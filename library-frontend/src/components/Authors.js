  
import React, { useState } from 'react'
import { useMutation } from '@apollo/client'
import { EDIT_BIRTHYEAR } from '../queries'

const Authors = (props) => {
	const [name, setName] = useState(props.authors[0].name)
	const [birth, setBirth] = useState('')
	const [changeBirth] = useMutation(EDIT_BIRTHYEAR)

	const handleEdit = (e) => {
		e.preventDefault()

		changeBirth({ variables: { name, setBornTo: parseInt(birth, 10) } })
		
		setBirth('')
	}

  if (!props.show) {
    return null
  }
  const authors = props.authors

  return (
    <div>
      <h2>authors</h2>
      <table>
        <tbody>
          <tr>
            <th></th>
            <th>
              born
            </th>
            <th>
              books
            </th>
          </tr>
          {authors.map(a =>
            <tr key={a.name}>
              <td>{a.name}</td>
              <td>{a.born}</td>
              <td>{a.bookCount}</td>
            </tr>
          )}
        </tbody>
      </table>
			{props.token && 
      <div>
        <h2>set birthyear</h2>
			  <form onSubmit={handleEdit}>
				  <label>
					  pick author to edit
					  <select onChange={({ target }) => setName(target.value)}>
						  {authors.map(a => <option key={a.name} value={a.name}>{a.name}</option>)}
					  </select>
				  </label>
				
				  <div>
					  born
					  <input value={birth} onChange={({ target }) => setBirth(target.value)} type="number" />
				  </div>
				  <button type="submit">update author</button>
			  </form>
      </div>
      }
    </div>
  )
}

export default Authors
