export function ScrollingText({ text }: { text: string }) {
  return (
    <div className="my-2 overflow-hidden whitespace-nowrap">
      <div className="inline-block animate-scroll-right">
        <span className="font-medium uppercase">{text}</span>
      </div>
    </div>
  );
}
