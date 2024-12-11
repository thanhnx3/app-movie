import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

function Movie() {
  const [movie, setMovie] = useState([]);
  const [title, setTitle] = useState("");

  const { movieId } = useParams();

  useEffect(() => {
    fetch(`https://phimapi.com/v1/api/danh-sach/${movieId}?limit=24`)
      .then((res) => res.json())
      .then((phimle) => {
        setMovie(phimle.data.items);
        setTitle(phimle.data.titlePage);
        document.title = phimle.data.seoOnPage.titleHead;
      })
      .catch((error) => console.error("Error fetching data:", error));
  }, [movieId]);

  return (
    <div className="container mx-auto px-14 py-8">
      <div className="mb-5">
        <span className="text-2xl font-bold text-yellow-500">{title}</span>
        <div className="border-t border-gray-200 mt-2"></div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
        {movie.map((data, index) => (
          <div
            key={index}
            className="flex flex-col items-center rounded-lg shadow-lg overflow-hidden"
          >
            <div className="w-full aspect-w-2 aspect-h-3 bg-white rounded-md overflow-hidden transition-transform duration-300 hover:scale-105">
              <a href={`/info/${data.slug}`} className="w-full h-64">
                <img
                  className="w-full h-full object-cover aspect-[2/3]"
                  src={`https://phimimg.com/${data.poster_url}`}
                  alt={data.name || "card__film"}
                />
              </a>
            </div>
            <div className="mt-2 text-center w-full">
              <a
                href={`/info/${data.slug}`}
                className="block text-white text-base font-medium truncate hover:text-red-400"
              >
                {data.name}
              </a>
              <a
                href={`/info/${data.slug}`}
                className="block text-gray-400 text-sm truncate"
              >
                {data.origin_name}
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Movie;
