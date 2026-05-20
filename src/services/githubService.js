/**
 * GitHub API Service
 * Validates a GitHub Personal Access Token and returns the account profile.
 */

const GITHUB_API = 'https://api.github.com';

/**
 * Validate GitHub Personal Access Token
 * @param {string} token - GitHub PAT
 * @returns {Promise<{valid: boolean, user?: object, error?: string}>}
 */
export async function validateToken(token) {
  try {
    const response = await fetch(`${GITHUB_API}/user`, {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/vnd.github.v3+json'
      }
    });

    if (response.ok) {
      const user = await response.json();
      return {
        valid: true,
        user: {
          username: user.login,
          avatarUrl: user.avatar_url,
          name: user.name
        }
      };
    }

    return {
      valid: false,
      error: response.status === 401 ? 'Invalid token' : 'Failed to validate token'
    };
  } catch (error) {
    return {
      valid: false,
      error: error.message
    };
  }
}
