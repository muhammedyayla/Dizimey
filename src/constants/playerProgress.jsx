export const CONTINUE_MOVIE_PREFIX = 'continue_movie_'
export const CONTINUE_EPISODE_PREFIX = 'continue_episode_'

export const buildMovieContinueKey = (id) => `${CONTINUE_MOVIE_PREFIX}${id}`
export const buildEpisodeContinueKey = (seriesId, season, episode) =>
  `${CONTINUE_EPISODE_PREFIX}${seriesId}_${season}_${episode}`

export const buildContinueKey = ({ type, id, season, episode }) => {
  if (type === 'movie') return buildMovieContinueKey(id)
  return buildEpisodeContinueKey(id, season, episode)
}

export const parseContinueEntry = (key, rawValue) => {
  if (!rawValue) return null
  try {
    const value = JSON.parse(rawValue)
    if (!value || typeof value !== 'object') return null
    if (typeof value.time !== 'number' || typeof value.duration !== 'number') return null
    return { ...value, key }
  } catch {
    return null
  }
}

export const getContinueEntry = (params) => {
  const key = buildContinueKey(params)
  const parsed = parseContinueEntry(key, localStorage.getItem(key))
  return parsed || null
}

export const getAllContinueEntries = () => {
  const entries = []
  for (let i = 0; i < localStorage.length; i += 1) {
    const key = localStorage.key(i)
    if (!key) continue
    if (!key.startsWith(CONTINUE_MOVIE_PREFIX) && !key.startsWith(CONTINUE_EPISODE_PREFIX)) continue
    const parsed = parseContinueEntry(key, localStorage.getItem(key))
    if (parsed) entries.push(parsed)
  }
  return entries.sort((a, b) => (b.updatedAt || 0) - (a.updatedAt || 0))
}
export const clearContinueEntry = (params) => {
  const key = buildContinueKey(params)
  localStorage.removeItem(key)
}
