import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Hls from "hls.js";

function Watch() {
  const [chap, setChap] = useState([]);
  const [active, setActive] = useState(0);
  const [film, setFilm] = useState("");
  const [activeFilm, setActiveFilm] = useState([]);
  const [content, setContent] = useState([]);
  const [currentServer, setCurrentServer] = useState(0);
  const { slug } = useParams();

  useEffect(() => {
    const WatchFilm = async () => {
      try {
        const res = await fetch(`https://phimapi.com/phim/${slug}`);
        const watch = await res.json();

        setContent(watch.movie);
        setChap(watch.episodes[currentServer]?.server_data.length || 0);
        setFilm(watch.episodes[currentServer]?.server_data[0]?.link_m3u8 || "");
        setActiveFilm(watch.episodes[currentServer]?.server_data || []);
        document.title = watch.movie.name;
      } catch (error) {
        console.error("Error fetching movie data:", error);
      }
    };

    WatchFilm();
  }, [slug, currentServer]);

  useEffect(() => {
    const video = document.getElementById("my-hls-video");

    if (Hls.isSupported()) {
      const hls = new Hls();
      hls.loadSource(film);
      hls.attachMedia(video);
      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        video.play();
      });
      return () => {
        hls.destroy();
      };
    } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
      video.src = film;
      video.play();
    }
  }, [film]);

  return (
    <div className="mt-6 pl-20 pr-20">
      <div className="container mx-auto">
        <div className="flex items-center gap-2.5 mb-6">
          <h1 className="text-xl font-semibold text-gray-300 uppercase">{`${
            content.name
          } ~ Tập ${active + 1}`}</h1>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-9 gap-4">
          <div className="lg:col-span-6">
            <video
              id="my-hls-video"
              controls
              className="w-full aspect-video rounded-md"
            />
          </div>
          <div className="lg:col-span-3">
            <div className="w-full p-4 bg-gray-900 rounded-md overflow-auto h-[410px]">
              <div className="flex gap-4 mb-4">
                <button
                  className={`px-4 py-2 rounded-md font-medium transition ${
                    currentServer === 0
                      ? "bg-green-500 text-white"
                      : "bg-gray-700 hover:bg-gray-600 text-white"
                  }`}
                  onClick={() => setCurrentServer(0)}
                >
                  Phụ đề
                </button>
                <button
                  className={`px-4 py-2 rounded-md font-medium transition ${
                    currentServer === 1
                      ? "bg-green-500 text-white"
                      : "bg-gray-700 hover:bg-gray-600 text-white"
                  }`}
                  onClick={() => setCurrentServer(1)}
                >
                  Lồng tiếng
                </button>
              </div>
              <div className="text-gray-300">
                <p className="font-roboto uppercase text-lg font-semibold">
                  Danh sách tập
                </p>
                <p className="mt-2 text-sm">
                  Chọn tập từ 1 đến <span className="font-bold">{chap}</span>
                </p>
              </div>
              <ul className="flex flex-wrap gap-2 mt-4">
                {Array.from({ length: chap }).map((_, i) => (
                  <li
                    key={i}
                    className={`flex items-center justify-center w-10 h-10 rounded-md text-sm font-medium cursor-pointer transition ${
                      active === i
                        ? "bg-green-500 text-white"
                        : "bg-gray-700 hover:bg-gray-600"
                    }`}
                    onClick={() => {
                      setActive(i);
                      setFilm(activeFilm[i]?.link_m3u8 || "");
                    }}
                  >
                    {i + 1}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
        <div className="mt-5">
          <div className="mt-5 text-gray-300">
            <p className="mt-3.5 leading-6">
              Thời gian: <span className="font-bold">{content.time}</span>
            </p>
            <p className="mt-3.5 leading-6">
              Nội dung: <span className="font-normal">{content.content}</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Watch;
