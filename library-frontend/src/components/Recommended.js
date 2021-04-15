import React, { useEffect, useState } from 'react'
import { ME, ALL_BOOKS } from '../queries'
import { useQuery, useLazyQuery } from '@apollo/client'

const Recommended = ({ books, show }) => {
	const result = useQuery(ME)
	const [getBooks, booksResult] = useLazyQuery(ALL_BOOKS, {
		fetchPolicy: 'network-only'
	})
	const [user, setUser] = useState(null)
	const [returnedBooks, setReturnedBooks] = useState([])
	
	useEffect(() => {
		if (result.data) {
			setUser(result.data.me)
			console.log('the me effect')
		}
	}, [result.data])

	useEffect(() => {
		if (user) {
			console.log('making the lazyQuery', user)
			getBooks({ variables: { genre: user.favoriteGenre } })
		}
	}, [user, getBooks, books])

	useEffect(() => {
		if (booksResult.data) {
			setReturnedBooks(booksResult.data.allBooks)
			console.log('returned result', booksResult.data.allBooks)
		}
	}, [booksResult.data])

	if (booksResult.loading) {
		return <div>loading...</div>
	}
	if (!show) {
		return null
	}

	return (
		<div>
			<h2>Recommendations</h2>
			<table>
        <tbody>
          <tr>
            <th></th>
            <th>
              author
            </th>
            <th>
              published
            </th>
          </tr>
          {returnedBooks.map(a =>
            <tr key={a.title}>
              <td>{a.title}</td>
              <td>{a.author.name}</td>
              <td>{a.published}</td>
            </tr>
          )}
        </tbody>
      </table>
		</div>
	)
}

export default Recommended