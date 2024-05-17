document.addEventListener("DOMContentLoaded", function() {
    // Attach event listener to the add to team buttons
    const getTeamList = document.querySelectorAll('#addToTeam');
    
    if (getTeamList.length > 0) {
        getTeamList.forEach(button => {
            button.addEventListener("click", async (event) => {
                event.preventDefault(); // Prevent the default behavior of following the link
                const button = event.target;
                const pokemonId = button.dataset.pokemonId; // Get the Pokemon ID from the data attribute
                console.log(pokemonId);

                const parentElement = button.closest('.pokemon-container'); 
                const addToTeamResponse = parentElement.querySelector('#addToTeamResponse');

                try {
                    const response = await fetch(`/api/pokedex/teamList`, {
                        method: 'GET',
                        headers: { 'Content-Type': 'application/json' },
                    });
                    console.log(response);
                    if (response.ok) {
                        const responseData = await response.json(); // Parse the response JSON
                        console.log(responseData);

                        addToTeamResponse.textContent = '';
                        responseData.forEach(team => {
                            const teamNameElement = document.createElement('li');
                            teamNameElement.textContent = team.name;
                            const id = `team_${team.id}`;
                            teamNameElement.id = id;

                            // Add a click event listener to each team name element
                            teamNameElement.addEventListener('click', () => {
                                // Perform some action when the team name is clicked
                                addToTeam(team.name, pokemonId, addToTeamResponse);
                                console.log(`Clicked on ${team.name}`);
                            });
                            addToTeamResponse.appendChild(teamNameElement);
                        });
                    } else {
                        console.error('Failed to add to team:', response.statusText);
                    }
                } catch (error) {
                    console.error('Error adding to team:', error);
                }
            });
        });
    }
});



//    // Function to handle adding a pokemon to a team
async function addToTeam(teamName, pokemonName, addToTeamResponse) {
    try {
      // Send a fetch request to add the pokemon to the team
      const response = await fetch(`/api/pokedex/addToTeam`, {
        method: 'POST',
        body: JSON.stringify({ teamName, pokemonName }),
        headers: {
          'Content-Type': 'application/json'
        }
      });
  
      // Check if the response is successful
      if (response.ok) {
        // Clear the addToTeamResponse container
        addToTeamResponse.innerHTML = '';
  
        // Display a message indicating the pokemon was added to the team
        addToTeamResponse.textContent = `${pokemonName} was added to ${teamName}`;
      } else {
        // If the response is not successful, show an alert with the status text
        alert('Failed to add pokemon to the team');
      }
    } catch (error) {
      console.error('Error adding pokemon to team:', error);
      alert('An error occurred while adding pokemon to the team');
    }
  }