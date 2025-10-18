"use client"

import { useState, useEffect } from "react"
import FormHeader from "../components/FormHeader"
import "./FillForm.css"

function FillForm() {
  const [templates, setTemplates] = useState([])
  const [selectedTemplate, setSelectedTemplate] = useState(null)
  const [headerData, setHeaderData] = useState({})
  const [headerCheckboxData, setHeaderCheckboxData] = useState({})
  const [tableRows, setTableRows] = useState([{}])
  const [secondarySectionsData, setSecondarySectionsData] = useState({})
  const [firmasData, setFirmasData] = useState({})
  const [observaciones, setObservaciones] = useState("")
  const [showSuccess, setShowSuccess] = useState(false)

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("formTemplates") || "[]")
    setTemplates(stored)
  }, [])

  const handleTemplateSelect = (codigo) => {
    const template = templates.find((t) => t.codigo === codigo)
    setSelectedTemplate(template)

    // Initialize header data
    const initialHeader = {}
    template.headerFields?.forEach((field) => {
      initialHeader[field.label] = ""
    })
    setHeaderData(initialHeader)

    const initialCheckboxes = {}
    template.headerCheckboxes?.forEach((checkbox) => {
      initialCheckboxes[checkbox.label] = ""
    })
    setHeaderCheckboxData(initialCheckboxes)

    // Initialize table with one empty row
    const initialRow = {}
    template.tableColumns?.forEach((col) => {
      initialRow[col.label] = ""
    })
    setTableRows([initialRow])

    const initialSections = {}
    template.secondarySections?.forEach((section, index) => {
      if (section.type === "table" || section.type === "materials" || section.type === "subproducts") {
        const initialRows = []
        for (let i = 0; i < (section.rows || 1); i++) {
          const row = {}
          section.columns?.forEach((col) => {
            row[col.label] = ""
          })
          initialRows.push(row)
        }
        initialSections[index] = initialRows
      } else if (section.type === "personnel") {
        initialSections[index] = { fileteadores: "", personalPlanta: "" }
      } else if (section.type === "observations") {
        initialSections[index] = ""
      } else if (section.type === "rejection") {
        initialSections[index] = { seRechazo: false, razon: "" }
      }
    })
    setSecondarySectionsData(initialSections)

    // Initialize firmas
    const initialFirmas = {}
    template.firmas?.forEach((firma) => {
      initialFirmas[firma.puesto] = { nombre: "", fecha: "" }
    })
    setFirmasData(initialFirmas)

    setObservaciones("")
  }

  const handleHeaderChange = (label, value) => {
    setHeaderData((prev) => ({ ...prev, [label]: value }))
  }

  const handleCheckboxChange = (label, value) => {
    setHeaderCheckboxData((prev) => ({ ...prev, [label]: value }))
  }

  const handleTableChange = (rowIndex, columnLabel, value) => {
    setTableRows((prev) => prev.map((row, i) => (i === rowIndex ? { ...row, [columnLabel]: value } : row)))
  }

  const addTableRow = () => {
    const newRow = {}
    selectedTemplate.tableColumns?.forEach((col) => {
      newRow[col.label] = ""
    })
    setTableRows((prev) => [...prev, newRow])
  }

  const removeTableRow = (index) => {
    if (tableRows.length > 1) {
      setTableRows((prev) => prev.filter((_, i) => i !== index))
    }
  }

  const handleSecondarySectionChange = (sectionIndex, rowIndex, columnLabel, value) => {
    setSecondarySectionsData((prev) => ({
      ...prev,
      [sectionIndex]: prev[sectionIndex].map((row, i) => (i === rowIndex ? { ...row, [columnLabel]: value } : row)),
    }))
  }

  const addSecondarySectionRow = (sectionIndex) => {
    const section = selectedTemplate.secondarySections[sectionIndex]
    const newRow = {}
    section.columns?.forEach((col) => {
      newRow[col.label] = ""
    })
    setSecondarySectionsData((prev) => ({
      ...prev,
      [sectionIndex]: [...prev[sectionIndex], newRow],
    }))
  }

  const removeSecondarySectionRow = (sectionIndex, rowIndex) => {
    setSecondarySectionsData((prev) => ({
      ...prev,
      [sectionIndex]: prev[sectionIndex].filter((_, i) => i !== rowIndex),
    }))
  }

  const handlePersonnelChange = (sectionIndex, field, value) => {
    setSecondarySectionsData((prev) => ({
      ...prev,
      [sectionIndex]: { ...prev[sectionIndex], [field]: value },
    }))
  }

  const handleObservationChange = (sectionIndex, value) => {
    setSecondarySectionsData((prev) => ({
      ...prev,
      [sectionIndex]: value,
    }))
  }

  const handleRejectionChange = (sectionIndex, field, value) => {
    setSecondarySectionsData((prev) => ({
      ...prev,
      [sectionIndex]: { ...prev[sectionIndex], [field]: value },
    }))
  }

  const handleFirmaChange = (puesto, field, value) => {
    setFirmasData((prev) => ({
      ...prev,
      [puesto]: { ...prev[puesto], [field]: value },
    }))
  }

  const renderField = (field, value, onChange) => {
    const commonProps = {
      value: value || "",
      onChange: (e) => onChange(e.target.value),
      required: field.required,
    }

    switch (field.type) {
      case "textarea":
        return <textarea {...commonProps} rows="3" />
      case "select":
        return (
          <select {...commonProps}>
            <option value="">Seleccionar...</option>
            {field.options?.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
        )
      case "date":
        return <input type="date" {...commonProps} />
      case "time":
        return <input type="time" {...commonProps} />
      case "datetime":
        return <input type="datetime-local" {...commonProps} />
      case "number":
      case "temperature":
        return <input type="number" step="0.01" {...commonProps} />
      default:
        return <input type="text" {...commonProps} />
    }
  }

  const handleSaveForm = () => {
    // Validate required fields
    const missingFields = []

    selectedTemplate.headerFields?.forEach((field) => {
      if (field.required && !headerData[field.label]) {
        missingFields.push(field.label)
      }
    })

    if (missingFields.length > 0) {
      alert(`Por favor completa los siguientes campos requeridos: ${missingFields.join(", ")}`)
      return
    }

    const formData = {
      templateCodigo: selectedTemplate.codigo,
      templateNombre: selectedTemplate.nombre,
      headerData,
      headerCheckboxData,
      tableRows,
      secondarySectionsData,
      firmasData,
      observaciones,
      createdAt: new Date().toISOString(),
    }

    const forms = JSON.parse(localStorage.getItem("filledForms") || "[]")
    forms.push(formData)
    localStorage.setItem("filledForms", JSON.stringify(forms))

    setShowSuccess(true)
    setTimeout(() => {
      setShowSuccess(false)
      setSelectedTemplate(null)
    }, 2000)
  }

  if (!selectedTemplate) {
    return (
      <div className="fill-form">
        <h1>Llenar Formulario</h1>

        {templates.length === 0 ? (
          <div className="empty-state-card">
            <p>No hay plantillas disponibles. Crea una plantilla primero.</p>
          </div>
        ) : (
          <div className="template-selection">
            <h2>Selecciona una plantilla:</h2>
            <div className="templates-grid">
              {templates.map((template) => (
                <div
                  key={template.codigo}
                  className="template-card"
                  onClick={() => handleTemplateSelect(template.codigo)}
                >
                  <div className="template-code">{template.codigo}</div>
                  <h3>{template.nombre}</h3>
                  {template.proceso && <p className="template-meta">Proceso: {template.proceso}</p>}
                  {template.quienLoLlena && <p className="template-meta">Responsable: {template.quienLoLlena}</p>}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="fill-form">
      <div className="form-header-bar">
        <button onClick={() => setSelectedTemplate(null)} className="btn-back">
          ← Volver
        </button>
        <h1>{selectedTemplate.nombre}</h1>
        <button onClick={handleSaveForm} className="btn-primary">
          💾 Guardar Formulario
        </button>
      </div>

      {showSuccess && <div className="success-message">✅ Formulario guardado exitosamente</div>}

      <div className="form-document">
        <FormHeader
          title={selectedTemplate.nombre}
          code={selectedTemplate.codigo}
          version={selectedTemplate.version || "1"}
          date={new Date().toLocaleDateString("es-EC")}
        />

        {selectedTemplate.headerCheckboxes && selectedTemplate.headerCheckboxes.length > 0 && (
          <div className="checkbox-section">
            {selectedTemplate.headerCheckboxes.map((checkbox, index) => (
              <div key={index} className="checkbox-group-inline">
                <label className="checkbox-label-main">{checkbox.label}:</label>
                <div className="checkbox-options">
                  {checkbox.options?.map((option) => (
                    <label key={option} className="checkbox-option">
                      <input
                        type="radio"
                        name={`checkbox-${index}`}
                        value={option}
                        checked={headerCheckboxData[checkbox.label] === option}
                        onChange={(e) => handleCheckboxChange(checkbox.label, e.target.value)}
                      />
                      <span className="checkbox-box">☐</span>
                      {option}
                    </label>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {selectedTemplate.headerFields && selectedTemplate.headerFields.length > 0 && (
          <div className="header-section">
            <h3>Información General</h3>
            <div className="header-grid">
              {selectedTemplate.headerFields.map((field, index) => (
                <div key={index} className="form-field">
                  <label>
                    {field.label}
                    {field.required && <span className="required">*</span>}
                  </label>
                  {renderField(field, headerData[field.label], (value) => handleHeaderChange(field.label, value))}
                </div>
              ))}
            </div>
          </div>
        )}

        {selectedTemplate.tableColumns && selectedTemplate.tableColumns.length > 0 && (
          <div className="table-section">
            <div className="table-header">
              <h3>Registro de Datos</h3>
              <button onClick={addTableRow} className="btn-add-row">
                + Agregar Fila
              </button>
            </div>

            <div className="table-wrapper">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>#</th>
                    {selectedTemplate.tableColumns.map((col, index) => (
                      <th key={index}>
                        {col.label}
                        {col.required && <span className="required">*</span>}
                      </th>
                    ))}
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {tableRows.map((row, rowIndex) => (
                    <tr key={rowIndex}>
                      <td>{rowIndex + 1}</td>
                      {selectedTemplate.tableColumns.map((col, colIndex) => (
                        <td key={colIndex}>
                          {renderField(col, row[col.label], (value) => handleTableChange(rowIndex, col.label, value))}
                        </td>
                      ))}
                      <td>
                        <button
                          onClick={() => removeTableRow(rowIndex)}
                          className="btn-remove-row"
                          disabled={tableRows.length === 1}
                          title="Eliminar fila"
                        >
                          🗑️
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {selectedTemplate.secondarySections &&
          selectedTemplate.secondarySections.map((section, sectionIndex) => (
            <div key={sectionIndex} className="secondary-section">
              <h3>{section.title}</h3>

              {(section.type === "table" || section.type === "materials" || section.type === "subproducts") && (
                <>
                  <div className="table-header">
                    <button onClick={() => addSecondarySectionRow(sectionIndex)} className="btn-add-row">
                      + Agregar Fila
                    </button>
                  </div>
                  <div className="table-wrapper">
                    <table className="data-table secondary-table">
                      <thead>
                        <tr>
                          <th>#</th>
                          {section.columns?.map((col, colIndex) => (
                            <th key={colIndex}>{col.label}</th>
                          ))}
                          <th>Acciones</th>
                        </tr>
                      </thead>
                      <tbody>
                        {secondarySectionsData[sectionIndex]?.map((row, rowIndex) => (
                          <tr key={rowIndex}>
                            <td>{rowIndex + 1}</td>
                            {section.columns?.map((col, colIndex) => (
                              <td key={colIndex}>
                                {renderField(col, row[col.label], (value) =>
                                  handleSecondarySectionChange(sectionIndex, rowIndex, col.label, value),
                                )}
                              </td>
                            ))}
                            <td>
                              <button
                                onClick={() => removeSecondarySectionRow(sectionIndex, rowIndex)}
                                className="btn-remove-row"
                                title="Eliminar fila"
                              >
                                🗑️
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </>
              )}

              {section.type === "personnel" && (
                <div className="personnel-section">
                  <div className="form-field">
                    <label>Fileteadores:</label>
                    <input
                      type="number"
                      value={secondarySectionsData[sectionIndex]?.fileteadores || ""}
                      onChange={(e) => handlePersonnelChange(sectionIndex, "fileteadores", e.target.value)}
                      placeholder="Número de fileteadores"
                    />
                  </div>
                  <div className="form-field">
                    <label>Personal de Planta:</label>
                    <input
                      type="number"
                      value={secondarySectionsData[sectionIndex]?.personalPlanta || ""}
                      onChange={(e) => handlePersonnelChange(sectionIndex, "personalPlanta", e.target.value)}
                      placeholder="Número de personal"
                    />
                  </div>
                </div>
              )}

              {section.type === "observations" && (
                <div className="observations-section">
                  <textarea
                    value={secondarySectionsData[sectionIndex] || ""}
                    onChange={(e) => handleObservationChange(sectionIndex, e.target.value)}
                    placeholder="Escribe aquí las observaciones..."
                    rows="4"
                  />
                </div>
              )}

              {section.type === "rejection" && (
                <div className="rejection-section">
                  <div className="form-field">
                    <label className="checkbox-label">
                      <input
                        type="checkbox"
                        checked={secondarySectionsData[sectionIndex]?.seRechazo || false}
                        onChange={(e) => handleRejectionChange(sectionIndex, "seRechazo", e.target.checked)}
                      />
                      ¿Se rechazó producto?
                    </label>
                  </div>
                  {secondarySectionsData[sectionIndex]?.seRechazo && (
                    <div className="form-field">
                      <label>Razón del rechazo:</label>
                      <textarea
                        value={secondarySectionsData[sectionIndex]?.razon || ""}
                        onChange={(e) => handleRejectionChange(sectionIndex, "razon", e.target.value)}
                        placeholder="Describe la razón del rechazo..."
                        rows="3"
                      />
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}

        <div className="observations-section">
          <h3>Observaciones Generales</h3>
          <textarea
            value={observaciones}
            onChange={(e) => setObservaciones(e.target.value)}
            placeholder="Escribe aquí cualquier observación relevante..."
            rows="4"
          />
        </div>

        {selectedTemplate.firmas && selectedTemplate.firmas.length > 0 && (
          <div className="signatures-section">
            <h3>Firmas y Aprobaciones</h3>
            <div className="signatures-grid">
              {selectedTemplate.firmas.map((firma, index) => (
                <div key={index} className="signature-box">
                  <h4>{firma.puesto}</h4>
                  <div className="signature-fields">
                    <div className="form-field">
                      <label>Nombre:</label>
                      <input
                        type="text"
                        value={firmasData[firma.puesto]?.nombre || ""}
                        onChange={(e) => handleFirmaChange(firma.puesto, "nombre", e.target.value)}
                        placeholder="Nombre completo"
                      />
                    </div>
                    <div className="form-field">
                      <label>Fecha:</label>
                      <input
                        type="date"
                        value={firmasData[firma.puesto]?.fecha || ""}
                        onChange={(e) => handleFirmaChange(firma.puesto, "fecha", e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="signature-line">
                    <span>Firma: _______________________</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="form-actions-bottom">
          <button onClick={handleSaveForm} className="btn-primary btn-large">
            💾 Guardar Formulario Completo
          </button>
        </div>
      </div>
    </div>
  )
}

export default FillForm
