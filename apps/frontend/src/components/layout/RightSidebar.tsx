export function RightSidebar() {
  return (
    <aside className="w-72 flex-shrink-0 border-l border-border bg-card/80 backdrop-blur-md flex flex-col z-10 shadow-[-1px_0_3px_0_rgba(0,0,0,0.02)]">
      <div className="p-4 border-b border-border">
        <h3 className="text-sm font-semibold tracking-tight">Properties</h3>
      </div>
      <div className="p-4 flex-1 overflow-y-auto">
        <div className="flex flex-col items-center justify-center h-full text-foreground/40 text-sm gap-3">
          <p>Select an element to edit</p>
          <div className="w-12 h-1 bg-border rounded-full" />
        </div>
      </div>
    </aside>
  );
}
