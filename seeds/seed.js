const sequelize = require('../config/connection');

const logout = async () => {
    const pokeId = 1;
    const queryURL = `https://pokeapi.co/api/v2/pokemon/${pokeId}/`
    const response = await fetch(queryURL, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });
  
    if (response.ok) {
        const data = await response.json();
        console.log(data.id, data.name, data.types[0].type.name, data.types[1].type.name); // Log the JSON data
        } else {
      alert(response.statusText);
    }
  };

  logout();
// const { Pokes, Evolutions } = require('../models');

// const seedDatabase = async () => {
//     await sequelize.sync({ force: true });
  
//     const pokes = await Pokes.bulkCreate(pokeData, {
//       individualHooks: true,
//       returning: true,
//     });
  
//     process.exit(0);
//   };

//   dex("rayquaza-mega").then((pokemon) => {
//     console.log(pokemon)
// })

console.log("seeding...");