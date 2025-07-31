import { useEffect, useState } from "react";
import { Play, Star } from "lucide-react";
import { generateMovieRating, formatRating } from "../../routes/rating";

function News() {
  const [news, setNews] = useState([]);

  useEffect(() => {
    fetch("https://phimapi.com/danh-sach/phim-moi-cap-nhat")
      .then((res) => res.json())
      .then((newsData) => {
        setNews(newsData.items);
        document.title = "Phim mới cập nhật !!";
      })
      .catch((error) => console.error("Error fetching data:", error));
  }, []);

  return (
    <div className="container mx-auto px-14 py-8">
      <div className="mb-5">
        <span className="text-2xl font-bold text-yellow-500">
          PHIM MỚI CẬP NHẬT
        </span>
        <div className="border-t border-gray-200 mt-2"></div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
        {news.map((data, index) => {
          const rating = generateMovieRating(data.slug); // Sử dụng slug làm ID thống nhất
          const ratingFormatted = formatRating(rating);
          
          return (
            <div
              key={index}
              className="relative group flex-shrink-0"
            >
              {/* Hover nút "Xem ngay" */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg z-10 flex items-end justify-center pb-2">
                <a 
                  href={`/info/${data.slug}`} 
                  className="bg-red-600 text-white px-4 py-2 rounded-full flex items-center gap-1 text-sm font-medium hover:bg-red-700 transition-colors"
                >
                  <Play size={16} /> Xem ngay
                </a>
              </div>

              {/* Container poster phim */}
              <div className="w-full aspect-[2/3] bg-gray-900 rounded-lg overflow-hidden shadow-lg transition-all duration-300 group-hover:shadow-xl group-hover:scale-105 relative">
                <a href={`/info/${data.slug}`}>
                  <img
                    className="w-full h-full object-cover"
                    src={data.poster_url}
                    alt={data.name || "card__film"}
                    loading="lazy"
                  />
                </a>
                
                {/* Icon chất lượng */}
                <div className="absolute top-2 right-2 bg-yellow-500/90 text-xs font-bold text-black px-2 py-1 rounded">
                  {data.quality || "HD"}
                </div>
                
                {/* Icon đánh giá */}
                <div className="absolute top-2 left-2 bg-black/70 rounded px-1.5 py-1 flex items-center">
                  <Star size={14} className={ratingFormatted.color + " mr-1"} />
                  <span className="text-white text-xs font-medium">{ratingFormatted.value}</span>
                </div>

                {/* Icon mới/cập nhật */}
                <div className="absolute bottom-2 left-2 bg-red-600/90 text-xs font-bold text-white px-2 py-1 rounded">
                  MỚI
                </div>
              </div>

              {/* Thông tin phim */}
              <div className="mt-2 px-1">
                <a
                  href={`/info/${data.slug}`}
                  className="block text-white text-sm font-medium truncate hover:text-red-400"
                >
                  {data.name}
                </a>
                <a
                  href={`/info/${data.slug}`}
                  className="block text-gray-400 text-xs truncate mb-1"
                >
                  {data.origin_name}
                </a>
                {/* Thông tin tập phim nếu có */}
                {data.episode_current && (
                  <div className="text-green-400 text-xs font-medium">
                    {data.episode_current}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default News;