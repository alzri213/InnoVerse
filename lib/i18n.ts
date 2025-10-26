"use client"

import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'

// the translations
// (tip: move them in a JSON file and import them,
// or even better, manage them separated from your code: https://react.i18next.com/guides/multiple-translation-files)
const resources = {
  en: {
    translation: {
      // Navigation
      "nav.home": "Home",
      "nav.courses": "Courses",
      "nav.materials": "Materials",
      "nav.quiz": "Quiz",
      "nav.games": "Games",
      "nav.news": "News",
      "nav.contact": "Contact",
      "nav.dashboard": "Dashboard",
      "nav.admin": "Admin",
      "nav.signin": "Sign In",
      "nav.signup": "Sign Up",
      "nav.signout": "Sign Out",
      "nav.profile": "Profile",
      "nav.settings": "Settings",

      // Loading Screen
      "loading.initializing": "Initializing InnoVerse Experience...",
      "loading.preparing": "Preparing immersive learning environment",

      // Common
      "common.loading": "Loading...",
      "common.error": "Error",
      "common.success": "Success",
      "common.cancel": "Cancel",
      "common.confirm": "Confirm",
      "common.save": "Save",
      "common.delete": "Delete",
      "common.edit": "Edit",
      "common.view": "View",
      "common.back": "Back",
      "common.next": "Next",
      "common.previous": "Previous",
      "common.close": "Close",
      "common.open": "Open",
      "common.search": "Search",
      "common.filter": "Filter",
      "common.sort": "Sort",
      "common.language": "Language",

      // Auth
      "auth.welcome": "Welcome",
      "auth.signin.title": "Sign In to Your Account",
      "auth.signup.title": "Create Your Account",
      "auth.email": "Email",
      "auth.password": "Password",
      "auth.confirmPassword": "Confirm Password",
      "auth.forgotPassword": "Forgot Password?",
      "auth.noAccount": "Don't have an account?",
      "auth.haveAccount": "Already have an account?",
      "auth.signUp": "Sign Up",
      "auth.signIn": "Sign In",

      // Dashboard
      "dashboard.title": "Dashboard",
      "dashboard.welcome": "Welcome back",
      "dashboard.progress": "Your Progress",
      "dashboard.achievements": "Achievements",
      "dashboard.recent": "Recent Activity",

      // Courses
      "courses.title": "Courses",
      "courses.description": "Learn with interactive courses",
      "courses.enroll": "Enroll Now",
      "courses.start": "Start Course",
      "courses.continue": "Continue",
      "courses.completed": "Completed",

      // Quiz
      "quiz.title": "Quiz",
      "quiz.start": "Start Quiz",
      "quiz.submit": "Submit Answer",
      "quiz.next": "Next Question",
      "quiz.finish": "Finish Quiz",
      "quiz.score": "Your Score",
      "quiz.correct": "Correct",
      "quiz.incorrect": "Incorrect",

      // Games
      "games.title": "Games",
      "games.description": "Learn through fun games",
      "games.play": "Play Now",
      "games.score": "Score",

      // Materials
      "materials.title": "Materials",
      "materials.description": "Access learning materials",
      "materials.download": "Download",
      "materials.view": "View Material",

      // News
      "news.title": "News",
      "news.latest": "Latest News",
      "news.readMore": "Read More",

      // Contact
      "contact.title": "Contact Us",
      "contact.description": "Get in touch with us",
      "contact.name": "Name",
      "contact.message": "Message",
      "contact.send": "Send Message",

      // Footer
      "footer.about": "About InnoVerse",
      "footer.description": "Technology education platform for everyone",
      "footer.links": "Quick Links",
      "footer.contact": "Contact",
      "footer.social": "Follow Us",
      "footer.copyright": "© 2024 InnoVerse. All rights reserved."
    }
  },
  id: {
    translation: {
      // Navigation
      "nav.home": "Beranda",
      "nav.courses": "Kursus",
      "nav.materials": "Materi",
      "nav.quiz": "Kuis",
      "nav.games": "Permainan",
      "nav.news": "Berita",
      "nav.contact": "Kontak",
      "nav.dashboard": "Dasbor",
      "nav.admin": "Admin",
      "nav.signin": "Masuk",
      "nav.signup": "Daftar",
      "nav.signout": "Keluar",
      "nav.profile": "Profil",
      "nav.settings": "Pengaturan",

      // Loading Screen
      "loading.initializing": "Menginisialisasi Pengalaman InnoVerse...",
      "loading.preparing": "Mempersiapkan lingkungan pembelajaran imersif",

      // Common
      "common.loading": "Memuat...",
      "common.error": "Kesalahan",
      "common.success": "Berhasil",
      "common.cancel": "Batal",
      "common.confirm": "Konfirmasi",
      "common.save": "Simpan",
      "common.delete": "Hapus",
      "common.edit": "Edit",
      "common.view": "Lihat",
      "common.back": "Kembali",
      "common.next": "Selanjutnya",
      "common.previous": "Sebelumnya",
      "common.close": "Tutup",
      "common.open": "Buka",
      "common.search": "Cari",
      "common.filter": "Filter",
      "common.sort": "Urutkan",
      "common.language": "Bahasa",

      // Auth
      "auth.welcome": "Selamat Datang",
      "auth.signin.title": "Masuk ke Akun Anda",
      "auth.signup.title": "Buat Akun Anda",
      "auth.email": "Email",
      "auth.password": "Kata Sandi",
      "auth.confirmPassword": "Konfirmasi Kata Sandi",
      "auth.forgotPassword": "Lupa Kata Sandi?",
      "auth.noAccount": "Belum punya akun?",
      "auth.haveAccount": "Sudah punya akun?",
      "auth.signUp": "Daftar",
      "auth.signIn": "Masuk",

      // Dashboard
      "dashboard.title": "Dasbor",
      "dashboard.welcome": "Selamat datang kembali",
      "dashboard.progress": "Progress Anda",
      "dashboard.achievements": "Pencapaian",
      "dashboard.recent": "Aktivitas Terbaru",

      // Courses
      "courses.title": "Kursus",
      "courses.description": "Belajar dengan kursus interaktif",
      "courses.enroll": "Daftar Sekarang",
      "courses.start": "Mulai Kursus",
      "courses.continue": "Lanjutkan",
      "courses.completed": "Selesai",

      // Quiz
      "quiz.title": "Kuis",
      "quiz.start": "Mulai Kuis",
      "quiz.submit": "Kirim Jawaban",
      "quiz.next": "Pertanyaan Selanjutnya",
      "quiz.finish": "Selesai Kuis",
      "quiz.score": "Skor Anda",
      "quiz.correct": "Benar",
      "quiz.incorrect": "Salah",

      // Games
      "games.title": "Permainan",
      "games.description": "Belajar melalui permainan yang menyenangkan",
      "games.play": "Main Sekarang",
      "games.score": "Skor",

      // Materials
      "materials.title": "Materi",
      "materials.description": "Akses materi pembelajaran",
      "materials.download": "Unduh",
      "materials.view": "Lihat Materi",

      // News
      "news.title": "Berita",
      "news.latest": "Berita Terbaru",
      "news.readMore": "Baca Selengkapnya",

      // Contact
      "contact.title": "Hubungi Kami",
      "contact.description": "Hubungi kami",
      "contact.name": "Nama",
      "contact.message": "Pesan",
      "contact.send": "Kirim Pesan",

      // Footer
      "footer.about": "Tentang InnoVerse",
      "footer.description": "Platform pendidikan teknologi untuk semua orang",
      "footer.links": "Tautan Cepat",
      "footer.contact": "Kontak",
      "footer.social": "Ikuti Kami",
      "footer.copyright": "© 2024 InnoVerse. Hak cipta dilindungi undang-undang."
    }
  }
}

i18n
  // pass the i18n instance to react-i18next.
  .use(initReactI18next)
  // init i18next
  // for all options read: https://www.i18next.com/overview/configuration-options
  .init({
    resources,
    lng: 'en', // language to use, more info here: https://www.i18next.com/overview/configuration-options#languages-namespaces-resources
    // you can use the i18n.changeLanguage function to change the language manually: https://www.i18next.com/overview/api#changelanguage
    // if you're using a language detector, do not define the lng option

    interpolation: {
      escapeValue: false // react already does escaping
    }
  })

export default i18n
export { i18n }
