import { FaStar, FaStarHalfAlt, FaRegStar } from "react-icons/fa";

const RatingStars = ({ rating = 0 }) => {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

  return (
    <ul className="list-inline mb-2">
      {Array.from({ length: fullStars }).map((_, i) => (
        <li key={`full-${i}`} className="list-inline-item small">
          <FaStar className="text-warning" />
        </li>
      ))}

      {hasHalfStar && (
        <li className="list-inline-item small">
          <FaStarHalfAlt className="text-warning" />
        </li>
      )}

      {Array.from({ length: emptyStars }).map((_, i) => (
        <li key={`empty-${i}`} className="list-inline-item small">
          <FaRegStar className="text-warning" />
        </li>
      ))}
    </ul>
  );
};

export default RatingStars;
