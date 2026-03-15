document.addEventListener('DOMContentLoaded', async () => {
  const id = new URLSearchParams(window.location.search).get('id');

  if (!id) {
    console.error('ID do anúncio não encontrado na URL.');
    return;
  }

  try {
    const res = await fetch(`/api/posts/${id}`);

    if (!res.ok) {
      console.error('Anúncio não encontrado.');
      return;
    }

    const { dados } = await res.json();
    const { anuncio, dono } = dados;

    document.getElementById('advertisement-title').textContent       = anuncio.namepet;
    document.getElementById('advertisement-image').src               = anuncio.images;
    document.getElementById('advertisement-description').textContent = anuncio.racapet;

    if (dono) {
      document.getElementById('advertisement-user').textContent   = dono.name;
      document.getElementById('profile-dot').style.backgroundImage = `url('${dono.image_profille}')`;
    }
  } catch (err) {
    console.error('Erro ao carregar detalhes:', err);
  }
});
