import { createContext, useState } from "react";

const INITIAL_USER_STATE = {
  username: null,
  userId: null,
  isLoggedIn: false,
};

export const UserContext = createContext();

export function UserProvider(props) {
  const [currentUser, setCurrentUser] = useState(INITIAL_USER_STATE);
  const changeUser = (user) => setCurrentUser(user);

  return (
    <UserContext.Provider value={{ currentUser, changeUser }}>
      {props.children}
    </UserContext.Provider>
  );
}
