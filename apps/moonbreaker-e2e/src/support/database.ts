import neo4j from 'neo4j-driver';
// @ts-expect-error fixtures imported statically
import units from '../fixtures/units.json';

// TODO: add clearing and adding constraints
// TODO: move this setup inside docker and CI

const getDriver = () => {
  try {
    const driver = neo4j.driver(
      Cypress.env('neo4jURI'),
      neo4j.auth.basic(Cypress.env('neo4jUser'), Cypress.env('neo4jPass')),
      { disableLosslessIntegers: true }
    );
    return driver;
  } catch (e) {
    return undefined;
  }
};

export const clearDB = async () => {
  const driver = getDriver();
  const session = driver?.session();
  try {
    const query = `MATCH (n) DETACH DELETE n`;
    await session?.run(query);
  } finally {
    session?.close();
  }
};

export const addUnits = async ({ patchName }: { patchName: string }) => {
  const driver = getDriver();
  const session = driver?.session();

  const writeUnitsQuery = `
    UNWIND $units as unit
    WITH unit
    MERGE (p:Patch {name: $patchName})
    MERGE (p)-[:INCLUDES]-(u:Unit {name: unit.name})
    SET
      u.attackType = unit.unitInfo.attackType,
      u.baseDmg = unit.unitInfo.baseDmg,
      u.culture = unit.unitInfo.culture,
      u.description = unit.description,
      u.health = unit.unitInfo.health,
      u.size = unit.unitInfo.size,
      u.type = unit.unitInfo.type
    WITH u, unit
    UNWIND unit.activeAbilities as activeAbility
    MERGE (u)-[:HAS_ABILITY]->(aa:ActiveAbility {
      cinderCost: activeAbility.cinderCost,
      name: activeAbility.name,
      text: activeAbility.text
    })
    WITH u, unit
    UNWIND unit.uniqueAbilities as uniqueAbility
    MERGE (u)-[:HAS_ABILITY]->(pa:PassiveAbility {
      name: uniqueAbility
    });
  `;

  await session?.writeTransaction((tx) => {
    tx.run(writeUnitsQuery, {
      units,
      patchName,
    });
  });
};

export const defaultDriver = getDriver();
