const User = require('../../../../domain/models/User');

module.exports = (container) => ({
  Query: {
    getUserById: async (_, { id }) => {
      const userRepository = container.resolve('userRepository');
      return await userRepository.findById(id);
    },
    getAllUsers: async () => {
      const userRepository = container.resolve('userRepository');
      return await userRepository.findAll();
    },
    getUserByEmail: async (_, { email }) => {
      const userRepository = container.resolve('userRepository');
      return await userRepository.findByEmail(email);
    }
  
  },
  Mutation: {
    registerUserWithGithub: async (_, { code }) => {
      return await container.resolve('registerUser')({ code });
    },

    createTestUser: async (_, { input }) => {
      const userRepository = container.resolve('userRepository');
      const user = new User({ ...input });
      return await userRepository.save(user);
    },

    updateUserById: async (_, { id, input }) => {
      const userRepository = container.resolve('userRepository');
      return await userRepository.updateById(id, input);
    }

  }
});
