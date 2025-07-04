const GitHubOAuthAdapter = require('../adapters/output/auth/GitHubOAuthAdapter');
const MongoUserRepository = require('../adapters/output/database/MongoUserRepository');
const UserModel = require('../infrastructure/models/UserModel');
const registerUser = require('../app/registerUser');

module.exports = {
  resolve: (key) => {
    const gitHubOAuthAdapter = new GitHubOAuthAdapter({
      clientId: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      redirectUri: process.env.GITHUB_REDIRECT_URI
    });

    const userRepository = new MongoUserRepository(UserModel);

    const dependencies = {
      registerUser: (params) =>
        registerUser({ ...params, gitHubOAuthAdapter, userRepository }),
      userRepository
    };

    return dependencies[key];
  }
};

