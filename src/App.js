
import { useEffect,useState } from 'react';
import axios from 'axios'
import YouTube from 'react-youtube';
import styles from "./App.css";

function App() {
  const API_URL = "https://api.themoviedb.org/3";
  const API_KEY = "002fadaaf15321dac9c6a6620e0ededd";
  const IMAGE_PATH = "https://image.tmdb.org/t/p/original";



  // variables de estado
  const [movies, setMovies] = useState([]);
  const [searchKey, setSearchKey] = useState("");
  
  const [trailer, setTrailer] = useState(null);
  const [movie, setMovie] = useState({ title: "Loading Movies" });
  const [playing, setPlaying] = useState(false);

  // funcion para realizar la peticion get a la api
  const fetchMovies = async (searchKey) => {
    const type = searchKey ? "search" : "discover";
    const {
      data: { results },
    } = await axios.get(`${API_URL}/${type}/movie`, {
      params: {
        api_key: API_KEY,
        query: searchKey,
        language:"es-ES",
      },
    });
    

    setMovies(results);
    setMovie(results[0]);

    if (results.length) {
      await fetchMovie(results[0].id);
    }
  };

  // funcion para la peticion de un solo objeto y mostrar en reproductor de videos
  const fetchMovie = async (id) => {
    const { data } = await axios.get(`${API_URL}/movie/${id}`, {
      params: {
        api_key: API_KEY,
        append_to_response: "videos",
        language:"es-ES",
      },
    });

    if (data.videos && data.videos.results) {
      const trailer = data.videos.results.find(
        (vid) => vid.name === "Official Trailer"
      );
      setTrailer(trailer ? trailer : data.videos.results[0]);
    }
    //return data
    setMovie(data);
  };

  const selectMovie = async (movie) => {
    
    fetchMovie(movie.id);

    setMovie(movie);
    window.scrollTo(0, 0);
  };

  // funcion para buscar peliculas
  const searchMovies = (e) => {
    e.preventDefault();
    fetchMovies(searchKey);
  };

  useEffect(() => {
    fetchMovies();
  }, []);

  return (
    <div>

      {/* el HEADER*/}


      <nav className="navbar navbar-expand-lg navbar-dark bg-dark fixed-top">
          <div className="container">
            <a className="navbar-brand" href="/ ">TruchoFlix</a>
            <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
              <span className="navbar-toggler-icon" />
            </button>
            <div className="collapse navbar-collapse" id="navbarSupportedContent">
              <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                <li className="nav-item">
                  <a className="nav-link" href="/">Home</a>
                </li>
              </ul>
              <form className="d-flex" onSubmit={searchMovies}  >
                <input className="form-control me-2" type="search" placeholder="Search" aria-label="Search" onChange={(e) => setSearchKey(e.target.value)}/>
                <button className="btn btn-outline-info" type="submit">Search</button>
              </form>
            </div>
          </div>
        </nav>

    
      {/* Fondo Grande con detalles para peliculas */}
      <div>
        <main>
          {movie ? (
            <div
              className="viewtrailer"
              style={{
                backgroundImage: `url("${IMAGE_PATH}${movie.backdrop_path}")`,
                backgroundSize:"cover",
                backgroundRepeat:"no-repeat",
                backgroundPosition: "center",
                height:"600px",
                

              }}
            >
              {playing ? (
                <> <div className='reproductor'>
                <button onClick={() => setPlaying(false)} className="btn btn-danger mt-5 ml-5">
                    close
                  </button>
                  <YouTube
                    videoId={trailer.key}
                    
                    containerClassName={"youtube-container amru"}
                    opts={{
                      width: "70%",
                      height: "400px",
                      paddingLeft:"0px 40px",
                      playerVars: {
                        autoplay: 1,
                        controls: 0,
                        cc_load_policy: 0,
                        fs: 0,
                        iv_load_policy: 0,
                        modestbranding: 0,
                        rel: 0,
                        showinfo: 0,
                      },
                    }}
                    style={{width: "100%",
                    height: "100%",
                    }
                      
                    }
                  />
                  </div>
                </>
                
              ) : (
                <div className="container mt-5">
                    <br></br>
                    <h1 className="text-white">{movie.title}</h1>
                    <h2 className="text-info">Sinopsis:</h2>
                    <p className="text-white">{movie.overview}</p>
                    <h2 className="text-info">Trailer</h2>
                    <div className="">
                    {trailer ? (
                      <button
                        className="btn btn-success m-2"
                        onClick={() => setPlaying(true)}
                        type="button"
                      >
                        Play Trailer
                      </button>
                      
                    ) : (
                      
                      <p className='text-white'>Perdon, El trailer aun no esta Disponible</p>
                    )}
                  </div>
                </div>
              )}
            </div>
          ) : null}
        </main>
      </div>




      {/* contenedor para mostrar los posters y las peliculas en la peticion a la api */}
      <div className="container mt-3 mb-5">
        <div className="row">
          {movies.map((movie) => (
            
            <div
              key={movie.id}
              className="col-12 col-sm-6 col-lg-3 my-2"
              onClick={() => selectMovie(movie) }
            >
              <div className="card h-100">
              <img
                src={`${IMAGE_PATH + movie.poster_path}`}
                alt=""
              />
              <h4 className="text-center">{movie.title}</h4>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;