export function Input({ value, onChange, placeholder }) {
  return (
    <input
      type="text"
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className="px-2 py-1 border rounded-md w-full"
    />
  );
}