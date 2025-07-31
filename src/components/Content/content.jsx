import { useEffect, useState, useRef } from "react";
import PropTypes from "prop-types";
import { ChevronLeft, ChevronRight, Star, Play, Calendar, Clock } from "lucide-react";
import { generateMovieRating, formatRating } from "../../routes/rating"; 

function Content() {
  const [films, setFilms] = useState({
    hoatHinh: [],
    phimle: [],
    phimbo: [],
    tvshows: [],
  });
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("all");
  const [currentHeroIndex, setCurrentHeroIndex] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [hoatHinhRes, phimleRes, phimboRes, tvshowRes] = await Promise.all([
          fetch(`https://phimapi.com/v1/api/danh-sach/hoat-hinh?limit=12`),
          fetch(`https://phimapi.com/v1/api/danh-sach/phim-le?limit=12`),
          fetch(`https://phimapi.com/v1/api/danh-sach/phim-bo?limit=12`),
          fetch(`https://phimapi.com/v1/api/danh-sach/tv-shows?limit=12`),
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
          "PhimMax - Xem phim chất lượng cao miễn phí. Phim hd VietSub & thuyết minh.";
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Scroll references for each section
  const scrollRefs = {
    hoatHinh: useRef(null),
    phimle: useRef(null),
    phimbo: useRef(null),
    tvshows: useRef(null),
  };

  const scroll = (direction, section) => {
    if (scrollRefs[section] && scrollRefs[section].current) {
      scrollRefs[section].current.scrollBy({
        left: direction === "left" ? -400 : 400,
        behavior: "smooth",
      });
    }
  };

  // Get featured films (mix of different categories)
  const getFeaturedFilms = () => {
    const featured = [];
    if (films.phimle.length > 0) featured.push(...films.phimle.slice(0, 3));
    if (films.phimbo.length > 0) featured.push(...films.phimbo.slice(0, 2));
    if (films.hoatHinh.length > 0) featured.push(...films.hoatHinh.slice(0, 2));
    return featured;
  };

  const featuredFilms = getFeaturedFilms();
  const currentFeaturedFilm = featuredFilms[currentHeroIndex] || {
    name: "Loading...",
    origin_name: "",
    poster_url: "/api/placeholder/800/450",
    quality: "HD",
    slug: "#",
    year: 2023,
    time: "120 phút"
  };

  // Hero navigation functions
  const nextHero = () => {
    if (featuredFilms.length > 0) {
      setCurrentHeroIndex((prev) => (prev + 1) % featuredFilms.length);
    }
  };

  const prevHero = () => {
    if (featuredFilms.length > 0) {
      setCurrentHeroIndex((prev) => (prev - 1 + featuredFilms.length) % featuredFilms.length);
    }
  };

  const FilmCard = ({ film }) => {
    const rating = generateMovieRating(film.slug);
    const ratingFormatted = formatRating(rating);
    
    return (
      <div className="relative group flex-shrink-0 w-44">
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg z-10 flex items-end justify-center pb-2">
          <a href={`/info/${film.slug}`} className="bg-red-600 text-white px-4 py-2 rounded-full flex items-center gap-1 text-sm font-medium hover:bg-red-700 transition-colors">
            <Play size={16} /> Xem ngay
          </a>
        </div>
        <div className="w-full aspect-[2/3] bg-gray-900 rounded-lg overflow-hidden shadow-lg transition-all duration-300 group-hover:shadow-xl group-hover:scale-105">
          <a href={`/info/${film.slug}`}>
            <img
              src={`https://phimimg.com/${film.poster_url}`}
              alt={film.name}
              className="w-full h-full object-cover"
              loading="lazy"
            />
          </a>
          <div className="absolute top-2 right-2 bg-yellow-500/90 text-xs font-bold text-black px-2 py-1 rounded">
            {film.quality === "FHD" ? "FHD" : "HD"}
          </div>
          <div className="absolute top-2 left-2 bg-black/70 rounded px-1.5 py-1 flex items-center">
            <Star size={14} className={ratingFormatted.color + " mr-1"} />
            <span className="text-white text-xs font-medium">{ratingFormatted.value}</span>
          </div>
        </div>
        <div className="mt-2 px-1">
          <a
            href={`/info/${film.slug}`}
            className="block text-white text-sm font-medium truncate hover:text-red-400"
          >
            {film.name}
          </a>
          <a
            href={`/info/${film.slug}`}
            className="block text-gray-400 text-xs truncate mb-1"
          >
            {film.origin_name}
          </a>
        </div>
      </div>
    );
  };

  FilmCard.propTypes = {
    film: PropTypes.shape({
      name: PropTypes.string.isRequired,
      origin_name: PropTypes.string,
      poster_url: PropTypes.string.isRequired,
      quality: PropTypes.string,
      slug: PropTypes.string.isRequired,
    }).isRequired,
  };

  const renderFilmList = (filmList, title, section, isScroll = false) => {
    if (filmList.length === 0 && !loading) return null;
    
    return (
      <div className="my-10">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-white">
            <span className="border-l-4 border-red-600 pl-3">{title}</span>
          </h2>
          {isScroll && (
            <div className="flex space-x-2">
              <button
                onClick={() => scroll("left", section)}
                className="text-white bg-gray-800/60 rounded-full p-2 hover:bg-red-600 transition-colors"
                aria-label="Scroll left"
              >
                <ChevronLeft size={20} />
              </button>
              <button
                onClick={() => scroll("right", section)}
                className="text-white bg-gray-800/60 rounded-full p-2 hover:bg-red-600 transition-colors"
                aria-label="Scroll right"
              >
                <ChevronRight size={20} />
              </button>
            </div>
          )}
        </div>

        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {[...Array(6)].map((_, index) => (
              <div key={index} className="animate-pulse">
                <div className="bg-gray-700 w-full aspect-[2/3] rounded-lg"></div>
                <div className="mt-2 h-4 bg-gray-700 rounded w-3/4"></div>
                <div className="mt-1 h-3 bg-gray-700 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        ) : (
          <div
            ref={scrollRefs[section]}
            className={isScroll ? "flex space-x-4 overflow-x-auto scrollbar-hide pb-4" : "grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4"}
          >
            {filmList.map((film, index) => (
              <FilmCard key={index} film={film} />
            ))}
          </div>
        )}
      </div>
    );
  };

  // Hero section with navigation
  const renderHeroSection = () => {
    if (loading || !currentFeaturedFilm) return null;
    
    const heroRating = generateMovieRating(currentFeaturedFilm.slug);
    const heroRatingFormatted = formatRating(heroRating);
    
    return (
      <div className="relative h-96 mb-14 rounded-xl overflow-hidden shadow-2xl">
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/70 to-transparent z-10"></div>
        <img 
          src={`https://phimimg.com/${currentFeaturedFilm.poster_url}`} 
          alt={currentFeaturedFilm.name} 
          className="w-full h-full object-cover transition-all duration-500"
        />
        
        {/* Navigation Buttons */}
        {featuredFilms.length > 1 && (
          <>
            <button
              onClick={prevHero}
              className="absolute left-4 top-1/2 transform -translate-y-1/2 z-30 text-white bg-black/50 hover:bg-red-600 rounded-full p-3 transition-colors group"
              aria-label="Previous featured film"
            >
              <ChevronLeft size={24} className="group-hover:scale-110 transition-transform" />
            </button>
            <button
              onClick={nextHero}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 z-30 text-white bg-black/50 hover:bg-red-600 rounded-full p-3 transition-colors group"
              aria-label="Next featured film"
            >
              <ChevronRight size={24} className="group-hover:scale-110 transition-transform" />
            </button>
          </>
        )}
        
        {/* Indicators */}
        {featuredFilms.length > 1 && (
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-30 flex space-x-2">
            {featuredFilms.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentHeroIndex(index)}
                className={`w-3 h-3 rounded-full transition-colors ${
                  index === currentHeroIndex ? "bg-red-600" : "bg-white/50 hover:bg-white/70"
                }`}
                aria-label={`Go to featured film ${index + 1}`}
              />
            ))}
          </div>
        )}
        
        <div className="absolute bottom-0 left-0 right-0 p-8 z-20">
          <h1 className="text-4xl font-bold text-white mb-2">{currentFeaturedFilm.name}</h1>
          <p className="text-gray-300 text-lg mb-4">{currentFeaturedFilm.origin_name}</p>
          <div className="flex items-center space-x-4 mb-6 text-sm text-gray-300">
            <div className="flex items-center">
              <Star size={16} className={heroRatingFormatted.color + " mr-1"} />
              <span>{heroRatingFormatted.value}</span>
            </div>
            <div className="flex items-center">
              <Calendar size={16} className="mr-1" />
              <span>{currentFeaturedFilm.year || "2023"}</span>
            </div>
            <div className="flex items-center">
              <Clock size={16} className="mr-1" />
              <span>{currentFeaturedFilm.time || "120 phút"}</span>
            </div>
            <div className="bg-yellow-500/90 text-xs font-bold text-black px-2 py-1 rounded">
              {currentFeaturedFilm.quality === "FHD" ? "FHD" : "HD"}
            </div>
          </div>
          <div className="flex space-x-4">
            <a href={`/info/${currentFeaturedFilm.slug}`} className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-full flex items-center gap-2 font-medium transition-colors">
              <Play size={20} strokeWidth={2.5} />
              Xem ngay
            </a>
            <a href={`/info/${currentFeaturedFilm.slug}`} className="bg-gray-800/60 hover:bg-gray-700 text-white px-6 py-3 rounded-full font-medium transition-colors">
              Chi tiết
            </a>
          </div>
        </div>
      </div>
    );
  };

  // Filter tabs
  const renderTabs = () => {
    const tabs = [
      { id: "all", label: "Tất cả" },
      { id: "phimle", label: "Phim lẻ" },
      { id: "phimbo", label: "Phim bộ" },
      { id: "hoatHinh", label: "Hoạt hình" },
      { id: "tvshows", label: "TV Shows" }
    ];
    
    return (
      <div className="flex overflow-x-auto space-x-2 mb-8 pb-2">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-5 py-2 rounded-full font-medium text-sm whitespace-nowrap transition-colors ${
              activeTab === tab.id
                ? "bg-red-600 text-white"
                : "text-gray-300 bg-gray-800/60 hover:bg-gray-700"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>
    );
  };

  return (
    <div className="bg-gray-900 min-h-screen text-white">
      <div className="max-w-screen-xl mx-auto px-6 sm:px-8 py-8">
        {renderHeroSection()}
        
        {renderTabs()}
        
        {(activeTab === "all" || activeTab === "hoatHinh") &&
          renderFilmList(films.hoatHinh, "Phim Hoạt Hình Đề Cử", "hoatHinh", true)}
          
        {(activeTab === "all" || activeTab === "phimle") &&
          renderFilmList(films.phimle, "Phim Lẻ Đề Cử", "phimle")}
          
        {(activeTab === "all" || activeTab === "phimbo") &&
          renderFilmList(films.phimbo, "Phim Bộ Đề Cử", "phimbo")}
          
        {(activeTab === "all" || activeTab === "tvshows") &&
          renderFilmList(films.tvshows, "TV Shows Đề Cử", "tvshows", true)}
      </div>
    </div>
  );
}

export default Content;