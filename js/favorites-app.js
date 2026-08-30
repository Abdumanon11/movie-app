import { getFavorites } from "./favorites.js";
import { renderMovies } from "./renderMovies.js";
import { openModal } from "./modal.js";

const moviesGrid = document.querySelector(".movies-grid");
 export function showFavorites() {

    const favorites = getFavorites();
    if (favorites.length === 0) {
        moviesGrid.innerHTML = `
            <div class="empty-state">
                <div class="empty-state-icon">❤️</div>
                <h2>Избранное пусто</h2>
                <p>Добавьте фильмы в избранное, чтобы увидеть их здесь</p>
            </div>
        `;
    } else {
        renderMovies(favorites, moviesGrid, openModal ,showFavorites);
    }
}
showFavorites()

