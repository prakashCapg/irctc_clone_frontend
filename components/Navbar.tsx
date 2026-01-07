export default function Navbar() {
  return (
    <header className="header">
      <div className="header__bar">
        <div className="header__brand">Logo</div>

        <div className="header__right">
          Logo
          <button aria-label="Menu" className="header__menu-btn">
            <span className="header__menu-icon" />
          </button>
        </div>
      </div>

      {/* <nav className="header__nav">
        <ul className="header__nav-list">
          <li>
            <Link href="/train-search">Train Search</Link>
          </li>
          <li>
            <Link href="/train-list">Train List</Link>
          </li>
          <li>
            <Link href="/pnr">PNR Status</Link>
          </li>
          <li>
            <Link href="/login">Login</Link>
          </li>
        </ul>
      </nav> */}
    </header>
  );
}
