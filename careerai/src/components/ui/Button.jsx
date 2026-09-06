import { Loader2 } from 'lucide-react';

const VARIANTS = {
  primary: 'btn-primary',
  secondary: 'btn-secondary',
  ghost: 'btn-ghost',
};

export default function Button({
  children,
  variant = 'primary',
  icon: Icon,
  iconPosition = 'left',
  loading = false,
  className = '',
  ...props
}) {
  return (
    <button className={`${VARIANTS[variant]} ${className}`} disabled={loading} {...props}>
      {loading && <Loader2 size={16} className="animate-spin" />}
      {!loading && Icon && iconPosition === 'left' && <Icon size={17} />}
      {children}
      {!loading && Icon && iconPosition === 'right' && <Icon size={17} />}
    </button>
  );
}
