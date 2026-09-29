import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useLanguage } from '../../i18n/context.js'
import Lotus from './Lotus.jsx'
import './Navbar.css'

const LINKS = [
  { id: 'about', to: '/about', hash: 'about', match: ['/about', '/home'], label: { bn: 'আমাদের সম্পর্কে', en: 'About' } },
  { id: 'glance', to: '/home', hash: 'glance', match: [], label: { bn: 'এক নজরে পূজা', en: 'Puja at a Glance' } },
  { id: 'artist', to: '/home', hash: 'artist', match: [], label: { bn: 'শিল্পী', en: 'Artist' } },
  // Organization Committee page is switched off (Committee.jsx is kept): restore this link to bring it back
  // { id: 'committee', to: '/committee', hash: 'committee', match: ['/committee'], label: { bn: 'সংগঠন কমিটি', en: 'Organization Committee' } },
  { id: 'gallery', to: '/gallery', hash: 'gallery', match: ['/gallery'], label: { bn: 'গ্যালারি', en: 'Gallery' } },
  { id: 'contact', to: '/contact', hash: 'contact', match: ['/contact'], label: { bn: 'যোগাযোগ', en: 'Contact Us' } },
]

// One bar for every page after the welcome screen. The music and EN/BN buttons
// are fixed elements that the `.dp-app--nav` layout slots into its right end.
export default function Navbar() {
  const { t } = useLanguage()
  const { pathname } = useLocation()
  const navigate = useNavigate()

  // on Home the highlighted link follows the section that is currently on screen
  const [section, setSection] = useState('about')
  useEffect(() => {
    if (pathname !== '/home') return
    const SECTIONS = [
      ['contact', '.dp-ct'],
      ['gallery', '.dp-gal'],
      ['artist', '.dp-ar'],
      ['glance', '.dp-gl'],
    ]
    const update = () => {
      const hit = SECTIONS.find(([, sel]) => {
        const el = document.querySelector(sel)
        return el && el.getBoundingClientRect().top <= window.innerHeight * 0.5
      })
      setSection(hit ? hit[0] : 'about')
    }
    update()
    window.addEventListener('scroll', update, { passive: true })
    return () => window.removeEventListener('scroll', update)
  }, [pathname])
  const isActive = (l) => (pathname === '/home' ? l.id === section : l.match.includes(pathname))

  const onClick = (e, link) => {
    e.preventDefault()
    const target = link.hash && document.getElementById(link.hash)
    if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' })
    else navigate(link.to)
  }

  return (
    <header className="dp-nav">
      <a
        className="dp-nav__brand"
        href="/home"
        onClick={(e) => {
          e.preventDefault()
          navigate('/home')
        }}
        aria-label="Haldia Durgotsav 2026"
      >
        <Lotus className="dp-nav__lotus" />
        <span className="dp-nav__brandtext">
          <span>HALDIA DURGOTSAV</span>
          <span className="dp-nav__year">2026</span>
        </span>
      </a>
      <nav className="dp-nav__links" aria-label={t({ bn: 'প্রধান মেনু', en: 'Main menu' })}>
        <ul>
          {LINKS.map((l) => (
            <li key={l.id}>
              <a
                href={l.to}
                className={isActive(l) ? 'is-active' : ''}
                aria-current={isActive(l) ? 'page' : undefined}
                onClick={(e) => onClick(e, l)}
              >
                {t(l.label)}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  )
}
