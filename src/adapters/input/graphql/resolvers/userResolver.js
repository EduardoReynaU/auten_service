const User = require('../../../../domain/models/User');

module.exports = (container) => ({
  Query: {
    getUserById: async (_, { id }, context) => {
      const userRepository = container.resolve('userRepository');
      return await userRepository.findById(id);
    },

    getAllUsers: async (_, __, context) => {
      const userRepository = container.resolve('userRepository');
      return await userRepository.findAll();
    },

    getUserByEmail: async (_, { email }, context) => {
      const userRepository = container.resolve('userRepository');
      return await userRepository.findByEmail(email);
    }
  },

  Mutation: {
    registerUserWithGithub: async (_, { code }) => {
      const { user, token } = await container.resolve('registerUser')({ code });
      return {
        ...user,
        token
      };
    },

    createTestUser: async (_, { input }, context) => {
      const userRepository = container.resolve('userRepository');
      const user = new User({ ...input });
      return await userRepository.save(user);
    },

    updateUserById: async (_, { id, input }, context) => {
      const userRepository = container.resolve('userRepository');
      return await userRepository.updateById(id, input);
    }
  },

  // 🧩 Resolver para federación
  User: {
    __resolveReference: async ({ id }, _, { user }) => {
      const userRepository = container.resolve('userRepository');
      return await userRepository.findById(id);
    }
  }
});
