import { useEffect, useRef, useState } from 'react'
import { createAboutScene } from './about/aboutScene.js'
import { useScrollPhase } from './useScrollPhase.js'
import { useLanguage } from '../i18n/context.js'
import bg from '../assets/committee/bg.webp'
import horse from '../assets/schedule/horse.webp'
import boat from '../assets/schedule/boat.webp'
import s1 from '../assets/schedule/s1.webp'
import s2 from '../assets/schedule/s2.webp'
import s3 from '../assets/schedule/s3.webp'
import Art, { ArtDefs } from './schedule/Art.jsx'
import './schedule/Schedule.css'

// optional card photos: drop `<day>-<1..3>.webp` (e.g. sasthi-1.webp, ashtami-3.webp) into src/assets/schedule/cards and the card shows it
const CARD_PHOTOS = import.meta.glob('../assets/schedule/cards/*.{webp,jpg,jpeg,png}', { eager: true, import: 'default' })
const cardPhoto = (day, i) => Object.entries(CARD_PHOTOS).find(([path]) => /([^/]+)\.[a-z]+$/.exec(path)?.[1] === `${day}-${i + 1}`)?.[1]

// flame centres in the 1683 x 935 artwork (same artwork as Committee): x, y, scale
const DIYAS = [
  [68, 768, 1.0],
  [157, 850, 1.15],
  [1609, 770, 1.0],
  [1519, 852, 1.15],
  [170, 62, 0.55],
  [113, 152, 0.5],
  [1511, 66, 0.55],
  [1568, 152, 0.5],
]

// 24 x 24 stroke icons
const ICONS = {
  calendar: (
    <>
      <rect width="18" height="18" x="3" y="4" rx="2" /><path d="M16 2v4M8 2v4M3 10h18" />
    </>
  ),
  sun: (
    <>
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
    </>
  ),
  clock: (
    <>
      <circle cx="12" cy="12" r="10" /><path d="M12 6v6l4 2" />
    </>
  ),
  boat: (
    <>
      <path d="M2 20a2.4 2.4 0 0 0 2 1 2.4 2.4 0 0 0 2-1 2.4 2.4 0 0 1 2-1 2.4 2.4 0 0 1 2 1 2.4 2.4 0 0 0 2 1 2.4 2.4 0 0 0 2-1 2.4 2.4 0 0 1 2-1 2.4 2.4 0 0 1 2 1 2.4 2.4 0 0 0 2 1 2.4 2.4 0 0 0 2-1" />
      <path d="M4 18 3 14h18l-1 4" /><path d="M12 14V3" /><path d="m12 3 6 8h-6" />
    </>
  ),
  lamp: (
    <>
      <path d="M12 2c1.5 2.5 2.5 4 2.5 6a2.5 2.5 0 0 1-5 0C9.5 6 10.5 4.5 12 2z" /><path d="M3 12h18c0 4-3 7-9 7s-9-3-9-7z" /><path d="M9 21h6" />
    </>
  ),
  lotus: (
    <>
      <path d="M12 21c-3-2-5-5-5-9 2 0 4 1 5 3 1-2 3-3 5-3 0 4-2 7-5 9z" /><path d="M12 15c-1.5-2-1.5-5 0-9 1.5 4 1.5 7 0 9z" />
    </>
  ),
  flower: (
    <>
      <circle cx="12" cy="12" r="3" />
      <path d="M12 9a4 4 0 1 1 0-6 4 4 0 0 1 0 6zM12 21a4 4 0 1 1 0-6 4 4 0 0 1 0 6zM9 12a4 4 0 1 1-6 0 4 4 0 0 1 6 0zM21 12a4 4 0 1 1-6 0 4 4 0 0 1 6 0z" />
    </>
  ),
}

const Icon = ({ name, className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    {ICONS[name]}
  </svg>
)

const LABELS = {
  window: { bn: 'শাস্ত্রীয় তিথি ও পবিত্র সময়কাল', en: 'Shastric Tithi & Sacred Window' },
  directive: { bn: 'পবিত্র শুভ নির্দেশ', en: 'Sacred Auspicious Directive' },
}

const DAYS = [
  { id: 'panchami', label: { bn: 'পঞ্চমী', en: 'Panchami' } },
  { id: 'sasthi', label: { bn: 'মহাষষ্ঠী', en: 'Maha Sasthi' } },
  { id: 'saptami', label: { bn: 'মহাসপ্তমী', en: 'Maha Saptami' } },
  { id: 'ashtami', label: { bn: 'মহাষ্টমী', en: 'Maha Ashtami' } },
  { id: 'nabami', label: { bn: 'মহানবমী', en: 'Maha Nabami' } },
  { id: 'dashami', label: { bn: 'বিজয়া দশমী', en: 'Bijoya Dashami' } },
]

// every day shares one shape: date lines, the sacred window, the directive and three timeline cards (only Panchami has photos)
const SCHEDULE = {
  panchami: {
    date: { bn: '১৪ ও ১৫ অক্টোবর (বুধবার ও বৃহস্পতিবার)', en: '14 & 15 October (Wednesday & Thursday)' },
    ashwin: { bn: '২৬ ও ২৭ আশ্বিন, ১৪৩৩', en: '26 & 27 Ashwin, 1433' },
    window: {
      bn: '১৪ অক্টোবর রাত ১১:৫১ থেকে ১৫ অক্টোবর রাত ০১:৪৩ (গভীর রাত)। এরপর মহাষষ্ঠী তিথি শুরু।',
      en: '14 October 11:51 PM to 15 October 01:43 AM (night). Maha Shasthi tithi commences thereafter.',
    },
    directive: {
      bn: '১৪ অক্টোবর রাত ১১:৫১-তে পঞ্চমী তিথি প্রবেশ করছে। বিশাল প্যান্ডেলের উৎসবমুখর উদ্বোধন।',
      en: 'Panchami tithi enters at 11:51 PM on 14 October. Festive inauguration of the grand pandal.',
    },
    steps: [
      {
        img: s1, icon: 'clock',
        when: { bn: '১৪ অক্টোবর, রাত ১১:৫১', en: '11:51 PM (14 Oct)' },
        title: { bn: 'পঞ্চমী তিথির সূচনা ও দেবী বন্দনা', en: 'Panchami Tithi Inception & Devi Vandana' },
        text: { bn: 'ঐতিহ্যবাহী সংকল্প ও প্রারম্ভিক আরতির মাধ্যমে পঞ্চমী তিথির শুভ সূচনা।', en: 'Auspicious inception of Panchami tithi with traditional sankalpa and introductory aarti.' },
      },
      {
        img: s2, icon: 'sun',
        when: { bn: 'দিন ও সন্ধ্যা', en: 'Day & Evening' },
        title: { bn: 'বিশাল প্যান্ডেলের উদ্বোধন ও আনন্দমেলা', en: 'Grand Pandal Opening & Ananda Mela' },
        text: { bn: 'গুজরাট-অনুপ্রাণিত স্থাপত্যের প্যান্ডেলের আনুষ্ঠানিক উন্মোচন ও সাংস্কৃতিক আয়োজন।', en: 'Official unveiling of the Gujarat-inspired architectural pandal and cultural treats.' },
      },
      {
        img: s3, icon: 'clock',
        when: { bn: '১৫ অক্টোবর, রাত ০১:৪৩', en: '01:43 AM (15 Oct)' },
        title: { bn: 'পঞ্চমী তিথির সমাপনী প্রার্থনা', en: 'Panchami Tithi Concluding Prayers' },
        text: { bn: 'পঞ্চমী তিথির আচার সমাপন ও মহাষষ্ঠীর জন্য পবিত্রীকরণ।', en: 'Completion of Panchami tithi rituals and sanctification for Maha Shasthi.' },
      },
    ],
  },
  sasthi: {
    date: { bn: '১৬ অক্টোবর, শুক্রবার', en: '16 October, Friday' },
    ashwin: { bn: '২৮ আশ্বিন, ১৪৩৩', en: '28 Ashwin, 1433' },
    window: {
      bn: 'ষষ্ঠী তিথি থাকবে রাত ০৩:৪৭ পর্যন্ত। বারবেলা বাদ দিয়ে সকাল ০৮:৩০-এর মধ্যে কল্পারম্ভ ও ষষ্ঠী পূজা; সন্ধ্যায় বোধন, আমন্ত্রণ ও অধিবাস।',
      en: 'Shasthi tithi lasts till 03:47 AM night. Avoiding Barabela, Kalparambha & Shasthi Puja within 08:30 AM; Bodhon, Amantran & Adhibas in the evening.',
    },
    directive: {
      bn: 'বারবেলা বাদ দিয়ে সকাল ০৮:৩০-এর মধ্যে কল্পারম্ভ ও ষষ্ঠী পূজা; গোধূলিতে বোধন, আমন্ত্রণ ও অধিবাস।',
      en: 'Avoiding Barabela, Kalparambha & Shasthi Puja within 08:30 AM; Bodhon, Amantran & Adhibas at dusk.',
    },
    steps: [
      {
        art: 'kalash',
        icon: 'clock',
        when: { bn: 'সকাল ০৮:৩০-এর মধ্যে', en: 'Within 08:30 AM' },
        title: { bn: 'কল্পারম্ভ ও ষষ্ঠী পূজা', en: 'Kalparambha & Shasthi Puja' },
        text: { bn: 'সকাল ০৮:৩০-এর মধ্যে শুভ সংকল্প ও দুর্গাপূজার আনুষ্ঠানিক সূচনা।', en: 'Auspicious pledge and formal inception of Durga Puja within 08:30 AM.' },
      },
      {
        art: 'beltree',
        icon: 'clock',
        when: { bn: 'সন্ধ্যা ০৬:১৫', en: '06:15 PM' },
        title: { bn: 'সান্ধ্য বোধন, আমন্ত্রণ ও অধিবাস', en: 'Evening Bodhon, Amantran & Adhibas' },
        text: { bn: 'বেলগাছের তলায় দেবীর পবিত্র জাগরণ, আবাহন ও শুভ আচার।', en: 'Sacred awakening of the Goddess under the Bel tree, invocation and auspicious rites.' },
      },
      {
        art: 'aarti',
        icon: 'clock',
        when: { bn: 'রাত ০৭:৪৫', en: '07:45 PM' },
        title: { bn: 'মহাষষ্ঠীর সান্ধ্য আরতি', en: 'Maha Shasthi Evening Aarti' },
        text: { bn: 'ঢাকের গম্ভীর ছন্দে কর্পূর আরতি, ভক্তদের স্বাগত জানিয়ে।', en: 'Evening camphor aarti with resonant Dhak rhythms welcoming devotees.' },
      },
    ],
  },
  saptami: {
    date: { bn: '১৭ ও ১৮ অক্টোবর (শনিবার ও রবিবার)', en: '17 & 18 October (Saturday & Sunday)' },
    ashwin: { bn: '২৯ ও ৩০ আশ্বিন, ১৪৩৩', en: '29 & 30 Ashwin, 1433' },
    window: {
      bn: '১৭ অক্টোবর: পূর্বাহ্নে নবপত্রিকা স্নান, প্রবেশ ও সপ্তমী পূজা। ১৮ অক্টোবর: সকাল ০৫:৫৩-এর মধ্যে শুক্লা সপ্তমী পূজা এবং রাত ১০:৫৯ – ১১:৪৭-এর মধ্যে অর্ধরাত্র পূজা।',
      en: '17 Oct: Nabapatrika Snan, entry & Saptami Puja in forenoon. 18 Oct: Shukla Saptami Puja within 05:53 AM and Ardharatra Puja between 10:59 PM - 11:47 PM.',
    },
    directive: {
      bn: '১৮ অক্টোবর: সকাল ০৫:৫৩-এর মধ্যে বিস্তৃত সপ্তমী পূজা এবং রাত ১০:৫৯ – ১১:৪৭-এ পবিত্র অর্ধরাত্র পূজা।',
      en: '18 Oct: Extended Saptami Puja within 05:53 AM and sacred Ardharatra Puja 10:59 PM - 11:47 PM.',
    },
    steps: [
      {
        art: 'nabapatrika',
        icon: 'clock',
        when: { bn: '১৭ অক্টোবর, পূর্বাহ্ন', en: '17 Oct Forenoon' },
        title: { bn: 'নবপত্রিকা স্নান ও সপ্তমী বিহিত পূজা', en: 'Nabapatrika Snan & Saptami Vihita Puja' },
        text: { bn: 'নবপত্রিকার পবিত্র নদীস্নান ও কালবেলা বাদ দিয়ে আনুষ্ঠানিক প্রতিষ্ঠা।', en: 'Holy river bathing of Nabapatrika and ceremonial installation avoiding Kalabela.' },
      },
      {
        art: 'sunrise',
        icon: 'clock',
        when: { bn: '১৮ অক্টোবর, সকাল ০৫:৫৩-এর মধ্যে', en: '18 Oct by 05:53 AM' },
        title: { bn: 'শুক্লা সপ্তমীর বিস্তৃত পূজা', en: 'Shukla Saptami Extended Puja' },
        text: { bn: 'ভোরের বৈদিক আবাহন ও নিবেদন, সকাল ০৫:৫৩-এর মধ্যে।', en: 'Early morning Vedic invocation and offerings within 05:53 AM.' },
      },
      {
        art: 'midnight',
        icon: 'clock',
        when: { bn: '১৮ অক্টোবর, রাত ১০:৫৯ – ১১:৪৭', en: '18 Oct 10:59 - 11:47 PM' },
        title: { bn: 'পবিত্র অর্ধরাত্র পূজা', en: 'Sacred Ardharatra Puja' },
        text: { bn: 'গভীর মধ্যরাতের আরাধনা, বিশেষ তান্ত্রিক ও বৈদিক মন্ত্রোচ্চারণে।', en: 'Deep midnight worship with special tantric and Vedic incantations.' },
      },
    ],
  },
  ashtami: {
    date: { bn: '১৯ অক্টোবর, সোমবার', en: '19 October, Monday' },
    ashwin: { bn: '১ কার্তিক, ১৪৩৩', en: '1 Kartik, 1433' },
    window: {
      bn: 'মহাষ্টমী তিথি থাকবে সকাল ০৭:৫০ পর্যন্ত। কালবেলা ও সন্ধির নিয়ম মেনে সকাল ০৭:০৫ – ০৭:৫০-এর মধ্যে কল্পারম্ভ ও পূজা শুভ। বীরাষ্টমী ও উপবাস।',
      en: 'Maha Ashtami tithi lasts till 07:50 AM. Following Kalabela and Sandhi rules, Kalparambha & Puja auspicious between 07:05 AM - 07:50 AM. Birashtami & fasting.',
    },
    directive: {
      bn: 'শাস্ত্রীয় নিয়ম মেনে সকাল ০৭:০৫ থেকে ০৭:৫০-এর মধ্যে মহাষ্টমীর কল্পারম্ভ ও পবিত্র পূজা।',
      en: 'Maha Ashtami Kalparambha and sacred Puja between 07:05 AM and 07:50 AM adhering to scriptural rules.',
    },
    steps: [
      {
        art: 'thali',
        icon: 'clock',
        when: { bn: 'সকাল ০৭:০৫ – ০৭:৫০', en: '07:05 - 07:50 AM' },
        title: { bn: 'মহাষ্টম্যাদি কল্পারম্ভ ও পূজা', en: 'Maha Ashtamydi Kalparambha & Puja' },
        text: { bn: 'শাস্ত্রীয় নিয়ম মেনে সবচেয়ে পবিত্র পুষ্পাঞ্জলির সময় ও কল্পারম্ভ।', en: 'Most sacred pushpanjali window and kalparambha adhering to scriptural rules.' },
      },
      {
        art: 'lotus',
        icon: 'clock',
        when: { bn: 'সকাল ১১:০০', en: '11:00 AM' },
        title: { bn: 'বীরাষ্টমী ব্রত ও কুমারী পূজা', en: 'Birashtami Vrata & Kumari Puja' },
        text: { bn: 'বীরাষ্টমীর উপবাস পালন এবং কুমারীকে দেবী জননীরূপে পূজা।', en: 'Sacred observance of Birashtami fasting and worshipping Kumari as the Divine Mother.' },
      },
      {
        art: 'lamps',
        icon: 'clock',
        when: { bn: 'সন্ধিক্ষণ', en: 'Sandhi Juncture' },
        title: { bn: 'সন্ধিপূজা (১০৮ পদ্ম ও প্রদীপ)', en: 'Sandhi Puja (108 Lotuses & Lamps)' },
        text: { bn: 'চণ্ড-মুণ্ড বধের মহাসন্ধিক্ষণ — ১০৮টি পদ্ম ও পিতলের প্রদীপে আরাধনা।', en: 'Apex juncture marking the slaying of Chanda & Munda with 108 lotuses and brass lamps.' },
      },
    ],
  },
  nabami: {
    date: { bn: '২০ অক্টোবর, মঙ্গলবার', en: '20 October, Tuesday' },
    ashwin: { bn: '২ কার্তিক, ১৪৩৩', en: '2 Kartik, 1433' },
    window: {
      bn: 'মহানবমী তিথি সকাল ০৯:৩১ পর্যন্ত। পূর্বাহ্নে কল্পারম্ভ, পূজা ও নবরাত্রি ব্রত সমাপন।',
      en: 'Maha Nabami tithi till 09:31 AM. Kalparambha, Puja and completion of Navratri Vrata in forenoon.',
    },
    directive: {
      bn: 'মহানবমী তিথি সকাল ০৯:৩১ পর্যন্ত। পূর্বাহ্নের আচার ও নবরাত্রি ব্রত সমাপন।',
      en: 'Maha Nabami tithi till 09:31 AM. Forenoon rituals and completion of Navratri Vrata.',
    },
    steps: [
      {
        art: 'garland',
        icon: 'clock',
        when: { bn: 'সকাল ০৯:৩১-এর মধ্যে', en: 'Within 09:31 AM' },
        title: { bn: 'মহানবমী কল্পারম্ভ ও পূজা', en: 'Maha Nabami Kalparambha & Puja' },
        text: { bn: 'প্রভাতী পুষ্পাঞ্জলি, কল্পারম্ভ ও শুভ যজ্ঞের সূচনা।', en: 'Morning pushpanjali, kalparambha, and auspicious yajna initiation.' },
      },
      {
        art: 'havan',
        icon: 'clock',
        when: { bn: 'সকাল ১১:০০', en: '11:00 AM' },
        title: { bn: 'মহাযজ্ঞ ও নবরাত্রি প্রতিষ্ঠা', en: 'Maha Yajna & Navratri Consecration' },
        text: { bn: 'সমৃদ্ধি ও বিশ্বসম্প্রীতির প্রার্থনায় বৈদিক শ্লোকসহ পবিত্র অগ্নি-আহুতি।', en: 'Sacred fire oblation with Vedic shlokas praying for prosperity and universal harmony.' },
      },
      {
        art: 'dhunuchi',
        icon: 'clock',
        when: { bn: 'সন্ধ্যা ০৭:৩০', en: '07:30 PM' },
        title: { bn: 'মহানবমীর ধুনুচি ও আরতি', en: 'Grand Nabami Dhunuchi & Aarti' },
        text: { bn: 'ঐতিহ্যবাহী কাঁসরের তালে প্রাণবন্ত ধুনুচি নাচ ও আরতি।', en: 'Spirited Dhunuchi dance and Aarti resonating with traditional Kanshor.' },
      },
    ],
  },
  dashami: {
    date: { bn: '২১ অক্টোবর, বুধবার', en: '21 October, Wednesday' },
    ashwin: { bn: '৩ কার্তিক, ১৪৩৩', en: '3 Kartik, 1433' },
    window: {
      bn: 'দশমী তিথি সকাল ১০:৪৭ পর্যন্ত। কালবেলা বাদ দিয়ে সকাল ০৮:৩১-এর মধ্যে পূজা সমাপন ও বিসর্জন শুভ। এরপর অপরাজিতা পূজা ও বিজয়ার আচার।',
      en: 'Dashami tithi till 10:47 AM. Avoiding Kalabela, Puja conclusion & Visarjan auspicious within 08:31 AM. Followed by Aparajita Puja & Bijoya rites.',
    },
    directive: {
      bn: 'কালবেলা বাদ দিয়ে সকাল ০৮:৩১-এর মধ্যে পূজা সমাপন ও বিসর্জন; এরপর অপরাজিতা পূজা।',
      en: 'Puja conclusion and Bisarjan within 08:31 AM avoiding Kalabela; followed by Aparajita Puja.',
    },
    steps: [
      {
        art: 'mirror',
        icon: 'clock',
        when: { bn: 'সকাল ০৮:৩১-এর মধ্যে', en: 'Within 08:31 AM' },
        title: { bn: 'দশমী পূজা সমাপন ও দর্পণ বিসর্জন', en: 'Dashami Puja Completion & Darpan Visarjan' },
        text: { bn: 'কালবেলা বাদ দিয়ে দশমী পূজা সমাপন, আয়নায় প্রতিবিম্বের আচারিক বিসর্জন।', en: 'Completing Dashami Puja avoiding Kalabela, ritual immersion of reflection in mirror.' },
      },
      {
        art: 'sindoor',
        icon: 'clock',
        when: { bn: 'সকাল ০৯:১৫ থেকে', en: 'From 09:15 AM' },
        title: { bn: 'দেবীবরণ ও সিঁদুর খেলা', en: 'Devi Baran & Sindoor Khela' },
        text: { bn: 'বিবাহিতা নারীরা আশীর্বাদ চেয়ে মিষ্টি, পান ও সিঁদুর নিবেদন করেন।', en: 'Married women offering sweets, betel leaf and vermilion seeking blessings.' },
      },
      {
        art: 'boat',
        icon: 'clock',
        when: { bn: 'অপরাহ্ন', en: 'Afternoon' },
        title: { bn: 'অপরাজিতা পূজা ও বিশাল শোভাযাত্রা', en: 'Aparajita Puja & Grand Procession' },
        text: { bn: 'অপরাজিতা আচার, পবিত্র শান্তিজল বিতরণ ও শেষ বিসর্জন।', en: 'Aparajita rituals, holy peace water (Santijal) distribution, and final immersion.' },
      },
    ],
  },
}

const toBn = (n) => String(n).replace(/\d/g, (d) => '০১২৩৪৫৬৭৮৯'[d])

// whole days from today (local time) to Maha Panchami, 14 October 2026
function daysToPanchami() {
  const now = new Date()
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  return Math.round((new Date(2026, 9, 14) - today) / 86400000)
}

// Pinned, scroll-scrubbed section with two scenes under one heading (same mechanics as Concept / Committee):
// first the goddess's arrival and departure, then the day-by-day tithi schedule with a tab per day.
export default function Schedule() {
  const trackRef = useRef(null)
  const frameRef = useRef(null)
  const stageRef = useRef(null)
  const { lang, t } = useLanguage()
  const [day, setDay] = useState('panchami')
  const days = daysToPanchami()

  useEffect(() => {
    const scene = createAboutScene(stageRef.current, { artW: 1683, artH: 935, diyas: DIYAS, band: 0.1 })
    return () => scene.dispose()
  }, [])
  useScrollPhase(trackRef, frameRef, { coverVar: '--cover7', hold: true })

  const ph = (s, l) => ({ '--s': s, '--l': l })
  const n = (v) => (lang === 'bn' ? toBn(v) : v)

  let countdown
  if (days > 1) {
    countdown = t({
      bn: `দুর্গাপূজা ২০২৬ • মহাপঞ্চমীর আর মাত্র ${n(days)} দিন বাকি! (১৪ অক্টোবর)`,
      en: `Durga Puja 2026 • Only ${days} days to auspicious Maha Panchami! (14 October)`,
    })
  } else if (days === 1) {
    countdown = t({ bn: 'দুর্গাপূজা ২০২৬ • মহাপঞ্চমীর আর মাত্র ১ দিন বাকি! (১৪ অক্টোবর)', en: 'Durga Puja 2026 • Only 1 day to auspicious Maha Panchami! (14 October)' })
  } else if (days === 0) {
    countdown = t({ bn: 'দুর্গাপূজা ২০২৬ • আজ মহাপঞ্চমী! (১৪ অক্টোবর)', en: 'Durga Puja 2026 • Maha Panchami is today! (14 October)' })
  } else {
    countdown = t({ bn: 'দুর্গাপূজা ২০২৬ • ১৪ অক্টোবর মহাপঞ্চমী থেকে উৎসব শুরু হয়েছে', en: 'Durga Puja 2026 • The festivities began on Maha Panchami, 14 October' })
  }
  const current = DAYS.find((d) => d.id === day)
  const plan = SCHEDULE[day]

  return (
    <section className="dp-sc" ref={trackRef}>
      {/* scroll target for the navbar's "Puja Schedule" link: the point where the first scene has built */}
      <span id="schedule" className="dp-sc__anchor" aria-hidden="true" />
      <div className="dp-sc__pin">
        <img loading="lazy" decoding="async" className="dp-sc__backdrop" src={bg} alt="" draggable="false" aria-hidden="true" />
        <div className="dp-sc__frame" ref={frameRef}>
          <img loading="lazy" decoding="async" className="dp-sc__bg" src={bg} alt="" draggable="false" />
          <ArtDefs />

          {/* heading: stays through both scenes */}
          <span className="dp-sc__badge dp-ph" style={ph(0.02, 0.08)}>
            <Icon name="calendar" />
            {t({ bn: 'আচার ও তিথির সূচি', en: 'Rituals & Tithi Schedule' })}
          </span>
          <h2 className="dp-sc__title dp-ph" style={ph(0.05, 0.12)}>
            {t({ bn: 'দৈনিক পবিত্র সূচি ও সময়', en: 'Daily Sacred Schedule & Timings' })}
          </h2>
          <p className="dp-sc__sub dp-ph" style={ph(0.1, 0.1)}>
            {t({ bn: 'পঞ্চমীর জাগরণ থেকে বিজয়া দশমীর শুভ নিরঞ্জন পর্যন্ত।', en: 'From Panchami awakening to Bijoya Dashami’s auspicious immersion.' })}
          </p>

          {/* scene 1: arrival & departure */}
          <div className="dp-sc__scene is-a">
            <p className="dp-sc__count dp-ph" style={ph(0.14, 0.1)}>
              <Icon name="flower" />
              {countdown}
            </p>
            <div className="dp-sc__omen dp-ph" style={ph(0.2, 0.14)}>
              <header>
                <Icon name="sun" />
                <h3>{t({ bn: 'দেবী দুর্গার আগমন ও গমন (২০২৬)', en: 'Divine Arrival & Departure of Goddess Durga (2026)' })}</h3>
                <span className="dp-sc__chip">{t({ bn: 'পঞ্জিকা নির্দেশনা', en: 'Sacred Almanac Guidance' })}</span>
              </header>
              <div className="dp-sc__cols">
                <article className="dp-ph" style={ph(0.3, 0.14)}>
                  <p className="dp-sc__tag">
                    <span>{t({ bn: 'দেবীর আগমন', en: 'Divine Arrival' })}</span>
                    <b>{t({ bn: 'ঘোটক (ঘোড়ায়)', en: 'Ghotok (On Horseback)' })}</b>
                  </p>
                  <div className="dp-sc__media">
                    <img loading="lazy" decoding="async" src={horse} alt="" draggable="false" />
                    <div>
                      <small>{t({ bn: 'শাস্ত্রীয় ফল:', en: 'Scriptural Consequence:' })}</small>
                      <strong>{t({ bn: 'ছত্রভঙ্গ (সামাজিক ও রাজনৈতিক অস্থিরতা)', en: 'Chhatra-bhanga (Social & Political Turmoil)' })}</strong>
                    </div>
                  </div>
                  <p className="dp-sc__note">
                    {t({ bn: 'শাস্ত্রমতে, ঘোড়ায় দেবীর আগমন অশান্তি, অস্থিরতা ও উথালপাথালের ইঙ্গিত দেয়।', en: 'According to traditional scriptures, arrival on horseback foretells turbulence, instability and upheaval.' })}
                  </p>
                </article>
                <article className="is-dep dp-ph" style={ph(0.38, 0.14)}>
                  <p className="dp-sc__tag is-dep">
                    <span><Icon name="boat" />{t({ bn: 'দেবীর গমন', en: 'Divine Departure' })}</span>
                    <b>{t({ bn: 'নৌকা (নৌকায়)', en: 'Nouka (By Boat)' })}</b>
                  </p>
                  <div className="dp-sc__media">
                    <img loading="lazy" decoding="async" src={boat} alt="" draggable="false" />
                    <div>
                      <small>{t({ bn: 'শাস্ত্রীয় ফল:', en: 'Scriptural Consequence:' })}</small>
                      <strong>{t({ bn: 'শস্যের প্রাচুর্য ও উর্বর জলধারা', en: 'Abundance of Crops & Fertile Waters' })}</strong>
                    </div>
                  </div>
                  <p className="dp-sc__note">
                    {t({ bn: 'নৌকায় দেবীর গমন প্রচুর বর্ষা, সবুজ ফসল ও সমৃদ্ধিতে দেশকে আশীর্বাদ করে।', en: 'Departure by boat blesses the land with bountiful monsoon, lush agricultural harvest, and prosperity.' })}
                  </p>
                </article>
              </div>
            </div>
          </div>

          {/* scene 2: the day-by-day schedule */}
          <div className="dp-sc__scene is-b">
            <ul className="dp-sc__tabs dp-ph" style={ph(0.64, 0.08)} role="tablist">
              {DAYS.map((d) => (
                <li key={d.id}>
                  <button type="button" role="tab" aria-selected={d.id === day} className={d.id === day ? 'is-on' : ''} onClick={() => setDay(d.id)}>
                    <Icon name="flower" />
                    {t(d.label)}
                  </button>
                </li>
              ))}
            </ul>

            <div className="dp-sc__head dp-ph" style={ph(0.68, 0.08)}>
              <h3>{t(current.label)}</h3>
              <p>{t(plan.date)}</p>
              <span>{t(plan.ashwin)}</span>
            </div>
            <div className="dp-sc__window dp-ph" style={ph(0.72, 0.08)}>
              <Icon name="clock" className="dp-sc__ico" />
              <div>
                <small>{t(LABELS.window)}</small>
                <p>{t(plan.window)}</p>
              </div>
            </div>
            <div className="dp-sc__directive dp-ph" style={ph(0.76, 0.08)}>
              <Icon name="lamp" className="dp-sc__ico" />
              <div>
                <small>{t(LABELS.directive)}</small>
                <p>{t(plan.directive)}</p>
              </div>
            </div>
            <ul className="dp-sc__steps" key={day}>
              {plan.steps.map((s, i) => {
                const img = s.img ?? cardPhoto(day, i)
                const art = !img && s.art
                return (
                <li key={s.title.en} className={`dp-sc__step dp-ph${img || art ? '' : ' is-plain'}`} style={ph(0.8 + i * 0.05, 0.1)}>
                  {img || art ? (
                    <div className="dp-sc__shot">
                      {img ? <img src={img} alt="" draggable="false" loading="lazy" decoding="async" /> : <Art kind={art} />}
                      <span><Icon name={s.icon} />{t(s.when)}</span>
                    </div>
                  ) : (
                    <span className="dp-sc__when"><Icon name={s.icon} />{t(s.when)}</span>
                  )}
                  <div className="dp-sc__body">
                    <h4>{t(s.title)}</h4>
                    <p>{t(s.text)}</p>
                  </div>
                  <Icon name="lotus" className="dp-sc__lotus" />
                </li>
                )
              })}
            </ul>
          </div>

          {/* Three.js overlay: petals, dust, flickering diya flames */}
          <div className="dp-sc__stage" ref={stageRef} aria-hidden="true" />
        </div>
      </div>
    </section>
  )
}
