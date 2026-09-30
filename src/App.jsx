import { useEffect } from 'react'
import { createBrowserRouter, Outlet, RouterProvider, useLocation } from 'react-router-dom'
import TransitionLayer from './components/transition/TransitionLayer.jsx'
import LanguageProvider from './i18n/LanguageProvider.jsx'
import LanguageToggle from './i18n/LanguageToggle.jsx'
import Home from './Pages/Home.jsx'
import Welcome from './Pages/Welcome.jsx'
import About from './Pages/About.jsx'
import Gallery from './Pages/Gallery.jsx'
import Contact from './Pages/Contact.jsx'
import Navbar from './components/navbar/Navbar.jsx'

function RootLayout() {
  // every page after the welcome screen shares the same navbar
  const showNav = useLocation().pathname !== '/'
  useEffect(() => {
    document.body.classList.toggle('dp-has-nav', showNav)
    return () => document.body.classList.remove('dp-has-nav')
  }, [showNav])
  return (
    <LanguageProvider>
      <TransitionLayer>
        <div className="dp-app">
          {showNav && <Navbar />}
          <Outlet />
          <LanguageToggle />
        </div>
      </TransitionLayer>
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
