const sequelize = require('../config/connection');
const { Pokemon } = require('fast-poke-fetch');
const { Pokes, Evolutions } = require('../models');


const pokeNames = async () => {
    const queryURL = `https://pokeapi.co/api/v2/pokemon/?offset=0&limit=3`
    const response = await fetch(queryURL, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });
  
    if (response.ok) {
        const pokemon = (await response.json()).results;
        seedPokemon(pokemon);
    } else {
      alert(response.statusText);
    }
};


const seedPokemon = async (pokemon) => {
    await sequelize.sync({ force: true });
    for (const poke of pokemon) {
        const pokeData = await Pokemon(poke.name);
        // const evolution = await pokeEvolve(pokeData); // Call pokeEvolve to get evolution data
        // let evolvesToData = null; // Initialize evolvesToData as null

        const pokes = await Pokes.create({
            id: pokeData.id,
            name: pokeData.name,
            type1: pokeData.types[0],
            type2: pokeData.types[1],
            // evolves_to: evolvesToData, // Set evolves_to property to evolvesToData
            individualHooks: true,
            returning: true,
        });

        console.log(`${pokeData.id}, ${pokeData.name}, ${pokeData.types} added to database`);
    }
    
    process.exit(0);
};

const pokeEvolve = async () => {
    const queryURL = `https://pokeapi.co/api/v2/evolution-chain/?offset=0&limit=10`
    const response = await fetch(queryURL, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });
  
    if (response.ok) {
        const evolutions = (await response.json()).results;
        seedEvolutions(evolutions);
    } else {
      alert(response.statusText);
    }
};

const seedEvolutions = async (evolutions) => {
    await sequelize.sync({ force: true });
    for (const evolve of evolutions) {
        const queryURL = evolve.url;
        const response = await fetch(queryURL, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
        });

        if (response.ok) {
            const evolveChain = await response.json();
            const evolvesData = evolveChain.chain.evolves_to;
            const evolutionDetail1 = evolvesData[0].evolution_details[0];
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
                trigger1: evolutionDetail1.trigger.name,
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
    process.exit(0);
};





// pokeNames();
pokeEvolve();


// const pokeEvolve = async (pokeData) => {
//     const pokeId = pokeData.id;
//     console.log(`${pokeId} logged from line 44`);
//     const queryURL = `https://pokeapi.co/api/v2/evolution-chain/${pokeId}/`
//     console.log(queryURL);
    
//     try {
//         const response = await fetch(queryURL, {
//             method: 'GET',
//             headers: { 'Content-Type': 'application/json' },
//         });
//         console.log(response); // Log the response

//         if (response.ok) {
//             const evolution = await response.json();
//             console.log(evolution);
//             const evolvesToSpecies = evolution.chain.evolves_to[0].species.name;
//             console.log(`${evolution.chain.species.name} evolves into ${evolvesToSpecies} by ${evolution.chain.evolves_to[0].evolution_details[0].trigger.name} at level ${evolution.chain.evolves_to[0].evolution_details[0].min_level}`);

//             // Return the name of the species it evolves into
//             return evolvesToSpecies;
//         } else {
//             throw new Error(`Failed to fetch evolution data for ${pokeData.name}`);
//         }
//     } catch (error) {
//         console.error('Error fetching data:', error);
//         throw error;
//     }
// };
