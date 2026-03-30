import { createSlice } from '@reduxjs/toolkit'

const uiSlice = createSlice({
  name: 'ui',
  initialState: {
    isSearchOpen: false,
    isAuthOpen: false,
    isMenuOpen: false,
  },
  reducers: {
    openSearch: (state) => {
      state.isSearchOpen = true
    },
    closeSearch: (state) => {
      state.isSearchOpen = false
    },
    openAuth: (state) => {
      state.isAuthOpen = true
    },
    closeAuth: (state) => {
      state.isAuthOpen = false
    },
    openMenu: (state) => {
      state.isMenuOpen = true
    },
    closeMenu: (state) => {
      state.isMenuOpen = false
    },
    toggleMenu: (state) => {
      state.isMenuOpen = !state.isMenuOpen
    },
  },
})

export const { openSearch, closeSearch, openAuth, closeAuth, openMenu, closeMenu, toggleMenu } = uiSlice.actions
export default uiSlice.reducer
