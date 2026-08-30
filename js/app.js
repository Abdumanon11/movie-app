import { renderMovies } from "./renderMovies.js";
import { openModal } from "./modal.js";

const searchInput = document.querySelector(".search-box input");
const searchError = document.querySelector(".search-error");
const genreFilter = document.querySelector("#genre-filter")
const sortFilter = document.querySelector("#sort-filter")
const loadMoreBtn = document.querySelector(".load-more-btn")

const moviesGrid = document.querySelector(".movies-grid");
const loader = document.querySelector(".loader");

const API_KEY = "25e1ae71bc6bfa03944d676483b77bd0";
const BASE_URL = "https://api.themoviedb.org/3";

async function getMoviesByGenre(genreId) {
    const url = `${BASE_URL}/discover/movie?api_key=${API_KEY}&language=ru-RU&with_genres=${genreId}&page=${page}`;
    loader.classList.remove("hidden");
    try {
        const response = await fetch(url)
        const data = await response.json();
        if (page === 1) {
            movies = data.results;
        } else {
            movies.push(...data.results);
        }
        renderMovies(movies, moviesGrid, openModal);
        page++;


    } catch (err) {
        console.error(err);
        searchError.textContent = "Не удалось загрузить фильмы. Попробуйте ещё раз."
    } finally {
        loader.classList.add("hidden")

    }

}


async function getGenres() {
    const url = `${BASE_URL}/genre/movie/list?api_key=${API_KEY}&language=ru-RU`;

    try {
        const response = await fetch(url);
        const data = await response.json();

        const option = document.createElement("option")
        option.textContent = "Все фильмы"
        option.value = "all"
        genreFilter.appendChild(option)

        data.genres.forEach((genre) => {
            const option = document.createElement("option")
            option.textContent = genre.name;
            option.value = genre.id
            genreFilter.appendChild(option)
        });

        genreFilter.addEventListener("change", (event) => {
            const value = event.target.value;

            if (value === "all") {
                page = 1;
                selectedGenre = null;
                getMovies();
                return;
            }

            const genreId = Number(value);
            selectedGenre = genreId
            page = 1;
            getMoviesByGenre(genreId)

        });


    } catch (err) {
        console.error(err);
    }
}
getGenres()

sortFilter.addEventListener("change", (event) => {
    const value = event.target.value
    if (value === "all") {
        page = 1;
        getMovies()
        return;
    }
    if (value === "rating-desc") {
        movies.sort((a, b) => {
            return b.vote_average - a.vote_average

        })
    }
    if (value === "rating-asc") {
        movies.sort((a, b) => {
            return a.vote_average - b.vote_average
        })
    }
    if (value === "title-asc") {
        movies.sort((a, b) => {
            return a.title.localeCompare(b.title)
        })
    }
    if (value === "title-desc") {
        movies.sort((a, b) => {
            return b.title.localeCompare(a.title)
        })
    }
    renderMovies(movies, moviesGrid, openModal, () => { });

})




let page = 1
let timeout;
let movies = [];
let selectedGenre = null;
let searchQuery = null;

async function getMovies() {
    loader.classList.remove("hidden");

    const url = `${BASE_URL}/movie/popular?api_key=${API_KEY}&language=ru-RU&page=${page}`;

    try {
        const response = await fetch(url);
        const data = await response.json();
        if (page === 1) {
            movies = data.results;
        } else {
            movies.push(...data.results);
        }
        page++;

        renderMovies(movies, moviesGrid, openModal, () => { });
    } catch (err) {
        console.error(err);
    } finally {
        loader.classList.add("hidden");
    }
}

loadMoreBtn.addEventListener("click", () => {
    if (searchQuery !== null) {
        searchMovies(searchQuery)
    } else if (selectedGenre !== null) {
        getMoviesByGenre(selectedGenre)
    } else {
        getMovies()
    }
})

async function searchMovies(query) {
    loader.classList.remove("hidden");
    searchQuery = query;
    const url = `${BASE_URL}/search/movie?api_key=${API_KEY}&language=ru-RU&query=${query}&page=${page}`;
    try {
        const response = await fetch(url);

        if (!response.ok) {
            throw new Error("Не удалось загрузить");
        }

        const data = await response.json();
        if (page === 1) {
            movies = data.results;
        } else {
            movies.push(...data.results);
        }
        page++;
        renderMovies(movies, moviesGrid, openModal, () => { });

    } catch (err) {
        console.error(err);

        searchError.textContent =
            "Не удалось выполнить поиск. Попробуйте ещё раз.";

    } finally {
        loader.classList.add("hidden");
    }
}

searchInput.addEventListener("input", () => {
    const query = searchInput.value.trim();

    if (query === "") {
        page = 1;
        searchQuery = null
        getMovies();
        return;
    }

    clearTimeout(timeout);
    page = 1;
    timeout = setTimeout(() => {
        searchMovies(query);
    }, 400);
});

searchInput.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
        const query = searchInput.value.trim();

        if (query === "") {
            return;
        }

        clearTimeout(timeout);
        page = 1;
        searchMovies(query);
    }
});

getMovies();