// Função para buscar notícias da API do IBGE
async function fetchNoticias(page = 1) {
  try {
    const searchInput = document.getElementById('pesquisa');
    const tipoInput = document.getElementById('tipo');
    const quantidadeSelect = document.getElementById('quantidade');
    const deInput = document.getElementById('de');
    const ateInput = document.getElementById('ate');

    const queryParams = new URLSearchParams();
    if (searchInput.value) queryParams.append('busca', searchInput.value);
    if (tipoInput.value) queryParams.append('tipo', tipoInput.value);
    if (quantidadeSelect.value) queryParams.append('quantidade', quantidadeSelect.value);
    if (deInput.value) queryParams.append('de', deInput.value);
    if (ateInput.value) queryParams.append('ate', ateInput.value);
    queryParams.append('page', page); // Adicionar página à query string

    const url = `https://servicodados.ibge.gov.br/api/v3/noticias?${queryParams.toString()}`;
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Erro ao buscar notícias: ${response.status} ${response.statusText}`);
    }

    const noticias = await response.json();
    displayNoticias(noticias);
    createPaginationButtons(page, noticias.total_pages); // Atualiza os botões de paginação com base no total de páginas

  } catch (error) {
    console.error('Erro ao buscar notícias:', error.message);
    // Aqui você pode adicionar uma mensagem de erro na interface, se necessário
  }
}

// Função para criar os botões de páginação
function createPaginationButtons(currentPage, totalPages) {
  const paginationList = document.querySelector('.pagination-list');
  paginationList.innerHTML = ''; // Limpa os botões existentes

  const maxVisibleButtons = 10;
  const halfMaxVisibleButtons = Math.floor(maxVisibleButtons / 2);

  let startPage = currentPage - halfMaxVisibleButtons;
  startPage = Math.max(startPage, 1); // Garante que não seja menor que a página 1

  let endPage = startPage + maxVisibleButtons - 1;
  endPage = Math.min(endPage, totalPages); // Garante que não ultrapasse o total de páginas

  for (let page = startPage; page <= endPage; page++) {
    const button = document.createElement('button');
    button.textContent = page;
    button.classList.add('pagination-button');
    
    if (page === currentPage) {
      button.classList.add('current-page');
    }

    button.addEventListener('click', () => {
      fetchNoticias(page); // Busca as notícias da página clicada
      updateQueryString(page); // Atualiza a query string com a página selecionada
    });

    paginationList.appendChild(button);
  }
}

// Função para atualizar a query string da URL
function updateQueryString(page) {
  const urlParams = new URLSearchParams(window.location.search);
  urlParams.set('page', page);
  window.history.replaceState({}, '', `${window.location.pathname}?${urlParams}`);
}


// Função para exibir as notícias no HTML
function displayNoticias(noticias) {
  noticiasContainer.innerHTML = ''; // Limpar o conteúdo anterior

  // Verificar se noticias.items é um array antes de iterá-lo
  if (!Array.isArray(noticias.items)) {
    console.error('Os dados das notícias não estão no formato esperado:', noticias);
    return;
  }

  const ulElement = document.createElement('ul');
  ulElement.className = 'noticias-list'; // Adicione uma classe se desejar estilizar a lista

  noticias.items.forEach(noticia => {
    const liElement = document.createElement('li');
    liElement.className = 'noticia';

    // Concatenar URL base com caminho da imagem, se fornecido
    const imagemUrl = noticia.imagem ? `https://agenciadenoticias.ibge.gov.br${noticia.imagem}` : '';

    liElement.innerHTML = `
      <h2>${noticia.titulo}</h2>
      <p>${noticia.introducao}</p>
      <p><strong>Publicado:</strong> ${formatarDataPublicacao(noticia.data_publicacao)}</p>
      ${imagemUrl ? `<img src="${imagemUrl}" alt="Imagem da notícia">` : ''}
      <p><strong>Editorias:</strong> ${formatarEditorias(noticia.editorias)}</p>
      <a href="${noticia.link}" target="_blank">Leia mais</a>
    `;

    ulElement.appendChild(liElement);
  });

  noticiasContainer.appendChild(ulElement);
}

// Função para formatar data de publicação
function formatarDataPublicacao(data) {
  const dataPublicacao = new Date(data);
  const hoje = new Date();
  const diff = hoje - dataPublicacao;
  const umDia = 1000 * 60 * 60 * 24;

  if (diff < umDia) {
    return 'Publicado hoje';
  } else if (diff < umDia * 2) {
    return 'Publicado ontem';
  } else {
    const diasPassados = Math.floor(diff / umDia);
    return `Publicado há ${diasPassados} dias`;
  }
}

// Função para formatar editorias
function formatarEditorias(editorias) {
  if (!Array.isArray(editorias)) {
    return ''; // Retornar vazio se não houver editorias
  }
  return editorias.map(editoria => `#${editoria}`).join(', ');
}

document.addEventListener('DOMContentLoaded', () => {
  const filterIcon = document.getElementById('filter-icon-container');
  const filterDialog = document.getElementById('filter-dialog');
  const filterCount = document.getElementById('filter-count');
  const closeDialogButton = document.getElementById('close-dialog');
  const applyFiltersButton = document.getElementById('apply-filters');
  const noticiasContainer = document.getElementById('noticias-container');
  const tipoInput = document.getElementById('tipo');
  const quantidadeSelect = document.getElementById('quantidade');
  const deInput = document.getElementById('de');
  const ateInput = document.getElementById('ate');
  let searchInput; // Declarar aqui para uso global

  // Mostrar o modal quando o ícone de filtro for clicado
  filterIcon.addEventListener('click', () => {
    filterDialog.showModal();
  });

  // Fechar o modal quando o botão de fechar for clicado
  closeDialogButton.addEventListener('click', () => {
    filterDialog.close();
  });

  // Função para buscar tipos da API do IBGE
  async function fetchTipos() {
    try {
      const response = await fetch('https://servicodados.ibge.gov.br/api/docs/noticias?versao=3');
  
      if (!response.ok) {
        throw new Error(`Erro ao buscar tipos: ${response.status} ${response.statusText}`);
      }
  
      const contentType = response.headers.get('content-type');
      
      // Verificar se o conteúdo da resposta é JSON
      if (contentType && contentType.includes('application/json')) {
        const tipos = await response.json();
        console.log('Tipos de notícias:', tipos);
  
        // Limpar e preencher as opções de tipoInput
        tipoInput.innerHTML = ''; // Limpar opções existentes
        tipos.forEach(tipo => {
          const option = document.createElement('option');
          option.value = tipo;
          option.textContent = tipo;
          tipoInput.appendChild(option);
        });
      } else {
        // Se a resposta não for JSON, lançar um erro ou exibir uma mensagem adequada
        const text = await response.text();
        throw new Error(`A API retornou um tipo de conteúdo inesperado: ${contentType}. Texto da resposta: ${text}`);
      }
    } catch (error) {
      console.error('Erro ao buscar tipos:', error.message);
      
      // Exibir mensagem de erro na interface
      const errorMessage = document.createElement('p');
      errorMessage.textContent = 'Erro ao buscar tipos de notícias. Por favor, tente novamente mais tarde.';
      errorMessage.style.color = 'red';
      document.getElementById('noticias-container').appendChild(errorMessage);
    }
  }
  

  
  

  // Função para buscar notícias da API do IBGE
  async function fetchNoticias() {
    try {
      searchInput = document.getElementById('pesquisa'); // Definir searchInput aqui
      const queryParams = new URLSearchParams();

      if (searchInput.value) queryParams.append('busca', searchInput.value);
      if (tipoInput.value) queryParams.append('tipo', tipoInput.value);
      if (quantidadeSelect.value) queryParams.append('quantidade', quantidadeSelect.value);
      if (deInput.value) queryParams.append('de', deInput.value);
      if (ateInput.value) queryParams.append('ate', ateInput.value);

      const url = `https://servicodados.ibge.gov.br/api/v3/noticias?${queryParams.toString()}`;
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Erro ao buscar notícias: ${response.status} ${response.statusText}`);
      }
      const noticias = await response.json();
      // Chamar a função displayNoticias após receber os dados
      displayNoticias(noticias);
    } catch (error) {
      console.error('Erro ao buscar notícias:', error.message);
      // Aqui você pode adicionar uma mensagem de erro na interface, se necessário
    }
  }

  // Função para exibir as notícias no HTML
function displayNoticias(noticias) {
  noticiasContainer.innerHTML = ''; // Limpar o conteúdo anterior

  // Verificar se noticias.items é um array antes de iterá-lo
  if (!Array.isArray(noticias.items)) {
    console.error('Os dados das notícias não estão no formato esperado:', noticias);
    return;
  }

  const ulElement = document.createElement('ul');
  ulElement.className = 'noticias-list'; // Adicione uma classe se desejar estilizar a lista

  noticias.items.forEach(noticia => {
    const liElement = document.createElement('li');
    liElement.className = 'noticia';

    // Manipular a imagem para extrair a URL correta, se necessário
    let imagemUrl = '';
    if (noticia.imagem && typeof noticia.imagem === 'object' && noticia.imagem.hasOwnProperty('url')) {
      // Concatenar com o prefixo da URL base
      imagemUrl = `https://agenciadenoticias.ibge.gov.br${noticia.imagem.url}`;
    } else if (noticia.imagem && typeof noticia.imagem === 'string') {
      // Considerar que a imagem já é uma URL completa
      imagemUrl = noticia.imagem;
    }

    liElement.innerHTML = `
      <h2>${noticia.titulo}</h2>
      <p>${noticia.introducao}</p>
      <p><strong>Publicado:</strong> ${formatarDataPublicacao(noticia.data_publicacao)}</p>
      ${imagemUrl ? `<img src="${imagemUrl}" alt="Imagem da notícia">` : ''}
      <p><strong>Editorias:</strong> ${formatarEditorias(noticia.editorias)}</p>
      <a href="${noticia.link}" target="_blank">Leia mais</a>
    `;

    ulElement.appendChild(liElement);
  });

  noticiasContainer.appendChild(ulElement);
}


  // Função para formatar data de publicação
  function formatarDataPublicacao(data) {
    const dataPublicacao = new Date(data);
    const hoje = new Date();
    const diff = hoje - dataPublicacao;
    const umDia = 1000 * 60 * 60 * 24;

    if (diff < umDia) {
      return 'Publicado hoje';
    } else if (diff < umDia * 2) {
      return 'Publicado ontem';
    } else {
      const diasPassados = Math.floor(diff / umDia);
      return `Publicado há ${diasPassados} dias`;
    }
  }

  // Função para formatar editorias
  function formatarEditorias(editorias) {
    if (!Array.isArray(editorias)) {
      return ''; // Retornar vazio se não houver editorias
    }
    return editorias.map(editoria => `#${editoria}`).join(', ');
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

    // Buscar notícias com os novos filtros
    fetchNoticias();
  });

  // Preencher o input de "Tipo" com valores possíveis da API
  fetchTipos();
  fetchNoticias();
});



