import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api'

const getToken = () => localStorage.getItem('token')

// Get watchlist from database
export const fetchWatchlist = createAsyncThunk('watchlist/fetch', async (_, { rejectWithValue }) => {
  try {
    const token = getToken()
    if (!token) {
      return []
    }

    const res = await axios.get(`${API_BASE_URL}/watchlist`, {
      headers: { Authorization: `Bearer ${token}` }
    })

    if (res.data.success) {
      return res.data.watchlist
    }
    return []
  } catch (error) {
    console.error('Fetch watchlist error:', error)
    return rejectWithValue(error.message)
  }
})

// Add to watchlist
export const addToWatchlist = createAsyncThunk('watchlist/add', async (item, { rejectWithValue }) => {
  try {
    const token = getToken()
    if (!token) {
      throw new Error('Not authenticated')
    }

    const res = await axios.post(`${API_BASE_URL}/watchlist`, {
      tmdb_id: item.id,
      media_type: item.media_type || 'movie',
      title: item.title || item.name || item.original_title || item.original_name,
      poster_path: item.poster_path,
      vote_average: item.vote_average
    }, {
      headers: { Authorization: `Bearer ${token}` }
    })

    if (res.data.success) {
      return res.data.item
    }
    throw new Error('Failed to add to watchlist')
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || error.message)
  }
})

// Remove from watchlist
export const removeFromWatchlist = createAsyncThunk('watchlist/remove', async ({ tmdbId, mediaType }, { rejectWithValue }) => {
  try {
    const token = getToken()
    if (!token) {
      throw new Error('Not authenticated')
    }

    const res = await axios.delete(`${API_BASE_URL}/watchlist/${tmdbId}/${mediaType}`, {
      headers: { Authorization: `Bearer ${token}` }
    })

    if (res.data.success) {
      return { tmdbId, mediaType }
    }
    throw new Error('Failed to remove from watchlist')
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || error.message)
  }
})

const initialState = {
  items: [],
  loading: false,
  error: null
}

const watchlistSlice = createSlice({
  name: 'watchlist',
  initialState,
  reducers: {
    clearWatchlist: (state) => {
      state.items = []
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchWatchlist.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchWatchlist.fulfilled, (state, action) => {
        state.loading = false
        state.items = action.payload
      })
      .addCase(fetchWatchlist.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      .addCase(addToWatchlist.fulfilled, (state, action) => {
        state.items.push(action.payload)
      })
      .addCase(removeFromWatchlist.fulfilled, (state, action) => {
        state.items = state.items.filter(
          item => !(item.tmdb_id === action.payload.tmdbId && item.media_type === action.payload.mediaType)
        )
      })
  }
})

export const { clearWatchlist } = watchlistSlice.actions
export default watchlistSlice.reducer

