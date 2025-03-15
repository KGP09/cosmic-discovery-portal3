import { useState } from "react";

const ThemeToggle = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle("dark", !isDarkMode);
  };

  return (
    <button
      onClick={toggleTheme}
      className="p-2 rounded-full bg-transparent hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
      aria-label="Toggle Theme"
    >
      {isDarkMode ? (
        <svg
          className="h-5 w-5 text-gray-700 dark:text-gray-300"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M12 3v1m4.22.78A9 9 0 0112 21a9 9 0 01-4.22-16.22m0 0A9 9 0 0112 3m0 0c1.084 0 2.09.25 3.037.698"
          />
        </svg>
      ) : (
        <svg
          className="h-5 w-5 text-gray-700 dark:text-gray-300"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M12 3v1m4.22.78A9 9 0 0112 21a9 9 0 01-4.22-16.22m0 0A9 9 0 0112 3m0 0c1.084 0 2.09.25 3.037.698"
          />
        </svg>
      )}
    </button>
  );
};

export default ThemeToggle;
