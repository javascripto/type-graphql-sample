import { gql, useQuery, ApolloProvider, useMutation } from "@apollo/client";

import { client } from "./lib/apollo";
import { User } from '../../backend/src/models/User';

export default function App() {
  return (
    <ApolloProvider client={client}>
      <Page />
    </ApolloProvider>
  )
}

const GET_USERS = gql`
  query {
    users {
      id
      name
    }
  }
` 

const CREATE_USER = gql`
  mutation createUser($name: String!) {
    createUser(name: $name) {
      id
      name
    }
  }
`

const DELETE_USER = gql`
  mutation deleteUser($id: String!) {
    deleteUser(id: $id)
  }
`

function Page() {
  const {data, loading, error} = useQuery<{ users: User[] }>(GET_USERS)
  const [deleteUser] = useMutation<any, { id: string }>(DELETE_USER)
  const [createUser] = useMutation<{ createUser: User}, { name: string }>(CREATE_USER)
  function newUser() {
    const name = prompt('Enter a name') ?? ''
    createUser({
      variables: { name },
      // refetchQueries: [GET_USERS],
      onError: (error) => alert(error.message),
      update(cache, { data }) {
        const users = cache.readQuery<{ users: User[] }>({ query: GET_USERS })?.users ?? []
        cache.writeQuery({
          query: GET_USERS,
          data: { users: [...users, data?.createUser] }
        })
      },
    })
  }
  function removeUser(event: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
    const id = event.currentTarget.dataset.id!
    if (confirm('Are you sure?'))
      deleteUser({ variables: { id }, refetchQueries: [GET_USERS] })
  }
  if (loading) return <p>Loading...</p>
  if (error) return <p>Error :(</p>
  return (
    <div>
      <h1>Users</h1>
      <button onClick={newUser}>Create user</button>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {data?.users.map(user => (
            <tr key={user.id}>
              <td>{user.id}</td>
              <td>{user.name}</td>
              <td>
                <button data-id={user.id} onClick={removeUser}>
                  remove
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
