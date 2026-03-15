document.addEventListener('DOMContentLoaded', async () => {
  await carregarDadosEdicao();
  configurarPreviewAvatar();
  configurarFormulario();
});

async function carregarDadosEdicao() {
  try {
    const res = await fetch('/api/user/profile');

    if (res.status === 401) {
      window.location.href = '/page_login/login/index.html';
      return;
    }

    const { dados } = await res.json();

    document.getElementById('name').value  = dados.name;
    document.getElementById('email').value = dados.email;
    document.getElementById('phone').value = dados.number;
    document.getElementById('previewImg').src = dados.image_profille;
  } catch (err) {
    console.error('Erro ao carregar dados:', err);
  }
}

function configurarPreviewAvatar() {
  document.getElementById('avatar').addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (ev) => {
      document.getElementById('previewImg').src = ev.target.result;
    };
    reader.readAsDataURL(file);
  });
}

function configurarFormulario() {
  document.querySelector('.edit-form').addEventListener('submit', async (e) => {
    e.preventDefault();

    document.getElementById('loadingOverlay').style.visibility = 'visible';

    const formData = new FormData();
    formData.append('name',   document.getElementById('name').value);
    formData.append('email',  document.getElementById('email').value);
    formData.append('phone',  document.getElementById('phone').value);

    const avatarFile = document.getElementById('avatar').files[0];
    if (avatarFile) formData.append('avatar', avatarFile);

    try {
      const res = await fetch('/api/user/profile', {
        method: 'PUT',
        body: formData,
      });

      if (res.ok) {
        window.location.replace('/home/index.html');
      } else {
        console.error('Erro ao salvar perfil:', res.status);
      }
    } catch (err) {
      console.error('Erro na requisição:', err);
    } finally {
      document.getElementById('loadingOverlay').style.visibility = 'hidden';
    }
  });
}
