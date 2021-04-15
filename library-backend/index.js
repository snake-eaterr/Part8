const { ApolloServer, gql, UserInputError, AuthenticationError, PubSub } = require('apollo-server')
const { v1: uuid } = require('uuid')
const mongoose = require('mongoose')
const Book = require('./models/Book')
const Author = require('./models/Author')
const User = require('./models/User')
const jwt = require('jsonwebtoken')

const jwt_secret = 'jsdkfjsdkfjsdkfjsdkfjskdlfjaksdfjouoiutiornsongvnjnv'

const MONGODB_URI = 'mongodb+srv://user1:G5TfAv2qe84rijn@cluster0.u3xie.mongodb.net/chat?retryWrites=true&w=majority'


console.log('connecting to', MONGODB_URI)
mongoose.connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true})
  .then(() => {
    console.log('connected to MongoDB')
  })
  .catch((error) => {
    console.log('error connecting to MongoDB:', error.message)
  })
  

  const pubsub = new PubSub()

const typeDefs = gql`

  type User {
    username: String!
    favoriteGenre: String!
    id: ID!
  }

  type Token {
    value: String!
  }
	type Author {
		name: String!
		born: Int
		bookCount: Int!
		id: ID!
	}

	type Book {
		title: String!
		published: Int!
		author: Author!
		id: ID!
		genres: [String!]!
	}

  type Query {
		bookCount: Int!
		authorCount: Int!
		allBooks(author: String, genre: String): [Book!]!
		allAuthors: [Author!]!
    me: User
  }

	type Mutation {
		addBook(
			title: String!
			author: String!
			published: Int!
			genres: [String!]!
		): Book

		editAuthor(
			name: String!
			setBornTo: Int!
		): Author

    createUser(
      username: String!
      favoriteGenre: String!
    ): User

    login(
      username: String!
      password: String!
    ): Token
	}

  type Subscription {
    bookAdded: Book!
  }
`

const resolvers = {
  Query: {
		bookCount: () => Book.collection.countDocuments(),
		authorCount: () => Author.collection.countDocuments(),
		allBooks: (root, args) => {
		if (!args.author && !args.genre) {
				return Book.find({}).populate('author')
			}
			/*
			if (args.author && args.genre) {
				return books.filter(b => b.author === args.author && b.genres.includes(args.genre))
			}*/
/*
			if (args.author && !args.genre) {
				return books.filter(b => b.author === args.author)
			}*/

			if (!args.author && args.genre) {
				return Book.find({ genres: { $in: [args.genre] } }).populate('author')
			}
      
		},
		allAuthors: () => Author.find({}),
    me: (root, args, context) => context.currentUser

  },
  Subscription: {
    bookAdded: {
      subscribe: () => pubsub.asyncIterator(['BOOK_ADDED'])
    }
  },
	Mutation: {
		addBook: async (root, args, { currentUser }) => {
      if(!currentUser) {
        throw new AuthenticationError('not authenticated')
      }
      let author = await Author.findOne({ name: args.author })
      if (author) {
        author.bookCount = author.bookCount + 1
        await author.save()
      }
      if (!author) {
        author = new Author({ name: args.author, bookCount: 1 })
        try {
          await author.save()
        } catch (error) {
          throw new UserInputError(error.message, {
            invalidArgs: args
          })
        }
      }
      const book = new Book({ ...args, author})
      try {
        await book.save()
      } catch (error) {
        throw new UserInputError(error.message, {
          invalidArgs: args
        })
      }

      pubsub.publish('BOOK_ADDED', { bookAdded: book })
      return book
		},
		editAuthor: async (root, args, context) => {
      if(!context.currentUser) {
        throw new AuthenticationError('not authenticated')
      }
      const author = await Author.findOne({ name: args.name })
			if (!author) {
				return null
			}

      author.born = args.setBornTo
      try {
        return author.save()
      } catch (error) {
        throw new UserInputError(error.message, {
          invalidArgs: args
        })
      }

		},
    createUser: async (root, args) => {
      const user = new User({ ...args })
      try {
        return user.save()
      } catch (error) {
        throw new UserInputError(error.message, {
          invalidArgs: args
        })
      }
    },
    login: async (root, args) => {
      const user = await User.findOne({ username: args.username })

      if (!user || args.password !== 'secret') {
        throw new UserInputError('wrong credentials')
      }

      const tokenForUser = {
        username: user.username,
        id: user._id
      }

      return { value: jwt.sign(tokenForUser, jwt_secret) }
    }
	}
}

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: async ({ req }) => {
    const auth = req ? req.headers.authorization : null
    if(auth && auth.toLowerCase().startsWith('bearer ')) {
      let decodedToken
      try {
        decodedToken = jwt.verify(auth.substring(7), jwt_secret)
      } catch (error) {
        return null
      }
      const currentUser = await User.findById(decodedToken.id)
      return { currentUser }
    }
    
  }
})

server.listen().then(({ url }) => {
  console.log(`Server ready at ${url}`)
})