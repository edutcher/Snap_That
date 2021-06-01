import { useHistory } from "react-router-dom";
import { favoritePhoto } from "../utils/API";

export default function usePhotoClicks(currentUser, changeUser) {
  const history = useHistory();
  return {
    handleGridClick: (e) => {
      const id = e.currentTarget.getAttribute("data-id");
      history.push(`/photo/${id}`);
    },
    handleNameClick: (e) => {
      e.stopPropagation();
      const id = e.currentTarget.getAttribute("data-id");
      history.push(`/profile/${id}`);
    },
    handleFavClick: async (e) => {
      e.stopPropagation();
      const id = e.currentTarget.getAttribute("data-id");
      if (!currentUser.username) return;
      if (currentUser.favorites) {
        if (currentUser.favorites.includes(id)) return;
      }
      e.currentTarget.style.setProperty("color", "rgba(255, 0, 160, 0.54)");
      const newFav = {
        photoId: id,
        userId: currentUser.userId,
      };
      if (currentUser.favorites) {
        changeUser({
          ...currentUser,
          favorites: [...currentUser.favorites, id],
        });
      } else {
        changeUser({
          ...currentUser,
          favorites: [id],
        });
      }
      await favoritePhoto(newFav);
    },
  };
}
