const sequelize = require('../config/connection');
const { Op } = require('sequelize');
const { Pokemon } = require('fast-poke-fetch');
const { Pokes, Evolutions } = require('../models');


const pokeNames = async () => {
    const queryURL = `https://pokeapi.co/api/v2/pokemon/?offset=0&limit=151`
    const response = await fetch(queryURL, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });
  
    if (response.ok) {
        const pokemon = (await response.json()).results;
        pokeEvolve(pokemon);
    } else {
      alert(response.statusText);
    }
};


// const seedPokemon = async (pokemon) => {
//     await sequelize.sync({ force: true });
   
    
//     process.exit(0);
// };

const pokeEvolve = async (pokemon) => {
    const queryURL = `https://pokeapi.co/api/v2/evolution-chain/?offset=0&limit=78`
    const response = await fetch(queryURL, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });
  
    if (response.ok) {
        const evolutions = (await response.json()).results;
        seedDatabase(pokemon, evolutions);
    } else {
      alert(response.statusText);
    }
};

const seedDatabase = async (pokemon, evolutions) => {
    await sequelize.sync({ force: true });
    for (const poke of pokemon) {
        const pokeData = await Pokemon(poke.name);

        const pokes = await Pokes.create({
            id: pokeData.id,
            name: pokeData.name,
            type1: pokeData.types[0],
            type2: pokeData.types[1],
            individualHooks: true,
            returning: true,
        });

        console.log(`${pokeData.id}, ${pokeData.name}, ${pokeData.types} added to database`);
    }

    for (const evolve of evolutions) {
        const queryURL = evolve.url;
        const response = await fetch(queryURL, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
        });

        if (response.ok) {
            const evolveChain = await response.json();
            const evolvesData = evolveChain.chain.evolves_to;
            const evolutionDetail1 = evolvesData[0]?.evolution_details[0];
            const evolutionDetail2 = evolvesData[0]?.evolves_to[0]?.evolution_details[0];
            // console.log(evolutionDetail1);
            // console.log(evolutionDetail2);
            let triggerDetail1 = null;
            let triggerDetail2 = null;

            for (const key in evolutionDetail1) {
                if (evolutionDetail1[key]) {
                    if (typeof evolutionDetail1[key] === 'object' && evolutionDetail1[key].name) {
                        triggerDetail1 = { [key]: evolutionDetail1[key].name };
                    } else {
                        triggerDetail1 = { [key]: evolutionDetail1[key] };
                    }                    
                    break;
                }
            }

            for (const key in evolutionDetail2) {
                if (evolutionDetail2[key]) {
                    if (typeof evolutionDetail2[key] === 'object' && evolutionDetail2[key].name) {
                        triggerDetail2 = { [key]: evolutionDetail2[key].name };
                    } else {
                        triggerDetail2 = { [key]: evolutionDetail2[key] };
                    }                     
                    break;
                }
            }
            // console.log(triggerDetail1);
            // console.log(triggerDetail2);

            // Create the evolution entry in the database
            const evolves = await Evolutions.create({
                id: evolveChain.id,
                stage1: evolveChain.chain.species.name,
                trigger1: evolutionDetail1?.trigger.name,
                trigger_details1: triggerDetail1,
                stage2: evolvesData[0]?.species.name || null,
                trigger2: evolutionDetail2?.trigger.name,
                trigger_details2: triggerDetail2,
                stage3: evolvesData[0]?.evolves_to[0]?.species.name,
                individualHooks: true,
                returning: true,
            });

            console.log('id:', evolves.id);
            console.log('stage1:', evolves.stage1);
            console.log('trigger1:', evolves.trigger1);
            console.log('trigger_details1:', evolves.trigger_details1);
            console.log('stage2:', evolves.stage2);
            console.log('trigger2:', evolves.trigger2);
            console.log('trigger_details2:', evolves.trigger_details2);
            console.log('stage3:', evolves.stage3);
        }
    }
    await updateEvolvesTo();
    console.log('Seeding and updating completed.');
    process.exit(0);
};

const updateEvolvesTo = async () => {
    // Retrieve all Pokes entries
    const allPokes = await Pokes.findAll();
    
    for (const poke of allPokes) {
        // Find the corresponding Evolutions entry where the Pokes entry's name matches stage1, stage2, or stage3
        const evolution = await Evolutions.findOne({
            where: {
                [Op.or]: [
                    { stage1: poke.name },
                    { stage2: poke.name },
                    { stage3: poke.name }
                ]
            }
        });

        if (evolution) {
            // Update the evolution_id of the Pokes entry to be the corresponding Evolutions entry's id
            await poke.update({
                evolution_id: evolution.id
            });
            console.log(`Updated evolution_id for ${poke.name} to ${evolution.id}`);
        } else {
            console.log(`Corresponding evolution not found for ${poke.name}, skipping update.`);
        }

        // Hard code the specific cases
        if (poke.id === 107) {
            await poke.update({
                evolution_id: 47
            });
            console.log(`Hardcoded update: Set evolution_id to 47 for ${poke.name}`);
        }

        if (poke.id === 135 || poke.id === 136) {
            await poke.update({
                evolution_id: 67
            });
            console.log(`Hardcoded update: Set evolution_id to 67 for ${poke.name}`);
        }
    }
    // Retrieve all Evolutions entries where stage2 is not null
    const evolvedPokemon1 = await Evolutions.findAll({
        where: {
            stage2: {
                [Op.not]: null
            }
        }
    });
    // console.log(evolvedPokemon);
    // Iterate over each Evolutions entry
    for (const evolution of evolvedPokemon1) {
        // Find the corresponding Poke entry where name matches stage1
        const pokemonToUpdate = await Pokes.findOne({
            where: {
                name: evolution.stage1
            }
        });
        // console.log(pokemonToUpdate);
        // If the corresponding Pokemon exists, update its evolves_to attribute
        if (pokemonToUpdate) {
            await pokemonToUpdate.update({
                evolves_to: evolution.stage2
            });
            console.log(`Updated evolves_to for ${evolution.stage1}`);
        } else {
            console.log(`Pokemon ${evolution.stage1} not found, skipping update.`);
        }
    }

    // Retrieve all Evolutions entries where stage3 is not null
    const evolvedPokemon2 = await Evolutions.findAll({
        where: {
            stage3: {
                [Op.not]: null
            }
        }
    });

    // Iterate over each Evolutions entry
    for (const evolution of evolvedPokemon2) {
        // Find the corresponding Poke entry where name matches stage1
        const pokemonToUpdate = await Pokes.findOne({
            where: {
                name: evolution.stage2
            }
        });
        // console.log(pokemonToUpdate);
         // If the corresponding Pokémon exists, update its evolves_to attribute to match stage3
         if (pokemonToUpdate) {
            await pokemonToUpdate.update({
                evolves_to: evolution.stage3
            });
            console.log(`Updated evolves_to for ${evolution.stage2}`);
        } else {
            console.log(`Pokemon ${evolution.stage2} not found, skipping update.`);
        }
    }

    console.log('Evolves_to attribute updated successfully.');
};

pokeNames();
// updateEvolvesTo();