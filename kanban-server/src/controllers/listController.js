const List = require('../models/List');
const Board = require('../models/Board');
const { checkBoardMembership } = require('../services/permissionService');

exports.createList = async (req, res) => {
    const { name, boardId } = req.body;
    const userId = req.user._id;

    try {
        if(!(await checkBoardMembership(boardId, userId))) {
            return res.status(403).json({ message: 'You are not a member of this board'})
        }
        const board = await Board.findById(boardId);
        if(!board) {
            return res.status(404).json({ message: 'Board not found' });
        }

        const List = new List ({ name, board: boardId });
        const createList = await List.save();

        board.lists.push(createdList._id);
        await board.save();

        res.status(201).json(createList);

    } catch (error) {
        res.status.json({ message: error.message });
    }
};

exports.updateList = async (req, res) => {
    const { name } = req.body;
    const { id } = req.params;

    try {
        const list = await List.findById(id);
        if(!list) {
            return res.status(404).json({ message: 'List not found' });
        }

        if(!(await checkBoardMembership(list.board, req.user._id))) {
            return res.status(403).json({ message: 'You are not a member of this board' });
        }

        list.name = name || list.name;
        const updatedList = await list.save();
        res.json(updatedList);
    } catch (error) {
        res.status(500).json({message: error.message});
    }
}; 

exports.deleteList = async (req, res) => {
  const { id } = req.params;

  try {
    const list = await List.findById(id);
    if (!list) return res.status(404).json({ message: 'List not found' });

    if (!(await checkBoardMembership(list.board, req.user._id))) {
      return res.status(403).json({ message: 'Not authorized to delete this list' });
    }

    // Delete all cards under this list
    await Card.deleteMany({ list: id });

    // Remove list reference from the board
    await Board.findByIdAndUpdate(list.board, { $pull: { lists: id } });

    await list.deleteOne();

    res.json({ message: 'List and associated cards removed successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};