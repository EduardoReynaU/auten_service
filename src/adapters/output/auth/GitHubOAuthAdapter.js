const axios = require('axios');

class GitHubOAuthAdapter {
  constructor({ clientId, clientSecret, redirectUri }) {
    this.clientId = clientId;
    this.clientSecret = clientSecret;
    this.redirectUri = redirectUri;
  }

  async getAccessToken(code) {
    const response = await axios.post('https://github.com/login/oauth/access_token', {
      client_id: this.clientId,
      client_secret: this.clientSecret,
      code,
      redirect_uri: this.redirectUri
    }, {
      headers: {
        Accept: 'application/json'
      }
    });

    if (response.data.error) {
      throw new Error(`GitHub token error: ${response.data.error_description}`);
    }

    return response.data.access_token;
  }

  async getUserInfo(accessToken) {
    const { data: user } = await axios.get('https://api.github.com/user', {
      headers: { Authorization: `Bearer ${accessToken}` }
    });

    const { data: emails } = await axios.get('https://api.github.com/user/emails', {
      headers: { Authorization: `Bearer ${accessToken}` }
    });

    const primaryEmail = emails.find(e => e.primary && e.verified)?.email;

    return {
      providerId: user.id?.toString(),
      username: user.login,
      avatarUrl: user.avatar_url,
      email: primaryEmail,
      names: user.name?.split(' ')[0] || '',
      lastName: user.name?.split(' ')[1] || ''
    };
  }

  async getTopLanguages(accessToken) {
    const { data: repos } = await axios.get('https://api.github.com/user/repos', {
      headers: { Authorization: `Bearer ${accessToken}` }
    });

    const languageCount = {};
    for (const repo of repos) {
      const lang = repo.language;
      if (lang) languageCount[lang] = (languageCount[lang] || 0) + 1;
    }

    return Object.entries(languageCount)
      .sort((a, b) => b[1] - a[1])
      .map(([lang]) => lang)
      .slice(0, 3);
  }
}

module.exports = GitHubOAuthAdapter;
