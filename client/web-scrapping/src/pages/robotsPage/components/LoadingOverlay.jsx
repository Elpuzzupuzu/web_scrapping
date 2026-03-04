import { Loader2 } from "lucide-react";
import styles from "../css/LoadingOverlay.module.css";

const LoadingOverlay = ({ message = "Ejecutando extracción de datos..." }) => {
  return (
    <div className={styles.overlay}>
      <div className={styles.container}>
        <div className={styles.loaderWrapper}>
          <Loader2 className={styles.spinner} size={42} />
        </div>
        <div className={styles.textWrapper}>
          <p className={styles.mainText}>{message}</p>
          <p className={styles.subText}>Analizando selectores en el sitio de destino</p>
        </div>
        <div className={styles.progressTrack}>
          <div className={styles.progressFill} />
        </div>
      </div>
    </div>
  );
};

export default LoadingOverlay;