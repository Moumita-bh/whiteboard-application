const Room = require('../models/Room');

module.exports = function setupSocket(io) {
  const userMap = {};

  io.on('connection', socket => {
    let currentRoomId = null;

    socket.on('join-room', async ({ roomId }) => {
      currentRoomId = roomId;
      socket.join(roomId);
      userMap[socket.id] = roomId;

      const room = await Room.findOne({ roomId });
      if (room) {
        io.to(socket.id).emit('init-canvas', room.drawingData || []);
      }

      updateUserCount(roomId);
    });

    socket.on('draw-start', async (data) => {
      await saveCommand(currentRoomId, { type: 'draw-start', data, timestamp: Date.now() });
      socket.to(currentRoomId).emit('draw-start', data);
    });

    socket.on('draw-move', async (data) => {
      await saveCommand(currentRoomId, { type: 'draw-move', data, timestamp: Date.now() });
      socket.to(currentRoomId).emit('draw-move', data);
    });

    socket.on('draw-end', async (data) => {
      await saveCommand(currentRoomId, { type: 'draw-end', data, timestamp: Date.now() });
      socket.to(currentRoomId).emit('draw-end', data);
    });

    socket.on('clear-canvas', async () => {
      await Room.updateOne({ roomId: currentRoomId }, { $set: { drawingData: [] } });
      io.to(currentRoomId).emit('clear-canvas');
    });

    socket.on('cursor-move', (data) => {
      socket.to(currentRoomId).emit('cursor-move', { ...data, id: socket.id });
    });

    socket.on('disconnect', () => {
      const roomId = userMap[socket.id];
      delete userMap[socket.id];
      updateUserCount(roomId);
    });

    async function saveCommand(roomId, command) {
      await Room.updateOne(
        { roomId },
        { $push: { drawingData: command }, $set: { lastActivity: new Date() } }
      );
    }

    function updateUserCount(roomId) {
      const count = Object.values(userMap).filter(r => r === roomId).length;
      io.to(roomId).emit('user-count', count);
    }
  });
};
