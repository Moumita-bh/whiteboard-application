import { useEffect, useRef, useState } from 'react';
import io from 'socket.io-client';
import DrawingCanvas from './DrawingCanvas';
import Toolbar from './Toolbar';
import UserCursors from './UserCursors';

export default function Whiteboard({ roomId }) {
  const socketRef = useRef();
  const [cursors, setCursors] = useState({});
  const [userCount, setUserCount] = useState(1);
  const [commands, setCommands] = useState([]);
  const [tool, setTool] = useState({ color: '#000000', width: 2 });

  useEffect(() => {
    const socket = io();
    socketRef.current = socket;

    socket.emit('join-room', { roomId });

    socket.on('init-canvas', cmds => setCommands(cmds));
    socket.on('draw-start', cmd => setCommands(c => [...c, cmd]));
    socket.on('draw-move', cmd => setCommands(c => [...c, cmd]));
    socket.on('draw-end', cmd => setCommands(c => [...c, cmd]));
    socket.on('clear-canvas', () => setCommands([]));

    socket.on('cursor-move', data => setCursors(c => ({ ...c, [data.id]: data })));
    socket.on('user-count', n => setUserCount(n));

    return () => socket.disconnect();
  }, [roomId]);

  const emit = (event, payload) => socketRef.current.emit(event, payload);

  return (
    <div className="relative h-screen w-full bg-white overflow-hidden">
      <Toolbar tool={tool} setTool={setTool} onClear={() => emit('clear-canvas')} />
      <DrawingCanvas commands={commands} emit={emit} tool={tool} />
      <UserCursors cursors={cursors} />
      <div className="absolute top-2 right-2 text-sm bg-black text-white px-2 py-1 rounded">
        Users: {userCount}
      </div>
    </div>
  );
}
