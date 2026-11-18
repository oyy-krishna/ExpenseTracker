import { Link } from "react-router-dom";

export default function Logo() {
  return (
    <Link to="/" className="flex items-center gap-2.5 rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
      <span className="grid h-10 w-10 place-items-center rounded-2xl bg-gradient-to-br from-pink-400 to-violet-500 text-xl shadow-md shadow-pink-500/30">
        🌸
      </span>
      <span className="leading-tight">
        <span className="block text-lg font-extrabold tracking-tight">Bloom</span>
        <span className="block text-[11px] font-medium text-muted-foreground">money, beautifully</span>
      </span>
    </Link>
  );
}
