const sequelize = require('../config/connection');

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