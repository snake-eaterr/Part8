import { gql } from '@apollo/client'
export const ALL_AUTHORS = gql`
query {
  allAuthors {
    name
    born
    bookCount
    id
  }
}
`

export const ALL_BOOKS = gql`
query getBooks($author: String, $genre: String) {
  allBooks(author: $author, genre: $genre) {
    title
    published
    author {
      name
      born
      bookCount
      id
    }
    genres
    id
  }
}
`
export const ALL_QUERY = gql`
query {
  allAuthors {
    name
    born
    bookCount
    id
  }
  allBooks {
    title
    published
    author {
      name
      born
      bookCount
      id
    }
    genres
    id
  }
}
`

export const ADD_BOOK = gql`
mutation createBook($title: String!, $author: String!, $published: Int!, $genres: [String!]!) {
  addBook(
    title: $title,
    author: $author,
    published: $published,
    genres: $genres
  ) {
    title
    published
    author {
      name
      id
    }
    genres
    id
  }
}
`

export const EDIT_BIRTHYEAR = gql`
mutation changeBirth($name: String!, $setBornTo: Int!) {
  editAuthor(name: $name, setBornTo: $setBornTo) {
    name
    born
    bookCount
    id
  }
}
`

export const LOGIN = gql`
mutation login($username: String!, $password: String!) {
  login(username: $username, password: $password) {
    value
  }
}
`

export const ME = gql`
query {
  me {
    favoriteGenre
  }
}
`
export const BOOK_ADDED = gql`
subscription {
  bookAdded {
    title
    published
    author {
      name
      born
      id
    }
    id
    genres
  }
}
`