module.exports = (io, socket) => {
  const joinBoard = (boardId, callback) => {
    try {
      if (!boardId) {
        return callback?.({ error: "Board ID is required" });
      }
      socket.join(boardId);
      console.log(`Socket ${socket.id} joined board ${boardId}`);
      callback?.({ success: true, boardId });
      socket.emit('board:joined', boardId); // optional client notification
    } catch (error) {
      console.error(`Error joining board ${boardId}:`, error);
      callback?.({ error: error.message });
    }
  };

  const leaveBoard = (boardId, callback) => {
    try {
      if (!boardId) {
        return callback?.({ error: "Board ID is required" });
      }
      socket.leave(boardId);
      console.log(`Socket ${socket.id} left board ${boardId}`);
      callback?.({ success: true, boardId });
    } catch (error) {
      console.error(`Error leaving board ${boardId}:`, error);
      callback?.({ error: error.message });
    }
  };

  const updateCardPosition = (data) => {
    try {
      const { boardId } = data;
      if (!boardId) {
        return;
      }
      console.log(`Card position updated on board ${boardId} by ${socket.id}`, data);
      // Broadcast to all except sender
      socket.to(boardId).emit('card:updated', data);
    } catch (error) {
      console.error('Error updating card position:', error);
    }
  };

  // Registering event listeners
  socket.on('board:join', joinBoard);
  socket.on('board:leave', leaveBoard);
  socket.on('card:move', updateCardPosition);

  // ✅ You can add more event handlers as your app grows:
  // socket.on('card:create', createCardHandler);
  // socket.on('list:update', updateListHandler);
};
