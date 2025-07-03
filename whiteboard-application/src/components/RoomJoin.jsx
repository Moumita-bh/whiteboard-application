import { useState } from "react";

export default function RoomJoin({onJoin}){
    const[code, setCode] = useState('');

    const joinRoom = async () => {
      const res = await fetch('/api/rooms/join', {
        method: 'POST',
        header: {'Content-Type': 'application/json'},
        body: JSON.stringify({roomID: code || null})
      });
      const data = await res.json();
      onJoin(data.roomID)
    };

    return(
       <div className="flex flex-col items-center justify-center h-screen gap-4 bg-gray-100">
       <h1 className="text-2xl font-bold">Join or Create Whiteboard Room</h1>
       <input
        type="text"
        value={code}
        onChange={e => setCode(e.target.value)}
        className="border p-2 rounded w-64"
        placeholder="Enter room code..."
      />
      <button onClick={joinRoom} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
        Join Room
      </button>
       </div> 
    );
}
