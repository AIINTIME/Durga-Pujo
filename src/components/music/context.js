import { createContext, useContext } from 'react'

export const MusicContext = createContext({ playing: false, toggle: () => {} })
export const useMusic = () => useContext(MusicContext)
