import { Link } from "react-router-dom";

export default function Header({ page }) {
  return (
    <header className="flex p-4 border-b-2 mb-4">
      <Link to="/" className="flex h-8 items-center">
        <img src="/logo.png" alt="logo" className="h-full" />
        <img src="/logo-name.png" alt="logo" className="h-full" />
      </Link>
      <h5 className="mx-auto">{page} page</h5>
    </header>
  );
}
