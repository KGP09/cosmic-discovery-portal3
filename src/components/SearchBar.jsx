import { useState } from "react";

const SearchBar = ({ placeholder, onSearch, expanded, className }) => {
  const [query, setQuery] = useState("");

  const handleInputChange = (e) => {
    setQuery(e.target.value);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    onSearch(query);
  };

  return (
    <form
      onSubmit={handleSearch}
      className={`flex items-center ${expanded ? "w-full" : "w-72"} transition-all ${className}`}
    >
      <input
        type="text"
        value={query}
        onChange={handleInputChange}
        placeholder={placeholder}
        className="px-4 py-2 rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary"
      />
      <button
        type="submit"
        className="ml-2 px-4 py-2 bg-primary text-white rounded-md transition-colors hover:bg-primary/90"
      >
        Search
      </button>
    </form>
  );
};

export default SearchBar;
