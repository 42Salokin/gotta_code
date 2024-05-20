const logout = async () => {
    //api/users/logout': Specifies the URL endpoint of the API responsible for user logout.
    const response = await fetch('/api/users/logout', {
        //method: 'POST': Sets the HTTP method to POST, indicating you're sending data or instructions to the server.
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
    });
    
    // If successful, the code inside this block executes
    if (response.ok) {
        //Redirects the user to the homepage (/) after successful logout.
        document.location.replace('/');
    } else {
        //Displays a basic alert message with the status text from the response (e.g., "401 Unauthorized").
        alert(response.statusText);
    }
};
//Uses document.querySelector to find the element with the ID logout
document.querySelector('#logout-button').addEventListener('click', logout);

