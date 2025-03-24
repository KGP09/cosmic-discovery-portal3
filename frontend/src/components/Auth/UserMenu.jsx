import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "../../store/useAuthStore";
const UserMenu = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const {logout} = useAuthStore()
  const toggleMenu = () => setIsMenuOpen((prev) => !prev);
  const navigate = useNavigate();
  const hangleLogout = ()=>{
      logout();
      navigate('/');
  }
  return (
    <div className="relative">
      <button
        onClick={toggleMenu}
        className="p-2 rounded-full bg-transparent hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
        aria-label="User Menu"
      >
        <svg
          className="h-6 w-6 text-gray-700 dark:text-gray-300"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M5 3h14M5 12h14M5 21h14"
          />
        </svg>
      </button>

      {isMenuOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
          <ul className="py-2 text-sm">
            <li className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer">
              Profile
            </li>
            <li className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer">
              Settings
            </li>
            <li onClick={hangleLogout}  className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer">
              Log Out
            </li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default UserMenu;
