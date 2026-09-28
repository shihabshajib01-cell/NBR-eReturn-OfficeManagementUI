interface SToggleProps {
  id: string;
  checked: boolean;
  onChange: (v: boolean) => void;
  label: string;
}

export function SToggle({ id, checked, onChange, label }: SToggleProps) {
  const labelId = `${id}-lbl`;
  return (
    <div className="s-toggle-wrapper">
      <button
        role="switch"
        id={id}
        aria-checked={checked}
        aria-labelledby={labelId}
        type="button"
        onClick={() => onChange(!checked)}
        className="s-toggle-track"
      >
        <span className="s-toggle-thumb" aria-hidden="true" />
      </button>
      <span id={labelId} className="s-toggle-label" onClick={() => onChange(!checked)}>
        {label}
      </span>
    </div>
  );
}
