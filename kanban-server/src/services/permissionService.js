const Board = require('../models/Board');

exports.checkBoardMembership = async (boardId, userId) => {
  if (!boardId || !userId) return false;
  
  try {
    const board = await Board.findById(boardId);
    if (!board) return false; // Board doesn't exist

    return board.members.some((memberId) => memberId.equals(userId));
  } catch (error) {
    console.error(
      `Error in permission check for boardId=${boardId}, userId=${userId}:`,
      error
    );
    return false;
  }
};
