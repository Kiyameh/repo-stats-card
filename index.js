/**
 * Función principal para crear una tarjeta de estadísticas de GitHub
 * @param {string} selector - Selector CSS del elemento contenedor
 * @param {string} repoName - Nombre del repositorio en formato 'usuario/nombre-del-repo'
 */
export async function createRepoCard(selector, repoName) {
  // Validar parámetros
  if (!selector || !repoName) {
    throw new Error(
      'Se requieren tanto el selector como el nombre del repositorio'
    )
  }

  try {
    // Obtener datos del repositorio
    const response = await fetch(`https://api.github.com/repos/${repoName}`)

    if (!response.ok) {
      throw new Error(
        `Error al obtener datos del repositorio: ${response.status}`
      )
    }

    const repoData = await response.json()

    // Extraer estadísticas clave
    const stats = {
      name: repoData.name,
      fullName: repoData.full_name,
      htmlUrl: repoData.html_url,
      stargazersCount: repoData.stargazers_count,
      forksCount: repoData.forks_count,
      openIssuesCount: repoData.open_issues_count,
      description: repoData.description || 'Sin descripción',
    }

    // Inyectar CSS si no existe
    injectCSS()

    // Generar HTML de la tarjeta
    const cardHTML = generateHTML(stats)

    // Encontrar el elemento contenedor
    const container = document.querySelector(selector)
    if (!container) {
      throw new Error(`No se encontró el elemento con selector: ${selector}`)
    }

    // Insertar la tarjeta
    container.innerHTML = cardHTML
  } catch (error) {
    console.error('Error al crear la tarjeta de GitHub:', error)

    // Mostrar mensaje de error en el contenedor
    const container = document.querySelector(selector)
    if (container) {
      container.innerHTML = `
        <div class="github-stats-card error">
          <p>❌ Error al cargar las estadísticas del repositorio</p>
          <p class="error-message">${error.message}</p>
        </div>
      `
    }
  }
}

/**
 * Genera el HTML de la tarjeta de estadísticas
 * @param {Object} stats - Objeto con las estadísticas del repositorio
 * @returns {string} HTML de la tarjeta
 */
function generateHTML(stats) {
  return `
    <div class="github-stats-card">
      <div class="card-header">
        <h3 class="repo-name">
          <a href="${stats.htmlUrl}" target="_blank" rel="noopener noreferrer">
            ${stats.fullName}
          </a>
        </h3>
        <p class="repo-description">${escapeHtml(stats.description)}</p>
      </div>
      
      <div class="card-stats">
        <div class="stat-item">
          <span class="stat-icon">⭐</span>
          <span class="stat-value">${stats.stargazersCount.toLocaleString()}</span>
          <span class="stat-label">Estrellas</span>
        </div>
        
        <div class="stat-item">
          <span class="stat-icon">🍴</span>
          <span class="stat-value">${stats.forksCount.toLocaleString()}</span>
          <span class="stat-label">Forks</span>
        </div>
        
        <div class="stat-item">
          <span class="stat-icon">❗</span>
          <span class="stat-value">${stats.openIssuesCount.toLocaleString()}</span>
          <span class="stat-label">Issues</span>
        </div>
      </div>
      
      <div class="card-footer">
        <a href="${
          stats.htmlUrl
        }" target="_blank" rel="noopener noreferrer" class="view-repo-btn">
          Ver en GitHub →
        </a>
      </div>
    </div>
  `
}

/**
 * Escapa caracteres HTML para prevenir XSS
 * @param {string} text - Texto a escapar
 * @returns {string} Texto escapado
 */
function escapeHtml(text) {
  const div = document.createElement('div')
  div.textContent = text
  return div.innerHTML
}

/**
 * Inyecta los estilos CSS necesarios en el head del documento
 */
function injectCSS() {
  // Verificar si los estilos ya han sido inyectados
  if (document.querySelector('#github-stats-card-styles')) {
    return
  }

  const styles = `
    .github-stats-card {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
      background: #ffffff;
      border: 1px solid #e1e4e8;
      border-radius: 8px;
      padding: 16px;
      max-width: 400px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
      transition: box-shadow 0.2s ease;
    }
    
    .github-stats-card:hover {
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    }
    
    .github-stats-card.error {
      background: #fef2f2;
      border-color: #fecaca;
      color: #dc2626;
    }
    
    .github-stats-card.error .error-message {
      font-size: 0.875rem;
      margin-top: 8px;
      opacity: 0.8;
    }
    
    .card-header {
      margin-bottom: 16px;
    }
    
    .repo-name {
      margin: 0 0 8px 0;
      font-size: 1.125rem;
      font-weight: 600;
    }
    
    .repo-name a {
      color: #0366d6;
      text-decoration: none;
    }
    
    .repo-name a:hover {
      text-decoration: underline;
    }
    
    .repo-description {
      margin: 0;
      font-size: 0.875rem;
      color: #586069;
      line-height: 1.4;
    }
    
    .card-stats {
      display: flex;
      justify-content: space-between;
      margin-bottom: 16px;
      padding: 12px 0;
      border-top: 1px solid #e1e4e8;
      border-bottom: 1px solid #e1e4e8;
    }
    
    .stat-item {
      display: flex;
      flex-direction: column;
      align-items: center;
      flex: 1;
    }
    
    .stat-icon {
      font-size: 1.25rem;
      margin-bottom: 4px;
    }
    
    .stat-value {
      font-size: 1.125rem;
      font-weight: 600;
      color: #24292e;
    }
    
    .stat-label {
      font-size: 0.75rem;
      color: #586069;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    
    .card-footer {
      text-align: center;
    }
    
    .view-repo-btn {
      display: inline-block;
      background: #0366d6;
      color: #ffffff;
      text-decoration: none;
      padding: 8px 16px;
      border-radius: 6px;
      font-size: 0.875rem;
      font-weight: 500;
      transition: background-color 0.2s ease;
    }
    
    .view-repo-btn:hover {
      background: #0256cc;
    }
    
    /* Responsive */
    @media (max-width: 480px) {
      .github-stats-card {
        padding: 12px;
      }
      
      .card-stats {
        flex-direction: column;
        gap: 12px;
      }
      
      .stat-item {
        flex-direction: row;
        justify-content: center;
        gap: 8px;
      }
      
      .stat-icon {
        margin-bottom: 0;
      }
    }
  `

  const styleElement = document.createElement('style')
  styleElement.id = 'github-stats-card-styles'
  styleElement.textContent = styles
  document.head.appendChild(styleElement)
}
