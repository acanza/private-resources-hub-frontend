import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import {
  requestDirectoryAccess,
  getDirectoryItems,
} from '../api/resources';
import type { DirectoryItem } from '../types/api';
import '../styles/DirectoryPage.css';

export const DirectoryPage = () => {
  const navigate = useNavigate();
  const { directoryName } = useParams<{ directoryName: string }>();
  const { email, idToken, logout } = useAuth();
  const [items, setItems] = useState<DirectoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [forbidden, setForbidden] = useState(false);
  const [formattedDirectoryName, setFormattedDirectoryName] = useState<string | null>(null);

  // Format the directory name for display (replace hyphens with spaces and capitalize)
  if (directoryName && !formattedDirectoryName) {
    let formattedName = directoryName.replace(/-/g, ' ');
    formattedName = formattedName.slice(0, 1).toUpperCase() + formattedName.slice(1);
    setFormattedDirectoryName(formattedName);
  }

  useEffect(() => {
    const fetchDirectoryContent = async () => {
      if (!email || !idToken || !directoryName) {
        setError('Información incompleta para acceder al directorio');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        setForbidden(false);

        // Step 1: Request access to the directory
        // This endpoint validates permissions and sets CloudFront signed cookies
        await requestDirectoryAccess(directoryName, email, idToken);

        // Step 2: Fetch directory items
        // Only called after access is granted
        const response = await getDirectoryItems(
          directoryName,
          email,
          idToken
        );
        setItems(response.items);
      } catch (err) {
        console.error('Error fetching directory content:', err);

        if (err instanceof Error) {
          const message = err.message.toLowerCase();
          if (message.includes('403') || message.includes('forbidden')) {
            setForbidden(true);
            setError('No tienes permiso para acceder a este directorio.');
          } else if (message.includes('404') || message.includes('not found')) {
            setError('El directorio no existe.');
          } else {
            setError(message);
          }
        } else {
          setError('Error al cargar el contenido del directorio');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchDirectoryContent();
  }, [directoryName, email, idToken]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleBack = () => {
    navigate('/resources');
  };

  return (
    <div className="directory-page">
      <header className="directory-header">
        <div className="directory-title-section">
          <button onClick={handleBack} className="back-button">
            ← Volver
          </button>
          <h1>
            {formattedDirectoryName
              ? `${formattedDirectoryName}`
              : 'Cargando...'}
          </h1>
        </div>
        <button onClick={handleLogout} className="logout-button">
          Cerrar Sesión
        </button>
      </header>

      <main className="directory-main">
        {loading ? (
          <div className="state-container">
            <p className="loading-message">Cargando contenido del directorio...</p>
          </div>
        ) : forbidden ? (
          <div className="state-container forbidden-state">
            <p className="forbidden-message">
              {error || 'No tienes permiso para acceder a este recurso.'}
            </p>
            <button onClick={handleBack} className="back-link-button">
              Volver a mis recursos
            </button>
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
        ) : items.length === 0 ? (
          <div className="state-container empty-state">
            <p className="empty-message">
              Este directorio no contiene archivos.
            </p>
            <button onClick={handleBack} className="back-link-button">
              Volver a mis recursos
            </button>
          </div>
        ) : (
          <div className="files-list">
            <h2>Archivos disponibles</h2>
            <ul className="files-grid">
              {items.map((item) => (
                <li key={item.name} className="file-item">
                  <a
                    href={item.signed_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="file-link"
                    download
                  >
                    <span className="file-icon">📄</span>
                    <span className="file-name">{item.name}</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}
      </main>
    </div>
  );
};
