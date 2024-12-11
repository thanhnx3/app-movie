import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

function Info() {
  const { slug } = useParams();
  const [info, setInfo] = useState("");

  useEffect(() => {
    fetch(`https://phimapi.com/phim/${slug}`)
      .then((res) => res.json())
      .then((info_content) => {
        setInfo(info_content.movie);
        document.title = info_content.movie.name;
      });
  }, [slug]);

  return (
    <div className="container px-20">
      {info && (
        <div className="relative p-6 rounded-lg shadow-lg text-white">
          <div className="relative">
            <img
              className="w-full h-[460px] object-cover rounded-lg"
              src={info.thumb_url}
              alt=""
            />
            <div className="absolute bottom-14 left-6 flex flex-col items-center gap-3">
              <img
                className="w-44 h-72 object-cover rounded-lg shadow-lg"
                src={info.poster_url}
                alt=""
              />
              <a
                href={`/watch/${info.slug}`}
                className="px-12 py-2 bg-red-600 text-white rounded-lg text-center font-semibold transition hover:bg-red-700"
              >
                Xem Phim
              </a>
            </div>
          </div>
          <div className="mt-8">
            <p className="text-2xl font-semibold mb-2">Phim: {info.name}</p>
            <p className="text-gray-400 mb-4">Thời gian: {info.time}</p>
            <p className="text-gray-300 mb-4">Nội dung: {info.content}</p>
            <ul className="list-disc list-inside space-y-1 text-gray-300">
              <p className="text-lg font-medium">Diễn viên:</p>
              {info.actor.map((item, index) => (
                <li key={index} className="ml-4 list-none">
                  - {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}

export default Info;
