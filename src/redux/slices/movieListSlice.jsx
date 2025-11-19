import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import axios from 'axios'
import { API_KEY, API_MOVIE_LIST_URL, API_MOVIE_TOP_RATED_URL } from '../../constants/api'

const initialState = {
    movieList: [],
    topRatedMovies: []
}

const LANGUAGE_TR = 'tr-TR'
const LANGUAGE_EN = 'en-US'

const mergeMovieData = (trResults, enResults) => {
    const enMap = new Map(enResults.map(m => [m.id, m]))
    return trResults.map(trMovie => {
        const enMovie = enMap.get(trMovie.id)
        return {
            ...trMovie,
            original_title: enMovie?.original_title || trMovie.original_title || trMovie.title,
            original_name: enMovie?.original_name || trMovie.original_name || trMovie.name,
            title: enMovie?.title || trMovie.title,
            name: enMovie?.name || trMovie.name
        }
    })
}

export const getMovieList = createAsyncThunk('movies', async () => {
    const [trRes, enRes] = await Promise.all([
        axios.get(`${API_MOVIE_LIST_URL}?api_key=${API_KEY}&language=${LANGUAGE_TR}`),
        axios.get(`${API_MOVIE_LIST_URL}?api_key=${API_KEY}&language=${LANGUAGE_EN}`)
    ])
    return mergeMovieData(trRes.data.results, enRes.data.results)
})

export const getMovieListByGenre = createAsyncThunk('moviesByGenre', async (id) => {
    const [trRes, enRes] = await Promise.all([
        axios.get(`${API_MOVIE_LIST_URL}?api_key=${API_KEY}&language=${LANGUAGE_TR}&with_genres=${id}`),
        axios.get(`${API_MOVIE_LIST_URL}?api_key=${API_KEY}&language=${LANGUAGE_EN}&with_genres=${id}`)
    ])
    return mergeMovieData(trRes.data.results, enRes.data.results)
})

export const getTopRatedMovies = createAsyncThunk('topRatedMovies', async () => {
    const [trRes, enRes] = await Promise.all([
        axios.get(`${API_MOVIE_TOP_RATED_URL}?api_key=${API_KEY}&language=${LANGUAGE_TR}`),
        axios.get(`${API_MOVIE_TOP_RATED_URL}?api_key=${API_KEY}&language=${LANGUAGE_EN}`)
    ])
    return mergeMovieData(trRes.data.results, enRes.data.results)
})

export const movieListSlice = createSlice({
    name: "movieList",
    initialState,
    reducers: {
        //HTTP istekleri yoksa burası kullanılır. 
    },
    extraReducers: (builder) => {  // HTTP isteklerinde burası kullanılır.
        builder.addCase(getMovieList.fulfilled, (state, action) => {
            state.movieList = action.payload;
        })
        builder.addCase(getMovieListByGenre.fulfilled, (state, action) => {
            state.movieList = action.payload;
        })
        builder.addCase(getTopRatedMovies.fulfilled, (state, action) => {
            state.topRatedMovies = action.payload;
        })
    }
})

export const {} = movieListSlice.actions;  // Buraya sadece reducers içerisine yazılacak fonksiyonlar yazılır.
export default movieListSlice.reducer;  // Dışarıdan erişebilmek için.