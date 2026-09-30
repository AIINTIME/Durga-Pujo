import { createContext, useContext } from 'react'

export const MusicContext = createContext({ playing: false, toggle: () => {}, welcomeEnded: () => {} })
export const useMusic = () => useContext(MusicContext)
