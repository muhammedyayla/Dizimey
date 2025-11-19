import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import axios from "axios"
import { API_KEY, API_MOVIE_FIND_URL } from "../../constants/api"

const initialState = {
    movieDetail: {}
}

const LANGUAGE_TR = 'tr-TR'
const LANGUAGE_EN = 'en-US'

export const getMovieById = createAsyncThunk('getMovieById', async (id) => {
    const [trRes, enRes] = await Promise.all([
        axios.get(`${API_MOVIE_FIND_URL}/${id}?api_key=${API_KEY}&language=${LANGUAGE_TR}&append_to_response=credits,similar`),
        axios.get(`${API_MOVIE_FIND_URL}/${id}?api_key=${API_KEY}&language=${LANGUAGE_EN}&append_to_response=credits`)
    ])
    
    return {
        ...trRes.data,
        original_title: enRes.data.original_title || enRes.data.title,
        title: enRes.data.title,
        credits: {
            ...trRes.data.credits,
            crew: enRes.data.credits?.crew || trRes.data.credits?.crew
        }
    }
})

export const movieDetailSlice = createSlice({
    name: "movieDetail",
    initialState,
    reducers:  {
        // HTTP isteği yoksa burası kullanılır.
    },
    extraReducers: (builder) => {  // HTTP isteklerinde burası kullanılır.
        builder.addCase(getMovieById.fulfilled, (state, action) => {
            state.movieDetail = action.payload;
        })

    }
})

export const {} = movieDetailSlice.actions;  // Buraya sadece reducers içerisine yazılacak fonksiyonlar yazılır.
export default movieDetailSlice.reducer;  // Dışarıdan erişebilmek için.