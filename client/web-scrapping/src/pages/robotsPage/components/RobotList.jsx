import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchRobots, deleteRobot } from "../../../features/robots/robotSlice";
import { Trash2, Globe, AlertCircle, Loader2, Calendar, Hash } from "lucide-react";
import RobotForm from "./RobotForm";
// Importamos el módulo de estilos
import styles from "../css/RobotList.module.css";

const RobotList = () => {
  const dispatch = useDispatch();
  const { items: robots, loading, error } = useSelector((state) => state.robots);

  useEffect(() => {
    dispatch(fetchRobots());
  }, [dispatch]);

  const handleDelete = (id) => {
    if (window.confirm("¿Estás seguro de que deseas eliminar este robot?")) {
      dispatch(deleteRobot(id));
    }
  };

  if (loading) {
    return (
      <div className={styles.stateContainer}>
        <Loader2 className={styles.loaderIcon} size={32} />
        <p className={styles.stateText}>Sincronizando base de datos...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.errorBanner}>
        <AlertCircle size={16} style={{ flexShrink: 0 }} />
        <span>Error de conexión: {error}</span>
      </div>
    );
  }

  return (
    <div className={styles.wrapper}>
      <div className={styles.formWrapper}>
        <RobotForm />
      </div>

      <div className={styles.tableCard}>
        <div className={styles.tableHeader}>
          <div className={styles.headerLeft}>
            <div className={styles.headerDot} />
            <span className={styles.headerTitle}>Extractores activos</span>
          </div>
          <span className={styles.headerCount}>
            {robots.length} {robots.length === 1 ? "robot" : "robots"}
          </span>
        </div>

        <div className={styles.divider} />

        <div className={styles.tableScroll}>
          <table className={styles.table}>
            <thead>
              <tr className={styles.theadRow}>
                <th className={styles.th} style={{ textAlign: "left" }}>Nombre del Robot</th>
                <th className={styles.th} style={{ textAlign: "left" }}>URL de Origen</th>
                <th className={styles.th} style={{ textAlign: "center" }}>Selectores</th>
                <th className={styles.th} style={{ textAlign: "center" }}>Frecuencia (Cron)</th>
                <th className={styles.th} style={{ textAlign: "right" }}>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {robots.length > 0 ? (
                robots.map((robot) => (
                  <tr key={robot.id} className={styles.robotRow}>
                    <td className={styles.td}>
                      <div className={styles.robotName}>{robot.name}</div>
                      <div className={styles.robotId}>
                        <span className={styles.idTag}>{robot.id.split("-")[0]}</span>
                      </div>
                    </td>

                    <td className={styles.td}>
                      <div className={styles.urlCell} title={robot.url}>
                        <Globe size={13} style={{ flexShrink: 0, opacity: 0.6 }} />
                        <span className={styles.urlText}>{robot.url}</span>
                      </div>
                    </td>

                    <td className={styles.td} style={{ textAlign: "center" }}>
                      <span className={styles.selectorBadge}>
                        <Hash size={11} />
                        {robot.selectors?.length || 0}
                      </span>
                    </td>

                    <td className={styles.td} style={{ textAlign: "center" }}>
                      {robot.cron_expression ? (
                        <span className={styles.cronBadge}>
                          <Calendar size={12} style={{ opacity: 0.7 }} />
                          {robot.cron_expression}
                        </span>
                      ) : (
                        <span className={styles.manualBadge}>Manual</span>
                      )}
                    </td>

                    <td className={styles.td} style={{ textAlign: "right" }}>
                      <button
                        className={styles.deleteButton}
                        onClick={() => handleDelete(robot.id)}
                        title="Eliminar permanentemente"
                      >
                        <Trash2 size={15} />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className={styles.emptyCell}>
                    <div className={styles.emptyState}>
                      <div className={styles.emptyIcon}>
                        <Globe size={22} style={{ opacity: 0.3 }} />
                      </div>
                      <p className={styles.emptyTitle}>No hay robots activos</p>
                      <p className={styles.emptySubtitle}>
                        Configura un nuevo extractor para comenzar a recolectar datos.
                      </p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default RobotList;