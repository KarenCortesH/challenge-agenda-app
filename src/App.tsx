import '@fortawesome/fontawesome-free/css/all.min.css';
import Users from "./components/Users";
import TimeBlocks from "./components/TimeBlocks";
import Dashboard from "./pages/Dashboard";
function App() {
  return (
    // <div className="min-h-screen bg-gray-100 p-10 flex flex-col gap-6">
    //   <h1 className="text-3xl font-bold text-center text-gray-800">Sistema de Agendamiento</h1>
    //   <div className="grid grid-cols-2 gap-6">
    //     <Users />
    //     <TimeBlocks />
    //   </div>
    // </div>
    <div className="min-h-screen bg-gray-100 p-10 flex flex-col gap-6">
    <Dashboard />
  </div>
  );
}

export default App;
