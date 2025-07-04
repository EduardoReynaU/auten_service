const { gql } = require('apollo-server');

module.exports = gql`
  type User {
    id: ID
    names: String
    lastName: String
    username: String
    email: String
    provider: String
    providerId: String
    avatarUrl: String
    topLanguages: [String]
  }

  input UserInput {
    names: String
    lastName: String
    username: String
    email: String
    password: String
    provider: String
    providerId: String
    avatarUrl: String
    topLanguages: [String]
  }

  type Query {
    _: String
  }

  type Mutation {
    registerUserWithGithub(code: String): User
    createTestUser(input: UserInput!): User
  }

  type Query {
    getUserById(id: ID!): User
  }

  type Query {
    getUserById(id: ID!): User
    getAllUsers: [User]
  }
 
  type Mutation {
    registerUserWithGithub(code: String!): User
    createTestUser(input: UserInput!): User
    updateUserById(id: ID!, input: UserInput!): User
  }

  type Query {
    getUserById(id: ID!): User
    getUserByEmail(email: String!): User
    getAllUsers: [User]
  }


`;
