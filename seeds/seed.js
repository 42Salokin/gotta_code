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
        seedDatabase(pokemon);
    } else {
      alert(response.statusText);
    }
};

pokeNames();

const seedDatabase = async (pokemon) => {
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
