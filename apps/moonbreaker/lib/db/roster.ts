import { defaultDriver } from './driver';

import { getUnitsByType } from './units';
import { isRosterComplete } from '../utils/roster';

import type { Driver } from 'neo4j-driver';
import type {
  RosterRequestData,
  RosterData,
  RosterListData,
} from '../types/roster';

export const validateRoster = async ({
  driver = defaultDriver,
  patchName,
  rosterData,
}: {
  driver?: Driver;
  patchName: string;
  rosterData: RosterRequestData;
}): Promise<{
  isValid: boolean;
  error?: string;
}> => {
  const { captainsList, crewList } = await getUnitsByType({ patchName });

  const { isComplete, error } = isRosterComplete({
    captainsList,
    crewList,
    roster: rosterData,
  });

  if (!isComplete) {
    return { isValid: isComplete, error };
  }

  // Check that roster composition is unique
  const compareQuery = `
  MATCH (n:Unit) WHERE id(n) IN $unitIDS
    WITH collect(n) AS units
  MATCH (p:Patch {name: $patchName})-[:INCLUDES]->(r:Roster)-[:HAS]-(d:PublicList)
  RETURN d, ALL(x IN units WHERE (d)-[:INCLUDES]->(x)) as matchAll`;

  const session = driver?.session();

  try {
    const uniqueResult = await session?.run(compareQuery, {
      patchName,
      unitIDS: rosterData.unitIDS,
    });

    const isUnique = uniqueResult?.records.reduce((acc, rec) => {
      return acc && !rec.get('matchAll');
    }, true);

    if (!isUnique) {
      return {
        isValid: false,
        error: 'Roster composition is not unique',
      };
    }
  } finally {
    session?.close();
  }

  return { isValid: isComplete, error };
};

export const saveDraft = async ({
  driver = defaultDriver,
  rosterData,
  patchName,
  userID,
}: {
  driver?: Driver;
  patchName: string;
  rosterData: RosterRequestData;
  userID: string;
}): Promise<RosterData> => {
  const session = driver?.session();

  const writeQuery = `
    MATCH (p:Patch {name: $patchName})
      MERGE (p)-[:INCLUDES]->(r:Roster {name: $rosterData.name})-[:HAS]->(d:Draft)
      ON CREATE SET r.id = apoc.create.uuid()
    WITH r, d
    MATCH (u:User {id: $userID})
    MERGE(u)-[:CREATED]->(r)
    WITH r, d
    OPTIONAL MATCH (d)-[i:INCLUDES]-(u:Unit)
      DETACH DELETE i
    WITH r, d
    UNWIND $rosterData.unitIDS as unitID
      MATCH (u:Unit)
      WHERE id(u) = unitID
      MERGE (d)-[:INCLUDES]->(u)
  `;

  await session?.writeTransaction((tx) =>
    tx.run(writeQuery, { patchName, rosterData, userID })
  );

  const readQuery = `
  MATCH (u:User {id: $userID})-[:CREATED]->(r:Roster{name: $rosterData.name})-[:HAS]->(d:Draft)
  WITH r, d
  MATCH (d)-[:INCLUDES]->(u:Unit)
  WITH COLLECT(u) as units, r
    UNWIND units as unit
    OPTIONAL MATCH (unit)-[:HAS_ABILITY]->(aa:ActiveAbility)
  WITH COLLECT({name: aa.name, text: aa.text, cinderCost: aa.cinderCost}) as activeAbilities, unit, r
    OPTIONAL MATCH (unit)-[:HAS_ABILITY]->(pa:PassiveAbility)
  WITH COLLECT(pa.name) as uniqueAbilities, activeAbilities, unit ,r
  WITH COLLECT(
    {
      activeAbilities: activeAbilities,
      description: unit.description,
      id: id(unit),
      name: unit.name,
      unitInfo: {
        attackType: unit.attackType,
        baseDmg: unit.baseDmg,
        culture: unit.culture,
        deploymentCost: unit.deploymentCost,
        health: unit.health,
        imageURL: unit.imageURL,
        size: unit.size,
        type: unit.type
      },
      uniqueAbilities: uniqueAbilities
    }
    ) as parsedUnits, r
  RETURN parsedUnits as units, r.name as name, r.id as id
  `;

  const readResult = await session?.readTransaction((tx) =>
    tx.run(readQuery, { patchName, rosterData, userID })
  );

  session.close();

  const returnData = {
    id: readResult.records[0].get('id'),
    name: readResult.records[0].get('name'),
    units: readResult.records[0].get('units'),
  };

  return returnData;
};

export const publishRoster = async ({
  driver = defaultDriver,
  rosterData,
  patchName,
  userID,
}: {
  driver?: Driver;
  patchName: string;
  rosterData: RosterRequestData;
  userID: string;
}): Promise<RosterData> => {
  const session = driver?.session();

  const writeQuery = `
    MATCH (p:Patch {name: $patchName})
      MERGE (p)-[:INCLUDES]->(r:Roster {name: $rosterData.name})-[:HAS]->(d:PublicList)
      ON CREATE SET r.id = apoc.create.uuid()
    WITH r, d
    MATCH (u:User {id: $userID})
    MERGE(u)-[:CREATED]->(r)
    WITH r, d
    OPTIONAL MATCH (d)-[i:INCLUDES]-(u:Unit)
      DETACH DELETE i
    WITH r, d
    UNWIND $rosterData.unitIDS as unitID
      MATCH (u:Unit)
      WHERE id(u) = unitID
      MERGE (d)-[:INCLUDES]->(u)
  `;

  await session?.writeTransaction((tx) =>
    tx.run(writeQuery, { patchName, rosterData, userID })
  );

  const readQuery = `
  MATCH (u:User {id: $userID})-[:CREATED]->(r:Roster{name: $rosterData.name})-[:HAS]->(d:PublicList)
  WITH r, d
  MATCH (d)-[:INCLUDES]->(u:Unit)
  WITH COLLECT(u) as units, r
    UNWIND units as unit
    OPTIONAL MATCH (unit)-[:HAS_ABILITY]->(aa:ActiveAbility)
  WITH COLLECT({name: aa.name, text: aa.text, cinderCost: aa.cinderCost}) as activeAbilities, unit, r
    OPTIONAL MATCH (unit)-[:HAS_ABILITY]->(pa:PassiveAbility)
  WITH COLLECT(pa.name) as uniqueAbilities, activeAbilities, unit ,r
  WITH COLLECT(
    {
      activeAbilities: activeAbilities,
      description: unit.description,
      id: id(unit),
      name: unit.name,
      unitInfo: {
        attackType: unit.attackType,
        baseDmg: unit.baseDmg,
        culture: unit.culture,
        deploymentCost: unit.deploymentCost,
        health: unit.health,
        imageURL: unit.imageURL,
        size: unit.size,
        type: unit.type
      },
      uniqueAbilities: uniqueAbilities
    }
    ) as parsedUnits, r
  RETURN parsedUnits as units, r.name as name, r.id as id
  `;

  const readResult = await session?.readTransaction((tx) =>
    tx.run(readQuery, { patchName, rosterData, userID })
  );

  session.close();

  const returnData = {
    id: readResult.records[0].get('id'),
    name: readResult.records[0].get('name'),
    units: readResult.records[0].get('units'),
  };

  return returnData;
};

export const getRostersList = async ({
  driver = defaultDriver,
  patchName,
}: {
  driver?: Driver;
  patchName: string;
}): Promise<RosterListData[]> => {
  const session = driver?.session();
  const readQuery = `
  MATCH(pa:Patch {name : $patchName})-[:INCLUDES]->(r:Roster)-[:HAS]->(p:PublicList)
    WITH p, r
    MATCH (p)-[:INCLUDES]->(u:Unit)
    WITH COLLECT({name: u.name, type: u.type}) as units, r, p
    RETURN r.name as name, id(p) as id, units
  `;

  try {
    const readResult = await session?.readTransaction((tx) =>
      tx.run(readQuery, { patchName })
    );

    const parsedData = readResult.records.map((record) => {
      const id = record.get('id');
      const name = record.get('name');
      const units = record.get('units');

      const captain = units.find((unit: any) => unit.type === 'Captain')[
        'name'
      ];
      const crew = units
        .filter((unit: any) => unit.type === 'Crew')
        .map((crew) => crew.name);

      return {
        id,
        name,
        units: {
          captain,
          crew,
        },
      };
    });

    return parsedData;
  } finally {
    session.close();
  }
};
