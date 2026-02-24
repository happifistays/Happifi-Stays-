import { TinySlider } from "@/components";
import { useToggle } from "@/hooks";
import { currency, useLayoutContext } from "@/states";
import { useEffect, useState } from "react";
import { Card, CardBody, CardFooter } from "react-bootstrap";
import { renderToString } from "react-dom/server";
import {
  BsArrowLeft,
  BsArrowRight,
  BsBookmark,
  BsBookmarkFill,
  BsStarFill,
} from "react-icons/bs";
import { Link } from "react-router-dom";
import "tiny-slider/dist/tiny-slider.css";

import { ToastContainer, toast } from "react-toastify";

const HotelGridCard = ({
  feature,
  id,
  images,
  name,
  price,
  rating,
  sale,
  showChip = false,
  offerText,
}) => {
  const { isOpen, toggle } = useToggle();
  const { dir } = useLayoutContext();

  const discountPercentage =
    sale > price ? Math.round(((sale - price) / sale) * 100) : 0;

  const gridSliderSettings = {
    nested: "inner",
    autoplay: false,
    controls: true,
    autoplayButton: false,
    autoplayButtonOutput: false,
    controlsText: [
      renderToString(<BsArrowLeft size={16} />),
      renderToString(<BsArrowRight size={16} />),
    ],
    arrowKeys: true,
    items: 1,
    autoplayDirection: dir === "ltr" ? "forward" : "backward",
    nav: false,
  };

  const [isFav, setIsFav] = useState(false);

  useEffect(() => {
    const existingFav = JSON.parse(localStorage.getItem("fav")) || [];
    setIsFav(existingFav.includes(id));
  }, [id]);

  const handleAddToFav = () => {
    const existingFav = JSON.parse(localStorage.getItem("fav")) || [];

    let updatedFav;

    if (existingFav.includes(id)) {
      updatedFav = existingFav.filter((item) => item !== id);
      localStorage.setItem("fav", JSON.stringify(updatedFav));
      setIsFav(false);
      toast.error("Removed from favourites");
    } else {
      updatedFav = [...existingFav, id];
      localStorage.setItem("fav", JSON.stringify(updatedFav));
      setIsFav(true);
      toast.success("Added to favourites");
    }
  };

  return (
    <>
      <Card className="shadow p-2 pb-0 h-100 new">
        {discountPercentage > 0 && (
          <div className="position-absolute top-0 start-0 z-index-1 m-4">
            <div className="badge bg-danger text-white">
              {discountPercentage}% Off
            </div>
          </div>
        )}

        {showChip && offerText && (
          <div className="position-absolute top-0 end-0 z-index-1 m-4">
            <div className="badge bg-success text-white">{offerText}</div>
          </div>
        )}

        <div className="tiny-slider arrow-round arrow-xs arrow-dark rounded-2 overflow-hidden">
          <TinySlider settings={gridSliderSettings}>
            {images.map((image, idx) => (
              <div key={idx}>
                <img src={image} alt="Card image" />
              </div>
            ))}
          </TinySlider>
        </div>
        <CardBody className="px-3 pb-0">
          <div className="d-flex justify-content-between mb-3 align-items-center">
            <Link to="" className="badge bg-dark text-white items-center">
              <BsStarFill size={13} className=" fa-fw me-2 text-warning" />
              {rating}
            </Link>
            <Link to="" className="h6 mb-0 z-index-2" onClick={handleAddToFav}>
              <BsBookmark className={`fa-fw ${isFav ? "text-danger" : ""}`} />
            </Link>
          </div>
          <h5 className="card-title">
            <Link to={`/hotels/detail/${id}`}>{name}</Link>
          </h5>
          <ul className="nav nav-divider mb-2 mb-sm-3">
            {feature.map((f, idx) => (
              <li key={idx} className="nav-item">
                {f}
              </li>
            ))}
          </ul>
        </CardBody>
        <CardFooter className="pt-0">
          <div className="d-sm-flex justify-content-sm-between align-items-center">
            <div className="d-flex align-items-center">
              <h5 className="fw-normal text-success mb-0 me-1">
                {currency}
                {sale}
              </h5>
              <span className="mb-0 me-2">/day</span>
              {discountPercentage > 0 && (
                <span className="text-decoration-line-through small">
                  {currency}
                  {sale}
                </span>
              )}
            </div>
            <div className="mt-2 mt-sm-0">
              <Link
                to={`/hotels/detail/${id}`}
                className="btn btn-sm btn-primary-soft mb-0 w-100 items-center"
              >
                View Detail
                <BsArrowRight className=" ms-2" />
              </Link>
            </div>
          </div>
        </CardFooter>
      </Card>
      <ToastContainer />
    </>
  );
};

export default HotelGridCard;
