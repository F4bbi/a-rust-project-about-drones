import { useState, useEffect } from 'react'
import { Sun, Moon } from 'lucide-react'

const ThemeToggleButton = () => {
  const [isDark, setIsDark] = useState(() =>
    typeof window !== 'undefined' ? document.documentElement.classList.contains('dark') : false
  );

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [isDark])

  const toggleTheme = () => {
    setIsDark((prev) => !prev)
  }

  return (
    <div className="fixed top-0 right-0 z-10 pr-5 pt-5">
      <button
        onClick={toggleTheme}
        className="bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-xl shadow-lg border border-gray-200 dark:border-gray-600 transition-all duration-200 active:scale-95 w-[60px] h-[60px] flex items-center justify-center"
        title={isDark ? "Switch to light mode" : "Switch to dark mode"}
      >
        {isDark ? (
          <Sun className="h-6 w-6 text-yellow-500" />
        ) : (
          <Moon className="h-6 w-6 text-gray-600" />
        )}
      </button>
    </div>
  )
}

export default ThemeToggleButton