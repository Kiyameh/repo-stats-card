/**
 * Interfaz para las estadísticas del repositorio de GitHub
 */
export interface GitHubRepoStats {
  /** Nombre del repositorio */
  name: string
  /** Nombre completo del repositorio (usuario/nombre) */
  fullName: string
  /** URL del repositorio en GitHub */
  htmlUrl: string
  /** Número de estrellas */
  stargazersCount: number
  /** Número de forks */
  forksCount: number
  /** Número de issues abiertos */
  openIssuesCount: number
  /** Descripción del repositorio */
  description: string
}

/**
 * Interfaz para los datos de respuesta de la API de GitHub
 */
export interface GitHubRepoResponse {
  name: string
  full_name: string
  html_url: string
  stargazers_count: number
  forks_count: number
  open_issues_count: number
  description: string | null
}

/**
 * Crea una tarjeta de estadísticas de GitHub en el elemento especificado
 * @param selector - Selector CSS del elemento contenedor donde se insertará la tarjeta
 * @param repoName - Nombre del repositorio en formato 'usuario/nombre-del-repo'
 * @returns Promise<void> - Promesa que se resuelve cuando la tarjeta se ha creado exitosamente
 * @throws Error - Si no se proporcionan los parámetros requeridos o si hay un error al obtener los datos
 *
 * @example
 * ```javascript
 * import { createRepoCard } from 'github-repo-stats-card';
 *
 * // Crear una tarjeta de estadísticas
 * await createRepoCard('#my-container', 'Kiyameh/repo-stats-card');
 * ```
 */
export function createRepoCard(
  selector: string,
  repoName: string
): Promise<void>

/**
 * Genera el HTML de la tarjeta de estadísticas
 * @param stats - Objeto con las estadísticas del repositorio
 * @returns HTML de la tarjeta como string
 */
export function generateHTML(stats: GitHubRepoStats): string

/**
 * Escapa caracteres HTML para prevenir XSS
 * @param text - Texto a escapar
 * @returns Texto escapado
 */
export function escapeHtml(text: string): string

/**
 * Inyecta los estilos CSS necesarios en el head del documento
 */
export function injectCSS(): void
