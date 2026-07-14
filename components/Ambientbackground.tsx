export default function AmbientBackground() {
  return (
    <div className="ambient-bg">
      <div
        className="ambient-blob w-[700px] h-[700px] bg-terracotta animate-float-slow"
        style={{ top: "-15%", left: "50%", transform: "translateX(-50%)", opacity: 0.12 }}
      />
    </div>
  );
}