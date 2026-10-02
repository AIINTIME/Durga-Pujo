import { lazy, Suspense, useEffect } from 'react'
import { createBrowserRouter, Outlet, RouterProvider, useLocation } from 'react-router-dom'
import TransitionLayer from './components/transition/TransitionLayer.jsx'
import MusicPlayer from './components/music/MusicPlayer.jsx'
import LanguageProvider from './i18n/LanguageProvider.jsx'
import LanguageToggle from './i18n/LanguageToggle.jsx'
import Welcome from './Pages/Welcome.jsx'

// Only the welcome screen is in the first download; every other page is its own chunk.
const loadHome = () => import('./Pages/Home.jsx')
const Home = lazy(loadHome)
const About = lazy(() => import('./Pages/About.jsx'))
const Gallery = lazy(() => import('./Pages/Gallery.jsx'))
const Contact = lazy(() => import('./Pages/Contact.jsx'))
import Navbar from './components/navbar/Navbar.jsx'

function RootLayout() {
  // every page after the welcome screen shares the same navbar
  const { pathname } = useLocation()
  const showNav = pathname !== '/'
  // while the visitor is on the welcome screen, quietly fetch Home so ENTER feels instant
  useEffect(() => {
    if (pathname !== '/') return
    const idle = window.requestIdleCallback || ((cb) => setTimeout(cb, 1500))
    const id = idle(() => loadHome())
    return () => (window.cancelIdleCallback || clearTimeout)(id)
  }, [pathname])
  useEffect(() => {
    document.body.classList.toggle('dp-has-nav', showNav)
    return () => document.body.classList.remove('dp-has-nav')
  }, [showNav])
  return (
    <LanguageProvider>
      <MusicPlayer>
        <TransitionLayer>
          <div className="dp-app">
            {showNav && <Navbar />}
            <Suspense fallback={<div className="dp-route-wait" />}>
              <Outlet />
            </Suspense>
            <LanguageToggle />
          </div>
        </TransitionLayer>
      </MusicPlayer>
    </LanguageProvider>
  )
}

const router = createBrowserRouter([
  {
    element: <RootLayout />,
    children: [
      { path: '/', element: <Welcome /> },
      { path: '/home', element: <Home /> },
      { path: '/about', element: <About /> },
      // { path: '/committee', element: <Committee /> }, // Organising Committee page is switched off
      { path: '/gallery', element: <Gallery /> },
      { path: '/contact', element: <Contact /> },
    ],
  },
])

export default function App() {
  return <RouterProvider router={router} />
}
