document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('show-register').addEventListener('click', () => {
    document.getElementById('register-form').classList.remove('d-none');
    document.querySelector('.btn-login').classList.add('d-none');
    document.getElementById('show-register').classList.add('d-none');
  });

  document.getElementById('show-login').addEventListener('click', () => {
    document.getElementById('register-form').classList.add('d-none');
    document.querySelector('.btn-login').classList.remove('d-none');
    document.getElementById('show-register').classList.remove('d-none');
  });

  document.getElementById('login-form').addEventListener('submit', async (e) => {
    e.preventDefault();

    const email    = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (res.ok) {
        window.location.replace('/home/index.html');
      } else {
        mostrarErro(data.mensagem || 'Credenciais inválidas.');
      }
    } catch (err) {
      console.error('Erro no login:', err);
      mostrarErro('Erro ao conectar com o servidor.');
    }
  });
});

function mostrarErro(msg) {
  const el = document.getElementById('erro-login');
  if (!el) return;
  el.textContent = msg;
  el.classList.remove('d-none');
}
