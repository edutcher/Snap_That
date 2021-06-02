import { createContext, useState, useEffect } from "react";
import { isLoggedIn, getNotifications } from "../utils/API";

const INITIAL_USER_STATE = {
  username: null,
  userId: null,
  isLoggedIn: false,
  isAdmin: false,
  notifications: null,
  favorites: null,
  avatar: null,
};

export const UserContext = createContext();

export function UserProvider(props) {
  const [currentUser, setCurrentUser] = useState(INITIAL_USER_STATE);
  const changeUser = (user) => setCurrentUser(user);

  useEffect(() => {
    const checkLoggedIn = async () => {
      try {
        let result = await isLoggedIn();
        if (result.status === 200) {
          const notes = await getNotifications(result.data._id);
          const newNotes = notes.data.notifications.filter(
            (note) => note.status === "unread"
          );
          console.log(result.data.avatar_url);
          setCurrentUser({
            username: result.data.username,
            userId: result.data._id,
            isAdmin: result.data.isAdmin,
            avatar: result.data.avatar_url,
            notifications: newNotes,
            favorites: result.data.favorites || [],
          });
        }
      } catch (error) {}
    };
    checkLoggedIn();
  }, []);

  return (
    <UserContext.Provider value={{ currentUser, changeUser }}>
      {props.children}
    </UserContext.Provider>
  );
}
