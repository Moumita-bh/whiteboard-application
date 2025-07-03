export default function Toolbar({ tool, setTool, onClear }) {
  return (
    <div className="flex items-center gap-4 p-2 bg-gray-200">
      <label className="flex items-center gap-1">
        Color:
        <select
          value={tool.color}
          onChange={e => setTool({ ...tool, color: e.target.value })}
          className="border p-1 rounded"
        >
          <option value="#000000">Black</option>
          <option value="#ff0000">Red</option>
          <option value="#0000ff">Blue</option>
          <option value="#008000">Green</option>
        </select>
      </label>
      <label className="flex items-center gap-1">
        Width:
        <input
          type="range"
          min="1"
          max="10"
          value={tool.width}
          onChange={e => setTool({ ...tool, width: Number(e.target.value) })}
        />
      </label>
      <button onClick={onClear} className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600">
        Clear
      </button>
    </div>
  );
}
