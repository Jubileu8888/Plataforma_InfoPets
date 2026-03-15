document.addEventListener('DOMContentLoaded', () => {
  configurarPreview();
  configurarFormulario();
});

function configurarPreview() {
  document.getElementById('anuncio-form').addEventListener('change', () => {
    const titulo  = document.getElementById('titulo').value;
    const descricao = document.getElementById('descricao').value;
    const imagem  = document.getElementById('imagem').files[0];

    if (titulo || descricao || imagem) {
      document.getElementById('preview-titulo').textContent   = titulo;
      document.getElementById('preview-descricao').textContent = descricao;
      if (imagem) document.getElementById('preview-imagem').src = URL.createObjectURL(imagem);
      document.getElementById('preview').classList.remove('d-none');
    } else {
      document.getElementById('preview').classList.add('d-none');
    }
  });
}

async function configurarFormulario() {
  document.querySelector('.edit-form').addEventListener('submit', async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('namepet', document.getElementById('titulo').value);
    formData.append('racapet', document.getElementById('descricao').value);
    formData.append('image',   document.getElementById('imagem').files[0]);

    try {
      const res = await fetch('/api/posts', { method: 'POST', body: formData });

      if (res.ok) {
        window.location.replace('/home/index.html');
      } else if (res.status === 401) {
        window.location.href = '/page_login/login/index.html';
      } else {
        console.error('Erro ao criar post:', res.status);
      }
    } catch (err) {
      console.error('Erro na requisição:', err);
    }
  });
}
