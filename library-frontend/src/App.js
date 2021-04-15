
import React, { useEffect, useState } from 'react'
import Authors from './components/Authors'
import Books from './components/Books'
import NewBook from './components/NewBook'
import Login from './components/Login'
import Recommended from './components/Recommended'

import { useQuery, useApolloClient , useSubscription} from '@apollo/client'
import { ALL_BOOKS, ALL_QUERY, BOOK_ADDED } from './queries'

const App = () => {
  const [page, setPage] = useState('authors')
  const [token, setToken] = useState(null)
	const result = useQuery(ALL_QUERY)
  const client = useApolloClient()

  useEffect(() => {
    const savedToken = localStorage.getItem('user-token')
    if (savedToken) {
      setToken(savedToken)
    }
  }, [])

  useSubscription(BOOK_ADDED, {
    onSubscriptionData: ({ subscriptionData }) => {
      const addedBook = subscriptionData.data.bookAdded

      window.alert(`${addedBook.title} added`)
      const dataInStore = client.readQuery({ query: ALL_QUERY })
      console.log(dataInStore)
      client.writeQuery({
        query: ALL_QUERY,
        data: { 
          ...dataInStore,
          allBooks: dataInStore.allBooks.concat(addedBook)
         }
      })
    }
  })

	if(result.loading) {
		return <div>loading...</div>
	}

  const logout = () => {
    setToken(null)
    localStorage.clear()
    client.resetStore()

  }
  
	
  return (
    <div>
      <div>
        <button onClick={() => setPage('authors')}>authors</button>
        <button onClick={() => setPage('books')}>books</button>
        {token && <button onClick={() => setPage('add')}>add book</button>}
        {token && <button onClick={() => setPage('recommended')}>recommended</button>}
        {!token ? <button onClick={() => setPage('login')}>login</button> : <button onClick={logout}>logout</button>} 
      </div>

      <Authors
        show={page === 'authors'}
				authors={result.data.allAuthors}
        token={token}
      />

      <Books
        show={page === 'books'}
				books={result.data.allBooks}
      />

      <NewBook
        show={page === 'add'}
      />
      <Login
        show={page === 'login'}
        setToken={setToken}
        setPage={setPage}
      />
      {token &&
      <Recommended
        show={page === 'recommended'}
        books={result.data.allBooks}
      />
      }

    </div>
  )
}

export default App