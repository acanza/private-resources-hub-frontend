import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { getResources } from '../api/resources';
import { ResourceCard } from '../components/ResourceCard';
import type { Resource } from '../types/api';
import '../styles/ResourcesPage.css';

export const ResourcesPage = () => {
  const navigate = useNavigate();
  const { email, idToken, logout } = useAuth();
  const [resources, setResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchResources = async () => {
      if (!email || !idToken) {
        setError('Usuario no autenticado');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        const response = await getResources(email, idToken);
        setResources(response.resources);
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : 'Error al cargar recursos';
        setError(errorMessage);
        console.error('Error fetching resources:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchResources();
  }, [email, idToken]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleResourceClick = (resource: Resource) => {
    if (resource.has_access) {
      navigate(`/resources/${resource.name}`);
    }
  };

  return (
    <div className="resources-page">
      <header className="resources-header">
        <h1>Mis Recursos</h1>
        <button onClick={handleLogout} className="logout-button">
          Cerrar Sesión
        </button>
      </header>

      <main className="resources-main">
        {loading ? (
          <div className="state-container">
            <p className="loading-message">Cargando recursos...</p>
          </div>
        ) : error ? (
          <div className="state-container error-state">
            <p className="error-message">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="retry-button"
            >
              Reintentar
            </button>
          </div>
        ) : resources.length === 0 ? (
          <div className="state-container empty-state">
            <p className="empty-message">
              No hay recursos disponibles para tu cuenta.
            </p>
          </div>
        ) : (
          <div className="resources-grid">
            {resources.map((resource) => (
              <ResourceCard
                key={resource.name}
                resource={resource}
                onClick={() => handleResourceClick(resource)}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
};
