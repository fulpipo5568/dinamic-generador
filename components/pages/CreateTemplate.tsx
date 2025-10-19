"use client"

import { useState } from "react"
import "./CreateTemplate.css"

function CreateTemplate() {
  const [template, setTemplate] = useState({
    codigo: "",
    nombre: "",
    version: "1",
    objetivo: "",
    proceso: "",
    cuandoSeUsa: "",
    quienLoLlena: "",
    headerFields: [],
    headerCheckboxes: [],
    tableColumns: [],
    secondarySections: [],
    firmas: [],
  })

  const [showSuccess, setShowSuccess] = useState(false)

  const fieldTypes = [
    { value: "text", label: "Texto" },
    { value: "number", label: "Número" },
    { value: "date", label: "Fecha" },
    { value: "time", label: "Hora" },
    { value: "datetime", label: "Fecha y Hora" },
    { value: "temperature", label: "Temperatura (°C)" },
    { value: "select", label: "Selección" },
    { value: "textarea", label: "Área de texto" },
  ]

  const sectionTypes = [
    { value: "table", label: "Tabla de datos" },
    { value: "materials", label: "Materiales de empaque" },
    { value: "personnel", label: "Personal" },
    { value: "subproducts", label: "Subproductos" },
    { value: "observations", label: "Observaciones" },
    { value: "rejection", label: "Rechazo de producto" },
  ]

  const handleInputChange = (field, value) => {
    setTemplate((prev) => ({ ...prev, [field]: value }))
  }

  const addHeaderCheckbox = () => {
    setTemplate((prev) => ({
      ...prev,
      headerCheckboxes: [...prev.headerCheckboxes, { label: "", options: [] }],
    }))
  }

  const updateHeaderCheckbox = (index, field, value) => {
    setTemplate((prev) => ({
      ...prev,
      headerCheckboxes: prev.headerCheckboxes.map((item, i) => (i === index ? { ...item, [field]: value } : item)),
    }))
  }

  const removeHeaderCheckbox = (index) => {
    setTemplate((prev) => ({
      ...prev,
      headerCheckboxes: prev.headerCheckboxes.filter((_, i) => i !== index),
    }))
  }

  const addHeaderField = () => {
    setTemplate((prev) => ({
      ...prev,
      headerFields: [...prev.headerFields, { label: "", type: "text", required: false, options: [] }],
    }))
  }

  const updateHeaderField = (index, field, value) => {
    setTemplate((prev) => ({
      ...prev,
      headerFields: prev.headerFields.map((item, i) => (i === index ? { ...item, [field]: value } : item)),
    }))
  }

  const removeHeaderField = (index) => {
    setTemplate((prev) => ({
      ...prev,
      headerFields: prev.headerFields.filter((_, i) => i !== index),
    }))
  }

  const addTableColumn = () => {
    setTemplate((prev) => ({
      ...prev,
      tableColumns: [...prev.tableColumns, { label: "", type: "text", required: false, options: [] }],
    }))
  }

  const updateTableColumn = (index, field, value) => {
    setTemplate((prev) => ({
      ...prev,
      tableColumns: prev.tableColumns.map((item, i) => (i === index ? { ...item, [field]: value } : item)),
    }))
  }

  const removeTableColumn = (index) => {
    setTemplate((prev) => ({
      ...prev,
      tableColumns: prev.tableColumns.filter((_, i) => i !== index),
    }))
  }

  const addSecondarySection = () => {
    setTemplate((prev) => ({
      ...prev,
      secondarySections: [
        ...prev.secondarySections,
        { title: "", type: "table", columns: [], rows: 1, multipleInstances: false },
      ],
    }))
  }

  const updateSecondarySection = (index, field, value) => {
    setTemplate((prev) => ({
      ...prev,
      secondarySections: prev.secondarySections.map((item, i) => (i === index ? { ...item, [field]: value } : item)),
    }))
  }

  const removeSecondarySection = (index) => {
    setTemplate((prev) => ({
      ...prev,
      secondarySections: prev.secondarySections.filter((_, i) => i !== index),
    }))
  }

  const addSectionColumn = (sectionIndex) => {
    setTemplate((prev) => ({
      ...prev,
      secondarySections: prev.secondarySections.map((section, i) =>
        i === sectionIndex ? { ...section, columns: [...section.columns, { label: "", type: "text" }] } : section,
      ),
    }))
  }

  const updateSectionColumn = (sectionIndex, columnIndex, field, value) => {
    setTemplate((prev) => ({
      ...prev,
      secondarySections: prev.secondarySections.map((section, i) =>
        i === sectionIndex
          ? {
              ...section,
              columns: section.columns.map((col, j) => (j === columnIndex ? { ...col, [field]: value } : col)),
            }
          : section,
      ),
    }))
  }

  const removeSectionColumn = (sectionIndex, columnIndex) => {
    setTemplate((prev) => ({
      ...prev,
      secondarySections: prev.secondarySections.map((section, i) =>
        i === sectionIndex ? { ...section, columns: section.columns.filter((_, j) => j !== columnIndex) } : section,
      ),
    }))
  }

  const addFirma = () => {
    setTemplate((prev) => ({
      ...prev,
      firmas: [...prev.firmas, { puesto: "", nombre: "" }],
    }))
  }

  const updateFirma = (index, field, value) => {
    setTemplate((prev) => ({
      ...prev,
      firmas: prev.firmas.map((item, i) => (i === index ? { ...item, [field]: value } : item)),
    }))
  }

  const removeFirma = (index) => {
    setTemplate((prev) => ({
      ...prev,
      firmas: prev.firmas.filter((_, i) => i !== index),
    }))
  }

  const handleSaveTemplate = () => {
    if (!template.codigo || !template.nombre) {
      alert("Por favor completa al menos el código y nombre del formulario")
      return
    }

    const templates = JSON.parse(localStorage.getItem("formTemplates") || "[]")
    const existingIndex = templates.findIndex((t) => t.codigo === template.codigo)

    if (existingIndex >= 0) {
      templates[existingIndex] = { ...template, updatedAt: new Date().toISOString() }
    } else {
      templates.push({ ...template, createdAt: new Date().toISOString() })
    }

    localStorage.setItem("formTemplates", JSON.stringify(templates))

    setShowSuccess(true)
    setTimeout(() => setShowSuccess(false), 3000)

    // Reset form
    setTemplate({
      codigo: "",
      nombre: "",
      version: "1",
      objetivo: "",
      proceso: "",
      cuandoSeUsa: "",
      quienLoLlena: "",
      headerFields: [],
      headerCheckboxes: [],
      tableColumns: [],
      secondarySections: [],
      firmas: [],
    })
  }

  const loadExistingTemplate = () => {
    const templates = JSON.parse(localStorage.getItem("formTemplates") || "[]")
    const codigo = prompt("Ingresa el código del formulario a editar:")
    const existing = templates.find((t) => t.codigo === codigo)

    if (existing) {
      setTemplate(existing)
    } else {
      alert("No se encontró un formulario con ese código")
    }
  }

  return (
    <div className="create-template">
      <div className="page-header">
        <h1>Crear Plantilla de Formulario</h1>
        <div className="header-actions">
          <button onClick={loadExistingTemplate} className="btn-secondary">
            Cargar Plantilla Existente
          </button>
          <button onClick={handleSaveTemplate} className="btn-primary">
            Guardar Plantilla
          </button>
        </div>
      </div>

      {showSuccess && <div className="success-message">✅ Plantilla guardada exitosamente</div>}

      <div className="form-section">
        <h2>Información General</h2>
        <div className="form-grid">
          <div className="form-group">
            <label>Código *</label>
            <input
              type="text"
              value={template.codigo}
              onChange={(e) => handleInputChange("codigo", e.target.value)}
              placeholder="Ej: FOR-CA-1"
            />
          </div>

          <div className="form-group">
            <label>Versión</label>
            <input
              type="text"
              value={template.version}
              onChange={(e) => handleInputChange("version", e.target.value)}
              placeholder="Ej: 1, 2, 1.1"
            />
          </div>

          <div className="form-group full-width">
            <label>Nombre del Registro *</label>
            <input
              type="text"
              value={template.nombre}
              onChange={(e) => handleInputChange("nombre", e.target.value)}
              placeholder="Ej: CONTROL DE TEMPERATURA DE TÚNELES"
            />
          </div>

          <div className="form-group full-width">
            <label>Objetivo</label>
            <textarea
              value={template.objetivo}
              onChange={(e) => handleInputChange("objetivo", e.target.value)}
              placeholder="Describe el objetivo del formulario"
              rows="3"
            />
          </div>

          <div className="form-group">
            <label>Proceso</label>
            <input
              type="text"
              value={template.proceso}
              onChange={(e) => handleInputChange("proceso", e.target.value)}
              placeholder="Ej: Producción, Calidad, Recepción"
            />
          </div>

          <div className="form-group">
            <label>Cuándo se usa</label>
            <input
              type="text"
              value={template.cuandoSeUsa}
              onChange={(e) => handleInputChange("cuandoSeUsa", e.target.value)}
              placeholder="Ej: Posterior a congelación"
            />
          </div>

          <div className="form-group">
            <label>Quién lo llena</label>
            <input
              type="text"
              value={template.quienLoLlena}
              onChange={(e) => handleInputChange("quienLoLlena", e.target.value)}
              placeholder="Ej: Asistente de Cámara"
            />
          </div>
        </div>
      </div>

      <div className="form-section">
        <div className="section-header">
          <h2>Checkboxes del Encabezado</h2>
          <button onClick={addHeaderCheckbox} className="btn-add">
            + Agregar Checkbox
          </button>
        </div>

        {template.headerCheckboxes.map((checkbox, index) => (
          <div key={index} className="field-item">
            <div className="field-grid">
              <div className="form-group">
                <label>Etiqueta</label>
                <input
                  type="text"
                  value={checkbox.label}
                  onChange={(e) => updateHeaderCheckbox(index, "label", e.target.value)}
                  placeholder="Ej: Tipo de almacenamiento"
                />
              </div>

              <div className="form-group">
                <label>Opciones (separadas por coma)</label>
                <input
                  type="text"
                  value={checkbox.options?.join(", ") || ""}
                  onChange={(e) =>
                    updateHeaderCheckbox(
                      index,
                      "options",
                      e.target.value.split(",").map((o) => o.trim()),
                    )
                  }
                  placeholder="PROVISIONAL, FINAL"
                />
              </div>

              <button onClick={() => removeHeaderCheckbox(index)} className="btn-remove" title="Eliminar checkbox">
                🗑️
              </button>
            </div>
          </div>
        ))}

        {template.headerCheckboxes.length === 0 && (
          <p className="empty-state">No hay checkboxes. Agrega uno si necesitas opciones múltiples en el encabezado.</p>
        )}
      </div>

      <div className="form-section">
        <div className="section-header">
          <h2>Campos del Encabezado</h2>
          <button onClick={addHeaderField} className="btn-add">
            + Agregar Campo
          </button>
        </div>

        {template.headerFields.map((field, index) => (
          <div key={index} className="field-item">
            <div className="field-grid">
              <div className="form-group">
                <label>Etiqueta</label>
                <input
                  type="text"
                  value={field.label}
                  onChange={(e) => updateHeaderField(index, "label", e.target.value)}
                  placeholder="Ej: Fecha, Lote, Turno"
                />
              </div>

              <div className="form-group">
                <label>Tipo</label>
                <select value={field.type} onChange={(e) => updateHeaderField(index, "type", e.target.value)}>
                  {fieldTypes.map((type) => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group checkbox-group">
                <label>
                  <input
                    type="checkbox"
                    checked={field.required}
                    onChange={(e) => updateHeaderField(index, "required", e.target.checked)}
                  />
                  Requerido
                </label>
              </div>

              <button onClick={() => removeHeaderField(index)} className="btn-remove" title="Eliminar campo">
                🗑️
              </button>
            </div>

            {field.type === "select" && (
              <div className="form-group">
                <label>Opciones (separadas por coma)</label>
                <input
                  type="text"
                  value={field.options?.join(", ") || ""}
                  onChange={(e) =>
                    updateHeaderField(
                      index,
                      "options",
                      e.target.value.split(",").map((o) => o.trim()),
                    )
                  }
                  placeholder="Opción 1, Opción 2, Opción 3"
                />
              </div>
            )}
          </div>
        ))}

        {template.headerFields.length === 0 && (
          <p className="empty-state">No hay campos de encabezado. Agrega al menos uno.</p>
        )}
      </div>

      <div className="form-section">
        <div className="section-header">
          <h2>Columnas de la Tabla Principal</h2>
          <button onClick={addTableColumn} className="btn-add">
            + Agregar Columna
          </button>
        </div>

        {template.tableColumns.map((column, index) => (
          <div key={index} className="field-item">
            <div className="field-grid">
              <div className="form-group">
                <label>Nombre de Columna</label>
                <input
                  type="text"
                  value={column.label}
                  onChange={(e) => updateTableColumn(index, "label", e.target.value)}
                  placeholder="Ej: Hora, Lote, Temperatura"
                />
              </div>

              <div className="form-group">
                <label>Tipo</label>
                <select value={column.type} onChange={(e) => updateTableColumn(index, "type", e.target.value)}>
                  {fieldTypes.map((type) => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group checkbox-group">
                <label>
                  <input
                    type="checkbox"
                    checked={column.required}
                    onChange={(e) => updateTableColumn(index, "required", e.target.checked)}
                  />
                  Requerido
                </label>
              </div>

              <button onClick={() => removeTableColumn(index)} className="btn-remove" title="Eliminar columna">
                🗑️
              </button>
            </div>

            {column.type === "select" && (
              <div className="form-group">
                <label>Opciones (separadas por coma)</label>
                <input
                  type="text"
                  value={column.options?.join(", ") || ""}
                  onChange={(e) =>
                    updateTableColumn(
                      index,
                      "options",
                      e.target.value.split(",").map((o) => o.trim()),
                    )
                  }
                  placeholder="Opción 1, Opción 2, Opción 3"
                />
              </div>
            )}
          </div>
        ))}

        {template.tableColumns.length === 0 && (
          <p className="empty-state">No hay columnas definidas. Agrega al menos una.</p>
        )}
      </div>

      <div className="form-section">
        <div className="section-header">
          <h2>Secciones Adicionales</h2>
          <button onClick={addSecondarySection} className="btn-add">
            + Agregar Sección
          </button>
        </div>

        {template.secondarySections.map((section, sectionIndex) => (
          <div key={sectionIndex} className="secondary-section-item">
            <div className="section-header-row">
              <h3>Sección {sectionIndex + 1}</h3>
              <button
                onClick={() => removeSecondarySection(sectionIndex)}
                className="btn-remove"
                title="Eliminar sección"
              >
                🗑️
              </button>
            </div>

            <div className="form-grid">
              <div className="form-group">
                <label>Título de la Sección</label>
                <input
                  type="text"
                  value={section.title}
                  onChange={(e) => updateSecondarySection(sectionIndex, "title", e.target.value)}
                  placeholder="Ej: Material de Empaque, Personal"
                />
              </div>

              <div className="form-group">
                <label>Tipo de Sección</label>
                <select
                  value={section.type}
                  onChange={(e) => updateSecondarySection(sectionIndex, "type", e.target.value)}
                >
                  {sectionTypes.map((type) => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
              </div>

              {section.type === "table" && (
                <>
                  <div className="form-group">
                    <label>Número de filas iniciales</label>
                    <input
                      type="number"
                      min="1"
                      value={section.rows}
                      onChange={(e) => updateSecondarySection(sectionIndex, "rows", Number.parseInt(e.target.value))}
                    />
                  </div>

                  <div className="form-group checkbox-group">
                    <label>
                      <input
                        type="checkbox"
                        checked={section.multipleInstances}
                        onChange={(e) => updateSecondarySection(sectionIndex, "multipleInstances", e.target.checked)}
                      />
                      Permitir múltiples instancias
                    </label>
                  </div>
                </>
              )}
            </div>

            {(section.type === "table" || section.type === "materials" || section.type === "subproducts") && (
              <div className="section-columns">
                <div className="section-header">
                  <h4>Columnas de la Sección</h4>
                  <button onClick={() => addSectionColumn(sectionIndex)} className="btn-add-small">
                    + Columna
                  </button>
                </div>

                {section.columns.map((column, columnIndex) => (
                  <div key={columnIndex} className="field-item-small">
                    <div className="field-grid">
                      <div className="form-group">
                        <label>Nombre</label>
                        <input
                          type="text"
                          value={column.label}
                          onChange={(e) => updateSectionColumn(sectionIndex, columnIndex, "label", e.target.value)}
                          placeholder="Ej: Material, Cantidad"
                        />
                      </div>

                      <div className="form-group">
                        <label>Tipo</label>
                        <select
                          value={column.type}
                          onChange={(e) => updateSectionColumn(sectionIndex, columnIndex, "type", e.target.value)}
                        >
                          {fieldTypes.map((type) => (
                            <option key={type.value} value={type.value}>
                              {type.label}
                            </option>
                          ))}
                        </select>
                      </div>

                      <button
                        onClick={() => removeSectionColumn(sectionIndex, columnIndex)}
                        className="btn-remove-small"
                        title="Eliminar"
                      >
                        ✕
                      </button>
                    </div>
                  </div>
                ))}

                {section.columns.length === 0 && <p className="empty-state-small">No hay columnas definidas.</p>}
              </div>
            )}
          </div>
        ))}

        {template.secondarySections.length === 0 && (
          <p className="empty-state">
            No hay secciones adicionales. Agrega secciones para materiales, personal, observaciones, etc.
          </p>
        )}
      </div>

      <div className="form-section">
        <div className="section-header">
          <h2>Firmas</h2>
          <button onClick={addFirma} className="btn-add">
            + Agregar Firma
          </button>
        </div>

        {template.firmas.map((firma, index) => (
          <div key={index} className="field-item">
            <div className="field-grid">
              <div className="form-group">
                <label>Puesto</label>
                <input
                  type="text"
                  value={firma.puesto}
                  onChange={(e) => updateFirma(index, "puesto", e.target.value)}
                  placeholder="Ej: Supervisor de Calidad"
                />
              </div>

              <button onClick={() => removeFirma(index)} className="btn-remove" title="Eliminar firma">
                🗑️
              </button>
            </div>
          </div>
        ))}

        {template.firmas.length === 0 && <p className="empty-state">No hay firmas definidas.</p>}
      </div>

      <div className="form-actions">
        <button onClick={handleSaveTemplate} className="btn-primary btn-large">
          💾 Guardar Plantilla
        </button>
      </div>
    </div>
  )
}

export default CreateTemplate
