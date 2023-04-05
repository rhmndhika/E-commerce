import React from 'react';
import useFetch from './useFetch';

function App() {

  const { data, loading, error, refetch } = useFetch("https://v2.jokeapi.dev/joke/Any");

  if (loading) return <h1>loading...</h1>

  if (error) console.log(error);

  return (
    <div className="App">
      <h1>{data?.setup} : {data?.delivery}</h1>
      <button onClick={refetch}>Refetch</button>
    </div>
  );
}

export default App;
