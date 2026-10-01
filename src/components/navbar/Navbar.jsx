import { useEffect, useRef, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useLanguage } from '../../i18n/context.js'
import Lotus from './Lotus.jsx'
import './Navbar.css'

const LINKS = [
  { id: 'about', to: '/about', hash: 'about', match: ['/about', '/home'], label: { bn: 'আমাদের সম্পর্কে', en: 'About' } },
  { id: 'glance', to: '/home', hash: 'glance', match: [], label: { bn: 'এক নজরে পূজা', en: 'Puja at a Glance' } },
  { id: 'themes', to: '/home', hash: 'theme-archive', match: [], label: { bn: 'থিম আর্কাইভ', en: 'Theme Archive' } },
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
      ['artist', '.dp-ay'],
      ['themes', '.dp-th'],
      ['themes', '.dp-cr'],
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

  // phones: the links live in a slide-in sidebar behind a hamburger button
  // the menu counts as open only on the page it was opened on, so a route change closes it
  const [openAt, setOpenAt] = useState(null)
  const open = openAt === pathname
  const setOpen = (v) => setOpenAt(v ? pathname : null)
  const burgerRef = useRef(null)
  const closeRef = useRef(null)
  const wasOpen = useRef(false)

  useEffect(() => {
    if (!open) {
      if (wasOpen.current) burgerRef.current?.focus({ preventScroll: true })
      wasOpen.current = false
      return
    }
    wasOpen.current = true
    closeRef.current?.focus({ preventScroll: true })
    document.documentElement.classList.add('dp-menu-open') // stops the page scrolling behind the sidebar
    const onKey = (e) => e.key === 'Escape' && setOpenAt(null)
    const mq = window.matchMedia('(min-width: 821px)')
    const onWide = () => mq.matches && setOpenAt(null)
    window.addEventListener('keydown', onKey)
    mq.addEventListener('change', onWide)
    return () => {
      document.documentElement.classList.remove('dp-menu-open')
      window.removeEventListener('keydown', onKey)
      mq.removeEventListener('change', onWide)
    }
  }, [open])

  const onClick = (e, link) => {
    e.preventDefault()
    const go = () => {
      const target = link.hash && document.getElementById(link.hash)
      if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' })
      else navigate(link.to)
    }
    if (open) {
      setOpen(false)
      setTimeout(go, 120) // let the page scroll again once the sidebar has released it
    } else go()
  }

  const linkItems = (
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
  )

  return (
    <>
    <header className="dp-nav">
      <button
        ref={burgerRef}
        type="button"
        className="dp-nav__burger"
        aria-label={t({ bn: 'মেনু খুলুন', en: 'Open menu' })}
        aria-expanded={open}
        aria-controls="dp-sidebar"
        onClick={() => setOpen(true)}
      >
        <span aria-hidden="true" />
        <span aria-hidden="true" />
        <span aria-hidden="true" />
      </button>
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
        {linkItems}
      </nav>
    </header>
    <div className={`dp-side__scrim${open ? ' is-open' : ''}`} onClick={() => setOpen(false)} aria-hidden="true" />
    <aside
      id="dp-sidebar"
      className={`dp-side${open ? ' is-open' : ''}`}
      aria-label={t({ bn: 'প্রধান মেনু', en: 'Main menu' })}
      aria-hidden={!open}
      inert={!open}
    >
      <div className="dp-side__top">
        <span className="dp-side__brand">
          <Lotus className="dp-nav__lotus" />
          <span className="dp-nav__brandtext">
            <span>HALDIA DURGOTSAV</span>
            <span className="dp-nav__year">2026</span>
          </span>
        </span>
        <button ref={closeRef} type="button" className="dp-side__close" aria-label={t({ bn: 'মেনু বন্ধ করুন', en: 'Close menu' })} onClick={() => setOpen(false)}>
          <span aria-hidden="true" />
          <span aria-hidden="true" />
        </button>
      </div>
      <nav className="dp-side__links" aria-label={t({ bn: 'প্রধান মেনু', en: 'Main menu' })}>
        {linkItems}
      </nav>
      <p className="dp-side__foot">{t({ bn: 'শারদীয়া দুর্গোৎসব ২০২৬', en: 'Sharodiya Durgotsav 2026' })}</p>
    </aside>
    </>
  )
}
