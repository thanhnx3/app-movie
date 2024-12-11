import React, { useEffect, useState } from "react";

function Content() {
  const [films, setFilms] = useState({
    hoatHinh: [],
    phimle: [],
    phimbo: [],
    tvshows: [],
  });

  // console.log(films);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [hoatHinhRes, phimleRes, phimboRes, tvshowRes] =
          await Promise.all([
            fetch(`https://phimapi.com/v1/api/danh-sach/hoat-hinh?limit=6`),
            fetch(`https://phimapi.com/v1/api/danh-sach/phim-le?limit=12`),
            fetch(`https://phimapi.com/v1/api/danh-sach/phim-bo?limit=12`),
            fetch(`https://phimapi.com/v1/api/danh-sach/tv-shows?limit=6`),
          ]);

        const hoatHinhData = await hoatHinhRes.json();
        const phimleData = await phimleRes.json();
        const phimboData = await phimboRes.json();
        const tvshowsData = await tvshowRes.json();

        setFilms({
          hoatHinh: hoatHinhData.data.items,
          phimle: phimleData.data.items,
          phimbo: phimboData.data.items,
          tvshows: tvshowsData.data.items,
        });

        document.title =
          "Phim Max chất lượng cao miễn phí. Xem phim hd VietSub. Phim thuyết minh chất lượng HD.";
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const renderFilmList = (filmList, title) => (
    <div className="my-8">
      <h2 className="text-2xl font-semibold text-yellow-500 uppercase mb-4">
        {title}
      </h2>
      <div className="border-t border-gray-200 mb-4 mt-4"></div>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
        {filmList.map((film, index) => (
          <div key={index} className="flex flex-col items-center">
            <div className="w-full aspect-w-2 aspect-h-3 bg-white rounded-md overflow-hidden transition-transform duration-300 hover:scale-105">
              <a href={`/info/${film.slug}`}>
                <img
                  src={`https://phimimg.com/${film.poster_url}`}
                  alt={film.name}
                  className="w-full h-full object-cover aspect-[2/3]"
                />
              </a>
            </div>
            <div className="mt-2 text-center w-full">
              <a
                href={`/info/${film.slug}`}
                className="block text-white text-base font-medium truncate hover:text-red-400"
              >
                {film.name}
              </a>
              <a
                href={`/info/${film.slug}`}
                className="block text-gray-400 text-sm truncate"
              >
                {film.origin_name}
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="max-w-screen-xl mx-auto px-6 sm:px-8">
      {films.hoatHinh.length > 0 &&
        renderFilmList(films.hoatHinh, "PHIM HOẠT HÌNH ĐỀ CỬ")}
      {films.phimle.length > 0 && renderFilmList(films.phimle, "PHIM LẺ ĐỀ CỬ")}
      {films.phimbo.length > 0 && renderFilmList(films.phimbo, "PHIM BỘ ĐỀ CỬ")}
      {films.tvshows.length > 0 &&
        renderFilmList(films.tvshows, "TV SHOWS ĐỀ CỬ")}
    </div>
  );
}

export default Content;
