const mongoose = require("mongoose");
const Movie = mongoose.model("Movie");
const getAllMovies = async (type, year) => {
  let query = {};
  if (type) {
    query.movieTypes = {
      $in: [type]
    };
  }
  if (year) {
    query.year = year;
  }
  const movies = await Movie.find(query);
  return movies;
};

const getMovieDetail = async id => {
  const movie = await Movie.findOne({
    _id: id
  });
  return movie;
};
/**
 *
 * @param {获取其他有关电影信息} movie
 */
const getRelativeMovies = async movie => {
  const movies = await Movie.find({
    movieTypes: {
      $in: movie.movieTypes
    }
  });
  return movies;
};

module.exports = {
  getRelativeMovies,
  getAllMovies,
  getMovieDetail
};
