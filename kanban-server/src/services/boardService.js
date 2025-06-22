const Board = require('../models/Board');
const User = require('../models/User');

/**
 * Adds a user to a board's member list.
 * @param {string} boardId - The ID of the board.
 * @param {string} userIdToAdd - The ID of the user to add.
 * @param {string} currentUserId - The ID of the user performing the action.
 * @returns {object} - { success: boolean, message: string, data: object | null }
 */
exports.addMemberToBoard = async (boardId, userIdToAdd, currentUserId) => {
    try {
        const board = await Board.findById(boardId);
        if (!board) {
            return { success: false, message: 'Board not found.' };
        }

        if (!board.owner.equals(currentUserId)) {
            return { success: false, message: 'Only the board owner can add members.' };
        }

        const userToAdd = await User.findById(userIdToAdd);
        if (!userToAdd) {
            return { success: false, message: 'User to add not found.' };
        }

        if (board.members.some(m => m.equals(userIdToAdd))) {
            return { success: false, message: 'User is already a member of this board.' };
        }

        board.members.push(userIdToAdd);
        const updatedBoard = await board.save();
        await updatedBoard.populate('members', 'name email'); // optional

        return { success: true, message: 'Member added successfully.', data: updatedBoard };
    } catch (error) {
        return { success: false, message: error.message };
    }
};

// You can add more complex board-related logic here,
// like handling board invitations, activity logs, etc.