export interface RepoStats {
    name: string;
    fullName: string;
    htmlUrl: string;
    stargazersCount: number;
    forksCount: number;
    openIssuesCount: number;
    description: string;
    createdAt: string;
    updatedAt: string;
    languages: Record<string, number>;
}
/**
 * Función principal para crear una tarjeta de estadísticas de GitHub
 * @param {string} selector - Selector CSS del elemento contenedor
 * @param {string} repoName - Nombre del repositorio en formato 'usuario/nombre-del-repo'
 * @param {string} githubAuthToken - Token de autenticación de Github opcional
 */
export declare function createRepoCard(selector: string, repoName: string, githubAuthToken?: string): Promise<void>;
/**
 * Obtiene solo los datos del repositorio sin manipular el DOM
 * Útil para SSR (Server-Side Rendering)
 * @param {string} repoName - Nombre del repositorio en formato 'usuario/nombre-del-repo'
 * @param {string} githubAuthToken - Token de autenticación de Github opcional
 * @returns {Promise<RepoStats>} Promesa que resuelve con las estadísticas del repositorio
 */
export declare function getRepoStats(repoName: string, githubAuthToken?: string): Promise<RepoStats>;
