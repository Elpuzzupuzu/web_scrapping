import { X, CheckCircle2 } from "lucide-react";
import styles from "../css/ExecutionModal.module.css";

const ExecutionModal = ({ results, onClose }) => {
  if (!results) return null;

  // ✅ Función para detectar imagen
  const isImageUrl = (url) => {
    return (
      typeof url === "string" &&
      (url.match(/\.(jpeg|jpg|gif|png|webp)$/i) ||
        url.includes("media-amazon.com"))
    );
  };

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
              {results.map((item, index) => {
                const imageUrl = item?.value?.url;

                return (
                  <tr key={index}>
                    <td className={styles.fieldName}>
                      {item.field_name}
                    </td>

                    <td className={styles.fieldValue}>
                      {isImageUrl(imageUrl) ? (
                        <div className={styles.imageContainer}>
                          <img
                            src={imageUrl}
                            alt={item.field_name}
                            className={styles.previewImage}
                            style={{
                              maxWidth: "100px",
                              borderRadius: "4px",
                            }}
                          />
                        </div>
                      ) : (
                        item.value?.titulo
                      )}

                      {imageUrl && !isImageUrl(imageUrl) && (
                        <a
                          href={imageUrl}
                          target="_blank"
                          rel="noreferrer"
                          className={styles.link}
                        >
                          Ver enlace
                        </a>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div className={styles.footer}>
          <button onClick={onClose} className={styles.btnDone}>
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};

export default ExecutionModal;