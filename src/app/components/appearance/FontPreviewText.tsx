interface FontPreviewTextProps {
  text: string;
  fontFamily: string;
  color: string;
}

export function FontPreviewText({ text, fontFamily, color }: FontPreviewTextProps) {
  return (
    <p style={{ fontFamily, fontSize: "11px", color, lineHeight: 1.5, marginTop: "3px" }}>
      {text}
    </p>
  );
}
