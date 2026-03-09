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
          <nav className="bg-gray-800 text-white p-4">
            <div className="flex gap-4 items-center">
              <Link to="/" className="font-bold">Bibliothek</Link>
              <Link to="/books">Bücher</Link>
              <Link to="/my-loans">Meine Ausleihen</Link>
              <Link to="/staff">Mitarbeiter</Link>
              <div className="ml-auto">
                <LoginButton />
              </div>
            </div>
          </nav>
          <main className="p-4">
            <Routes>
              <Route path="/" element={<h1>Willkommen in der Bibliothek</h1>} />
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