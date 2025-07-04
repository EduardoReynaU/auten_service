const User = require('../domain/models/User');

async function registerUser({ code, gitHubOAuthAdapter, userRepository }) {
  const accessToken = await gitHubOAuthAdapter.getAccessToken(code);
  const userInfo = await gitHubOAuthAdapter.getUserInfo(accessToken);
  const topLanguages = await gitHubOAuthAdapter.getTopLanguages(accessToken);

  const existingUser = await userRepository.findByEmail(userInfo.email);
  if (existingUser) return existingUser;

  const user = new User({
    names: userInfo.names,
    lastName: userInfo.lastName,
    username: userInfo.username,
    email: userInfo.email,
    password: null,
    provider: 'github',
    providerId: userInfo.providerId,
    avatarUrl: userInfo.avatarUrl,
    topLanguages
  });

  return await userRepository.save(user);
}

module.exports = registerUser;
