export const fetchUsers = async ({ pageParam = 1 }: { pageParam: number }) => {
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