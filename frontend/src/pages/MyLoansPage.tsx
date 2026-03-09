import { useEffect, useState } from 'react';
import { useKeycloak } from '@react-keycloak/web';
import { loanApi, setAuthToken } from '../services/api';
import type { Loan } from '../types';

export default function MyLoansPage() {
  const { keycloak } = useKeycloak();
  const [loans, setLoans] = useState<Loan[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (keycloak.token) {
      setAuthToken(keycloak.token);
      loanApi.getMyLoans()
        .then(setLoans)
        .finally(() => setLoading(false));
    }
  }, [keycloak.token]);

  if (loading) return <p>Laden...</p>;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Meine Ausleihen</h1>
      {loans.length === 0 ? (
        <p>Keine aktiven Ausleihen.</p>
      ) : (
        <table className="w-full border">
          <thead>
            <tr className="bg-gray-100">
              <th className="border p-2 text-left">Buch</th>
              <th className="border p-2 text-left">Ausgeliehen am</th>
              <th className="border p-2 text-left">Fällig am</th>
            </tr>
          </thead>
          <tbody>
            {loans.map(loan => (
              <tr key={loan.id}>
                <td className="border p-2">{loan.book.title}</td>
                <td className="border p-2">{loan.loanDate}</td>
                <td className="border p-2">{loan.dueDate}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}