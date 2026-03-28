import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  open: false,
  mediaType: 'movie',
  tmdbId: null,
  title: '',
  season: 1,
  episode: 1,
  posterPath: ''
}

export const playerSlice = createSlice({
  name: 'player',
  initialState,
  reducers: {
    setPlayerConfig: (state, action) => {
      return { 
        ...state, 
        ...action.payload, 
        open: true 
      }
    },
    closePlayer: (state) => {
      state.open = false
    },
    resetPlayer: () => initialState
  }
})

export const { setPlayerConfig, closePlayer, resetPlayer } = playerSlice.actions
export default playerSlice.reducer
