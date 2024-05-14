const sequelize = require('../config/connection');
const { Pokemon, Evolutions } = require('../models');


const logout = async () => {
    const pokeId = 1;
    const queryURL = `https://pokeapi.co/api/v2/pokemon/${pokeId}/`
    const response = await fetch(queryURL, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });
  
    if (response.ok) {
        const data = await response.json();
        seedDatabase(data);
        } else {
      alert(response.statusText);
    }
  };

  logout();

const seedDatabase = async (data) => {
    await sequelize.sync({ force: true });
    const pokes = await Pokemon.create({
        id: data.id,
        name: data.name,
        type1: data.types[0].type.name,
        type2: data.types[1].type.name,
      individualHooks: true,
      returning: true,
    });
    console.log(`${data.id}, ${data.name}, ${data.types[0].type.name}, ${data.types[1].type.name} added to database`);
    process.exit(0);
  };

//   dex("rayquaza-mega").then((pokemon) => {
//     console.log(pokemon)
// })

