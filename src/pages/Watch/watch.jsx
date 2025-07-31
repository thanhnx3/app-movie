import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Hls from "hls.js";

function Watch() {
  const { slug } = useParams();
  const [chap, setChap] = useState([]); // Tổng số tập phim
  const [active, setActive] = useState(0); // Tập đang xem
  const [film, setFilm] = useState(""); // Link phim hiện tại
  const [activeFilm, setActiveFilm] = useState([]); // Danh sách tập phim (server_data)

  // Dữ liệu phim
  const [content, setContent] = useState({
    name: "", time: "", content: "", category: [],
    director: [], actor: [], country: [], quality: "",
    episode_current: "", episode_total: "", year: "", poster_url: ""
  });

  const [currentServer, setCurrentServer] = useState(0); // Server phụ đề / lồng tiếng
  const [loading, setLoading] = useState(true); // Trạng thái loading phim
  const [isFullInfo, setIsFullInfo] = useState(false); // Trạng thái xem thêm nội dung phim

  const [recommendations, setRecommendations] = useState([]); // Phim đề xuất
  const [loadingRecommendations, setLoadingRecommendations] = useState(false);

  const itemsPerPage = 30;
  const [currentPage, setCurrentPage] = useState(0); // Phân trang tập phim

  useEffect(() => {
    const fetchFilm = async () => {
      setLoading(true);
      try {
        const res = await fetch(`https://phimapi.com/phim/${slug}`);
        const { movie, episodes } = await res.json();
        const m = movie || {};
        const ep = episodes[currentServer]?.server_data || [];

        // Cập nhật nội dung phim và danh sách tập
        setContent({ ...content, ...m });
        setChap(ep.length || 0);
        setFilm(ep[0]?.link_m3u8 || "");
        setActiveFilm(ep);

        // Đặt tiêu đề trang
        document.title = m.name || "Xem phim";
      } catch (err) {
        console.error("Lỗi tải phim:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchFilm();
  }, [slug, currentServer]);

  // Xử lý phát video bằng HLS.js
  useEffect(() => {
    const video = document.getElementById("my-hls-video");
    let hls;

    if (video && film) {
      if (Hls.isSupported()) {
        hls = new Hls({ maxBufferLength: 30, maxMaxBufferLength: 60 });
        hls.loadSource(film);
        hls.attachMedia(video);
        hls.on(Hls.Events.MANIFEST_PARSED, () => video.play().catch(() => {}));
      } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
        video.src = film;
        video.play().catch(() => {});
      }
    }

    return () => hls && hls.destroy();
  }, [film]);

  // Gợi ý phim đề xuất
  useEffect(() => {
    const fetchRecommendations = async () => {
      setLoadingRecommendations(true);
      try {
        const res = await fetch("https://phimapi.com/danh-sach/phim-moi-cap-nhat?page=1");
        const { items } = await res.json();
        setRecommendations(items?.filter(i => i.slug !== slug).slice(0, 3) || []);
      } catch {
        setRecommendations([]);
      } finally {
        setLoadingRecommendations(false);
      }
    };
    if (slug) fetchRecommendations();
  }, [slug]);

  const pageCount = Math.ceil(chap / itemsPerPage);
  const displayedEpisodes = Array.from({ length: chap })
    .slice(currentPage * itemsPerPage, (currentPage + 1) * itemsPerPage);

  const RecommendationItem = ({ movie }) => {
  const { slug, poster_url, thumb_url, name, year, quality, category } = movie || {};

  return (
    <div
      className="flex gap-3 cursor-pointer hover:bg-gray-700 p-2 rounded-md transition-colors"
      onClick={() => window.location.href = `/watch/${slug}`}
    >
      <div className="w-16 h-20 bg-gray-700 rounded overflow-hidden">
        <img
          src={poster_url || thumb_url}
          alt={name}
          className="w-full h-full object-cover"
        />
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-medium text-gray-300 text-sm line-clamp-2 mb-1">
          {name}
        </p>
        <p className="text-xs text-gray-400">
          {year} • {quality || "FHD"}
        </p>
        {Array.isArray(category) && category.length > 0 && (
          <p className="text-xs text-gray-500 mt-1 truncate">
            {category.slice(0, 2).map((c) => c.name).join(", ")}
          </p>
        )}
      </div>
    </div>
  );
};


  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900">
        <div className="flex flex-col items-center">
          <div className="w-16 h-16 border-4 border-t-green-500 border-gray-700 rounded-full animate-spin"></div>
          <p className="mt-4 text-xl text-gray-300">Đang tải phim...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-900 min-h-screen text-gray-200 px-4 py-6">
      <div className="max-w-7xl mx-auto">
        {/* HEADER */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold text-white">{content.name}</h1>
            <div className="flex items-center gap-2 mt-1">
              <p className="text-green-500 font-medium">Tập {active + 1} / {chap}</p>
              {content.episode_current && content.episode_total && (
                <p className="text-gray-400">• {content.episode_current} / {content.episode_total}</p>
              )}
              {content.quality && (
                <span className="px-2 py-0.5 bg-green-600 text-white text-xs rounded">
                  {content.quality}
                </span>
              )}
            </div>
          </div>
          <div className="flex gap-2">
            {['Phụ đề', 'Lồng tiếng'].map((label, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentServer(idx)}
                className={`px-4 py-2 rounded-md font-medium transition ${currentServer === idx ? 'bg-green-600 text-white' : 'bg-gray-800 text-gray-300 hover:bg-gray-700'}`}
              >{label}</button>
            ))}
          </div>
        </div>

        {/* MAIN CONTENT */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* VIDEO */}
          <div className="lg:col-span-8">
            <div className="bg-black rounded-lg overflow-hidden shadow-xl">
              <video id="my-hls-video" controls className="w-full aspect-video" controlsList="nodownload" poster={content.poster_url || ""} />
            </div>

            {/* Thông tin phim */}
            <div className="mt-6 bg-gray-800 rounded-lg p-5 shadow-lg">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold text-white">{content.name}</h2>
                <button onClick={() => setIsFullInfo(!isFullInfo)} className="text-sm text-green-400 hover:text-green-300">
                  {isFullInfo ? "Thu gọn" : "Xem thêm"}
                </button>
              </div>

              <div className="flex flex-wrap gap-2 mt-3">
                {Array.isArray(content.category)
                  ? content.category.map((cat, idx) => (
                      <span key={idx} className="bg-gray-700 px-2 py-1 rounded-md text-xs">{cat.name}</span>
                    ))
                  : typeof content.category === 'string'
                    ? content.category.split(',').map((cat, idx) => (
                        <span key={idx} className="bg-gray-700 px-2 py-1 rounded-md text-xs">{cat.trim()}</span>
                      ))
                    : null
                }
              </div>

              <div className="mt-4 space-y-2 text-sm">
                {content.time && (
                  <p className="flex items-center gap-2">
                    <span className="text-gray-400">Thời lượng:</span>
                    <span>{content.time}</span>
                  </p>
                )}
                {content.year && (
                  <p className="flex items-center gap-2">
                    <span className="text-gray-400">Năm phát hành:</span>
                    <span>{content.year}</span>
                  </p>
                )}
                {Array.isArray(content.country) && content.country.length > 0 && (
                  <p className="flex items-center gap-2">
                    <span className="text-gray-400">Quốc gia:</span>
                    <span>{content.country.map(c => c.name).join(', ')}</span>
                  </p>
                )}
                {Array.isArray(content.director) && content.director.length > 0 && (
                  <p className="flex items-center gap-2">
                    <span className="text-gray-400">Đạo diễn:</span>
                    <span>{content.director.join(', ')}</span>
                  </p>
                )}
                {Array.isArray(content.actor) && content.actor.length > 0 && (
                  <p className="flex items-center gap-2">
                    <span className="text-gray-400">Diễn viên:</span>
                    <span>{content.actor.slice(0, 3).join(', ')}{content.actor.length > 3 ? '...' : ''}</span>
                  </p>
                )}
              </div>

              {isFullInfo && content.content && (
                <div className="mt-4">
                  <p className="text-gray-400 mb-2">Nội dung:</p>
                  <p className="text-sm leading-relaxed text-gray-300">{content.content}</p>
                </div>
              )}
            </div>
          </div>

          {/* Danh sách tập và gợi ý */}
          <div className="lg:col-span-4">
            {/* Danh sách tập với phân trang */}
            <div className="bg-gray-800 rounded-lg p-4 shadow-lg mb-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-bold text-lg text-white">Danh sách tập</h3>
                <span className="text-sm text-gray-400">{chap} tập</span>
              </div>
              
              {/* Điều hướng trang */}
              {pageCount > 1 && (
                <div className="flex justify-center gap-2 mb-4">
                  <button 
                    onClick={() => setCurrentPage(prev => Math.max(0, prev - 1))}
                    disabled={currentPage === 0}
                    className={`w-8 h-8 flex items-center justify-center rounded ${
                      currentPage === 0 
                        ? "bg-gray-700 text-gray-500 cursor-not-allowed" 
                        : "bg-gray-700 hover:bg-gray-600 text-gray-300"
                    }`}
                  >
                    «
                  </button>
                  
                  <div className="flex items-center gap-1">
                    <span className="text-sm text-gray-400">
                      {currentPage + 1}/{pageCount}
                    </span>
                  </div>
                  
                  <button 
                    onClick={() => setCurrentPage(prev => Math.min(pageCount - 1, prev + 1))}
                    disabled={currentPage === pageCount - 1}
                    className={`w-8 h-8 flex items-center justify-center rounded ${
                      currentPage === pageCount - 1 
                        ? "bg-gray-700 text-gray-500 cursor-not-allowed" 
                        : "bg-gray-700 hover:bg-gray-600 text-gray-300"
                    }`}
                  >
                    »
                  </button>
                </div>
              )}
              
              {/* Grid tập phim */}
              <div className="grid grid-cols-5 gap-2">
                {displayedEpisodes.map((_, i) => {
                  const idx = i + currentPage * itemsPerPage;
                  return (
                    <button 
                      key={idx} 
                      className={`flex items-center justify-center h-10 rounded-md text-sm font-medium transition ${
                        active === idx 
                          ? 'bg-green-600 text-white' 
                          : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                      }`} 
                      onClick={() => {
                        setActive(idx);
                        setFilm(activeFilm[idx]?.link_m3u8 || "");
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                    >
                      {idx + 1}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Gợi ý phim */}
            <div className="bg-gray-800 rounded-lg p-4 shadow-lg">
              <h3 className="font-bold text-lg text-white mb-4">Đề xuất cho bạn</h3>
              
              {loadingRecommendations ? (
                <div className="flex justify-center py-8">
                  <div className="w-6 h-6 border-2 border-t-green-500 border-gray-600 rounded-full animate-spin"></div>
                </div>
              ) : recommendations.length > 0 ? (
                <div className="space-y-3">
                  {recommendations.map(movie => (
                    <RecommendationItem key={movie._id} movie={movie} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-6 text-gray-500">
                  <p className="text-sm">Không có phim đề xuất</p>
                </div>
              )}
              
              {/* Link xem thêm */}
              {recommendations.length > 0 && (
                <div className="mt-4 text-center">
                  <button 
                    className="text-green-400 hover:text-green-300 text-sm font-medium"
                    onClick={() => {
                      window.location.href = '/news';
                    }}
                  >
                    Xem thêm phim mới →
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Watch;