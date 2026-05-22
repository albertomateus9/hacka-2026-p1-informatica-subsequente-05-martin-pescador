document.addEventListener('DOMContentLoaded', () => {

  /* ==========================================================================
     BASE DE DADOS INICIAL (ACHADOS E PERDIDOS)
     ========================================================================== */
  let pertences = [
    {
      id: 1,
      title: 'Estojo Escolar Azul',
      category: 'materiais',
      status: 'perdido',
      date: '20/05/2026',
      location: 'Sala 102',
      desc: 'Estojo azul marinho com zíper laranja, contendo canetas diversas, lapiseira e uma borracha verde.',
      icon: 'fa-pencil-ruler'
    },
    {
      id: 2,
      title: 'Guarda-chuva Preto',
      category: 'vestuario',
      status: 'achado',
      date: '19/05/2026',
      location: 'Pátio Central',
      desc: 'Guarda-chuva grande preto com cabo de madeira curvilíneo, encontrado próximo aos bancos perto da cantina.',
      icon: 'fa-umbrella'
    },
    {
      id: 3,
      title: 'Calculadora Científica',
      category: 'eletronicos',
      status: 'achado',
      date: '18/05/2026',
      location: 'Laboratório de Redes',
      desc: 'Calculadora Casio fx-82MS cinza escura, com tampa protetora, esquecida sobre a mesa principal de testes.',
      icon: 'fa-calculator'
    },
    {
      id: 4,
      title: 'RG - Marcos S. Oliveira',
      category: 'documentos',
      status: 'perdido',
      date: '15/05/2026',
      location: 'Biblioteca',
      desc: 'Cédula de identidade (RG) original pertencente a Marcos de Souza Oliveira. Perdido possivelmente no período da noite.',
      icon: 'fa-id-card'
    },
    {
      id: 5,
      title: 'Caderno Universitário',
      category: 'materiais',
      status: 'achado',
      date: '21/05/2026',
      location: 'Auditório Principal',
      desc: 'Caderno espiral de 10 matérias com capa preta, encontrado nas últimas fileiras do auditório.',
      icon: 'fa-book'
    },
    {
      id: 6,
      title: 'Chaveiro de Metal',
      category: 'outros',
      status: 'perdido',
      date: '14/05/2026',
      location: 'Quadra Poliesportiva',
      desc: 'Chaveiro de argola com 3 chaves de latão e um pingente metálico em forma de controle de videogame.',
      icon: 'fa-key'
    }
  ];

  /* ==========================================================================
     GERENCIADOR DE TEMA ESCURO/CLARO
     ========================================================================== */
  const themeToggle = document.getElementById('theme-toggle');
  const themeIcon = document.getElementById('theme-icon');
  
  const savedTheme = localStorage.getItem('theme') || 'dark';
  document.documentElement.setAttribute('data-theme', savedTheme);
  updateThemeIcon(savedTheme);

  themeToggle.addEventListener('click', () => {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    updateThemeIcon(newTheme);
  });

  function updateThemeIcon(theme) {
    if (theme === 'light') {
      themeIcon.className = 'fa-solid fa-moon';
    } else {
      themeIcon.className = 'fa-solid fa-sun';
    }
  }

  /* ==========================================================================
     RENDERIZAÇÃO DOS CARDS DO MURAL
     ========================================================================== */
  const muralGrid = document.getElementById('mural-grid');
  const searchInput = document.getElementById('search-input');
  const filterButtons = document.querySelectorAll('.filter-btn');
  const filterStatusSelect = document.getElementById('filter-status');

  let activeCategory = 'all';
  let activeStatus = 'all';
  let searchQuery = '';

  function getCategoryIcon(category) {
    switch (category) {
      case 'eletronicos': return 'fa-laptop-code';
      case 'documentos': return 'fa-id-card';
      case 'vestuario': return 'fa-shirt';
      case 'materiais': return 'fa-pencil-ruler';
      default: return 'fa-magnifying-glass-question';
    }
  }

  function renderMural() {
    if (!muralGrid) return;
    muralGrid.innerHTML = '';

    const filteredPertences = pertences.filter(item => {
      // Filtro de Categoria
      const matchesCategory = activeCategory === 'all' || item.category === activeCategory;
      // Filtro de Status (Achado/Perdido)
      const matchesStatus = activeStatus === 'all' || item.status === activeStatus;
      // Filtro de Busca por texto
      const textToSearch = `${item.title} ${item.desc} ${item.location}`.toLowerCase();
      const matchesSearch = textToSearch.includes(searchQuery.toLowerCase());

      return matchesCategory && matchesStatus && matchesSearch;
    });

    if (filteredPertences.length === 0) {
      muralGrid.innerHTML = `
        <div style="grid-column: 1 / -1; text-align: center; padding: 4rem 2rem; color: var(--text-muted);">
          <i class="fa-regular fa-folder-open" style="font-size: 3rem; margin-bottom: 1rem; display: block; color: var(--accent);"></i>
          <p>Nenhum pertence encontrado com os filtros selecionados.</p>
        </div>
      `;
      return;
    }

    filteredPertences.forEach(item => {
      const card = document.createElement('div');
      card.className = 'item-card';
      
      const categoryIcon = item.icon || getCategoryIcon(item.category);
      const statusLabel = item.status === 'perdido' ? 'Perdido' : 'Achado';
      const statusClass = item.status === 'perdido' ? 'status-perdido' : 'status-achado';

      card.innerHTML = `
        <div class="card-img-container">
          <div class="card-placeholder-art">
            <i class="fa-solid ${categoryIcon}"></i>
          </div>
          <span class="item-status-tag ${statusClass}">${statusLabel}</span>
        </div>
        <div class="card-body">
          <span class="item-category-label">${item.category}</span>
          <h3>${item.title}</h3>
          <div class="item-meta-info">
            <span><i class="fa-regular fa-calendar"></i> ${item.date}</span>
            <span><i class="fa-solid fa-location-dot"></i> ${item.location}</span>
          </div>
          <p class="item-description">${item.desc}</p>
          <a href="#reportar" class="btn-contact">
            <i class="fa-regular fa-comment-dots"></i> Tenho Informações
          </a>
        </div>
      `;
      
      muralGrid.appendChild(card);
    });
  }

  // Event Listeners para Filtros e Busca
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      searchQuery = e.target.value;
      renderMural();
    });
  }

  filterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      filterButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      activeCategory = btn.getAttribute('data-category');
      renderMural();
    });
  });

  if (filterStatusSelect) {
    filterStatusSelect.addEventListener('change', (e) => {
      activeStatus = e.target.value;
      renderMural();
    });
  }

  /* ==========================================================================
     ENVIO DE REPORT (FORMULÁRIO)
     ========================================================================== */
  const reportForm = document.getElementById('report-form');
  const successModal = document.getElementById('success-modal');
  const modalCloseBtn = successModal ? successModal.querySelector('.modal-close-btn') : null;

  if (reportForm) {
    reportForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const titleInput = document.getElementById('item-title');
      const categorySelect = document.getElementById('item-category');
      const statusSelect = document.getElementById('item-status');
      const locationInput = document.getElementById('item-location');
      const descInput = document.getElementById('item-desc');

      let isValid = true;

      // Validação rápida
      [titleInput, categorySelect, statusSelect, locationInput, descInput].forEach(input => {
        if (!input.value.trim()) {
          input.style.borderColor = '#ef4444';
          isValid = false;
        } else {
          input.style.borderColor = '';
        }
      });

      if (!isValid) {
        alert('Por favor, preencha todos os campos.');
        return;
      }

      // Adicionar novo item na base de dados fictícia
      const newItem = {
        id: pertences.length + 1,
        title: titleInput.value,
        category: categorySelect.value,
        status: statusSelect.value,
        date: new Date().toLocaleDateString('pt-BR'),
        location: locationInput.value,
        desc: descInput.value,
        icon: null // Deixará o sistema puxar dinamicamente o ícone da categoria
      };

      pertences.unshift(newItem); // Adiciona no início da lista

      // Resetar filtros e renderizar mural atualizado
      if (searchInput) searchInput.value = '';
      searchQuery = '';
      filterButtons.forEach(b => b.classList.remove('active'));
      filterButtons[0].classList.add('active'); // Seleciona "Todos"
      activeCategory = 'all';
      if (filterStatusSelect) filterStatusSelect.value = 'all';
      activeStatus = 'all';

      renderMural();

      // Abrir Modal de Sucesso
      if (successModal) {
        successModal.classList.add('active');
        document.body.style.overflow = 'hidden';
      }

      // Limpar formulário
      reportForm.reset();
    });
  }

  // Fechar Modal
  if (modalCloseBtn && successModal) {
    modalCloseBtn.addEventListener('click', () => {
      successModal.classList.remove('active');
      document.body.style.overflow = '';
    });
    
    successModal.addEventListener('click', (e) => {
      if (e.target === successModal) {
        successModal.classList.remove('active');
        document.body.style.overflow = '';
      }
    });
  }

  // Inicialização Inicial do Mural
  renderMural();

});
