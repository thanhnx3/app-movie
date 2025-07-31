export const generateMovieRating = (movieId) => {
  // Sử dụng movieId để tạo seed cho Math.random() 
  // Điều này đảm bảo cùng một bộ phim sẽ luôn có cùng rating
  const seed = movieId ? hashCode(movieId) : Math.random();
  const seededRandom = Math.abs(Math.sin(seed)) % 1;
  
  // Tạo rating từ 6.5 đến 9.5 (phổ biến hơn cho phim hay)
  return (seededRandom * 3 + 6.5).toFixed(1);
};

// Hàm tạo hash code từ string để làm seed
function hashCode(str) {
  let hash = 0;
  if (str.length === 0) return hash;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  return Math.abs(hash);
}

// Hàm format rating với icon sao
export const formatRating = (rating) => {
  const numRating = parseFloat(rating);
  let color = 'text-yellow-400';
  
  if (numRating >= 8.5) color = 'text-green-400';
  else if (numRating >= 7.5) color = 'text-yellow-400';
  else if (numRating < 7.0) color = 'text-red-400';
  
  return {
    value: rating,
    color: color
  };
};