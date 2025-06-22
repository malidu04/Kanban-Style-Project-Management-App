const User = require('../models/User');

// @desc    Search for users by name or email
// @route   GET /api/users/search
exports.searchUsers = async (req, res) => {
    const keyword = req.query.search
        ? {
              $or: [
                  { name: { $regex: req.query.search, $options: 'i' } },
                  { email: { $regex: req.query.search, $options: 'i' } },
              ],
          }
        : {};

    // Find users, excluding the current user and their password
    const users = await User.find(keyword)
        .find({ _id: { $ne: req.user._id } })
        .select('-password');
    res.send(users);
};