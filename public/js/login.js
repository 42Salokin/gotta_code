const loginFormHandler = async (event) => {
  event.preventDefault();

  // Collect values from the login form
  const username = document.querySelector('#username-login').value.trim();
  const email = document.querySelector('#email-login').value.trim();
  const password = document.querySelector('#password-login').value.trim();

  if (username && email && password) {
    // Send a POST request to the API endpoint
    const response = await fetch('/api/users/login', {
      method: 'POST',
      body: JSON.stringify({ username: username, email: email, password: password }),
      headers: { 'Content-Type': 'application/json' },
    });
   
    console.log(response)

    //If successful, the code inside this block executes
    if (response.ok) {
      // If successful, redirect the browser to the profile page
      document.location.replace('/profile');
    } else {
      alert(response.statusText);
    }
  }
};

const signupFormHandler = async (event) => {
  //This prevents the browser from submitting the form to the server in the default way
  event.preventDefault();

  //Uses document.querySelector to find the element with the ID username-signup
  const username = document.querySelector('#username-signup').value.trim();
  const email = document.querySelector('#email-signup').value.trim();
  const password = document.querySelector('#password-signup').value.trim();
  console.log(username, email, password)
  //This conditional statement checks if all three variables
  if (username && email && password) {
    //This block executes only if all required fields have values
    // Specifies the URL endpoint of the API responsible for user signup.
    const response = await fetch('/api/users', {
      method: 'POST',
      //Creates a JSON object containing the collected user information (username, email, password).
      body: JSON.stringify({ username: username, email: email, password: password }),
      headers: { 'Content-Type': 'application/json' },
    });

    //Waits for the response from the API and checks if the status code indicates success (usually in the 200-299 range).
    if (response.ok) {
      //Redirects the user to the /profile page after successful signup.
      document.location.replace('/profile');
    } else {
      //Displays a basic alert message with the status text from the response (e.g., "400 Bad Request")
      alert(response.statusText);
    }
  }
};

//Uses document.querySelector to find the element with the ID login-form
document
  .querySelector('.login-form')
  .addEventListener('submit', loginFormHandler);

//Uses document.querySelector to find the element with the ID username-signup
document
  .querySelector('.signup-form')
  .addEventListener('submit', signupFormHandler);
