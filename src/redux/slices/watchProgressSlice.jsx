import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api'

const getToken = () => localStorage.getItem('token')

// Get watch progress from database
export const fetchWatchProgress = createAsyncThunk('watchProgress/fetch', async (_, { rejectWithValue }) => {
  try {
    const token = getToken()
    if (!token) {
      return []
    }

    const res = await axios.get(`${API_BASE_URL}/watch-progress`, {
      headers: { Authorization: `Bearer ${token}` }
    })

    if (res.data.success) {
      return res.data.progress
    }
    return []
  } catch (error) {
    console.error('Fetch watch progress error:', error)
    return rejectWithValue(error.message)
  }
})

// Update watch progress
export const updateWatchProgress = createAsyncThunk('watchProgress/update', async (data, { rejectWithValue }) => {
  try {
    const token = getToken()
    if (!token) {
      throw new Error('Not authenticated')
    }

    const res = await axios.post(`${API_BASE_URL}/watch-progress`, {
      tmdb_id: data.tmdbId,
      media_type: data.mediaType,
      title: data.title,
      poster_path: data.posterPath || null,
      backdrop_path: data.backdropPath || null,
      progress_percent: data.progressPercent || 0,
      current_time: data.currentTime || 0,
      total_duration: data.totalDuration || 0,
      season_number: data.seasonNumber || null,
      episode_number: data.episodeNumber || null
    }, {
      headers: { Authorization: `Bearer ${token}` }
    })

    if (res.data.success) {
      return res.data.progress
    }
    throw new Error('Failed to update watch progress')
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || error.message)
  }
})

// Delete watch progress
export const deleteWatchProgress = createAsyncThunk('watchProgress/delete', async ({ tmdbId, mediaType, seasonNumber, episodeNumber }, { rejectWithValue }) => {
  try {
    const token = getToken()
    if (!token) {
      throw new Error('Not authenticated')
    }

    let url = `${API_BASE_URL}/watch-progress/${tmdbId}/${mediaType}`
    const params = new URLSearchParams()
    if (seasonNumber !== null && seasonNumber !== undefined) params.append('season', seasonNumber)
    if (episodeNumber !== null && episodeNumber !== undefined) params.append('episode', episodeNumber)
    if (params.toString()) url += `?${params.toString()}`

    const res = await axios.delete(url, {
      headers: { Authorization: `Bearer ${token}` }
    })

    if (res.data.success) {
      return { tmdbId, mediaType, seasonNumber, episodeNumber }
    }
    throw new Error('Failed to delete watch progress')
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || error.message)
  }
})

const initialState = {
  items: [],
  loading: false,
  error: null
}

const watchProgressSlice = createSlice({
  name: 'watchProgress',
  initialState,
  reducers: {
    clearWatchProgress: (state) => {
      state.items = []
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchWatchProgress.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchWatchProgress.fulfilled, (state, action) => {
        state.loading = false
        state.items = action.payload
      })
      .addCase(fetchWatchProgress.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      .addCase(updateWatchProgress.fulfilled, (state, action) => {
        const existingIndex = state.items.findIndex(
          item => item.tmdb_id === action.payload.tmdb_id &&
                  item.media_type === action.payload.media_type &&
                  (item.season_number === action.payload.season_number || (!item.season_number && !action.payload.season_number)) &&
                  (item.episode_number === action.payload.episode_number || (!item.episode_number && !action.payload.episode_number))
        )
        if (existingIndex >= 0) {
          state.items[existingIndex] = action.payload
        } else {
          state.items.push(action.payload)
        }
        // Sort by last_watched descending
        state.items.sort((a, b) => new Date(b.last_watched) - new Date(a.last_watched))
      })
      .addCase(deleteWatchProgress.fulfilled, (state, action) => {
        state.items = state.items.filter(
          item => !(item.tmdb_id === action.payload.tmdbId &&
                   item.media_type === action.payload.mediaType &&
                   (item.season_number === action.payload.seasonNumber || (!item.season_number && !action.payload.seasonNumber)) &&
                   (item.episode_number === action.payload.episodeNumber || (!item.episode_number && !action.payload.episodeNumber)))
        )
      })
  }
})

export const { clearWatchProgress } = watchProgressSlice.actions
export default watchProgressSlice.reducer

