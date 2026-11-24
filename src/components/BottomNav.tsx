import { NavLink } from 'react-router-dom';

const linkClass = ({ isActive }: { isActive: boolean }) =>
  [
    'flex min-h-12 flex-1 items-center justify-center border-t-[3px] px-1 text-center text-sm font-semibold leading-tight',
    isActive ? 'border-cobalt text-cobalt' : 'border-transparent text-ink',
  ].join(' ');

export function BottomNav() {
  return (
    <nav className="grid shrink-0 grid-cols-3 border-t border-[rgba(27,36,51,0.12)] bg-white" aria-label="Main">
      <NavLink to="/home" data-testid="nav-home" className={linkClass}>
        Home
      </NavLink>
      <NavLink to="/games" data-testid="nav-my-games" className={linkClass}>
        My Games
      </NavLink>
      <NavLink to="/card" data-testid="nav-player-card" className={linkClass}>
        My Player Card
      </NavLink>
    </nav>
  );
}
