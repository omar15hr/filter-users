import { useMemo, useState } from "react";
import { SortBy, type User } from "./interfaces/types";
import { UsersList } from "./components/UsersList";
import "./App.css";
import { useUsers } from "./hooks/useUsers";

function App() {
  const { isLoading, isError, users, refetch, fetchNextPage, hasNextPage } = useUsers();

  const [showColors, setShowColors] = useState(false);
  const [sorting, setSorting] = useState<SortBy>(SortBy.NONE);
  const [filterCountry, setFilterCountry] = useState<string | null>(null);

  const toggleColor = () => {
    setShowColors(!showColors);
  };

  const toggleSortByCountry = () => {
    const newSortingValue =
      sorting === SortBy.NONE ? SortBy.COUNTRY : SortBy.NONE;
    setSorting(newSortingValue);
  };

  const handleDelete = (email: string) => {
    const filteredUsers = users.filter((user) => user.email !== email);
    // setUsers(filteredUsers);
  };

  const handleReset = async () => {
    await refetch();
  };

  const handleChangeSort = (sort: SortBy) => {
    setSorting(sort);
  };

  const filteredUsers = useMemo(() => {
    return filterCountry != null && filterCountry.length > 0
      ? users.filter((user) => {
          return user
            .location!.country.toLowerCase()
            .includes(filterCountry.toLowerCase());
        })
      : users;
  }, [users, filterCountry]);

  const sortedUsers = useMemo(() => {
    if (sorting === SortBy.NONE) return filteredUsers;

    const compareProperties: Record<string, (user: User) => string> = {
      [SortBy.COUNTRY]: (user) => user.location!.country,
      [SortBy.NAME]: (user) => user.name!.first,
      [SortBy.LAST]: (user) => user.name!.last,
    };

    return filteredUsers.toSorted((a, b) => {
      const extractProperty = compareProperties[sorting];
      return extractProperty(a).localeCompare(extractProperty(b));
    });
  }, [filteredUsers, sorting]);

  return (
    <div className="app">
      <h1>Prueba Técnica - Filtrado de Usuarios</h1>
      <header>
        <button onClick={toggleColor}>Colorear filas</button>
        <button onClick={toggleSortByCountry}>
          {sorting === SortBy.COUNTRY
            ? "No ordenar por país"
            : "Ordenar por país"}
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
        {users.length > 0 && (
          <UsersList
            changeSorting={handleChangeSort}
            users={sortedUsers}
            showColors={showColors}
            handleDelete={handleDelete}
          />
        )}
        {isLoading && <strong>Cargando...</strong>}
        {isError && <p>Ha habido un error</p>}
        {!isLoading && !isError && users.length === 0 && (
          <p>No hay usuarios disponibles</p>
        )}

        {!isLoading && !isError && hasNextPage && (
          <button
            className="pagination-button"
            onClick={() => {
              fetchNextPage();
            }}
          >
            Cargar más resultados
          </button>
        )}
        {!hasNextPage && <p>No hay más resultados disponibles</p>}
      </main>
    </div>
  );
}

export default App;
