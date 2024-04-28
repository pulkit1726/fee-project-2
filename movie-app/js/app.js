const TMDB_API_KEY = 'd693aea0faebf856f7cfc6a27f185da8';
const TMDB_API_URL_POPULAR = 'https://api.themoviedb.org/3/movie/popular';
const TMDB_API_URL_SEARCH = 'https://api.themoviedb.org/3/search/movie';
const TMDB_API_URL_MOVIE_DETAILS = 'https://api.themoviedb.org/3/movie/';

getMovies(TMDB_API_URL_POPULAR);

async function getMovies(url) {
    const response = await fetch(url + `?api_key=${TMDB_API_KEY}`);
    const responseData = await response.json();
    showMovies(responseData.results);
}

function getClassByRate(vote){
    if(vote >= 7){
        return 'green';
    } else if (vote > 5) {
        return 'orange';
    } else {
        return 'red';
    }
}

function showMovies(data) {
    const movies = document.querySelector('.movies');
    movies.innerHTML = '';

    data.forEach((movie) => {
        const movieEl = document.createElement('div');
        movieEl.classList.add('movie');
        movieEl.innerHTML = `
        <div class="movie__cover-inner">
            <img src="https://image.tmdb.org/t/p/w500/${movie.poster_path}" alt="${movie.title}" class="movie__cover">
            <div class="movie__cover--darkened"></div>
        </div>
        <div class="movie__info">
            <div class="movie__title">${movie.title}</div>
            <div class="movie__average movie__average--${getClassByRate(movie.vote_average)}">${movie.vote_average}</div>
        </div>
        `;

        movieEl.addEventListener('click', () => openModal(movie.id));

        movies.appendChild(movieEl);
    });
}

const form = document.querySelector('form');
const search = document.querySelector('.header__search');
const btn = document.querySelector('.header__btn');

btn.addEventListener('click', (e) => {
    e.preventDefault();

    const apiSearchUrl = `${TMDB_API_URL_SEARCH}?api_key=${TMDB_API_KEY}&query=${search.value}`;
    if(search.value) {
        getMovies(apiSearchUrl);

        search.value = '';
    }
});

// Modal
let modalEl = document.querySelector('.modal');

async function openModal(id) {
    const response = await fetch(TMDB_API_URL_MOVIE_DETAILS + `${id}?api_key=${TMDB_API_KEY}`);
    const responseData = await response.json();

    modalEl.classList.add('modal--show');
    document.body.classList.add('stop-scrolling');

    modalEl.innerHTML = `
    <div class="modal__card">
        <img src="https://image.tmdb.org/t/p/w500/${responseData.poster_path}" alt="" class="modal__movie-backdrop">
        <h2>
            <span class="modal__movie-title">Title: ${responseData.title}</span>
            <span class="modal__movie-release-year">Release Year: ${responseData.release_date.substring(0, 4)}</span>
        </h2>
        <ul class="modal__movie-info">
            <li class="modal__movie-runtime">Runtime: ${responseData.runtime} minutes</li>
            <li class="modal__movie-overview">Overview: ${responseData.overview}</li>
        </ul>
        <button type="button" class="modal__button-close">Close</button>
    </div>
    `;

    const btnClose = document.querySelector('.modal__button-close');
    btnClose.addEventListener('click', () => closeModal());
}

function closeModal() {
    modalEl.classList.remove('modal--show');
    document.body.classList.remove('stop-scrolling');
}

window.addEventListener('click', (e) => {
    if(e.target === modalEl) {
        closeModal();
    }
});

window.addEventListener('keydown', (e) => {
    if(e.keyCode === 27){
        closeModal();
    }
});
