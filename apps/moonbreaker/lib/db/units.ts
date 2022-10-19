import { defaultDriver } from './driver';

import type { Driver } from 'neo4j-driver';
import type { Unit, UnitListData } from '../types/units';

export const getUnits = async ({
  driver = defaultDriver,
  patchName,
}: {
  driver?: Driver;
  patchName: string;
}): Promise<Unit[]> => {
  const session = driver?.session();

  const readQuery = `
    MATCH (p:Patch {name: $patchName})-[:INCLUDES]->(u:Unit)
    WITH COLLECT(u) as units
    UNWIND units as unit
    OPTIONAL MATCH (unit)-[:HAS_ABILITY]->(aa:ActiveAbility)
    WITH COLLECT(aa) as activeAbilities, unit
    OPTIONAL MATCH (unit)-[:HAS_ABILITY]->(pa:PassiveAbility)
    WITH COLLECT(pa) as uniqueAbilities, activeAbilities, unit
    RETURN unit, activeAbilities, uniqueAbilities
      `;

  const readResult = await session?.readTransaction((tx) =>
    tx.run(readQuery, { patchName })
  );
  const finalResult = readResult?.records.map((record) => {
    const unit = record.get('unit');
    const activeAbilities = record.get('activeAbilities');
    const uniqueAbilities = record.get('uniqueAbilities');

    const returnData = {
      id: unit.identity,
      ...unit.properties,
      activeAbilities: activeAbilities.map((aa) => aa.properties),
      uniqueAbilities: uniqueAbilities.map((pa) => pa.properties.name),
    };

    return returnData;
  });
  return finalResult;
};

export const getUnitsList = async ({
  driver = defaultDriver,
  patchName,
}: {
  driver?: Driver;
  patchName: string;
}): Promise<UnitListData[]> => {
  const session = driver?.session();

  const readQuery = `
    MATCH (p:Patch {name: $patchName})-[:INCLUDES]->(u:Unit)
    RETURN u as unit
  `;

  const readResult = await session?.readTransaction((tx) =>
    tx.run(readQuery, { patchName })
  );
  const finalResult = readResult?.records.map((record) => {
    const unit = record.get('unit');

    const returnData: UnitListData = {
      id: unit.identity,
      baseDmg: unit?.properties?.baseDmg ? unit.properties.baseDmg : null,
      deploymentCost: unit?.properties?.deploymentCost
        ? unit?.properties?.deploymentCost
        : null,
      health: unit.properties.health,
      name: unit.properties.name,
      type: unit.properties.type,
    };

    return returnData;
  });
  return finalResult;
};
