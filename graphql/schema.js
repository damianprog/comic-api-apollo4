import gql from "graphql-tag";

const typeDefs = gql`
  type User {
    id: ID!
    nickname: String!
    email: String!
    birthDate: String!
    createdAt: String!
    userDetails: UserDetails
    token: String
  }

  type UserDetails {
    id: ID!
    userId: ID!
    bio: String
    location: String
    favoriteGenres: [String]
    createdAt: String!
    user: User
  }

  type Book {
    id: ID!
    googleBooksId: String!
    title: String!
    authors: [String]
    description: String
    thumbnail: String
    publishedDate: String
    publisher: String
    pageCount: Int
    categories: [String]
    language: String
    createdAt: String!
  }

  type UserBook {
    id: ID!
    userId: ID!
    bookId: ID!
    typename: String
    category: String
    createdAt: String!
    user: User
    book: Book
    comments: [Comment]
  }

  type Review {
    id: ID!
    bookId: ID!
    userId: ID!
    text: String
    typename: String
    createdAt: String!
    book: Book
    user: User
    comments: [Comment]
  }

  type Comment {
    id: ID!
    text: String
    reviewId: ID
    userBookId: ID
    userId: ID!
    typename: String
    createdAt: String!
    review: Review
    userBook: UserBook
    user: User
  }

  union UserActivity = Review | UserBook | Comment

  type Query {
    getUsers: [User]
    getUser(id: ID!): User
    book(id: ID!): Book
    books: [Book]
    searchBooks(query: String!): [Book]
    review(id: ID!): Review
    reviews(bookId: ID!): [Review]
    userBook(id: ID!): UserBook
    userBooks(userId: ID, nickname: String, bookId: ID): [UserBook]
    userBooksCategories(userId: ID, nickname: String): [String]
    comment(id: ID!): Comment
    comments(userBookId: ID, reviewId: ID): [Comment]
    userActivities(
      userId: ID!
      quantity: Int
      lastActivityCreatedAt: String
    ): [UserActivity]
  }

  input NewBookInput {
    googleBooksId: String!
    title: String!
    authors: [String]
    description: String
    thumbnail: String
    publishedDate: String
    publisher: String
    pageCount: Int
    categories: [String]
    language: String
  }

  input UpdateBookInput {
    googleBooksId: String
    title: String
    authors: [String]
    description: String
    thumbnail: String
    publishedDate: String
    publisher: String
    pageCount: Int
    categories: [String]
    language: String
  }

  type Mutation {
    register(
      nickname: String!
      email: String!
      birthDate: String!
      password: String!
      confirmPassword: String!
    ): User!

    login(email: String!, password: String!): User!

    createBook(newBookInput: NewBookInput!): Book!

    updateBook(bookId: ID!, updateBookInput: UpdateBookInput!): Book!

    deleteBook(bookId: ID!): String!

    createReview(bookId: ID!, text: String): Review!
    updateReview(reviewId: ID!, text: String): Review!
    deleteReview(reviewId: ID!): String!

    createUserBook(newBookInput: NewBookInput!, category: String): UserBook!
    updateUserBook(userBookId: ID!, category: String): UserBook!
    deleteUserBook(userBookId: ID!): String!

    createComment(text: String, reviewId: ID, userBookId: ID): Comment!
    updateComment(commentId: ID!, text: String): Comment!
    deleteComment(commentId: ID!): String!
  }
`;

export default typeDefs;
