const TMDB_KEY = "c29fbb833564782ada44d069d01f6411";
const FALLBACK_IMAGE_URL = "./fallback-image.png";
const FALLBACK_TEXT_OVERVIEW = "No Overview of this movie was provided by TMDB";
let base_url = "";
let searching = false;
let poster_sizes = [];

const getConfig = async () => {
  const res = await fetch(
    `https://api.themoviedb.org/3/configuration?api_key=${TMDB_KEY}`
  );
  const resData = await res.json();
  // console.log(resData);
  return resData;
};

const setupConfig = async () => {
  config = await getConfig();
  base_url = config.images.base_url;
  poster_sizes = config.images.poster_sizes;
  // console.log(base_url);
  console.log(poster_sizes);
};

const getMovieData = async (type) => {
  const res = await fetch(
    `https://api.themoviedb.org/3/movie/${type}?api_key=${TMDB_KEY}&language=en-US&page=1`
  );
  const resData = await res.json();
  console.log(resData);
  return resData;
};

const generateMovieCard = (movie) => {
  let movieCard = document.createElement("div");
  let movieImage = document.createElement("img");
  let movieOverlay = document.createElement("div");
  let movieOverlayText = document.createElement("p");
  let movieTextNode;
  if (movie.overview == "") {
    movieTextNode = document.createTextNode(FALLBACK_TEXT_OVERVIEW);
  } else {
    movieTextNode = document.createTextNode(movie.overview);
  }

  movieCard.classList.add("movie-card");
  movieOverlay.classList.add("movie-card-overlay");

  if (movie.poster_path != null) {
    movieImage.src = base_url + poster_sizes[1] + movie.poster_path;
  } else {
    movieImage.src = FALLBACK_IMAGE_URL;
  }

  movieOverlayText.appendChild(movieTextNode);
  movieOverlay.appendChild(movieOverlayText);
  movieCard.appendChild(movieImage);
  movieCard.appendChild(movieOverlay);

  return movieCard;
};
const createMovieCards = async (movies) => {
  const movieContainer = document.getElementById("movie-container");

  movies.results.forEach((movie) => {
    if (movies.dates != null) {
      if (new Date(movies.dates.minimum) < new Date(movie.release_date)) {
        let movieCard = generateMovieCard(movie);
        movieContainer.appendChild(movieCard);
      }
    } else {
      let movieCard = generateMovieCard(movie);
      movieContainer.appendChild(movieCard);
    }
  });
};

const displayMovies = (movies) => {
  const movieContainer = document.getElementById(`movie-container`);
  movieContainer.textContent = "";
  createMovieCards(movies);
};

const loadMovies = async (type) => {
  let movies = await getMovieData(type);
  displayMovies(movies);
};

const getSearchedMovies = async (movieName) => {
  const res = await fetch(
    `https://api.themoviedb.org/3/search/movie?api_key=${TMDB_KEY}&language=en-US&query=${movieName}&page=1&include_adult=false`
  );
  const resData = await res.json();
  console.log(resData);
  return resData;
};
const searchMovie = async () => {
  if (!searching) {
    searching = true;
    const searchBarInput = document.getElementById("searchBarTextInput").value;
    console.log(searchBarInput);
    const movies = await getSearchedMovies(searchBarInput);
    displayMovies(movies);
    searching = false;
  }
};

setupConfig();
loadMovies("popular");
