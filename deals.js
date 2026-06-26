function adminLogin() {
    const email    = el('email')    ? el('email').value    : '';
    const password = el('password') ? el('password').value : '';
    if (!email || !password) { alert('Please fill all fields!'); return; }
    fetch(`${API}/auth.php?action=admin-login`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, credentials: 'include',
        body: JSON.stringify({ email, password })
    })
    .then(res => res.json())
    .then(data => {
        if (data.success) {
            alert('Welcome, ' + data.data.name + '!');
            window.location.href = 'admin.html';
        } else { alert(data.message); }
    })
    .catch(() => alert('Connection error.'));
}