import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar from "../../components/Navbar";
import CapsuleCard from "../../components/CapsuleCard";

const SearchResults = () => {
  const [searchResults, setSearchResults] = useState([]);
  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);
  const searchQuery = queryParams.get("query");

  useEffect(() => {
    const fetchSearchResults = async () => {
      if (!searchQuery) return;
      try {
        const token = localStorage.getItem("token");
        await fetch("http://localhost:5000/api/capsule/reload");
        const response = await fetch(`http://localhost:5000/api/capsule/search?query=${encodeURIComponent(searchQuery)}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await response.json()
        setSearchResults(data.capsules || []);
      } catch (error) {
        console.error("Error fetching search results:", error);
      }
    };

    fetchSearchResults();
  }, [searchQuery]);

  return (
    <>
      <Navbar onSearch={(query) => navigate(`/search?query=${query}`)} />
      <div className="search-results-container">
        <h1>Search Results</h1>
        <p>Showing results for: <strong>{searchQuery}</strong></p>

        {searchResults.length === 0 ? (
          <p>No capsules found.</p>
        ) : (
          <div className="capsules-container">
            {searchResults.map((capsule) => (
              <CapsuleCard
                key={capsule.id}
                capsule={capsule}
              />
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default SearchResults;
