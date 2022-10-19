CREATE CONSTRAINT FOR (p:Patch)
REQUIRE p.name IS UNIQUE;

CREATE CONSTRAINT FOR (c:Unit)
REQUIRE c.name IS UNIQUE;

CREATE (p:Patch {name: 'Pre-Alpha 39919', id: apoc.create.uuid()});

MATCH (p:Patch {name: 'Pre-Alpha 39919'})
MERGE (p)-[:INCLUDES]-(c:Unit{name: "Astra",
      attackType: 'Ranged',
      baseDmg: 1,
      description:
      '12-year-old Astra is a child prodigy, exploring the Reaches and learning what it means to be a leader. She rides into battle atop her colorful creature (and best friend) named Furg.',
      culture: 'Methedori',
      health: 20,
      size: 'Large',
      type: 'Captain'
    });

MATCH (c:Unit {name: 'Astra'})
WITH c
UNWIND [{cinderCost: 1,name: 'Boost Morale',text: 'Permanently reduce the Cost of a random Crew on Bridge by 2.'},{cinderCost: 2,name: 'Into the Breach!',text: 'Remove Stunned from unit.'}] AS activeAbility
MERGE (c)-[:HAS_ABILITY]->(a:ActiveAbility {name: activeAbility.name, text: activeAbility.text, cinderCost: activeAbility.cinderCost})
WITH c
UNWIND ['Captain', 'Airborne', 'Reinforce when Astra destroys a Crew.'] AS passiveAbility
MERGE (c)-[:HAS_ABILITY]->(p:PassiveAbility {name: passiveAbility});

MATCH (p:Patch {name: 'Pre-Alpha 39919'})
MERGE (p)-[:INCLUDES]-(c:Unit {description:
      'Zax is a clever, fast-talking scoundrel, swindling his way through the Reaches with a joke and a plasma blaster. He died on his last job, but he tries not to let that get him down.',
      name: "Zax Ja'kar",
      attackType: 'Ranged',
      baseDmg: 2,
      culture: 'Smugglers',
      health: 20,
      size: 'Large',
      type: 'Captain'
    });

MATCH (c:Unit {name: "Zax Ja'kar"})
WITH c
UNWIND [{
        cinderCost: 1,
        name: 'Sleeper Mine',
        text: 'Create Sleeper Mine. It takes 1 turn to arm.'
      },
      {
        cinderCost: 2,
        name: 'Gravity Well',
        text: 'Move units in area together.'
      }] AS activeAbility
MERGE (c)-[:HAS_ABILITY]->(a:ActiveAbility {name: activeAbility.name, text: activeAbility.text, cinderCost: activeAbility.cinderCost})
WITH c
UNWIND ['Captain', 'Push target on hit.'] AS passiveAbility
MERGE (c)-[:HAS_ABILITY]->(p:PassiveAbility {name: passiveAbility});

MATCH (p:Patch {name: 'Pre-Alpha 39919'})
MERGE (p)-[:INCLUDES]-(c:Unit {    description:
      'Originally programmed to be a mindless, remorseless killing machine called a Death Bot, feared throughout The Reaches, Extilior has become sentient and has now chosen an honorable path.',
      name: 'Extilior',
      attackType: 'Melee',
      baseDmg: 2,
      culture: 'Methedori',
      health: 20,
      size: 'Large',
      type: 'Captain'
    });

MATCH (c:Unit {name: "Extilior"})
WITH c
UNWIND [{
        cinderCost: 1,
        name: 'Shield of Hope',
        text: 'Reduce next damage to unit by 1.'
      },
      {
        cinderCost: 2,
        name: 'Sword of Justice',
        text: 'Deal 3 damage to ALL units in range.'
      }] AS activeAbility
MERGE (c)-[:HAS_ABILITY]->(a:ActiveAbility {name: activeAbility.name, text: activeAbility.text, cinderCost: activeAbility.cinderCost})
WITH c
UNWIND ['Captain',
      'A random ally withing range gains Shield of Hope when a rival is destroyed.'] AS passiveAbility
MERGE (c)-[:HAS_ABILITY]->(p:PassiveAbility {name: passiveAbility});
