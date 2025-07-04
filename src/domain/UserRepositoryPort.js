class UserRepositoryPort {
  async save(user) {
    throw new Error("Not implemented");
  }

  async findByEmail(email) {
    throw new Error("Not implemented");
  }
}

module.exports = UserRepositoryPort;
