const TMDB_KEY = "c29fbb833564782ada44d069d01f6411";

const getData = async () => {
  const res = await fetch(
    `https://api.themoviedb.org/3/movie/popular?api_key=${TMDB_KEY}&language=en-US&page=1`
  );
  const resData = await res.json();
  console.log(res);
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

  movieImage.src = movie.poster_path;

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

loadMovies();
