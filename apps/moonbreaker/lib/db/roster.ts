import { defaultDriver } from './driver';

import { getUnitsByType } from './units';
import { isRosterComplete } from '../utils/roster';

import type { Driver } from 'neo4j-driver';
import type { RosterRequestData, RosterData } from '../types/roster';

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

  // TODO: Check that roster composition is unique
  // const session = driver?.session();

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
