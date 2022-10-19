UNWIND $units as unit
WITH unit
MATCH (p:Patch {name: $patchName})
MERGE (p)-[:INCLUDES]-(u:Unit {
  attackType: unit.unitInfo.attackType,
  baseDmg: unit.unitInfo.baseDmg,
  culture: unit.unitInfo.culture,
  description: unit.description,
  name: unit.name,
  health: unit.unitInfo.health,
  size: unit.unitInfo.size,
  type: unit.unitInfo.type
})
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
  name: uniqueAbility.name
});
