    document.addEventListener('DOMContentLoaded', () => {
// Seleciona o container do ícone de filtro
    const filterIcon = document.getElementById('filter-icon-container');
// Seleciona o modal de filtro
    const filterDialog = document.getElementById('filter-dialog');
// Seleciona o elemento que exibirá a contagem de filtros ativos
    const filterCount = document.getElementById('filter-count');
// Seleciona o botão de fechar o modal
    const closeDialogButton = document.getElementById('close-dialog');
// Seleciona o campo de busca
    const searchInput = document.getElementById('pesquisa');
// Mostra o modal quando o ícone de filtro é clicado
    filterIcon.addEventListener('click', () => {
      filterDialog.showModal();
    });
// Fecha o modal quando o botão de fechar é clicado
    closeDialogButton.addEventListener('click', () => {
      filterDialog.close();
    });
// Faz o parsing (análise) da query string para determinar os filtros ativos
    const urlParams = new URLSearchParams(window.location.search);
    let activeFilters = 0;
// Itera sobre os parâmetros da query string
    urlParams.forEach((value, key) => {
// Incrementa a contagem de filtros ativos se a chave não for "page" ou "busca"
      if (key !== 'page' && key !== 'busca') {
        activeFilters++;
      }
    });
// Exibe o número de filtros ativos no elemento "filterCount"
    filterCount.textContent = activeFilters > 0 ? activeFilters : '';
// Se a query string contém o parâmetro "busca", aplica esse valor no campo de busca
    if (urlParams.has('busca')) {
      searchInput.value = urlParams.get('busca');
    }
  });
  