const User = require('../domain/models/User');
const { generateToken } = require('../shared/jwtUtils');

async function registerUser({ code, gitHubOAuthAdapter, userRepository }) {
  const accessToken = await gitHubOAuthAdapter.getAccessToken(code);
  const userInfo = await gitHubOAuthAdapter.getUserInfo(accessToken);
  const topLanguages = await gitHubOAuthAdapter.getTopLanguages(accessToken);

  let user = await userRepository.findByEmail(userInfo.email);

  if (!user) {
    user = new User({
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

    user = await userRepository.save(user);
  }

  const token = generateToken(user);

  return { user, token };
}

module.exports = registerUser;
