import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";

function Header() {
  const [valueSearch, setValueSearch] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const searchRef = useRef(null);

  useEffect(() => {
    if (valueSearch.trim() !== "") {
      fetch(
        `https://phimapi.com/v1/api/tim-kiem?keyword=${valueSearch}&limit=20`
      )
        .then((res) => res.json())
        .then((data) => setSearchResults(data?.data?.items || []))
        .catch((error) =>
          console.error("Error fetching search results:", error)
        );
    } else {
      setSearchResults([]);
    }
  }, [valueSearch]);

  useEffect(() => {
    function handleClickOutside(event) {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setIsFocused(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <>
      <div className="bg-gray-900 fixed top-0 w-full z-50 shadow-lg">
        <div className="container mx-auto flex items-center justify-between py-2 px-4">
          <a
            href="/"
            className="text-3xl font-script text-customPurple text-opacity-75 hover:text-customBlue mr-4"
          >
            PhimMax
          </a>
          <nav className="hidden md:flex space-x-4 items-center text-white">
            <Link
              to="/news"
              className="hover:text-gray-300 hover:border-b-2 hover:border-blue-500 px-2 py-1 transition-all duration-300"
            >
              Phim Mới Cập Nhật
            </Link>
            <Link
              to="/hoat-hinh"
              className="hover:text-gray-300 hover:border-b-2 hover:border-blue-500 px-2 py-1 transition-all duration-300"
            >
              Phim Hoạt Hình
            </Link>
            <Link
              to="/movie/phim-le"
              className="hover:text-gray-300 hover:border-b-2 hover:border-blue-500 px-2 py-1 transition-all duration-300"
            >
              Phim Lẻ
            </Link>
            <Link
              to="/tv/phim-bo"
              className="hover:text-gray-300 hover:border-b-2 hover:border-blue-500 px-2 py-1 transition-all duration-300"
            >
              Phim Bộ
            </Link>
          </nav>
          <div
            className="relative flex-1 max-w-[250px] md:max-w-[250px] ml-auto"
            ref={searchRef}
          >
            <input
              type="text"
              placeholder="Tìm kiếm..."
              className="w-full p-2 pl-3 rounded-md bg-gray-800 text-base text-white focus:ring-2 focus:ring-blue-500"
              value={valueSearch}
              onChange={(e) => setValueSearch(e.target.value)}
              onFocus={() => setIsFocused(true)}
            />
            {isFocused && valueSearch.trim() !== "" && (
              <div className="absolute right-0 top-full mt-2 w-full bg-gray-700 shadow-lg rounded-lg overflow-hidden max-h-80 overflow-y-auto">
                {searchResults.length > 0 ? (
                  searchResults.map((item, index) => (
                    <a
                      key={index}
                      href={`/info/${item.slug}`}
                      className="flex items-center p-2 hover:bg-gray-600 "
                    >
                      <img
                        src={`https://phimimg.com/${item.poster_url}`}
                        alt={item.name}
                        className="w-16 h-22 object-cover rounded-md"
                      />
                      <div className="ml-3 text-sm font-medium text-white">
                        {item.name}
                      </div>
                    </a>
                  ))
                ) : (
                  <div className="p-4 text-sm text-gray-500">
                    Không tìm thấy kết quả.
                  </div>
                )}
              </div>
            )}
          </div>
          <button
            className="text-2xl text-white md:hidden focus:outline-none ml-4"
            onClick={toggleMenu}
          >
            ☰
          </button>
        </div>

        {isMenuOpen && (
          <nav className="md:hidden bg-gray-800 text-white text-sm right-0 top-full  w-48  absolute">
            <Link
              to="/news/phim-moi"
              className="block px-4 py-2 hover:bg-gray-700 hover:border-b-2 hover:border-blue-500"
            >
              Phim Mới Cập Nhật
            </Link>
            <Link
              to="/hoat-hinh"
              className="block px-4 py-2 hover:bg-gray-700 hover:border-b-2 hover:border-blue-500"
            >
              Phim Hoạt Hình
            </Link>
            <Link
              to="/movie/phim-le"
              className="block px-4 py-2 hover:bg-gray-700 hover:border-b-2 hover:border-blue-500"
            >
              Phim Lẻ
            </Link>
            <Link
              to="/tv/phim-bo"
              className="block px-4 py-2 hover:bg-gray-700 hover:border-b-2 hover:border-blue-500"
            >
              Phim Bộ
            </Link>
          </nav>
        )}
      </div>
      <div className="h-12 md:h-14"></div>
    </>
  );
}

export default Header;
