
// Add an event listener to the form for creating a team
document.querySelector('#create-team-form').addEventListener('submit', async (event) => {
    event.preventDefault(); // Prevent the default form submission
  
    // Collect values from the form inputs
    const teamName = document.querySelector('#team-name').value.trim();
    const pokemon1 = document.querySelector('#pokemon1').value.trim();
    const pokemon2 = document.querySelector('#pokemon2').value.trim();
    const pokemon3 = document.querySelector('#pokemon3').value.trim();
    const pokemon4 = document.querySelector('#pokemon4').value.trim();
    const pokemon5 = document.querySelector('#pokemon5').value.trim();
    const pokemon6 = document.querySelector('#pokemon6').value.trim();
  
    // Send a POST request to the server to create a new team
    const response = await fetch('/api/team', {
      method: 'POST',
      body: JSON.stringify({
        name: teamName,
        pokemon1,
        pokemon2,
        pokemon3,
        pokemon4,
        pokemon5,
        pokemon6
      }),
      headers: {
        'Content-Type': 'application/json' // Set the content type to JSON
      }
    });
  
    // If the response is successful, redirect to the profile page
    if (response.ok) {
      document.location.replace('/api/team');
    } else {
      // If the response is not successful, show an alert with the status text
      alert(response.statusText);
    }
  });

  document.addEventListener("DOMContentLoaded", function() {
    // Hide the create team section initially
    const createTeamForm = document.getElementById("create-team-form");
    const createTeamButton = document.querySelector(".create-team-button");
    const teamsSection = document.querySelector(".col-md-6");

    if (createTeamForm) {
        if (teamsSection) {
            createTeamForm.style.display = "none";
        } else {
            createTeamForm.style.display = "block";
        }

        if (createTeamButton) {
            createTeamButton.addEventListener("click", function() {
                if (createTeamForm.style.display === "none") {
                    createTeamForm.style.display = "block";
                    if (teamsSection) {
                        teamsSection.style.display = "none";
                    }
                } else {
                    createTeamForm.style.display = "none";
                    if (teamsSection) {
                        teamsSection.style.display = "block";
                    }
                }
            });
        }
    }
});


  document.addEventListener("DOMContentLoaded", function() {
    // Attach event listener to the delete buttons
    const deleteButtons = document.querySelectorAll("#deleteButton");
    deleteButtons.forEach(button => {
        button.addEventListener("click", async (event) => {
            event.preventDefault(); // Prevent default behavior of the button click
            
            // Get the ID of the element to be deleted
            const teamName = event.target.dataset.teamId; 
            const pokemonName = event.target.dataset.pokemonId; 
            let deleteName;

            if (teamName) {
                console.log(teamName);
                deleteName = teamName;
            }

            if (pokemonName) {
                console.log(pokemonName);
                deleteName = pokemonName;
            }

        try {
            // Send a DELETE request to the backend
            const response  = await fetch(`/api/team/${deleteName}`, {
                method: 'DELETE'
            })
            // const result = await response.json();

        if (response.ok) {
            // Force a page reload
            document.location.replace('/api/team');
            console.log(response);
        } else {
            console.error('Failed to delete Pokemon:', response);
        }
    }   catch(error) {
                console.error('Error deleting team:', error);
            };
        });
    });
});

  
  
  