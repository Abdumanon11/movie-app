const FAVORITES_KEY = "favorites";

export function getFavorites() {
    return JSON.parse(localStorage.getItem(FAVORITES_KEY)) || [];
}
 export function addFavorite(movie){
    const favorites = getFavorites()
    favorites.push(movie)
   localStorage.setItem(FAVORITES_KEY,JSON.stringify(favorites))
 }

 export function isFavorite(movie) {
    const favorites = getFavorites();
    return favorites.some(favorite => favorite.id === movie.id)
    
 }

 export function removeFavorite(movie){
    const favorites = getFavorites();
    const newFavorites = favorites.filter(favorite => favorite.id !== movie.id)
    localStorage.setItem(FAVORITES_KEY,JSON.stringify(newFavorites))
}

