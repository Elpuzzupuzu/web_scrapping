import RobotList from "./pages/robotsPage/components/RobotList";
import { Cpu, Plus } from "lucide-react";
import "./App.css";

function App() {
  return (
    <div className="app-layout">
      <header className="navbar">
        <div className="logo-section">
          <Cpu className="logo-icon" size={28} />
          <h1>Scraping<span>Panel</span></h1>
        </div>
        <button className="btn-add-robot">
          <Plus size={20} />
          Nuevo Robot
        </button>
      </header>

      <main className="content">
        <div className="content-header">
          <h2>Tus Robots</h2>
          <p>Gestiona y monitorea tus tareas de extracción de datos.</p>
        </div>
        
        <RobotList />
      </main>
    </div>
  );
}

export default App;