import { useEffect, useState } from "react";

function Search() {
  const [valueSearch, setValueSearch] = useState("");
  const [search, setSearch] = useState([]);

  useEffect(() => {
    if (valueSearch.trim() !== "") {
      fetch(
        `https://phimapi.com/v1/api/tim-kiem?keyword=${valueSearch}&limit=24`
      )
        .then((res) => res.json())
        .then((dataSearch) => {
          setSearch(dataSearch);
        })
        .catch((error) => console.error("Error fetching data:", error));
    } else {
      setSearch([]);
    }
  }, [valueSearch]);

  return (
    <div className="bg-gray-100 min-h-screen py-8">
      <div className="container mx-auto px-4">
        <div className="mb-6">
          <input
            onChange={(e) => setValueSearch(e.target.value)}
            value={valueSearch}
            name="search"
            type="text"
            placeholder="Vui lòng nhập tên phim..."
            className="w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
          {valueSearch &&
            search.data &&
            search.data.items &&
            search.data.items.length > 0 &&
            search.data.items.map((ds, index) => (
              <div
                key={index}
                className="bg-white rounded-lg shadow-lg overflow-hidden"
              >
                <a href={`/info/${ds.slug}`} className="block w-full h-64">
                  <img
                    className="w-full h-full object-cover"
                    src={`https://phimimg.com/${ds.poster_url}`}
                    alt={ds.title || "card__film"}
                  />
                </a>
                <div className="p-4 text-center">
                  <a
                    href={`/info/${ds.slug}`}
                    className="text-lg font-semibold text-gray-900 hover:text-red-600"
                  >
                    {ds.name || "Tên phim"}
                  </a>
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}

export default Search;
