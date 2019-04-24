import React, { useState, useEffect, useReducer } from 'react';
import axios from 'axios';
import './App.css';

//Action types
const FETCH_INIT = 'FETCH_INIT';
const FETCH_SUCCESS = 'FETCH_SUCCESS';
const FETCH_ERROR = 'FETCH_ERROR';

// Reducer
const dataFetchReducer = (state, action) => {
  switch (action.type) {
    case FETCH_INIT:
      return {
        ...state,
        isLoading: true,
        isError: false
      }
    case FETCH_SUCCESS:
      return {
        ...state,
        isLoading: false,
        isError: false,
        data: action.payload
      }
    case FETCH_ERROR:
      return {
        ...state,
        isLoading: false,
        isError: true
      }
    default:
      return { ...state }
  }
}

function useDataApi(initialUrl, initialData) {
  const [ url, setUrl ] = useState(initialUrl)

  const [state, dispatch]  = useReducer(dataFetchReducer, {
    isLoading: false,
    isError: false,
    data: initialData
  })

  useEffect(() => {
    const fetchData = async () => {
      dispatch({
        type: FETCH_INIT
      })
  
      try {
        const result = await axios(url)
    
        dispatch({
          type: FETCH_SUCCESS,
          payload: result.data
        })
      } catch(error) {
        dispatch({
          type: FETCH_ERROR
        })
      }
    }
  
    fetchData()
  }, [url])

  const doFetch = url => {
    setUrl(url)
  }

  return {
    ...state,
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
