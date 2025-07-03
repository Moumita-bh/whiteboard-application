import { useRef, useEffect, useState } from 'react';

export default function DrawingCanvas({ commands, emit, tool }) {
  const canvasRef = useRef();
  const [drawing, setDrawing] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    commands.forEach(cmd => drawCommand(canvas, cmd));
  }, [commands]);

  const commit = (type, data) => {
    emit(type, { ...data, ...tool, timestamp: Date.now() });
  };

  const handleMouseDown = e => {
    const { offsetX, offsetY } = e.nativeEvent;
    setDrawing(true);
    commit('draw-start', { x: offsetX, y: offsetY });
  };

  const handleMouseMove = e => {
    const { offsetX, offsetY } = e.nativeEvent;
    if (drawing) {
      commit('draw-move', { x: offsetX, y: offsetY });
    }
    emit('cursor-move', { x: offsetX, y: offsetY });
  };

  const handleMouseUp = () => {
    if (drawing) {
      setDrawing(false);
      commit('draw-end', {});
    }
  };

  return (
    <canvas
      ref={canvasRef}
      width={window.innerWidth}
      height={window.innerHeight - 60}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      className="absolute top-12 left-0 z-0"
    />
  );
}

function drawCommand(canvas, cmd) {
  const ctx = canvas.getContext('2d');
  if (cmd.type === 'clear') {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  } else if (cmd.type.startsWith('draw')) {
    ctx.strokeStyle = cmd.color;
    ctx.lineWidth = cmd.width;
    ctx.lineTo(cmd.x, cmd.y);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(cmd.x, cmd.y);
  }
}
