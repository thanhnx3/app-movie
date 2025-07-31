function Footer() {
  return (
    <div className="container mx-auto px-10 py-8">
      <div className="footer_bar">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div>
            <h2 className="text-xl font-semibold text-red-300 mb-4">
              Về chúng tôi
            </h2>
            <p className="text-gray-400">
              Website chính thức và duy nhất của PhimMax. Hiện tại chúng mình
              chỉ có duy nhất một website chứ không có website nào khác nhé!
            </p>
          </div>
          <div>
            <h2 className="text-xl font-semibold text-red-300 mb-4">
              Phim Mới
            </h2>
            <ul className="space-y-2">
              <li>
                <a
                  className="text-gray-400 hover:text-gray-800"
                  href="/tv/phim-le"
                >
                  Phim lẻ
                </a>
              </li>
              <li>
                <a
                  className="text-gray-400 hover:text-gray-800"
                  href="/tv/hoat-hinh"
                >
                  Phim hoạt hình
                </a>
              </li>
              <li>
                <a
                  className="text-gray-400 hover:text-gray-800"
                  href="/movie/phim-bo"
                >
                  Phim bộ
                </a>
              </li>
              <li>
                <a className="text-gray-400 hover:text-gray-800" href="#!">
                  Phim khoa học
                </a>
              </li>
              <li>
                <a className="text-gray-400 hover:text-gray-800" href="#!">
                  Phim hành động
                </a>
              </li>
              <li>
                <a className="text-gray-400 hover:text-gray-800" href="#!">
                  Phim hài hước
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h2 className="text-xl font-semibold text-red-300 mb-4">
              Thông tin
            </h2>
            <ul className="space-y-2">
              <li>
                <a className="text-gray-400 hover:text-gray-800" href="#!">
                  Giới thiệu
                </a>
              </li>
              <li>
                <a className="text-gray-400 hover:text-gray-800" href="#!">
                  Chính sách bảo mật
                </a>
              </li>
              <li>
                <a className="text-gray-400 hover:text-gray-800" href="#!">
                  Điều khoản
                </a>
              </li>
              <li>
                <a className="text-gray-400 hover:text-gray-800" href="#!">
                  Sitemap
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h2 className="text-xl font-semibold text-red-300 mb-4">Hỗ trợ</h2>
            <p className="text-gray-400">
              Mọi thắc mắc và góp ý cần hỗ trợ xin vui lòng liên hệ Fanpage và
              Instagram
            </p>
            <div className="flex space-x-4 mt-4">
              <a href="#!" className="text-gray-400 hover:text-gray-800">
                <i className="gg-facebook"></i>
              </a>
              <a href="#!" className="text-gray-400 hover:text-gray-800">
                <i className="gg-instagram"></i>
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-200 my-6"></div>
        <div className="flex justify-center">
          <h2 className="text-gray-400 text-center">
            Copyright 2024 ©{" "}
            <span className="text-gray-600 font-semibold">PhimMax</span>
          </h2>
        </div>
      </div>
    </div>
  );
}

export default Footer;
