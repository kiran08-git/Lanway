export default function Input({ label, icon: Icon, className = '', id, ...props }) {
  return (
    <div className={className}>
      {label && (
        <label htmlFor={id} className="block text-sm font-medium text-brand-ink-700 mb-1.5">
          {label}
        </label>
      )}
      <div className="relative">
        {Icon && (
          <Icon size={17} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-brand-ink-400" />
        )}
        <input id={id} className={`input-field ${Icon ? 'pl-10' : ''}`} {...props} />
      </div>
    </div>
  );
}
