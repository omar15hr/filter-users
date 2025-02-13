import { SortBy, User } from "../interfaces/types";

interface UsersListProps {
  users: User[];
  showColors: boolean;
  handleDelete: (email: string) => void;
  changeSorting: (sort: SortBy) => void;
}

export function UsersList({ users, showColors, handleDelete, changeSorting }: UsersListProps) {
  return (
    <table width="100%">
      <thead>
        <tr>
          <th>Foto</th>
          <th className="pointer" onClick={() => changeSorting(SortBy.NAME)}>Nombre</th>
          <th className="pointer" onClick={() => changeSorting(SortBy.LAST)}>Apellido</th>
          <th className="pointer" onClick={() => changeSorting(SortBy.COUNTRY)}>País</th>
          <th>Acciones</th>
        </tr>
      </thead>
      <tbody>
        {users.map((user, index) => {
          const backgroundColor = index % 2 === 0 ? "#333" : "#555";
          const color = showColors ? backgroundColor : "";
          return (
            <tr key={user.email} style={{ backgroundColor: color }}>
              <td>
                <img src={user.picture?.thumbnail} alt={user.name?.first} />
              </td>
              <td>{user.name?.first}</td>
              <td>{user.name?.last}</td>
              <td>{user.location?.country}</td>
              <td>
                <button onClick={() => handleDelete(user.email!)}>Borrar</button>
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}
