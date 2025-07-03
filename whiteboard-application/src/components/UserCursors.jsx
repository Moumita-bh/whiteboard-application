export default function UserCursors({ cursors }) {
  return (
    <>
      {Object.entries(cursors).map(([id, cur]) => (
        <div
          key={id}
          className="absolute w-2 h-2 bg-blue-500 rounded-full pointer-events-none"
          style={{ left: cur.x, top: cur.y }}
        />
      ))}
    </>
  );
}
