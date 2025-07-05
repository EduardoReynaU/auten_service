const { gql } = require('graphql-tag');


module.exports = gql`
  # Extensión para Federation
  directive @key(fields: String!) on OBJECT | INTERFACE

  type User @key(fields: "id") {
    id: ID
    names: String
    lastName: String
    username: String
    email: String
    provider: String
    providerId: String
    avatarUrl: String
    topLanguages: [String]
    token: String 
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
    getUserById(id: ID!): User
    getUserByEmail(email: String!): User
    getAllUsers: [User]
  }

  type Mutation {
    registerUserWithGithub(code: String!): User
    createTestUser(input: UserInput!): User
    updateUserById(id: ID!, input: UserInput!): User
  }
`;
