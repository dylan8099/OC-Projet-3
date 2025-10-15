function login() {
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  const errorMessage = document.getElementById('error-message');
  const url = 'http://localhost:5678/api/users/login';

  fetch(url, {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      email: email,
      password: password,
    })
  })
  .then(response => {
    if (!response.ok) { // Affichage de l'erreur 
      throw new Error('Erreur dans l’identifiant ou le mot de passe');
    }
    return response.json();
  })
  .then(data => { // Stockage du token
    localStorage.setItem('token', data.token);
    window.location.href = './index.html';
  })
  .catch(error => { // Affichage de "Erreur dans l’identifiant ou le mot de passe" dans le span
    errorMessage.textContent = error.message;
    errorMessage.style.display = 'block';
  });
}

const loginForm = document.getElementById('loginForm');
loginForm.addEventListener('submit', (e) => {
  e.preventDefault();
  login();
});
