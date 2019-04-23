import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

function useDataApi(initialUrl, initialData) {
  const [ data, setData ] = useState(initialData)
  const [ url, setUrl ] = useState(initialUrl)
  const [ isLoading, setIsLoading ] = useState(false)
  const [ isError, setIsError ] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      setIsError(false)
      setIsLoading(true)
  
      try {
        const result = await axios(url)
    
        setData(result.data)
      } catch(error) {
        setIsError(true)
      }
      setIsLoading(false)
    }
  
    fetchData()
  }, [url])

  const doFetch = url => {
    setUrl(url)
  }

  return {
    data,
    isLoading,
    isError,
    doFetch
  }
}

function App() {
  const URL = 'http://hn.algolia.com/api/v1/search';
  const [ query, setQuery ] = useState('')
  const {
    data,
    isLoading,
    isError,
    doFetch
  } = useDataApi(URL, { hits: [] });

  return (
    <div className="App">
      <form onSubmit={
        e => {
          e.preventDefault()
          doFetch(`${URL}?query=${query}`)
        }
      }>
        <input
          type="text"
          value={query}
          onChange={e => setQuery(e.target.value)}
        />
      </form>
      {isError && <p>Something went wrong</p>}
      {
        isLoading ?
        <p>Loading...</p> :
        <ul className="list">
          {data.hits.map(item => (
            <li key={item.objectID}>
              <a href={item.url}>{ item.title }</a>
            </li>
          ))}
        </ul>
      }
    </div>
  );
}

export default App;
