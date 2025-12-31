import Link from "next/link";

export default function Navbar() {
  return (
    <header className="border-b">
      <nav className="container mx-auto flex items-center justify-between p-4">
        <Link href="/" className="flex items-center gap-2 font-semibold">
          <span>IRCTC Clone</span>
        </Link>
        <div className="flex gap-4">
          <Link href="/train-search">Train Search</Link>
          <br></br>
          <Link href="/train-list">Train List</Link>
        </div>
      </nav>
    </header>
  );
}
