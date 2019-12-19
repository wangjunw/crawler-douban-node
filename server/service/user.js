const mongoose = require("mongoose");
const User = mongoose.model("User");
const checkPassword = async (email, password) => {
  let match = false;
  const user = await User.findOne({ email });
  if (user) {
    match = await User.comparePassword(password, user.password);
  }
  return {
    match,
    user
  };
};
module.exports = {
  checkPassword
};
