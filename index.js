document.addEventListener('DOMContentLoaded', () => {
    const filterIcon = document.getElementById('filter-icon-container');
    const filterDialog = document.getElementById('filter-dialog');
    const filterCount = document.getElementById('filter-count');
    const closeDialogButton = document.getElementById('close-dialog');
    const applyFiltersButton = document.getElementById('apply-filters');
    const searchInput = document.getElementById('pesquisa');
    const filterForm = document.getElementById('filter-form');
    const noticiasContainer = document.getElementById('noticias-container');
    const tipoInput = document.getElementById('tipo');
    const quantidadeSelect = document.getElementById('quantidade');
    const deInput = document.getElementById('de');
    const ateInput = document.getElementById('ate');
    const urlParams = new URLSearchParams(window.location.search);
  
    // Mostrar o modal quando o ícone de filtro for clicado
    filterIcon.addEventListener('click', () => {
      filterDialog.showModal();
    });
  
    // Fechar o modal quando o botão de fechar for clicado
    closeDialogButton.addEventListener('click', () => {
      filterDialog.close();
    });
  
    // Analisar a query string para determinar filtros ativos
    let activeFilters = 0;
    urlParams.forEach((value, key) => {
      if (key !== 'page' && key !== 'busca') {
        activeFilters++;
      }
    });
  
    // Exibir o número de filtros ativos
    filterCount.textContent = activeFilters > 0 ? activeFilters : '';
  
    // Aplicar a consulta de busca ao input, se existir
    if (urlParams.has('busca')) {
      searchInput.value = urlParams.get('busca');
    }
  
    // Preencher os inputs de filtro se eles existirem na query string
    if (urlParams.has('tipo')) {
      tipoInput.value = urlParams.get('tipo');
    }
    if (urlParams.has('quantidade')) {
      quantidadeSelect.value = urlParams.get('quantidade');
    }
    if (urlParams.has('de')) {
      deInput.value = urlParams.get('de');
    }
    if (urlParams.has('ate')) {
      ateInput.value = urlParams.get('ate');
    }
  
    // Função para buscar notícias da API do IBGE
    async function fetchNoticias() {
      const queryParams = new URLSearchParams();
  
      if (searchInput.value) queryParams.append('busca', searchInput.value);
      if (tipoInput.value) queryParams.append('tipo', tipoInput.value);
      if (quantidadeSelect.value) queryParams.append('quantidade', quantidadeSelect.value);
      if (deInput.value) queryParams.append('de', deInput.value);
      if (ateInput.value) queryParams.append('ate', ateInput.value);
  
      const url = `https://servicodados.ibge.gov.br/api/v3/noticias?${queryParams.toString()}`;
      try {
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const noticias = await response.json();
        displayNoticias(noticias);
      } catch (error) {
        console.error('Failed to fetch noticias:', error);
      }
    }
  
    // Função para exibir as notícias no HTML
    function displayNoticias(noticias) {
      noticiasContainer.innerHTML = '';
      noticias.items.forEach(noticia => {
        const noticiaElement = document.createElement('div');
        noticiaElement.className = 'noticia';
        noticiaElement.innerHTML = `
          <h2>${noticia.titulo}</h2>
          <p>${noticia.introducao}</p>
          <a href="${noticia.link}" target="_blank">Leia mais</a>
        `;
        noticiasContainer.appendChild(noticiaElement);
      });
    }
  
    // Atualizar a query string e os dados quando os filtros forem aplicados
    applyFiltersButton.addEventListener('click', (event) => {
      event.preventDefault(); // Impede o envio normal do formulário
  
      const newParams = new URLSearchParams(window.location.search);
      newParams.set('busca', searchInput.value);
      newParams.set('tipo', tipoInput.value);
      newParams.set('quantidade', quantidadeSelect.value);
      newParams.set('de', deInput.value);
      newParams.set('ate', ateInput.value);
  
      // Atualizar a URL com a nova query string
      window.history.pushState({}, '', `${window.location.pathname}?${newParams}`);
  
      // Fechar o dialog
      filterDialog.close();
  
      // Buscar notícias com os novos filtros
      fetchNoticias();
    });
  
    // Preencher o input de "Tipo" com valores possíveis da API
    async function fetchTipos() {
      try {
        const response = await fetch('https://servicodados.ibge.gov.br/api/docs/noticias?versao=3');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const tipos = await response.json();
        tipos.forEach(tipo => {
          const option = document.createElement('option');
          option.value = tipo;
          option.textContent = tipo;
          tipoInput.appendChild(option);
        });
      } catch (error) {
        console.error('Failed to fetch tipos:', error);
      }
    }
  
    // Inicializar a página carregando os tipos e as notícias
    fetchTipos();
    fetchNoticias();
  });
  