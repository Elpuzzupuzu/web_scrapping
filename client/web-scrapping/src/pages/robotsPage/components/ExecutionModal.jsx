import { X, CheckCircle2 } from "lucide-react";
// import styles from "../css/ExecutionModal.module.css";

const ExecutionModal = ({ results, onClose }) => {
  if (!results) return null;

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <div className={styles.header}>
          <div className={styles.titleGroup}>
            <CheckCircle2 size={20} color="#10b981" />
            <h3>Resultados de Extracción</h3>
          </div>
          <button onClick={onClose} className={styles.btnClose}>
            <X size={18} />
          </button>
        </div>

        <div className={styles.content}>
          <table className={styles.resultsTable}>
            <thead>
              <tr>
                <th>Campo</th>
                <th>Valor Extraído</th>
              </tr>
            </thead>
            <tbody>
              {results.map((item, index) => (
                <tr key={index}>
                  <td className={styles.fieldName}>{item.field_name}</td>
                  <td className={styles.fieldValue}>
                    {item.value.titulo}
                    {item.value.url && (
                      <a href={item.value.url} target="_blank" rel="noreferrer" className={styles.link}>
                        Ver enlace
                      </a>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className={styles.footer}>
          <button onClick={onClose} className={styles.btnDone}>Cerrar</button>
        </div>
      </div>
    </div>
  );
};

export default ExecutionModal;