const TMDB_KEY = "c29fbb833564782ada44d069d01f6411";
let base_url = "";
let poster_sizes = [];

const getConfig = async () => {
  const res = await fetch(
    `https://api.themoviedb.org/3/configuration?api_key=${TMDB_KEY}`
  );
  const resData = await res.json();
  console.log(resData);
  return resData;
};

const setupConfig = async () => {
  config = await getConfig();
  base_url = config.images.base_url;
  poster_sizes = config.images.poster_sizes;
  console.log(base_url);
  console.log(poster_sizes);
};

const getData = async () => {
  const res = await fetch(
    `https://api.themoviedb.org/3/movie/popular?api_key=${TMDB_KEY}&language=en-US&page=1`
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
  let movieTextNode = document.createTextNode(movie.overview);

  movieCard.classList.add("movie-card");
  movieOverlay.classList.add("movie-card-overlay");

  movieImage.src = base_url + poster_sizes[0] + movie.poster_path;

  movieOverlayText.appendChild(movieTextNode);
  movieOverlay.appendChild(movieOverlayText);
  movieCard.appendChild(movieImage);
  movieCard.appendChild(movieOverlay);

  return movieCard;
};

const loadMovies = async () => {
  const popularMovieContainer = document.getElementById(
    "popular-movie-container"
  );
  let data = await getData();

  data.results.forEach((movie) => {
    let movieCard = generateMovieCard(movie);
    popularMovieContainer.appendChild(movieCard);
  });
};

setupConfig();
loadMovies();
