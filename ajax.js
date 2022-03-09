/**** Login, Register, Logout Ajax ***/

//login ajax request
document.getElementById("login_btn").addEventListener("click", loginAjax, false); // Bind the AJAX call to button click
function loginAjax(event) {
    const username = document.getElementById("username").value; // Get the username from the form
    const password = document.getElementById("password").value; // Get the password from the form

    // Make a URL-encoded string for passing POST data:
    const data = { 'username': username, 'password': password };

    fetch("login.php", {
            method: 'POST',
            body: JSON.stringify(data),
            headers: { 'content-type': 'application/json' }
        })
        .then(response => response.json())
        .then(data => console.log(data.success ? "You've been logged in!" : `You were not logged in ${data.message}`))
        .catch(err => console.error(err));
}

//register ajax request
document.getElementById("register_btn").addEventListener("click", registerAjax, false); // Bind the AJAX call to button click
function registerAjax(event) {
    const new_username = document.getElementById("new_username").value; // Get the username from the form
    const new_password = document.getElementById("new_password").value; // Get the password from the form
    const confirm_password = document.getElementById("confirm_password").value; // Get the password confirmation from the form

    // Make a URL-encoded string for passing POST data:
    const data = { 'new_username': new_username, 'new_password': new_password, 'confirm_password': confirm_password };

    fetch("register.php", {
            method: 'POST',
            body: JSON.stringify(data),
            headers: { 'content-type': 'application/json' }
        })
        .then(response => response.json())
        .then(data => console.log(data.success ? "You've been registered!" : `You were not logged in ${data.message}`))
        .catch(err => console.error(err));
}


//logout ajax request
document.getElementById("logout_btn").addEventListener("click", logoutAjax, false);

function logoutAjax(event) {
    fetch("logout.php", {
            method: 'POST',
            body: JSON.stringify(),
            headers: { 'content-type': 'application/json' }
        })
        .then(response => response.json())
        .then(data => console.log(data.success ? "You've been logged out!" : `You were not logged out ${data.message}`))
        .catch(error => console.error('Error:', error))

}