export default function ProgressBar({ value = 0, color = 'blue', className = '', height = 'h-2' }) {
  const gradient =
    color === 'purple'
      ? 'from-brand-purple-500 to-brand-purple-600'
      : color === 'mixed'
      ? 'from-brand-blue-600 to-brand-purple-600'
      : 'from-brand-blue-500 to-brand-blue-600';

  return (
    <div className={`w-full ${height} rounded-full bg-brand-ink-100 overflow-hidden ${className}`}>
      <div
        className={`h-full rounded-full bg-gradient-to-r ${gradient} transition-all duration-700 ease-out`}
        style={{ width: `${Math.min(100, Math.max(0, value))}%` }}
      />
    </div>
  );
}
