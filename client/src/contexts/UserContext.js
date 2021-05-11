import { createContext, useState, useEffect } from "react";
import { isLoggedIn } from "../utils/API";

const INITIAL_USER_STATE = {
  username: null,
  userId: null,
  isLoggedIn: false,
};

export const UserContext = createContext();

export function UserProvider(props) {
  const [currentUser, setCurrentUser] = useState(INITIAL_USER_STATE);
  const changeUser = (user) => setCurrentUser(user);

  useEffect(() => {
    const checkLoggedIn = async () => {
      let result = await isLoggedIn();
      if (result.status === 200) {
        setCurrentUser({
          username: result.data.username,
          userId: result.data._id,
        });
      }
    };
    checkLoggedIn();
  }, []);

  return (
    <UserContext.Provider value={{ currentUser, changeUser }}>
      {props.children}
    </UserContext.Provider>
  );
}
