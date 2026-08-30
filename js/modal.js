const boxModal = document.querySelector(".box-modal");
const modal = document.querySelector(".modal");
const modalTitle = document.querySelector(".modal-title");
const modalOverview = document.querySelector(".modal-overview");
const modalPoster = document.querySelector(".modal-poster");
const modalReleaseDate = document.querySelector(".modal-release-date");
const modalVoteAverage = document.querySelector(".modal-vote-average");
const closeBtn = modal.querySelector(".close-modal");
const modalGenres = document.querySelector(".modal-genres");
const modalRunTime = document.querySelector(".modal-runtime");
const modalSlogan = document.querySelector(".modal-slogan");
const loadingModal = document.querySelector(".modal-loading");
const modalBackdrop = document.querySelector(".modal-backdrop");
const modalCast = document.querySelector(".modal-cast");
const modalDirector = document.querySelector(".modal-director");

const API_KEY = "25e1ae71bc6bfa03944d676483b77bd0";
const BASE_URL = "https://api.themoviedb.org/3";

async function getMovieDetails(movieId) {
    try {
        const url = `${BASE_URL}/movie/${movieId}?api_key=${API_KEY}&language=ru-RU`;

        const response = await fetch(url);

        if (!response.ok) {
            throw new Error("Не удалось загрузить фильм");
        }

        const data = await response.json();

        return data;
    } catch (err) {
        console.error(err);
        return null;
    }
}
async function getMovieCredits(movieId) {
    try {
        const url = `${BASE_URL}/movie/${movieId}/credits?api_key=${API_KEY}&language=ru-RU`;

        const response = await fetch(url);

        if (!response.ok) {
            throw new Error("Не удалось загрузить актёров");
        }

        const data = await response.json();

        return data;
    } catch (err) {
        console.error(err);
        return null;
    }
}

function getMovieYear(movie) {
    if (!movie.release_date) {
        return "Дата неизвестна";
    }
    return movie.release_date.slice(0, 4);
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
export async function openModal(movie) {
    boxModal.classList.add("modal-on");

    modalBackdrop.style.backgroundImage = "";

    modalTitle.textContent = "";
    modalOverview.textContent = "";
    modalPoster.src = "";
    modalReleaseDate.textContent = "";
    modalVoteAverage.textContent = "";
    modalRunTime.textContent = "";
    modalGenres.textContent = "";
    modalSlogan.textContent = "";
    modalDirector.textContent = "";
    modalCast.innerHTML = "";

    loadingModal.classList.add("modal-loading-on");

    const details = await getMovieDetails(movie.id);
    const credits = await getMovieCredits(movie.id);

    if (details === null || credits === null) {
        closeModal();
        return;
    }

    const director = credits.crew.find(
        person => person.job === "Director"
    );

    if (director) {
        modalDirector.textContent = director.name;
    }

    const casts = credits.cast.slice(0, 4);

    casts.forEach(cast => {
        modalCast.insertAdjacentHTML(
            "beforeend",
            `
            <div class="actor-card">
                <img 
                    src="https://image.tmdb.org/t/p/w185${cast.profile_path}" 
                    alt=""
                >
                <p class="name-cast">${cast.name}</p>
                <span class="cast-character">${cast.character}</span>
            </div>
            `
        );
    });

    let overview = "";

    if (!details.overview) {
        overview = "Описание отсутствует";
    } else {
        overview = details.overview;
    }

    loadingModal.classList.remove("modal-loading-on");

    modalBackdrop.style.backgroundImage =
        `url("https://image.tmdb.org/t/p/w1280${details.backdrop_path}")`;

    modalTitle.textContent = details.title;
    modalSlogan.textContent = details.tagline;
    modalOverview.textContent = overview;

    modalPoster.src =
        `https://image.tmdb.org/t/p/w500${details.poster_path}`;

    modalReleaseDate.textContent =
        `Год: ${getMovieYear(details)}`;

    modalVoteAverage.textContent =
        `⭐ ${movie.vote_average.toFixed(1)}`;

    getMovieRating(movie, modalVoteAverage);

    const hours = Math.floor(details.runtime / 60);
    const minutes = Math.floor(details.runtime % 60);

    modalRunTime.textContent = `${hours}ч ${minutes} мин`;

    const genres = details.genres
        .map(genre => `<span>${genre.name}</span>`)
        .join("|");

    modalGenres.innerHTML = `Жанры: ${genres}`;
}

function closeModal() {
    boxModal.classList.remove("modal-on");
}

document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
        closeModal();
    }
});

closeBtn.addEventListener("click", () => {
    closeModal();
});

boxModal.addEventListener("click", (event) => {
    if (event.target === boxModal) {
        closeModal();
    }
});