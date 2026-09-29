import { createContext, useContext } from 'react'

export const MusicContext = createContext({ playing: false, play: () => {}, toggle: () => {} })
export const useMusic = () => useContext(MusicContext)
