export default function Toolbar({ children }: { children: React.ReactNode }) {
  return (
    <div className="fixed top-48 flex items-center justify-around space-x-5 p-4 shadow-xl">
      {children}
    </div>
  );
}

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

export function ToolbarButton({
  icon,
  onClick,
  active,
}: {
  icon: React.ReactNode;
  onClick: () => void;
  active: boolean;
}) {
  return (
    <button
      type="button"
      onClick={(event) => {
        event.preventDefault();
        onClick();
      }}
      className={classNames(
        active ? "bg-indigo-50" : "bg-white",
        "rounded-md p-2 text-white shadow-sm hover:bg-indigo-50 focus:outline-none"
      )}
    >
      {icon}
    </button>
  );
}
