const TMDB_KEY = "c29fbb833564782ada44d069d01f6411";
const FALLBACK_IMAGE_URL = "./fallback-image.png";
const FALLBACK_TEXT_OVERVIEW = "No Overview of this movie was provided by TMDB";
let base_url = "";
let searching = false;
let poster_sizes = [];
let currentlyFoundMoviesText = "";

const getConfig = async () => {
  const res = await fetch(
    `https://api.themoviedb.org/3/configuration?api_key=${TMDB_KEY}`
  );
  const resData = await res.json();
  return resData;
};

const setupConfig = async () => {
  config = await getConfig();
  base_url = config.images.base_url;
  poster_sizes = config.images.poster_sizes;
};

const getMoviesData = async (type) => {
  const res = await fetch(
    `https://api.themoviedb.org/3/movie/${type}?api_key=${TMDB_KEY}&language=en-US&page=1`
  );
  const resData = await res.json();
  return resData;
};

const generateMovieCard = (movie, typeOfCard) => {
  // create elements
  let movieCard = document.createElement("div");
  let movieImage = document.createElement("img");
  let movieOverlay = document.createElement("div");
  let movieOverlayText = document.createElement("p");
  let ratingOverlay = document.createElement("div");
  let ratingOverlayText = document.createElement("p");
  let ratingTextNode = document.createTextNode(movie.vote_average);
  let movieTextNode;

  // check if there is an overview
  if (movie.overview == "") {
    movieTextNode = document.createTextNode(FALLBACK_TEXT_OVERVIEW);
  } else {
    movieTextNode = document.createTextNode(movie.overview);
  }

  // add classes to elements
  movieCard.classList.add(`${typeOfCard}`);
  movieOverlay.classList.add(`${typeOfCard}-overlay`);
  ratingOverlay.classList.add(`${typeOfCard}-rating-overlay`);

  // check if movie has an image
  let imageSize = poster_sizes[1];
  if (typeOfCard == "screen-card") {
    imageSize = poster_sizes[4];
  }
  if (movie.poster_path != null) {
    movieImage.src = base_url + imageSize + movie.poster_path;
  } else {
    movieImage.src = FALLBACK_IMAGE_URL;
  }

  movieOverlayText.appendChild(movieTextNode);
  movieOverlay.appendChild(movieOverlayText);

  ratingOverlayText.appendChild(ratingTextNode);
  ratingOverlay.appendChild(ratingOverlayText);

  movieCard.appendChild(movieImage);
  movieCard.appendChild(movieOverlay);
  movieCard.appendChild(ratingOverlay);

  return movieCard;
};
const createMovieCards = async (movies) => {
  const movieContainer = document.getElementById("movie-container");

  movies.results.forEach((movie) => {
    if (movies.dates != null) {
      if (new Date(movies.dates.minimum) < new Date(movie.release_date)) {
        let movieCard = generateMovieCard(movie, "movie-card");
        // add button to movie card to create screen overlay
        movieCard.onclick = () => {
          displayOverlay(movie.id);
        };
        movieContainer.appendChild(movieCard);
      }
    } else {
      let movieCard = generateMovieCard(movie, "movie-card");
      // add button to movie card to create screen overlay
      movieCard.onclick = () => {
        displayOverlay(movie.id);
      };
      movieContainer.appendChild(movieCard);
    }
  });
};

const displayMovies = (movies) => {
  const movieContainer = document.getElementById(`movie-container`);
  movieContainer.textContent = "";
  createMovieCards(movies);
};
const setHeader = (title) => {
  const movieTitleElement = document.getElementById("movie-title");
  movieTitleElement.textContent = title;
};
const loadMovies = async (type) => {
  const getTitle = (title) => {
    switch (title) {
      case "popular":
        return "Popular Movies";
      case "now_playing":
        return "In Theatres Now";
      case "top_rated":
        return "Top Rated";
      case "upcoming":
        return "Upcoming";
    }
  };
  let movies = await getMoviesData(type);
  setHeader(getTitle(type));
  displayMovies(movies);
};

const getSearchedMovies = async (movieName) => {
  const res = await fetch(
    `https://api.themoviedb.org/3/search/movie?api_key=${TMDB_KEY}&language=en-US&query=${movieName}&page=1&include_adult=false`
  );
  const resData = await res.json();
  return resData;
};

const submitSearch = (e) => {
  e.preventDefault();
  searchMovie();
};
const searchMovie = async () => {
  const searchBarInput = document.getElementById("searchBarTextInput").value;
  if (!searching && searchBarInput != currentlyFoundMoviesText) {
    searching = true;
    const movies = await getSearchedMovies(searchBarInput);
    setHeader("Searched: " + searchBarInput);
    displayMovies(movies);
    currentlyFoundMoviesText = searchBarInput;
    searching = false;
  }
};

const handleMenu = () => {
  const menu = document.getElementById("menu");
  if (menu.classList.contains("menu-open")) {
    menu.classList.remove("menu-open");
  } else {
    menu.classList.add("menu-open");
  }
};

const getMovieData = async (movieId) => {
  const res = await fetch(
    `https://api.themoviedb.org/3/movie/${movieId}?api_key=${TMDB_KEY}&language=en-US`
  );
  const resData = await res.json();
  return resData;
};

const createOverlay = (movieData) => {
  // create elements
  const card = generateMovieCard(movieData, "screen-card");
  console.log(card);
  console.log(poster_sizes);
  return card;
};

const removeOverlay = () => {
  const screenOverlay = document.getElementById("screen-overlay");
  screenOverlay.textContent = "";
  screenOverlay.classList.remove("overlay-active");
};

const displayOverlay = async (movieId) => {
  console.log(movieId);
  const screenOverlay = document.getElementById("screen-overlay");
  if (screenOverlay.classList.contains("overlay-active")) {
    removeOverlay();
  } else {
    screenOverlay.classList.add("overlay-active");
    const movieData = await getMovieData(movieId);
    console.log(movieData);
    const overlayCard = await createOverlay(movieData);
    screenOverlay.appendChild(overlayCard);
  }
};

const start = async () => {
  await setupConfig();
  loadMovies("popular");
};

start();
