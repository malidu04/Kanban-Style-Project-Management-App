const Board = require('../models/Board');

// Create a new board
const createBoard = async (req, res) => {
  const { name } = req.body;

  try {
    if (!name) {
      return res.status(400).json({ message: 'Board name is required' });
    }

    const board = new Board({
      name,
      owner: req.user._id,
      members: [req.user._id],
    });

    const createdBoard = await board.save();
    return res.status(201).json(createdBoard);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: error.message });
  }
};

// Get all boards for the logged-in user
const getUserBoards = async (req, res) => {
  try {
    const boards = await Board.find({ members: req.user._id });
    return res.status(200).json(boards); // ✅ send boards to client
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: error.message });
  }
};

// Get a specific board by ID
const getBoardById = async (req, res) => {
  try {
    const board = await Board.findById(req.params.id)
      .populate('lists')
      .populate('members', 'name email');

    if (!board) {
      return res.status(404).json({ message: 'Board not found' });
    }

    const isMember = board.members.some((member) => member._id.equals(req.user._id));
    if (!isMember) {
      return res.status(403).json({ message: 'Not authorized to access this board' }); // Forbidden
    }

    return res.status(200).json(board);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: error.message });
  }
};

module.exports = { createBoard, getUserBoards, getBoardById };
