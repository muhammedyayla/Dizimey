import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import axios from "axios"
import { API_KEY, API_TV_FIND_URL } from "../../constants/api"

const initialState = {
    tvDetail: {}
}

const LANGUAGE_TR = 'tr-TR'
const LANGUAGE_EN = 'en-US'

export const getTvById = createAsyncThunk('getTvById', async (id) => {
    const [trRes, enRes] = await Promise.all([
        axios.get(`${API_TV_FIND_URL}/${id}?api_key=${API_KEY}&language=${LANGUAGE_TR}&append_to_response=credits,similar`),
        axios.get(`${API_TV_FIND_URL}/${id}?api_key=${API_KEY}&language=${LANGUAGE_EN}&append_to_response=credits,similar`)
    ])
    
    return {
        ...trRes.data,
        original_name: enRes.data.original_name || enRes.data.name,
        name: enRes.data.name,
        credits: {
            ...trRes.data.credits,
            crew: enRes.data.credits?.crew || trRes.data.credits?.crew
        },
        similar: {
            ...trRes.data.similar,
            results: (trRes.data.similar?.results || []).map((item, idx) => ({
                ...item,
                media_type: 'tv',
                original_name: enRes.data.similar?.results?.[idx]?.original_name || enRes.data.similar?.results?.[idx]?.name || item.original_name || item.name
            }))
        }
    }
})

export const getTvSeasonEpisodes = createAsyncThunk('getTvSeasonEpisodes', async ({ id, seasonNumber }) => {
    const res = await axios.get(`${API_TV_FIND_URL}/${id}/season/${seasonNumber}?api_key=${API_KEY}&language=${LANGUAGE_TR}`)
    return res.data
})

export const tvDetailSlice = createSlice({
    name: "tvDetail",
    initialState,
    reducers: {
        // HTTP isteği yoksa burası kullanılır.
    },
    extraReducers: (builder) => {
        builder.addCase(getTvById.fulfilled, (state, action) => {
            state.tvDetail = action.payload;
        })
    }
})

export const {} = tvDetailSlice.actions;
export default tvDetailSlice.reducer;

