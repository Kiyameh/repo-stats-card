// Types for the stats data
export interface RepoStats {
  name: string
  fullName: string
  htmlUrl: string
  stargazersCount: number
  forksCount: number
  openIssuesCount: number
  description: string
  createdAt: string
  updatedAt: string
  languages: Record<string, number>
}


/**
 * Get the stats of a GitHub repository from Github API
 * @param {string} repoName - Repository name in format 'username/repository-name'
 * @param {string} githubAuthToken - Github authentication token optional
 * @returns {Promise<RepoStats>} Promise that resolves with the repository stats
 */
export async function getRepoStats(repoName: string, githubAuthToken?: string) {

  // 1. Validate parameters
  if (!repoName) {
    throw new Error('Repository name is required')
  }

  try {
    // 2. Get repository data
    const headers = {
      Accept: 'application/vnd.github.v3+json',
    } as Record<string, string>

    if (githubAuthToken) {
      headers.Authorization = `Bearer ${githubAuthToken}`
    }
    const response = await fetch(`https://api.github.com/repos/${repoName}`, { headers })
    const languages = await fetch(
      `https://api.github.com/repos/${repoName}/languages`,
      { headers }
    )

    // 3. Validate response
    if (!response.ok || !languages.ok) {
      throw new Error(
        `Error getting repository data: ${response.status}`
      )
    }

    const repoData = await response.json()
    const languagesData = await languages.json()
    
    // 4. Filter top 5 languages by usage
    const sortedLanguages = Object.entries(languagesData)
      .sort(([, a], [, b]) => (b as number) - (a as number))
      .slice(0, 5)
      .reduce((acc, [language, bytes]) => {
        acc[language] = bytes as number
        return acc
      }, {} as Record<string, number>)
    
    // 5. Return the stats
    return {
      name: repoData.name,
      fullName: repoData.full_name,
      htmlUrl: repoData.html_url,
      stargazersCount: repoData.stargazers_count,
      forksCount: repoData.forks_count,
      openIssuesCount: repoData.open_issues_count,
      description: repoData.description || 'Sin descripción',
      createdAt: repoData.created_at,
      updatedAt: repoData.updated_at,
      languages: sortedLanguages,
    } as RepoStats
  } catch (error) {
    console.error('Error getting repository stats:', error)
    throw error
  }
}

/**
 * Render a GitHub stats card with provided data
 * @param {string} selector - CSS selector of the container element
 * @param {RepoStats} stats - Repository stats
 */
export function renderRepoCard(selector: string, stats: RepoStats) {
  // 1. Verify if we are in the browser
  if (typeof window === 'undefined' || typeof document === 'undefined') {
    console.warn(
      'renderRepoCard: This function can only be executed in the browser'
    )
    return
  }

  // 2. Validate parameters
  if (!selector || !stats) {
    throw new Error(
      'Both selector and stats are required'
    )
  }

  try {
    // 3. Inject CSS if not exists
    injectCSS()

    // 4. Generate HTML of the card
    const cardHTML = generateHTML(stats)

    // 5. Find the container element
    const container = document.querySelector(selector)
    if (!container) {
      throw new Error(`No container found with selector: ${selector}`)
    }

    // 6. Insert the card
    container.innerHTML = cardHTML
  } catch (error) {
    console.error('Error rendering the GitHub card:', error)

    // 7. Show error message in the container
    const container = document.querySelector(selector)
    if (container) {
      container.innerHTML = `
        <div class="github-stats-card error">
          <p>❌ Error rendering the card</p>
          <p class="error-message">${(error as Error).message}</p>
        </div>
      `
    }
  }
}

/**
 * Escape HTML characters to prevent XSS
 * @param {string} text - Text to escape
 * @returns {string} Escaped text
 */
function escapeHtml(text: string) {
  if (typeof document === 'undefined') {
    // Fallback for SSR
    return text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;')
  }

  const div = document.createElement('div')
  div.textContent = text
  return div.innerHTML
}

/**
 * Format a date in format "DD/MM/YYYY"
 * @param {string} dateString - Date in ISO 8601 format
 * @returns {string} Formatted date
 */

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })
}

/**
 * Format a number in format "1.2K" or "1.2M"
 * @param {number} num - Number to format
 * @returns {string} Formatted number
 */
function formatNumber(num: number): string {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + "M"
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + "K"
  }
  return num.toString()
}

/**
 * Get the color of a programming language
 * @param {string} language - Programming language
 * @returns {string} Color of the language
 */
function getLanguageColor(language: string): string {
  const colors: Record<string, string> = {
    JavaScript: "#f1e05a",
    TypeScript: "#3178c6",
    Python: "#3572a5",
    Java: "#b07219",
    HTML: "#e34c26",
    CSS: "#563d7c",
    Go: "#00add8",
    Rust: "#dea584",
    PHP: "#4f5d95",
    Ruby: "#701516",
    "C++": "#f34b7d",
    "C#": "#239120",
    Swift: "#fa7343",
    Kotlin: "#a97bff",
    Dart: "#00b4ab",
    Shell: "#89e051",
  }
  return colors[language] || "#8b949e"
}

/**
 * Generate the segments of a pie chart
 * @param {Array<{ language: string; percentage: string }>} languagePercentages - Array of languages and percentages
 * @returns {string} HTML of the segments
 */

function generatePieSegments(languagePercentages: Array<{ language: string; percentage: string }>): string {
  let cumulativePercentage = 0

  return languagePercentages
    .map(({ language, percentage }) => {
      const startAngle = (cumulativePercentage / 100) * 360
      const endAngle = ((cumulativePercentage + Number.parseFloat(percentage)) / 100) * 360
      cumulativePercentage += Number.parseFloat(percentage)

      const startAngleRad = (startAngle * Math.PI) / 180
      const endAngleRad = (endAngle * Math.PI) / 180

      const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1"

      const x1 = 50 + 40 * Math.cos(startAngleRad)
      const y1 = 50 + 40 * Math.sin(startAngleRad)
      const x2 = 50 + 40 * Math.cos(endAngleRad)
      const y2 = 50 + 40 * Math.sin(endAngleRad)

      const pathData = [`M 50 50`, `L ${x1} ${y1}`, `A 40 40 0 ${largeArcFlag} 1 ${x2} ${y2}`, `Z`].join(" ")

      return `<path d="${pathData}" fill="${getLanguageColor(language)}" class="stat-card-pie-segment" title="${language}: ${percentage}%"></path>`
    })
    .join("")
}

/**
 * Generate the HTML of the GitHub stats card
 * @param {RepoStats} stats - Repository stats
 * @returns {string} HTML of the card
 */
function generateHTML(stats: RepoStats): string {
  // Calculate language percentages
  const totalBytes = Object.values(stats.languages).reduce((sum, bytes) => sum + bytes, 0)
  const languagePercentages = Object.entries(stats.languages)
    .map(([language, bytes]) => ({
      language,
      bytes,
      percentage: ((bytes / totalBytes) * 100).toFixed(1),
    }))
    .sort((a, b) => b.bytes - a.bytes)

  // Generate pie chart segments
  const pieSegments = generatePieSegments(languagePercentages)

  // Generate linear chart segments
  const linearSegments = languagePercentages
    .map(
      ({ language, percentage }) =>
        `<div class="stat-card-language-segment" style="width: ${percentage}%; background-color: ${getLanguageColor(language)};" title="${language}: ${percentage}%"></div>`,
    )
    .join("")

  // Generate language list items
  const languageItems = languagePercentages
    .map(
      ({ language, percentage }) =>
        `<li class="stat-card-language-item">
        <span class="stat-card-language-dot" style="background-color: ${getLanguageColor(language)};" aria-hidden="true"></span>
        <span>${language}</span>
        <span class="stat-card-language-percentage">${percentage}%</span>
      </li>`,
    )
    .join("")

  return `
    <div class="stat-card-container">
      <article class="stat-card" role="main">
        <div class="stat-card-layout">
          <!-- Main Content -->
          <div class="stat-card-main">
            <header class="stat-card-header">
              <h1 class="stat-card-title">
                <a href="${stats.htmlUrl}" class="stat-card-link" target="_blank" rel="noopener noreferrer">
                  ${stats.name}
                </a>
              </h1>
              <p class="stat-card-full-name">${stats.fullName}</p>
            </header>

            <div class="stat-card-stats" role="group" aria-label="Repository statistics">
              <div class="stat-card-stat">
                <svg class="stat-card-stat-icon" viewBox="0 0 16 16" aria-hidden="true">
                  <path d="M8 .25a.75.75 0 0 1 .673.418l1.882 3.815 4.21.612a.75.75 0 0 1 .416 1.279l-3.046 2.97.719 4.192a.75.75 0 0 1-1.088.791L8 12.347l-3.766 1.98a.75.75 0 0 1-1.088-.79l.72-4.194L.818 6.374a.75.75 0 0 1 .416-1.28l4.21-.611L7.327.668A.75.75 0 0 1 8 .25Z"/>
                </svg>
                <span class="stat-card-stat-value">${formatNumber(stats.stargazersCount)}</span>
                <span>stars</span>
              </div>
              <div class="stat-card-stat">
                <svg class="stat-card-stat-icon" viewBox="0 0 16 16" aria-hidden="true">
                  <path d="M5 5.372v.878c0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75v-.878a2.25 2.25 0 1 1 1.5 0v.878a2.25 2.25 0 0 1-2.25 2.25h-1.5v2.128a2.251 2.251 0 1 1-1.5 0V8.5h-1.5A2.25 2.25 0 0 1 3.5 6.25v-.878a2.25 2.25 0 1 1 1.5 0ZM5 3.25a.75.75 0 1 0-1.5 0 .75.75 0 0 0 1.5 0Zm6.75.75a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Zm-3 8.75a.75.75 0 1 0-1.5 0 .75.75 0 0 0 1.5 0Z"/>
                </svg>
                <span class="stat-card-stat-value">${formatNumber(stats.forksCount)}</span>
                <span>forks</span>
              </div>
              <div class="stat-card-stat">
                <svg class="stat-card-stat-icon" viewBox="0 0 16 16" aria-hidden="true">
                  <path d="M8 9.5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3Z"/>
                  <path d="M8 0a8 8 0 1 1 0 16A8 8 0 0 1 8 0ZM1.5 8a6.5 6.5 0 1 0 13 0 6.5 6.5 0 0 0-13 0Z"/>
                </svg>
                <span class="stat-card-stat-value">${formatNumber(stats.openIssuesCount)}</span>
                <span>issues</span>
              </div>
            </div>

            <p class="stat-card-description">${escapeHtml(stats.description)}</p>

            <div class="stat-card-dates">
              <div class="stat-card-date">
                <span class="stat-card-date-label">Created</span>
                <time datetime="${stats.createdAt}">${formatDate(stats.createdAt)}</time>
              </div>
              <div class="stat-card-date">
                <span class="stat-card-date-label">Updated</span>
                <time datetime="${stats.updatedAt}">${formatDate(stats.updatedAt)}</time>
              </div>
            </div>
          </div>

          <!-- Chart Section -->
          <div class="stat-card-chart-section">
            <section aria-labelledby="languages-title">
              <h2 class="stat-card-languages-title" id="languages-title">Languages</h2>

              <!-- Desktop Pie Chart -->
              <svg class="stat-card-pie-chart" viewBox="0 0 100 100" role="img" aria-label="Programming languages distribution pie chart">
                ${pieSegments}
              </svg>

              <!-- Mobile Linear Chart -->
              <div class="stat-card-linear-chart" role="img" aria-label="Programming languages distribution chart">
                <div class="stat-card-languages-bar">
                  ${linearSegments}
                </div>
              </div>

              <ul class="stat-card-languages-list">
                ${languageItems}
              </ul>
            </section>
          </div>
        </div>

        <span class="stat-card-sr-only">
          Repository statistics: ${formatNumber(stats.stargazersCount)} stars, ${formatNumber(stats.forksCount)} forks, ${formatNumber(stats.openIssuesCount)} open issues. 
          Main languages: ${languagePercentages
            .slice(0, 3)
            .map((l) => `${l.language} ${l.percentage}%`)
            .join(", ")}.
        </span>
      </article>
    </div>
  `
}

/**
 * Inject the CSS of the GitHub stats card
 */
function injectCSS(): void {
  // 1. Verify if we are in browser
  if (typeof window === "undefined" || typeof document === "undefined") {
    console.warn("GitHub Stats Card: Not running in browser environment")
    return
  }

  // 2. Verify if the styles have been injected
  const existingStyle = document.getElementById("github-stats-card-styles")
  if (existingStyle) {
    console.log("GitHub Stats Card: Styles already injected")
    return
  }

  // 3. Inject CSS code
  const styleElement = document.createElement("style")
  styleElement.id = "github-stats-card-styles"
  styleElement.textContent = `
    :root {
      --stat-card-surface: #ffffff;
      --stat-card-border: #e1e5e9;
      --stat-card-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
      --stat-card-radius: 12px;
      --stat-card-text-primary: #24292f;
      --stat-card-text-secondary: #656d76;
      --stat-card-text-muted: #8b949e;
      --stat-card-accent: #0969da;
      --stat-card-accent-hover: #0860ca;
      --stat-card-spacing-xs: 4px;
      --stat-card-spacing-sm: 8px;
      --stat-card-spacing-md: 16px;
      --stat-card-spacing-lg: 24px;
      --stat-card-font-sm: 0.875rem;
      --stat-card-font-base: 1rem;
      --stat-card-font-lg: 1.125rem;
    }

    .stat-card-container {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Noto Sans', Helvetica, Arial, sans-serif;
      max-width: 920px;
      margin: 0 auto;
    }

    .stat-card {
      background: var(--stat-card-surface);
      border: 1px solid var(--stat-card-border);
      border-radius: var(--stat-card-radius);
      box-shadow: var(--stat-card-shadow);
      padding: var(--stat-card-spacing-lg);
      color: var(--stat-card-text-primary);
      transition: box-shadow 0.2s ease;
    }

    .stat-card:hover {
      box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
    }

    /* Desktop Layout */
    @media (min-width: 768px) {
      .stat-card-layout {
        display: grid;
        grid-template-columns: 1fr 300px;
        gap: var(--stat-card-spacing-lg);
        align-items: start;
      }
    }

    /* Mobile Layout */
    @media (max-width: 767px) {
      .stat-card-layout {
        display: flex;
        flex-direction: column;
        gap: var(--stat-card-spacing-lg);
      }
    }

    .stat-card-main {
      min-width: 0;
    }

    .stat-card-chart-section {
      display: flex;
      flex-direction: column;
      align-items: center;
    }

    .stat-card-header {
      margin-bottom: var(--stat-card-spacing-lg);
    }

    .stat-card-title {
      margin: 0 0 var(--stat-card-spacing-xs) 0;
      font-size: var(--stat-card-font-lg);
      font-weight: 600;
      line-height: 1.25;
    }

    .stat-card-link {
      color: var(--stat-card-accent);
      text-decoration: none;
      transition: color 0.2s ease;
    }

    .stat-card-link:hover {
      color: var(--stat-card-accent-hover);
      text-decoration: underline;
    }

    .stat-card-link:focus {
      outline: 2px solid var(--stat-card-accent);
      outline-offset: 2px;
      border-radius: var(--stat-card-spacing-xs);
    }

    .stat-card-full-name {
      font-size: var(--stat-card-font-sm);
      color: var(--stat-card-text-secondary);
      margin: 0;
    }

    .stat-card-stats {
      display: flex;
      gap: var(--stat-card-spacing-lg);
      margin-bottom: var(--stat-card-spacing-lg);
      flex-wrap: wrap;
    }

    .stat-card-stat {
      display: flex;
      align-items: center;
      gap: var(--stat-card-spacing-xs);
      font-size: var(--stat-card-font-sm);
      color: var(--stat-card-text-secondary);
    }

    .stat-card-stat-icon {
      width: 16px;
      height: 16px;
      fill: currentColor;
    }

    .stat-card-stat-value {
      font-weight: 600;
      color: var(--stat-card-text-primary);
    }

    .stat-card-description {
      margin: 0 0 var(--stat-card-spacing-lg) 0;
      font-size: var(--stat-card-font-base);
      line-height: 1.5;
      color: var(--stat-card-text-secondary);
    }

    .stat-card-dates {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: var(--stat-card-spacing-md);
      font-size: var(--stat-card-font-sm);
      color: var(--stat-card-text-muted);
    }

    .stat-card-date {
      display: flex;
      flex-direction: column;
      gap: var(--stat-card-spacing-xs);
    }

    .stat-card-date-label {
      font-weight: 500;
      color: var(--stat-card-text-secondary);
    }

    .stat-card-languages-title {
      margin: 0 0 var(--stat-card-spacing-md) 0;
      font-size: var(--stat-card-font-base);
      font-weight: 600;
      color: var(--stat-card-text-primary);
      text-align: center;
    }

    /* Desktop Pie Chart */
    .stat-card-pie-chart {
      display: none;
      width: 200px;
      height: 200px;
      margin-bottom: var(--stat-card-spacing-md);
    }

    @media (min-width: 768px) {
      .stat-card-pie-chart {
        display: block;
      }
      .stat-card-linear-chart {
        display: none;
      }
    }

    .stat-card-pie-segment {
      transition: opacity 0.2s ease;
      cursor: pointer;
    }

    .stat-card-pie-segment:hover {
      opacity: 0.8;
    }

    /* Mobile Linear Chart */
    .stat-card-linear-chart {
      width: 100%;
      margin-bottom: var(--stat-card-spacing-md);
    }

    .stat-card-languages-bar {
      display: flex;
      height: 8px;
      border-radius: 4px;
      overflow: hidden;
      background: var(--stat-card-border);
    }

    .stat-card-language-segment {
      height: 100%;
      transition: opacity 0.2s ease;
    }

    .stat-card-language-segment:hover {
      opacity: 0.8;
    }

    .stat-card-languages-list {
      display: flex;
      flex-wrap: wrap;
      gap: var(--stat-card-spacing-md);
      list-style: none;
      margin: 0;
      padding: 0;
      justify-content: center;
    }

    @media (max-width: 767px) {
      .stat-card-languages-list {
        justify-content: flex-start;
      }
    }

    .stat-card-language-item {
      display: flex;
      align-items: center;
      gap: var(--stat-card-spacing-xs);
      font-size: var(--stat-card-font-sm);
      color: var(--stat-card-text-secondary);
    }

    .stat-card-language-dot {
      width: 12px;
      height: 12px;
      border-radius: 50%;
      flex-shrink: 0;
    }

    .stat-card-language-percentage {
      font-weight: 500;
      color: var(--stat-card-text-primary);
    }

    /* Screen reader only text */
    .stat-card-sr-only {
      position: absolute;
      width: 1px;
      height: 1px;
      padding: 0;
      margin: -1px;
      overflow: hidden;
      clip: rect(0, 0, 0, 0);
      white-space: nowrap;
      border: 0;
    }

    /* Mobile specific adjustments */
    @media (max-width: 480px) {
      .stat-card {
        padding: var(--stat-card-spacing-md);
      }
      
      .stat-card-stats {
        gap: var(--stat-card-spacing-md);
      }
      
      .stat-card-dates {
        grid-template-columns: 1fr;
        gap: var(--stat-card-spacing-sm);
      }
      
      .stat-card-languages-list {
        gap: var(--stat-card-spacing-sm);
      }
    }

    /* Dark theme support */
    @media (prefers-color-scheme: dark) {
      :root {
        --stat-card-surface: #0d1117;
        --stat-card-border: #30363d;
        --stat-card-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
        --stat-card-text-primary: #f0f6fc;
        --stat-card-text-secondary: #8b949e;
        --stat-card-text-muted: #6e7681;
        --stat-card-accent: #58a6ff;
        --stat-card-accent-hover: #79c0ff;
      }
    }
  `

  // Append to head
  document.head.appendChild(styleElement)
}