import { useEffect, useState } from "react";
import { type User } from "./interfaces/types";
import { UsersList } from "./components/UsersList";
import "./App.css";

function App() {
  const [users, setUsers] = useState<User[]>([]);
  const [showColors, setShowColors] = useState(false);

  const toggleColor = () => {
    setShowColors(!showColors);
  };

  useEffect(() => {
    fetch("https://randomuser.me/api/?results=100")
      .then(async (res) => await res.json())
      .then((res) => {
        setUsers(res.results);
      })
      .catch((err) => console.log(err));
  }, []);

  return (
    <div className="app">
      <h1>Prueba Técnica - Filtrado de Usuarios</h1>
      <header>
        <button onClick={toggleColor}>Colorear filas</button>
      </header>
      <main>
        <UsersList users={users} showColors={showColors} />
      </main>
    </div>
  );
}

export default App;
