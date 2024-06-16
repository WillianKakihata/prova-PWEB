document.addEventListener('DOMContentLoaded', () => {
    const filterIcon = document.getElementById('filter-icon-container');
    const filterDialog = document.getElementById('filter-dialog');
    const filterCount = document.getElementById('filter-count');
    const closeDialogButton = document.getElementById('close-dialog');
    const applyFiltersButton = document.getElementById('apply-filters');
    const searchInput = document.getElementById('pesquisa');
    const filterForm = document.getElementById('filter-form');
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
    const tipoInput = document.getElementById('tipo');
    const quantidadeSelect = document.getElementById('quantidade');
    const deInput = document.getElementById('de');
    const ateInput = document.getElementById('ate');
  
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
  
      // Fechar o modal
      filterDialog.close();
  
      // Simular a atualização dos dados com base nos novos filtros (substituir com a lógica real de busca de dados)
      console.log('Novos filtros aplicados:', Object.fromEntries(newParams));
    });
  });
  