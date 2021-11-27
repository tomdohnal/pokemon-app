import { Outlet, Link } from 'react-router-dom';

function App() {
  return (
    <div>
      <Link to="/">Home</Link>
      <Link to="/favorites">Favorites</Link>
      <Outlet />
    </div>
  );
}

export default App;
