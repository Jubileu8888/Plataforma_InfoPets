document.addEventListener('DOMContentLoaded', carregarPerfil);

async function carregarPerfil() {
  try {
    const res = await fetch('/api/user/profile');

    if (res.status === 401) {
      window.location.href = '/page_login/login/index.html';
      return;
    }

    const { dados } = await res.json();

    document.getElementById('name').innerHTML = `<h2 class="mb-4">${dados.name}</h2>`;
    document.getElementById('profileImg').src = dados.image_profille;
    document.getElementById('editProfileBtn').style.display = 'block';
  } catch (err) {
    console.error('Erro ao carregar perfil:', err);
  }
}
