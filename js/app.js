document.getElementById('loginForm').addEventListener('submit', function(event) {
    event.preventDefault();
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    let users = JSON.parse(localStorage.getItem('users')) || {};

    if (users[username]) {
        if (users[username].password === password) {
            //alert("Login exitoso");
            localStorage.setItem('loggedInUser', username);
            window.location.href = "index.html";
        } else {
            alert("Contraseña incorrecta");
        }
    } else {
        users[username] = { password: password };
        localStorage.setItem('users', JSON.stringify(users));
        localStorage.setItem('loggedInUser', username);
        //alert("Registro exitoso y login exitoso");
        window.location.href = "index.html";
    }
});
