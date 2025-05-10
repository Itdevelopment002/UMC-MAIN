import React, { useState } from "react";
import { searchablePages } from "./SearchPages";
import { useNavigate } from "react-router-dom";

const SearchBar = () => {
  const [query, setQuery] = useState("");
  const navigate = useNavigate();

  const handleSelect = (path) => {
    navigate(path);
    setQuery("");
  };

  const filteredPages = searchablePages.filter((page) =>
    page.title.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="search-bar-wrapper">
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search pages..."
      />
      {query && (
        <ul className="search-suggestions">
          {filteredPages.map((page, index) => (
            <li key={index} onClick={() => handleSelect(page.path)}>
              {page.title}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default SearchBar;
