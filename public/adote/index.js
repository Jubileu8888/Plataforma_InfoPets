document.addEventListener('DOMContentLoaded', async () => {
  await carregarSessao();
  await carregarAnuncios();
  configurarPreviewFormulario();
  configurarFormulario();
});

// --- Sessão ---
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

// --- Listagem de anúncios ---
async function carregarAnuncios() {
  try {
    const res  = await fetch('/api/posts');
    const { dados } = await res.json();

    const container = document.getElementById('container');
    container.innerHTML = '';

    const titulo = document.createElement('h2');
    titulo.className = 'text-center mb-4';
    titulo.textContent = 'Lista de animais';
    container.appendChild(titulo);

    const row = document.createElement('div');
    row.className = 'row g-3';
    container.appendChild(row);

    dados.forEach((ad) => {
      row.appendChild(criarCardAnuncio(ad));
      document.body.appendChild(criarModal(ad));
    });
  } catch (err) {
    console.error('Erro ao carregar anúncios:', err);
  }
}

function criarCardAnuncio(ad) {
  const col = document.createElement('div');
  col.className = 'col-md-4';

  const card = document.createElement('div');
  card.className = 'listing-card';

  const img = document.createElement('img');
  img.src = ad.images;
  img.alt = ad.namepet;

  const h3 = document.createElement('h3');
  h3.textContent = ad.namepet;

  const btn = document.createElement('button');
  btn.className = 'btn btn-primary';
  btn.textContent = 'Ver Detalhes';
  btn.setAttribute('data-bs-target', `#details${ad.id}`);
  btn.setAttribute('data-bs-toggle', 'modal');

  card.append(img, h3, btn);
  col.appendChild(card);
  return col;
}

function criarModal(ad) {
  const modal = document.createElement('div');
  modal.className = 'modal fade';
  modal.id = `details${ad.id}`;
  modal.setAttribute('data-bs-backdrop', 'static');
  modal.setAttribute('data-bs-keyboard', 'false');
  modal.tabIndex = '-1';

  modal.innerHTML = `
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">${ad.namepet}</h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Fechar"></button>
        </div>
        <div class="modal-body text-center">
          <img src="${ad.images}" alt="${ad.namepet}" class="imgdetailmod mb-3">
          <p><strong>Raça:</strong> ${ad.racapet}</p>
          <p><strong>E-mail:</strong> ${ad.email}</p>
          <p><strong>Telefone:</strong> ${ad.phone}</p>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-primary" data-bs-dismiss="modal">Fechar</button>
        </div>
      </div>
    </div>
  `;

  return modal;
}

// --- Preview do formulário ---
function configurarPreviewFormulario() {
  document.getElementById('anuncio-form').addEventListener('change', () => {
    const namepet = document.getElementById('namepet').value;
    const imagem  = document.getElementById('imagem').files[0];

    if (namepet || imagem) {
      document.getElementById('preview-namepet').textContent  = namepet;
      document.getElementById('preview-namepet2').textContent = namepet;

      if (imagem) {
        document.getElementById('preview-imagem').src = URL.createObjectURL(imagem);
      }

      document.getElementById('preview').classList.remove('d-none');
    } else {
      document.getElementById('preview').classList.add('d-none');
    }
  });
}

// --- Envio do formulário ---
function configurarFormulario() {
  document.querySelector('.edit-form').addEventListener('submit', async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('namepet',  document.getElementById('namepet').value);
    formData.append('racapet',  document.getElementById('raca').value);
    formData.append('email',    document.getElementById('email').value);
    formData.append('phone',    document.getElementById('telephone').value);
    formData.append('image',    document.getElementById('imagem').files[0]);

    try {
      const res = await fetch('/api/posts', { method: 'POST', body: formData });

      if (res.ok) {
        window.location.replace('/adote/index.html');
      } else if (res.status === 401) {
        window.location.href = '/page_login/login/index.html';
      } else {
        console.error('Erro ao criar anúncio:', res.status);
      }
    } catch (err) {
      console.error('Erro na requisição:', err);
    }
  });
}

// --- Validação do modal de confirmação ---
function verif() {
  const campos = ['namepet', 'raca', 'username', 'email', 'telephone'];
  const imagem = document.getElementById('imagem').files[0];
  const erro   = document.getElementById('erros');

  const todoPreenchido = campos.every(id => document.getElementById(id).value.trim()) && imagem;

  erro.innerHTML = '';

  if (todoPreenchido) {
    new bootstrap.Modal(document.getElementById('modalconfim')).show();
    bootstrap.Modal.getInstance(document.getElementById('modalcad')).hide();
  } else {
    erro.textContent = 'Preencha todos os campos para continuar.';
  }
}

function returnmod() {
  new bootstrap.Modal(document.getElementById('modalcad')).show();
  bootstrap.Modal.getInstance(document.getElementById('modalconfim')).hide();
}
