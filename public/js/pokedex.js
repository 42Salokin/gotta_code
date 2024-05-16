  // Select the anchor tag for adding to Pokedex
  const getTeamList = document.querySelector('#addToTeam');
  const addToTeamResponse = document.querySelector('#addToTeamResponse');

  // Add an event listener to the anchor tag
  getTeamList.addEventListener('click', async (event) => {
    event.preventDefault(); // Prevent the default behavior of following the link
    
    const pokemonId = event.target.dataset.pokemonId; // Get the Pokemon ID from the data attribute
    console.log(pokemonId);
    try {
      const response = await fetch(`/api/pokedex/teamList`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });    
      console.log(response);
      if (response.ok) {
        const responseData = await response.json(); // Parse the response JSON
        console.log(responseData);
        addToTeamResponse.textContent = responseData.message; // Display the response message
      } else {
        console.error('Failed to add to team:', response.statusText);
      }
    } catch (error) {
      console.error('Error adding to team:', error);
    }
  });

//    // Add an event listener to the anchor tag
//    addToTeam.addEventListener('click', async (event) => {
//     event.preventDefault(); // Prevent the default behavior of following the link
    
//     const pokemonId = event.target.dataset.pokemonId; // Get the Pokemon ID from the data attribute
//     console.log(pokemonId);
//     try {
//       const response = await fetch(`/api/pokedex/addToTeam/${pokemonId}`, {
//         method: 'GET',
//         headers: { 'Content-Type': 'application/json' },
//       });    
//       console.log(response);
//       if (response.ok) {
//         const responseData = await response.json(); // Parse the response JSON
//         addToTeamResponse.textContent = responseData.message; // Display the response message
//       } else {
//         console.error('Failed to add to team:', response.statusText);
//       }
//     } catch (error) {
//       console.error('Error adding to team:', error);
//     }
//   });