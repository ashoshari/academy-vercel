type SpinnerProps = {
  size?: number;        // px
  thickness?: number;   // border width in px
  className?: string;   // extra tailwind classes (e.g., text-orange-500)
};

export default function Spinner({
  size = 24,
  thickness = 3,
  className = "text-gray-400",
}: SpinnerProps) {
  // Uses currentColor for the visible arc
  const style: React.CSSProperties = {
    width: size,
    height: size,
    borderWidth: thickness,
  };

  return (
    <span
      role="status"
      aria-label="Loading"
      className={`inline-block animate-spin rounded-full border-current border-t-transparent ${className}`}
      style={style}
    />
  );
}