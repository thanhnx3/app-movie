import { useEffect, useState } from "react";
import { Play, Star, Palette, ChevronLeft, ChevronRight } from "lucide-react";
import { generateMovieRating, formatRating } from "../../routes/rating";

function Cartoon() {
  const [cartoon, setCartoon] = useState([]);
  const [title, setTitle] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);

  const fetchCartoons = async (page = 1) => {
    setLoading(true);
    try {
      const response = await fetch(`https://phimapi.com/v1/api/danh-sach/hoat-hinh?limit=24&page=${page}`);
      const data = await response.json();
      
      console.log("Dữ liệu đầy đủ:", data);
      
      if (data.data) {
        setCartoon(data.data.items);
        setTitle(data.data.titlePage);
        setTotalPages(data.data.params?.pagination?.totalPages || 1);
        document.title = data.data.seoOnPage.titleHead;
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCartoons(currentPage);
  }, [currentPage]);

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
      // Scroll về đầu trang khi chuyển trang
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const getVisiblePages = () => {
    const pages = [];
    const maxVisiblePages = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
    
    // Điều chỉnh startPage nếu endPage đã đạt tối đa
    if (endPage - startPage < maxVisiblePages - 1) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }
    
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    
    return pages;
  };

  return (
    <div className="container mx-auto px-14 py-8">
      <div className="mb-5">
        <span className="text-2xl font-bold text-yellow-500">{title}</span>
        <div className="border-t border-gray-200 mt-2"></div>
      </div>

      {/* Loading indicator */}
      {loading && (
        <div className="flex justify-center items-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-yellow-500"></div>
          <span className="ml-2 text-white">Đang tải...</span>
        </div>
      )}

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
        {cartoon.map((data, index) => {
          const rating = generateMovieRating(data.slug);
          const ratingFormatted = formatRating(rating);
          
          return (
            <div
              key={index}
              className="relative group flex-shrink-0"
            >
              {/* Hover overlay with "Xem ngay" button */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg z-10 flex items-end justify-center pb-2">
                <a 
                  href={`/info/${data.slug}`} 
                  className="bg-red-600 text-white px-4 py-2 rounded-full flex items-center gap-1 text-sm font-medium hover:bg-red-700 transition-colors"
                >
                  <Play size={16} /> Xem ngay
                </a>
              </div>

              {/* Movie poster container */}
              <div className="w-full aspect-[2/3] bg-gray-900 rounded-lg overflow-hidden shadow-lg transition-all duration-300 group-hover:shadow-xl group-hover:scale-105 relative">
                <a href={`/info/${data.slug}`}>
                  <img
                    className="w-full h-full object-cover"
                    src={`https://phimimg.com/${data.poster_url}`}
                    alt={data.name || "card__film"}
                    loading="lazy"
                  />
                </a>
                
                {/* Quality badge */}
                <div className="absolute top-2 right-2 bg-yellow-500/90 text-xs font-bold text-black px-2 py-1 rounded">
                  {data.quality || "HD"}
                </div>
                
                {/* Rating badge with consistent coloring */}
                <div className="absolute top-2 left-2 bg-black/70 rounded px-1.5 py-1 flex items-center">
                  <Star size={14} className={ratingFormatted.color + " mr-1"} />
                  <span className="text-white text-xs font-medium">{ratingFormatted.value}</span>
                </div>

                {/* Cartoon type badge với icon Palette */}
                <div className="absolute bottom-2 left-2 bg-pink-600/90 text-xs font-bold text-white px-2 py-1 rounded flex items-center gap-1">
                  <Palette size={12} />
                  HOẠT HÌNH
                </div>
              </div>

              {/* Movie info */}
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
                {/* Episode info và năm */}
                <div className="flex justify-between items-center text-xs">
                  {data.episode_current && (
                    <div className="text-green-400 font-medium">
                      {data.episode_current}
                    </div>
                  )}
                  {data.year && (
                    <div className="text-orange-400 font-medium">
                      {data.year}
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Pagination */}
      {!loading && totalPages > 1 && (
        <div className="flex justify-center items-center mt-8 space-x-2">
          {/* Previous button */}
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className={`flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
              currentPage === 1
                ? 'bg-gray-700 text-gray-400 cursor-not-allowed'
                : 'bg-gray-600 text-white hover:bg-gray-500'
            }`}
          >
            <ChevronLeft size={16} className="mr-1" />
            Trước
          </button>

          {/* First page */}
          {getVisiblePages()[0] > 1 && (
            <>
              <button
                onClick={() => handlePageChange(1)}
                className="px-3 py-2 rounded-lg text-sm font-medium bg-gray-600 text-white hover:bg-gray-500 transition-colors"
              >
                1
              </button>
              {getVisiblePages()[0] > 2 && (
                <span className="text-gray-400 px-2">...</span>
              )}
            </>
          )}

          {/* Page numbers */}
          {getVisiblePages().map((page) => (
            <button
              key={page}
              onClick={() => handlePageChange(page)}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                page === currentPage
                  ? 'bg-yellow-500 text-black'
                  : 'bg-gray-600 text-white hover:bg-gray-500'
              }`}
            >
              {page}
            </button>
          ))}

          {/* Last page */}
          {getVisiblePages()[getVisiblePages().length - 1] < totalPages && (
            <>
              {getVisiblePages()[getVisiblePages().length - 1] < totalPages - 1 && (
                <span className="text-gray-400 px-2">...</span>
              )}
              <button
                onClick={() => handlePageChange(totalPages)}
                className="px-3 py-2 rounded-lg text-sm font-medium bg-gray-600 text-white hover:bg-gray-500 transition-colors"
              >
                {totalPages}
              </button>
            </>
          )}

          {/* Next button */}
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className={`flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
              currentPage === totalPages
                ? 'bg-gray-700 text-gray-400 cursor-not-allowed'
                : 'bg-gray-600 text-white hover:bg-gray-500'
            }`}
          >
            Sau
            <ChevronRight size={16} className="ml-1" />
          </button>
        </div>
      )}

      {/* Page info */}
      {!loading && totalPages > 1 && (
        <div className="text-center mt-4 text-gray-400 text-sm">
          Trang {currentPage} / {totalPages}
        </div>
      )}
    </div>
  );
}

export default Cartoon;