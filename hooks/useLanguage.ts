"use client"

import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { i18n } from '@/lib/i18n'

const LANGUAGE_KEY = 'innoverse-language'

export function useLanguage() {
  const [language, setLanguage] = useState<string>('en')
  const { i18n } = useTranslation()

  useEffect(() => {
    // Load language from localStorage on mount
    const savedLanguage = localStorage.getItem(LANGUAGE_KEY)
    if (savedLanguage && (savedLanguage === 'en' || savedLanguage === 'id')) {
      setLanguage(savedLanguage)
      i18n.changeLanguage(savedLanguage)
    } else {
      // Detect browser language
      const browserLang = navigator.language.startsWith('id') ? 'id' : 'en'
      setLanguage(browserLang)
      i18n.changeLanguage(browserLang)
    }
  }, [i18n])

  const changeLanguage = (newLanguage: string) => {
    setLanguage(newLanguage)
    localStorage.setItem(LANGUAGE_KEY, newLanguage)
    i18n.changeLanguage(newLanguage)
  }

  return {
    language,
    changeLanguage,
  }
}
