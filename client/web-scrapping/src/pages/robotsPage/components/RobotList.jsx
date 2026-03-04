import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchRobots, deleteRobot } from "../../../features/robots/robotSlice";
import { executeRobot } from "../../../features/exucteRobots/executeRobotsSlice"; 
import { Trash2, Globe, AlertCircle, Loader2, Hash, Play } from "lucide-react";
import RobotForm from "./RobotForm";
import ExecutionModal from "./ExecutionModal"; 
import LoadingOverlay from "./LoadingOverlay"; // ✅ Importamos el nuevo loader
import styles from "../css/RobotList.module.css";

const RobotList = () => {
  const dispatch = useDispatch();
  
  const { items: robots, loading, error } = useSelector((state) => state.robots);
  const { executing } = useSelector((state) => state.executions);

  const [selectedResults, setSelectedResults] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // ✅ Determinamos si hay alguna ejecución activa para mostrar el overlay
  const isAnyExecuting = Object.values(executing).some((status) => status === true);

  useEffect(() => {
    dispatch(fetchRobots());
  }, [dispatch]);

  const handleDelete = (id) => {
    if (window.confirm("¿Estás seguro de que deseas eliminar este robot?")) {
      dispatch(deleteRobot(id));
    }
  };

  const handleExecute = async (id) => {
    try {
      const action = await dispatch(executeRobot(id)).unwrap();
      setSelectedResults(action.results);
      setIsModalOpen(true);
    } catch (err) {
      console.error("Fallo en la ejecución:", err);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedResults(null);
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
      {/* ✅ Loader de pantalla completa */}
      {isAnyExecuting && (
        <LoadingOverlay message="El robot está extrayendo información..." />
      )}

      <div className={styles.formWrapper}>
        <RobotForm />
      </div>

      <div className={styles.tableCard}>
        <div className={styles.tableScroll}>
          <table className={styles.table}>
            <thead>
              <tr className={styles.theadRow}>
                <th className={styles.th}>Nombre del Robot</th>
                <th className={styles.th}>URL de Origen</th>
                <th className={styles.th} style={{ textAlign: "center" }}>Selectores</th>
                <th className={styles.th} style={{ textAlign: "center" }}>Frecuencia</th>
                <th className={styles.th} style={{ textAlign: "right" }}>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {robots.map((robot) => {
                const isCurrentlyExecuting = executing[robot.id];
                
                return (
                  <tr key={robot.id} className={styles.robotRow}>
                    <td className={styles.td}>
                      <div className={styles.robotName}>{robot.name}</div>
                      <div className={styles.robotId}>
                        <span className={styles.idTag}>{robot.id.split("-")[0]}</span>
                      </div>
                    </td>

                    <td className={styles.td}>
                      <div className={styles.urlCell}>
                        <Globe size={13} style={{ opacity: 0.6 }} />
                        <span className={styles.urlText}>{robot.url}</span>
                      </div>
                    </td>

                    <td className={styles.td} style={{ textAlign: "center" }}>
                      <span className={styles.selectorBadge}>
                        <Hash size={11} /> {robot.selectors?.length || 0}
                      </span>
                    </td>

                    <td className={styles.td} style={{ textAlign: "center" }}>
                        {/* Lógica de cronBadge omitida */}
                    </td>

                    <td className={styles.td} style={{ textAlign: "right" }}>
                      <div className={styles.actionGroup}>
                        <button
                          className={styles.executeButton}
                          onClick={() => handleExecute(robot.id)}
                          disabled={isCurrentlyExecuting}
                          title="Ejecutar ahora"
                        >
                          {isCurrentlyExecuting ? (
                            <Loader2 className={styles.spin} size={15} />
                          ) : (
                            <Play size={15} fill="currentColor" />
                          )}
                        </button>

                        <button
                          className={styles.deleteButton}
                          onClick={() => handleDelete(robot.id)}
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && (
        <ExecutionModal 
          results={selectedResults} 
          onClose={closeModal} 
        />
      )}
    </div>
  );
};

export default RobotList;