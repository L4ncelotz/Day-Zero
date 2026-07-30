export default function ControlRoomLoading() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-center space-y-3">
        <div className="w-8 h-8 rounded-full border-2 border-accent border-t-transparent animate-spin mx-auto" />
        <p className="text-xs text-text-tertiary font-mono tracking-widest uppercase">Loading</p>
      </div>
    </div>
  );
}
