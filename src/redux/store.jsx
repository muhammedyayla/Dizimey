import { configureStore } from "@reduxjs/toolkit";
import genreSliceReducer from './slices/genreSlice'
import movieListSliceReducer from './slices/movieListSlice'
import movieDetailSliceReducers from './slices/movieDetailSlice'
import tvDetailSliceReducer from './slices/tvDetailSlice'
import favoritesSliceReducers from "./slices/favoritesSlice";
import playerSliceReducer from './slices/playerSlice'
import uiSliceReducer from './slices/uiSlice'


export const store = configureStore({
    reducer: {
        genre: genreSliceReducer,
        movieList: movieListSliceReducer,
        movieDetail: movieDetailSliceReducers,
        tvDetail: tvDetailSliceReducer,
        favorite: favoritesSliceReducers,
        player: playerSliceReducer,
        ui: uiSliceReducer

    }
})