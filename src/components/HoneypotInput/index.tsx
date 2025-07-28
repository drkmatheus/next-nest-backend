export function HoneypotInput() {
  return (
    <input
      className="niceInput"
      name="niceNameToInput"
      type="text"
      autoComplete="nem-password"
      tabIndex={-1}
      defaultValue=""
    />
  );
}
