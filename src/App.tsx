import { useMemo, useState } from "react";
import { SortBy, type User } from "./interfaces/types";
import { UsersList } from "./components/UsersList";
import { useInfiniteQuery } from "@tanstack/react-query";
import "./App.css";

const fetchUsers = async ({ pageParam = 1 }: { pageParam: number}) => {
  return await fetch(
    `https://randomuser.me/api/?results=10&seed=omar&page=${pageParam}`
  )
    .then(async (res) => {
      if (!res.ok) throw new Error("Failed to fetch users");
      return await res.json();
    })
    .then(res => {
      const currentPage = Number(res.info.page) 
      const nextCursor = currentPage > 10 ? undefined : currentPage + 1
      return {
        users: res.results,
        nextCursor
      }
    })
};

function App() {
  const {
    isLoading,
    isError,
    data,
    refetch,
    fetchNextPage,
    hasNextPage
  } = useInfiniteQuery<{users:User[],nextCursor:number}>({
    queryKey: ['users'],
    queryFn: fetchUsers,
    initialPageParam: 1,
    getNextPageParam: (lastPage) => lastPage.nextCursor,
  })

  const users: User[] = data?.pages?.flatMap(page => page.users) ?? [];

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
            onClick={() =>{ fetchNextPage() }}
          >
            Cargar más resultados
          </button>
        )}
        {
          !hasNextPage && <p>No hay más resultados disponibles</p>
        }
      </main>
    </div>
  );
}

export default App;
