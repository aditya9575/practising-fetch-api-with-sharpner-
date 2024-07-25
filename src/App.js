import React, { useCallback, useEffect, useState } from "react";

import MoviesList from "./components/MoviesList";
import "./App.css";
import AddMovie from "./components/AddMovie";

function App() {
  const [movies, setMovies] = useState([]);
  const [loading, setIsLoading] = useState(false);
  const [error , setError] = useState(false);

 
  const dummyMovies = useCallback( async () => {
    try {
      setIsLoading(true);
      const response = await fetch("https://sharpner-practice-project-default-rtdb.firebaseio.com/movies.json");
      const data = await response.json();

      const loadedMovies = [];

      for (const key in data){
        loadedMovies.push({
          id:key,
          title:data[key].title,
          openingText:data[key].openingText,
          releaseDate:data[key].releaseDate,

        })
      }

// further destructuring the response from the api 
// const movieDetails = data.map((movieData)=>{
//   return{
//     id:movieData.episode_id,
//     title:movieData.title,
//     openingText:movieData.opening_crawl,
//     releaseDate:movieData.release_date,
//   }
// });

      // setMovies(data.results); 
      // setMovies(movieDetails);
      setMovies(loadedMovies)
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching movies:", error);
      setError(true);
      
    }
  } , [] );

  // Fetch movies when the component mounts or loads
  useEffect(() => {
    dummyMovies();
  }, [dummyMovies]);

  async function addMovieHandler(movie){
    // fetch can be used to send/post data as well 
  const response = await fetch("https://sharpner-practice-project-default-rtdb.firebaseio.com/movies.json" , {
      method:"POST",
      // body wants json data not a js object so we use json.stringify on movies 
      body: JSON.stringify(movie),
      headers:{
       "Content-Type" : "application/json"
      }
    });
    const data = await response.json();
    console.log(data); 
  }

  

  return (
    <React.Fragment>
    <section>
      <AddMovie onAddMovie={addMovieHandler}/>
    </section>
      <section>
        <button onClick={dummyMovies}>Fetch Movies</button>
      </section>
      <section>
        {loading && !error && <h2>Loading Movies...</h2>}
        {error && <h2>Error in fetching movies</h2>}
        {!loading && !error && movies.length === 0 && <h2>No Movies Found</h2>}
        {!loading && !error && movies.length > 0 && <MoviesList movies={movies} />}
      </section>
    </React.Fragment>
  );
}

export default App;
