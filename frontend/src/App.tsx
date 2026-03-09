import { ReactKeycloakProvider, useKeycloak } from '@react-keycloak/web';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import keycloak from './services/keycloak';
import BooksPage from './pages/BooksPage';
import MyLoansPage from './pages/MyLoansPage';
import StaffPage from './pages/StaffPage';

export default function App() {
  return (
    <ReactKeycloakProvider authClient={keycloak}>
      <BrowserRouter>
        <div className="min-h-screen">
          <Navigation />
          <main className="p-4">
            <Routes>
              <Route path="/" element={<h1 className="text-2xl">Willkommen in der Bibliothek</h1>} />
              <Route path="/books" element={<BooksPage />} />
              <Route path="/my-loans" element={<MyLoansPage />} />
              <Route path="/staff" element={<StaffPage />} />
            </Routes>
          </main>
        </div>
      </BrowserRouter>
    </ReactKeycloakProvider>
  );
}

function Navigation() {
  const { keycloak, initialized } = useKeycloak();

  if (!initialized) return null;

  const isStaff = keycloak.hasRealmRole('STAFF');
  const isCustomer = keycloak.hasRealmRole('CUSTOMER');

  return (
    <nav className="bg-gray-800 text-white p-4">
      <div className="flex gap-4 items-center">
        <Link to="/" className="font-bold">Bibliothek</Link>
        <Link to="/books">Bücher</Link>
        {isCustomer && (
          <Link to="/my-loans">Meine Ausleihen</Link>
        )}
        {isStaff && (
          <Link to="/staff">Mitarbeiter</Link>
        )}
        <div className="ml-auto flex gap-2 items-center">
          {keycloak.authenticated && (
            <span className="text-sm text-gray-300">
              {keycloak.tokenParsed?.preferred_username}
            </span>
          )}
          <LoginButton />
        </div>
      </div>
    </nav>
  );
}

function LoginButton() {
  const { keycloak, initialized } = useKeycloak();

  if (!initialized) return null;

  if (keycloak.authenticated) {
    return (
      <button onClick={() => keycloak.logout()} className="bg-red-500 px-3 py-1 rounded">
        Abmelden
      </button>
    );
  }

  return (
    <button onClick={() => keycloak.login()} className="bg-green-500 px-3 py-1 rounded">
      Anmelden
    </button>
  );
}