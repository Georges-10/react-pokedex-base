// --- LABELED INPUT ---
interface LabeledInputProps {
  id: string;
  label: string;
  type?: string;
  placeholder?: string;
  refObj: React.RefObject<HTMLInputElement>;
  className?: string;
  min?: number;
  max?: number;
}

export function LabeledInput({
  id,
  label,
  type = "text",
  placeholder = "",
  refObj,
  className = "",
  min,
  max,
}: LabeledInputProps) {
  return (
    <div className="mb-5">
      <label htmlFor={id}>{label}</label>
      <input
        id={id}
        name={id}
        type={type}
        placeholder={placeholder}
        ref={refObj}
        className={`border border-gray-400 rounded-md px-3 py-2 w-full text-black ${className}`}
        {...(min !== undefined && { min })}
        {...(max !== undefined && { max })}
      />
    </div>
  );
}
