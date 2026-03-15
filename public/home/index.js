document.addEventListener('DOMContentLoaded', async () => {
  await carregarSessao();
  iniciarAnimacaoBotao();
});

async function carregarSessao() {
  try {
    const res = await fetch('/api/user/session');
    if (!res.ok) return;

    const { dados } = await res.json();
    if (!dados) return;

    const loginBtn = document.getElementById('locateimgorlogin');

    const link = document.createElement('a');
    link.href = '../client/profile/view/index.html';
    link.classList.add('profile-ball');

    const img = document.createElement('img');
    img.src = dados.image_profille;
    img.alt = 'Imagem de Perfil';

    link.appendChild(img);
    loginBtn.parentNode.replaceChild(link, loginBtn);
  } catch (err) {
    console.error('Erro ao carregar sessão:', err);
  }
}

function iniciarAnimacaoBotao() {
  const button = document.querySelector('.btn-anime');
  if (!button) return;

  button.addEventListener('mouseenter', () => button.style.transform = 'scale(1.05)');
  button.addEventListener('mouseleave', () => button.style.transform = 'scale(1)');
}
