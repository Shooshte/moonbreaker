import { defaultDriver } from './driver';

import { getUnitsByType } from './units';
import { isRosterComplete } from '../utils/roster';

import type { Driver } from 'neo4j-driver';
import type {
  CrewListData,
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
  userID,
}: {
  driver?: Driver;
  patchName: string;
  userID?: string;
}): Promise<RosterListData[]> => {
  const session = driver?.session();
  const readQuery = `
    MATCH(pa:Patch {name : $patchName})-[:INCLUDES]->(r:Roster)-[:HAS]->(p:PublicList)
      WITH p, r
      MATCH (p)-[:INCLUDES]->(u:Unit)
      WHERE u.type = 'Captain'
    WITH {name: u.name, id: id(u), imageURL: u.imageURL} as captain, p, r
    OPTIONAL MATCH (:User)-[dv:DOWNVOTED]->(p)
      WITH p, COUNT(dv) AS downVotes, captain, r
    OPTIONAL MATCH (:User)-[uv:UPVOTED]->(p)
      WITH p, downVotes, COUNT(uv) AS upVotes, captain, r
      WITH captain, r, upVotes - downVotes AS score, p
    OPTIONAL MATCH (u:User)-[udv:DOWNVOTED]->(p)
      WHERE u.id = $userID
      WITH COUNT(udv) AS userDownVotes, p, r, score, captain
    OPTIONAL MATCH (u2:User)-[uuv:UPVOTED]->(p)
      WHERE u2.id = $userID
      WITH COUNT(uuv) AS userUpVotes, userDownVotes, p, r, score, captain
      WITH userUpVotes - userDownVotes as userRating, p, r, captain, score
    RETURN captain, r.name as name, id(p) as id, score, userRating ORDER BY score DESC
  `;

  try {
    const readResult = await session?.readTransaction((tx) =>
      tx.run(readQuery, { patchName, userID: userID || '' })
    );

    const parsedData = readResult.records.map((record) => {
      const id = record.get('id');
      const name = record.get('name');
      const captain = record.get('captain');
      const score = record.get('score');
      const userRating = record.get('userRating');

      return {
        captain,
        id,
        name,
        score,
        userRating,
      };
    });

    return parsedData;
  } finally {
    session.close();
  }
};

export const getRosterInfo = async ({
  driver = defaultDriver,
  listID,
}: {
  driver?: Driver;
  listID: number;
}): Promise<RosterData> => {
  const session = driver?.session();
  const readQuery = `
  MATCH(r:Roster)-[:HAS]->(p:PublicList)
    WHERE id(p) = $listID
    WITH r, p
    MATCH (p)-[:INCLUDES]->(u:Unit)
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

  try {
    const readResult = await session?.readTransaction((tx) =>
      tx.run(readQuery, { listID })
    );

    return readResult.records[0]
      ? {
          id: readResult.records[0].get('id'),
          name: readResult.records[0].get('name'),
          units: readResult.records[0].get('units'),
        }
      : null;
  } finally {
    session.close();
  }
};

export const rateRoster = async ({
  driver = defaultDriver,
  userID,
  listID,
  rating,
}: {
  driver?: Driver;
  userID: string;
  listID: number;
  rating: number;
}) => {
  const session = driver?.session();

  const deleteQuery = `
    MATCH(p:PublicList)
    WHERE id(p) = $listID
    WITH p
    MATCH(u:User)
    WHERE u.id = $userID
    WITH p, u
    OPTIONAL MATCH (u)-[uv:UPVOTED]->(p)
    DELETE uv
    WITH p, u
    OPTIONAL MATCH (u)-[dv:DOWNVOTED]->(p)
    DELETE dv
  `;

  try {
    // First, clear all previous upvote/downvote relationships
    await session?.writeTransaction((tx) =>
      tx.run(deleteQuery, { listID, userID })
    );

    const upvote = async () => {
      const upvoteQuery = `
        MATCH(p:PublicList)
        WHERE id(p) = $listID
        WITH p
        MATCH(u:User)
        WHERE u.id = $userID
        WITH p, u
        MERGE (u)-[:UPVOTED]->(p)
        RETURN p
      `;

      await session?.writeTransaction((tx) =>
        tx.run(upvoteQuery, { listID, userID })
      );
    };

    const downVote = async () => {
      const downvoteQuery = `
        MATCH(p:PublicList)
        WHERE id(p) = $listID
        WITH p
        MATCH(u:User)
        WHERE u.id = $userID
        WITH p, u
        MERGE (u)-[:DOWNVOTED]->(p)
        RETURN p
      `;

      await session?.writeTransaction((tx) =>
        tx.run(downvoteQuery, { listID, userID })
      );
    };

    switch (rating) {
      // Upvote
      case 1:
        await upvote();
        break;
      // Downvote
      case -1:
        await downVote();
        break;
      // 0 or no value means vote needs to reset
      default:
        break;
    }
  } finally {
    session.close();
  }
};

export const getRosterMetaData = async ({
  driver = defaultDriver,
  listID,
}: {
  driver?: Driver;
  listID: number;
}) => {
  const readQuery = `
  MATCH(p:PublicList)
    WHERE id(p) = $listID
  WITH p
  OPTIONAL MATCH (:User)-[dv:DOWNVOTED]->(p)
  WITH p, COUNT(dv) AS downVotes
  OPTIONAL MATCH (:User)-[uv:UPVOTED]->(p)
  WITH p, downVotes, COUNT(uv) AS upVotes
  RETURN downVotes, upVotes
  `;

  const session = driver?.session();

  try {
    const readResult = await session?.readTransaction((tx) =>
      tx.run(readQuery, { listID })
    );

    const downVotes = readResult.records[0].get('downVotes') || 0;
    const upVotes = readResult.records[0].get('upVotes') || 0;
    const score = upVotes - downVotes;

    return {
      downVotes,
      upVotes,
      score,
    };
  } finally {
    session.close();
  }
};

export const getRosterUserRating = async ({
  driver = defaultDriver,
  listID,
  userID,
}: {
  driver?: Driver;
  listID: number;
  userID: string;
}): Promise<number> => {
  const readQuery = `
    MATCH(u:User)
      WHERE u.id = $userID
    WITH u
    MATCH(p:PublicList)
      WHERE id(p) = $listID
    WITH p
    OPTIONAL MATCH (u)-[dv:DOWNVOTED]->(p)
    WITH p, COUNT(dv) AS downVotes
    OPTIONAL MATCH (u)-[uv:UPVOTED]->(p)
    WITH p, downVotes, COUNT(uv) AS upVotes
    RETURN upVotes - downVotes AS rating
    `;

  const session = driver?.session();

  try {
    const readResult = await session?.readTransaction((tx) =>
      tx.run(readQuery, { listID, userID })
    );
    const rating = readResult?.records[0]?.get('rating') || 0;

    return rating;
  } finally {
    session.close();
  }
};

export const getCrewList = async ({
  driver = defaultDriver,
  patchName,
  listID,
}: {
  driver?: Driver;
  patchName: string;
  listID: string;
}): Promise<CrewListData[]> => {
  const session = driver?.session();
  const readQuery = `
    MATCH(pa:Patch {name : $patchName})-[:INCLUDES]->(r:Roster)-[:HAS]->(p:PublicList)
      WHERE id(p) = $listID
    WITH p
    MATCH (p)-[:INCLUDES]->(u:Unit)
      WHERE u.type = 'Crew'
    WITH COLLECT({name: u.name, id:id(u)}) as crew
    RETURN crew
  `;

  try {
    const readResult = await session?.readTransaction((tx) =>
      tx.run(readQuery, { patchName, listID: parseInt(listID) })
    );

    const crewData = readResult?.records[0]?.get('crew') || [];
    return crewData;
  } finally {
    session.close();
  }
};
