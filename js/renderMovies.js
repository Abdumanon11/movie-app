 import {
    isFavorite,
    addFavorite,
    removeFavorite
} from "./favorites.js";
 export function renderMovies(movies,moviesGrid , openModal,onFavoriteChange = () => {}) {
    moviesGrid.innerHTML = "";
    if (movies.length === 0) {
        moviesGrid.innerHTML = `
            <div class="empty-state">
                <div class="empty-state-icon">😔</div>
                <h2>Фильм не найден</h2>
                <p>Попробуйте изменить запрос поиска</p>
            </div>
        `;
        return;
    }

    movies.forEach(movie => {
        const card = document.createElement("div");
        card.classList.add("movie-card");
        let poster = ""
        if(!movie.poster_path){
            poster = `<div class ="poster-placeholder">Постер отсутствует</div>`
        }else{
            poster = `<img src="https://image.tmdb.org/t/p/w500${movie.poster_path}"alt="${movie.title}">`
        }


                    card.innerHTML = `
                        ${poster}
                        <button class ="favorit"></button>
                        <div class="movie-info">
                        <h3>${getMovieTitle(movie)}</h3>
                        
                         <div class="movie-meta">
                         <span class ="reyting">⭐ ${movie.vote_average.toFixed(1)}</span>
                         <span>${getMovieYear(movie)}</span>
                         </div>
                        </div>
                    `;

         const cardFavorit = card.querySelector(".favorit")
         cardFavorit.addEventListener("click" , (event)=>{
             if (isFavorite(movie) === false) {
                 addFavorite(movie)
                 cardFavorit.classList.add("active")
                }else{
                    removeFavorite(movie)
                    cardFavorit.classList.remove("active")
                    onFavoriteChange()
                }
                event.stopPropagation()
            })
            
            if(isFavorite(movie) === true){
                cardFavorit.classList.add("active")
            }

        const span = card.querySelector(".reyting");
        getMovieRating(movie, span)
        moviesGrid.append(card);
        
        card.addEventListener("click", () => {
            openModal(movie);
        });
    });
    
};

function getMovieTitle(movie) {
    return movie.title;
}

function getMovieYear(movie) {
    if (!movie.release_date) {
        return "Дата неизвестна";
    } else {
        return movie.release_date.slice(0, 4);
    }
}
function getMovieRating(movie, span) {
    span.classList.remove(
        "green-reyting",
        "gold-reyting",
        "red-reyting"
    );

    const rating = Number(movie.vote_average.toFixed(1));

    if (rating >= 8) {
        span.classList.add("green-reyting");
    } else if (rating >= 5) {
        span.classList.add("gold-reyting");
    } else {
        span.classList.add("red-reyting");
    }
}