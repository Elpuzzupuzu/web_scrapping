import { useState } from "react";
import { useDispatch } from "react-redux";
import { createRobot } from "../../../features/robots/robotSlice";
import { Plus, X, Save, LayoutGrid } from "lucide-react";
// Importación del módulo de estilos
import styles from "../css/RobotForm.module.css";

const RobotForm = ({ onClose }) => {
  const dispatch = useDispatch();

  const [formData, setFormData] = useState({
    name: "",
    url: "",
    cron_expression: "",
    selectors: [{ field_name: "", css_selector: "" }],
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSelectorChange = (index, e) => {
    const newSelectors = [...formData.selectors];
    newSelectors[index][e.target.name] = e.target.value;
    setFormData({ ...formData, selectors: newSelectors });
  };

  const addSelector = () => {
    setFormData({
      ...formData,
      selectors: [...formData.selectors, { field_name: "", css_selector: "" }],
    });
  };

  const removeSelector = (index) => {
    const newSelectors = formData.selectors.filter((_, i) => i !== index);
    setFormData({ ...formData, selectors: newSelectors });
  };

  // const handleSubmit = async (e) => {
  //   e.preventDefault();
  //   if (
  //     !formData.name ||
  //     !formData.url ||
  //     formData.selectors.some((s) => !s.field_name || !s.css_selector)
  //   ) {
  //     alert("Por favor, rellena todos los campos obligatorios");
  //     return;
  //   }
  //   try {
  //     await dispatch(createRobot(formData)).unwrap();
  //     alert("Robot creado con éxito");
  //     if (onClose) onClose();
  //   } catch (err) {
  //     console.error("Error al crear:", err);
  //   }
  // };

const handleSubmit = async (e) => {
    e.preventDefault();

    // LOG PARA DEPURACIÓN: Ver el estado exacto antes de validar
    console.group("🚀 Preparando envío de Robot");
    console.log("Datos generales:", { 
      name: formData.name, 
      url: formData.url, 
      cron: formData.cron_expression 
    });
    console.table(formData.selectors); // Muestra los selectores en una tabla limpia
    console.groupEnd();

    if (
      !formData.name ||
      !formData.url ||
      formData.selectors.some((s) => !s.field_name || !s.css_selector)
    ) {
      console.warn("⚠️ Validación fallida: Hay campos vacíos");
      alert("Por favor, rellena todos los campos obligatorios");
      return;
    }

    try {
      console.log("📡 Despachando acción createRobot...");
      await dispatch(createRobot(formData)).unwrap();
      alert("Robot creado con éxito");
      if (onClose) onClose();
    } catch (err) {
      console.error("❌ Error en la comunicación con el backend:", err);
    }
  };




  return (
    <div className={styles.card}>
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.headerLeft}>
          <div className={styles.headerDot} />
          <span className={styles.headerTitle}>Configurar nuevo extractor</span>
        </div>
        <div className={styles.headerIcon}>
          <LayoutGrid size={14} color="#475569" />
        </div>
      </div>

      <div className={styles.divider} />

      <form onSubmit={handleSubmit}>
        <div className={styles.body}>
          {/* Row: Nombre + URL */}
          <div className={styles.fieldRow}>
            <div className={styles.fieldGroup}>
              <label className={styles.label}>
                Nombre del robot
                <span className={styles.required}>*</span>
              </label>
              <input
                className={styles.input}
                name="name"
                placeholder="Ej. Extractor de Noticias"
                onChange={handleChange}
                required
              />
            </div>

            <div className={styles.fieldGroup}>
              <label className={styles.label}>
                URL de destino
                <span className={styles.required}>*</span>
              </label>
              <input
                className={`${styles.input} ${styles.inputMono}`}
                name="url"
                placeholder="https://ejemplo.com"
                onChange={handleChange}
                required
              />
            </div>

            <div className={`${styles.fieldGroup} ${styles.fieldGroupSmall}`}>
              <label className={styles.label}>
                Expresión Cron
                <span className={styles.optional}>opcional</span>
              </label>
              <input
                className={`${styles.input} ${styles.inputMono}`}
                name="cron_expression"
                placeholder="0 12 * * *"
                onChange={handleChange}
              />
            </div>
          </div>

          {/* Selectors Section */}
          <div className={styles.selectorsSection}>
            <div className={styles.selectorsSectionHeader}>
              <div className={styles.selectorsSectionLeft}>
                <span className={styles.sectionLabel}>Selectores CSS</span>
                <span className={styles.selectorCount}>
                  {formData.selectors.length}
                </span>
              </div>
              <button
                type="button"
                onClick={addSelector}
                className={styles.btnAdd}
              >
                <Plus size={13} />
                Añadir campo
              </button>
            </div>

            <div className={styles.selectorsList}>
              {formData.selectors.map((selector, index) => (
                <div
                  key={index}
                  className={styles.selectorRow}
                >
                  <div className={styles.rowIndex}>
                    {String(index + 1).padStart(2, "0")}
                  </div>

                  <input
                    className={styles.input}
                    name="field_name"
                    placeholder="Nombre del campo (ej. precio)"
                    value={selector.field_name}
                    onChange={(e) => handleSelectorChange(index, e)}
                    style={{ flex: 1 }} // Único estilo inline mantenido para layout dinámico
                  />

                  <input
                    className={`${styles.input} ${styles.inputMono}`}
                    name="css_selector"
                    placeholder=".selector-css"
                    value={selector.css_selector}
                    onChange={(e) => handleSelectorChange(index, e)}
                    style={{ flex: 1 }}
                  />

                  {formData.selectors.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeSelector(index)}
                      className={styles.btnRemove}
                      title="Eliminar selector"
                    >
                      <X size={13} />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className={styles.divider} />
        <div className={styles.footer}>
          <button type="submit" className={styles.btnSave}>
            <Save size={15} />
            Guardar robot
          </button>
        </div>
      </form>
    </div>
  );
};

export default RobotForm;