import { useEffect, useState } from "react";
import { type User } from "./interfaces/types";
import { UsersList } from "./components/UsersList";
import "./App.css";

function App() {
  const [users, setUsers] = useState<User[]>([]);
  const [showColors, setShowColors] = useState(false);
  const [sortByCountry, setSortByCountry] = useState(false);

  const toggleColor = () => {
    setShowColors(!showColors);
  };

  const toggleSortByCountry = () => {
    setSortByCountry(prevState => !prevState);
  };

  useEffect(() => {
    fetch("https://randomuser.me/api/?results=100")
      .then(async (res) => await res.json())
      .then((res) => {
        setUsers(res.results);
      })
      .catch((err) => console.log(err));
  }, []);

  const sortedUsers = sortByCountry 
  ? users.toSorted((a, b) => {
      return a.location!.country.localeCompare(b.location!.country);
    }) 
  : users

  return (
    <div className="app">
      <h1>Prueba Técnica - Filtrado de Usuarios</h1>
      <header>
        <button onClick={toggleColor}>Colorear filas</button>
        <button onClick={toggleSortByCountry}>
          {sortByCountry ? "No ordenar por país" : "Ordenar por país"}
        </button>
      </header>
      <main>
        <UsersList users={sortedUsers} showColors={showColors} />
      </main>
    </div>
  );
}

export default App;
