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
 * Get the stats of a GitHub repository from Github API
 * @param {string} repoName - Repository name in format 'username/repository-name'
 * @param {string} githubAuthToken - Github authentication token optional
 * @returns {Promise<RepoStats>} Promise that resolves with the repository stats
 */
export declare function getRepoStats(repoName: string, githubAuthToken?: string): Promise<RepoStats>;
/**
 * Render a GitHub stats card with provided data
 * @param {string} selector - CSS selector of the container element
 * @param {RepoStats} stats - Repository stats
 */
export declare function renderRepoCard(selector: string, stats: RepoStats): void;
