"use client"

import { useEffect, useState } from "react"
import "./Home.css"

function Home() {
  const [stats, setStats] = useState({
    templates: 0,
    forms: 0,
  })

  useEffect(() => {
    const templates = JSON.parse(localStorage.getItem("formTemplates") || "[]")
    const forms = JSON.parse(localStorage.getItem("filledForms") || "[]")
    setStats({
      templates: templates.length,
      forms: forms.length,
    })
  }, [])

  return (
    <div className="home">
      <div className="hero">
        <h1>Sistema de Formularios Dinámicos</h1>
        <p>Gestiona y crea formularios personalizados para el control de calidad y producción</p>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">📋</div>
          <div className="stat-content">
            <h3>{stats.templates}</h3>
            <p>Plantillas Creadas</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">📝</div>
          <div className="stat-content">
            <h3>{stats.forms}</h3>
            <p>Formularios Llenados</p>
          </div>
        </div>
      </div>

      <div className="info-section">
        <h2>Características del Sistema</h2>
        <div className="features-grid">
          <div className="feature">
            <h4>🎯 Formularios Dinámicos</h4>
            <p>Crea formularios con campos de encabezado, tablas dinámicas y secciones de firmas</p>
          </div>
          <div className="feature">
            <h4>💾 Almacenamiento Local</h4>
            <p>Todos los datos se guardan en tu navegador de forma segura</p>
          </div>
          <div className="feature">
            <h4>📊 Tablas Personalizables</h4>
            <p>Define columnas con diferentes tipos de datos (texto, número, fecha, hora, temperatura)</p>
          </div>
          <div className="feature">
            <h4>✅ Validación de Datos</h4>
            <p>Campos requeridos y validación automática según el tipo de dato</p>
          </div>
        </div>
      </div>

      <div className="quick-actions">
        <h2>Acciones Rápidas</h2>
        <div className="actions-grid">
          <div className="action-card-info">
            <div className="action-icon">➕</div>
            <h3>Crear Plantilla</h3>
            <p>Define una nueva plantilla de formulario con campos personalizados</p>
          </div>

          <div className="action-card-info">
            <div className="action-icon">✍️</div>
            <h3>Llenar Formulario</h3>
            <p>Completa un formulario basado en una plantilla existente</p>
          </div>

          <div className="action-card-info">
            <div className="action-icon">👁️</div>
            <h3>Ver Formularios</h3>
            <p>Consulta y exporta los formularios guardados</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Home
