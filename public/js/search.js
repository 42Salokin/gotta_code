const searchHandler = async (event) => {
    event.preventDefault();
  
    // Collect values from the search input
    const search = document.querySelector('#search').value.trim();
    console.log(`Search result at line 6 from search.handlebars: ${search}`);
  
    if (search) {
      // Send a GET request to the API endpoint
      try {
            console.log(`Search result at line 10 from search.handlebars: ${search}`);
            const response = await fetch(`/api/search/${search}`, {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' },
            });
            console.log(`Response from controller: ${response}`);
            if (response.ok) {
                // If successful, redirect the browser to the search page
                document.location.replace(`/api/search/${search}`);
            } else {
                alert(response.statusText);
            };
      } catch (error) {
        console.error('Error fetching data:', error);
        // Handle errors, if any
      }
    };
  };

  document
  .querySelector('.search-form')
  .addEventListener('submit', searchHandler);

  // Select the anchor tag for adding to Pokedex
const addToPokedexLink = document.querySelector('#addToPokedex');

if (addToPokedexLink) {
  // Add an event listener to the anchor tag
  addToPokedexLink.addEventListener('click', async (event) => {
    event.preventDefault(); // Prevent the default behavior of following the link

    const pokemonId = event.target.dataset.pokemonId; // Get the Pokemon ID from the data attribute
    console.log(pokemonId);
    try {
      const response = await fetch(`/api/search/addToPokedex/${pokemonId}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });
      console.log(response);
      if (response.ok) {
        const responseData = await response.json(); // Parse the response JSON
        addToPokedexResponse.textContent = responseData.message; // Display the response message
      } else {
        console.error('Failed to add to Pokedex:', response.statusText);
      }
    } catch (error) {
      console.error('Error adding to Pokedex:', error);
    }
  });
}

