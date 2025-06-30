import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
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
    <div className="fixed top-6 right-6 z-10">
      <Button
        variant="outline"
        size="sm"
        onClick={toggleTheme}
        className="w-10 h-10 rounded-full border-2 hover:scale-105 transition-all duration-200"
      >
        {isDark ? (
          <Sun className="h-4 w-4 text-yellow-500" />
        ) : (
          <Moon className="h-4 w-4 text-gray-600" />
        )}
      </Button>
    </div>
  )
}

export default ThemeToggleButton