import type { Resource } from '../types/api';
import '../styles/ResourceCard.css';

interface ResourceCardProps {
  resource: Resource;
  onClick: () => void;
}

export const ResourceCard = ({ resource, onClick }: ResourceCardProps) => {
  const isAccessible = resource.has_access;

  return (
    <div
      className={`resource-card ${isAccessible ? 'accessible' : 'disabled'}`}
      onClick={isAccessible ? onClick : undefined}
      role={isAccessible ? 'button' : 'status'}
      tabIndex={isAccessible ? 0 : -1}
      onKeyDown={(e) => {
        if (isAccessible && (e.key === 'Enter' || e.key === ' ')) {
          e.preventDefault();
          onClick();
        }
      }}
    >
      <div className="resource-card-content">
        <h3 className="resource-name">{resource.name}</h3>
        <div className="resource-status">
          {isAccessible ? (
            <span className="status-accessible">✓ Accesible</span>
          ) : (
            <span className="status-disabled">✗ No disponible</span>
          )}
        </div>
      </div>
    </div>
  );
};
