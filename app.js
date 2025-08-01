const API_BASE = 'https://fitness-api-ncet.onrender.com';

function register() {
  const username = document.getElementById('reg-username').value;
  const password = document.getElementById('reg-password').value;
  fetch(`${API_BASE}/v1/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password })
  })
  .then(resp => {
    if (!resp.ok) throw new Error('Registration failed');
    return resp.json();
  })
  .then(data => {
    alert('Registered! Please login.');
  })
  .catch(err => {
    alert(err.message);
  });
}

function login() {
  const username = document.getElementById('login-username').value;
  const password = document.getElementById('login-password').value;
  fetch(`${API_BASE}/v1/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password })
  })
  .then(resp => {
    if (!resp.ok) throw new Error('Login failed');
    return resp.json();
  })
  .then(data => {
    const token = data.token || (data.data && data.data.token);
    if (token) {
      localStorage.setItem('token', token);
      document.getElementById('auth').style.display = 'none';
      document.getElementById('content').style.display = 'block';
      loadExercises();
    } else {
      throw new Error('Token missing');
    }
  })
  .catch(err => {
    alert(err.message);
  });
}

function loadExercises() {
  const token = localStorage.getItem('token');
  fetch(`${API_BASE}/v1/exercises`, {
    headers: { 'Authorization': 'Bearer ' + token }
  })
  .then(resp => {
    if (!resp.ok) throw new Error('Failed to fetch exercises');
    return resp.json();
  })
  .then(data => {
    const list = document.getElementById('exercises');
    list.innerHTML = '';
    (data.data || data).forEach(item => {
      const li = document.createElement('li');
      li.textContent = item.name || JSON.stringify(item);
      list.appendChild(li);
    });
  })
  .catch(err => {
    console.error(err);
  });
}

function logout() {
  localStorage.removeItem('token');
  document.getElementById('content').style.display = 'none';
  document.getElementById('auth').style.display = 'block';
}
