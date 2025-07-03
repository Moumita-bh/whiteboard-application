const express = require('express');
const router = express.Router();
const Room = require('../models/Room');
const { nanoid } = require('nanoid');

router.post('/join', async (req, res) => {
  let { roomId } = req.body;
  if (!roomId) roomId = nanoid(6);

  let room = await Room.findOne({ roomId });
  if (!room) {
    room = new Room({ roomId });
    await room.save();
  }

  res.json({ roomId });
});

router.get('/:roomId', async (req, res) => {
  const room = await Room.findOne({ roomId: req.params.roomId });
  if (!room) return res.status(404).json({ message: 'Room not found' });
  res.json(room);
});

module.exports = router;
