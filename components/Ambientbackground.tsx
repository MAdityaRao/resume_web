export default function AmbientBackground() {
  return (
    <div className="fixed inset-0 z-[-10] overflow-hidden pointer-events-none bg-[#090909]">
      <div
        className="absolute w-[700px] h-[700px] bg-yellow-500/10 rounded-full blur-[100px] animate-pulse"
        style={{ top: "10%", left: "50%", transform: "translateX(-50%)" }}
      />
    </div>
  );
}
