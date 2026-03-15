document.addEventListener('DOMContentLoaded', async () => {
  await redirecionarSeLogado();
  configurarFormulario();
});

async function redirecionarSeLogado() {
  try {
    const res = await fetch('/api/user/session');
    if (res.ok) {
      const { dados } = await res.json();
      if (dados) window.location.replace('/home/index.html');
    }
  } catch {
    // não logado, permanece na página
  }
}

function configurarFormulario() {
  document.getElementById('register-form').addEventListener('submit', async (e) => {
    e.preventDefault();

    const body = {
      name:            document.getElementById('name').value,
      email:           document.getElementById('email').value,
      telephone:       document.getElementById('telephone').value,
      password:        document.getElementById('password').value,
      confirmpassword: document.getElementById('confirmpassword').value,
    };

    try {
      const res  = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      const data = await res.json();

      if (res.ok) {
        window.location.replace('/page_login/login/index.html');
      } else {
        mostrarErro(data.mensagem || 'Erro ao cadastrar.');
      }
    } catch (err) {
      console.error('Erro no cadastro:', err);
      mostrarErro('Erro ao conectar com o servidor.');
    }
  });
}

function mostrarErro(msg) {
  const el = document.getElementById('erro-register');
  if (!el) return;
  el.textContent = msg;
  el.classList.remove('d-none');
}
