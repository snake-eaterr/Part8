import React, { useEffect, useState } from 'react'

const Books = ({ books, show }) => {
  const [filter, setFilter] = useState(null)
  let genres = []
  books.forEach(b => b.genres.forEach(g => genres.push(g)))


  
  

  if (!show) {
    return null
  }

  

  const filteredBooks = filter && filter !== 'all' ? books.filter(b => b.genres.includes(filter)) : books


  return (
    <div>
      <h2>books</h2>

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
          {filteredBooks.map(a =>
            <tr key={a.title}>
              <td>{a.title}</td>
              <td>{a.author.name}</td>
              <td>{a.published}</td>
            </tr>
          )}
        </tbody>
      </table>
      <div>
        {genres.map(g => <button key={g} onClick={() => setFilter(g)}>{g}</button>)}
        <button onClick={() => setFilter('all')}>all genres</button>
      </div>
    </div>
  )
}

export default Books