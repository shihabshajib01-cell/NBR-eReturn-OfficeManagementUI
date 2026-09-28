interface ColorSwatchGroupProps {
  colors: string[];
}

export function ColorSwatchGroup({ colors }: ColorSwatchGroupProps) {
  return (
    <div className="flex items-center gap-1">
      {colors.map((c, i) => (
        <span
          key={i}
          className="w-3 h-3 rounded-full flex-shrink-0"
          style={{ backgroundColor: c, boxShadow: "inset 0 0 0 1px rgba(0,0,0,0.1)" }}
        />
      ))}
    </div>
  );
}
