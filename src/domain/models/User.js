class User {
  constructor({ id, names, lastName, username, email, password, provider, providerId, avatarUrl, topLanguages }) {
    this.id = id;
    this.names = names;
    this.lastName = lastName;
    this.username = username;
    this.email = email;
    this.password = password;
    this.provider = provider;
    this.providerId = providerId;
    this.avatarUrl = avatarUrl;
    this.topLanguages = topLanguages || [];
  }
}

module.exports = User;
