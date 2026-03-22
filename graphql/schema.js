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
    title: String
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

  type Query {
    getUsers: [User]
    getUser(id: ID!): User

    book(id: ID!): Book
    books: [Book]
    searchBooks(title: String!): [Book]

    review(id: ID!): Review
    reviews(bookId: ID!): [Review]

    userBook(id: ID!): UserBook
    userBooks: [UserBook]

    comments(userBookId: ID!): [Comment]
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

    createBook(
      googleBooksId: String!
      title: String
      authors: [String]
      description: String
      thumbnail: String
      publishedDate: String
      publisher: String
      pageCount: Int
      categories: [String]
      language: String
    ): Book!

    updateBook(
      bookId: ID!
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
    ): Book!

    deleteBook(bookId: ID!): String!

    createReview(bookId: ID!, text: String, typename: String): Review!

    updateReview(reviewId: ID!, text: String, typename: String): Review!

    deleteReview(reviewId: ID!): String!

    createUserBook(bookId: ID!, typename: String, category: String): UserBook!

    updateUserBook(
      userBookId: ID!
      typename: String
      category: String
    ): UserBook!

    deleteUserBook(userBookId: ID!): String!

    createComment(
      text: String
      reviewId: ID
      userBookId: ID
      typename: String
    ): Comment!

    updateComment(commentId: ID!, text: String, typename: String): Comment!

    deleteComment(commentId: ID!): String!
  }
`;

export default typeDefs;
