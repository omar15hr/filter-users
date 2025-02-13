import { useEffect, useMemo, useRef, useState } from "react";
import { type User } from "./interfaces/types";
import { UsersList } from "./components/UsersList";
import "./App.css";

function App() {
  const [users, setUsers] = useState<User[]>([]);
  const [showColors, setShowColors] = useState(false);
  const [sortByCountry, setSortByCountry] = useState(false);
  const originalUsers = useRef<User[]>([]);
  const [filterCountry, setFilterCountry] = useState<string | null>(null);

  const toggleColor = () => {
    setShowColors(!showColors);
  };

  const toggleSortByCountry = () => {
    setSortByCountry((prevState) => !prevState);
  };

  const handleDelete = (email: string) => {
    const filteredUsers = users.filter((user) => user.email !== email);
    setUsers(filteredUsers);
  };

  const handleReset = () => {
    setUsers(originalUsers.current);
  };

  useEffect(() => {
    fetch("https://randomuser.me/api/?results=100")
      .then(async (res) => await res.json())
      .then((res) => {
        setUsers(res.results);
        originalUsers.current = res.results;
      })
      .catch((err) => console.log(err));
  }, []);

  

  const filteredUsers = useMemo(() => {
    console.log('filterCountry')
    return filterCountry != null && filterCountry.length > 0
      ? users.filter((user) => {
          return user
            .location!.country.toLowerCase()
            .includes(filterCountry.toLowerCase());
        })
      : users
      }, [users, filterCountry]);

  const sortedUsers = useMemo(() => {
    console.log('sortByCountry');
    return sortByCountry
      ? filteredUsers.toSorted((a, b) => {
          return a.location!.country.localeCompare(b.location!.country);
        })
      : filteredUsers;
  }, [filteredUsers, sortByCountry]);

  return (
    <div className="app">
      <h1>Prueba Técnica - Filtrado de Usuarios</h1>
      <header>
        <button onClick={toggleColor}>Colorear filas</button>
        <button onClick={toggleSortByCountry}>
          {sortByCountry ? "No ordenar por país" : "Ordenar por país"}
        </button>
        <button onClick={handleReset}>Resetear Estado</button>
        <input
          type="text"
          placeholder="Filtrar por país"
          onChange={(e) => {
            setFilterCountry(e.target.value);
          }}
        />
      </header>
      <main>
        <UsersList
          users={sortedUsers}
          showColors={showColors}
          handleDelete={handleDelete}
        />
      </main>
    </div>
  );
}

export default App;
