

interface LogEntry {
  timestamp: string;
  model: string;
  promptSnippet: string;
  responseSnippet: string;
}

interface Props {
  logs: LogEntry[];
}

export default function LogsPanel({ logs }: Props) {
  return (
    <div className="rounded-2xl shadow-sm border border-gray-200 p-4 bg-white">
      <h2 className="text-lg font-semibold mb-3">Log</h2>
      <ul className="space-y-3">
        {logs.length === 0 && <li className="text-sm text-gray-500">No logs yet.</li>}
        {logs.map((log, idx) => (
          <li key={idx} className="text-sm">
            <div className="flex items-center justify-between">
              <span className="font-medium">{log.timestamp}</span>
              <span className="text-gray-600">{log.model}</span>
            </div>
            <div className="text-gray-700 mt-1">
              <span className="italic">“{log.promptSnippet}”</span>
              <span className="mx-1">|</span>
              <span>“{log.responseSnippet}”</span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}