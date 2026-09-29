import { useLanguage } from '../i18n/context.js'
import './about/About.css'

export default function ComingSoon({ title }) {
  const { t } = useLanguage()
  return (
    <main className="dp-soon">
      <h1>{t(title)}</h1>
      <p>{t({ bn: 'শীঘ্রই আসছে', en: 'Coming soon' })}</p>
    </main>
  )
}
