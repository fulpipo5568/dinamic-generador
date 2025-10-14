import "./FormHeader.css"

export default function FormHeader({ title, code, version, date }) {
  return (
    <div className="form-header">
      <div className="form-header-left">
        <div className="company-logo">
          <div className="logo-text">Frigolab "San Mateo"</div>
          <div className="logo-subtitle">Exportadores de mariscos frescos y congelados</div>
          <div className="logo-lines">
            <div className="line"></div>
            <div className="line"></div>
            <div className="line"></div>
          </div>
          <svg className="logo-icon" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
            <ellipse cx="50" cy="50" rx="35" ry="25" fill="#2563eb" />
            <path d="M 70 50 Q 85 45 90 50 Q 85 55 70 50" fill="#2563eb" />
            <circle cx="45" cy="45" r="3" fill="white" />
            <path d="M 30 55 Q 35 60 40 55" stroke="#1e40af" strokeWidth="2" fill="none" />
          </svg>
          <div className="company-contact">
            <div>📍 Avenida San Vía a Rocafuerte - Parque del Atún</div>
            <div>📞 593-5-3701161 ✉️ frigolab@frigolab.com.ec</div>
          </div>
        </div>
      </div>

      <div className="form-header-center">
        <h1 className="form-title">{title}</h1>
      </div>

      <div className="form-header-right">
        <div className="form-metadata">
          <div className="metadata-row">
            <span className="metadata-label">Código:</span>
            <span className="metadata-value">{code}</span>
          </div>
          <div className="metadata-row">
            <span className="metadata-label">Versión:</span>
            <span className="metadata-value">{version}</span>
          </div>
          <div className="metadata-row">
            <span className="metadata-label">Fecha:</span>
            <span className="metadata-value">{date}</span>
          </div>
        </div>
      </div>
    </div>
  )
}
