const TMDB_KEY = "c29fbb833564782ada44d069d01f6411";

const getData = async () => {
  const res = await fetch(
    `https://api.themoviedb.org/3/movie/popular?api_key=${TMDB_KEY}&language=en-US&page=1`
  );
  const resData = await res.json();
  console.log(res);
  console.log(resData);
};
