import { currency } from "@/states";
import { Button, Card, CardBody, Col, Image, Row } from "react-bootstrap";
import { FaCalendarAlt, FaStarHalfAlt } from "react-icons/fa";
import { FaRegStar, FaStar } from "react-icons/fa6";
import { Link } from "react-router-dom";
import Sticky from "react-sticky-el";
import { useViewPort } from "@/hooks";
import offerImg4 from "@/assets/images/offer/04.jpg";
import Flatpickr from "react-flatpickr";
import "flatpickr/dist/flatpickr.css";
import RatingStars from "../../../../components/RatingStars/RatingStars";

const PriceOverView = ({
  rate,
  rating,
  checkIn,
  checkOut,
  setCheckIn,
  setCheckOut,
  handleBookNow,
  isAvailable,
  availableOffers,
  discount,
}) => {
  const { width } = useViewPort();

  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

  const nights =
    checkIn && checkOut
      ? Math.ceil(
          Math.abs(new Date(checkOut) - new Date(checkIn)) /
            (1000 * 60 * 60 * 24)
        )
      : 0;
  const total = rate * (nights || 1);

  const handleCheckInChange = (date) => {
    const selectedDate = date[0];
    setCheckIn(selectedDate);
    if (checkOut && selectedDate >= checkOut) {
      setCheckOut(null);
    }
  };

  const handleCheckOutChange = (date) => {
    setCheckOut(date[0]);
  };

  return (
    <Sticky disabled={width <= 1199} topOffset={100} boundaryElement="aside">
      <Card as={CardBody} className="border">
        <div className="d-sm-flex justify-content-sm-between align-items-center mb-3">
          <div>
            <span>Entire Property</span>
            <h4 className="card-title mb-0">
              {currency}
              {rate}
            </h4>
          </div>
          <div>
            <h6 className="fw-normal mb-0">per night</h6>
          </div>
        </div>

        <Row className="g-2 mb-3">
          <Col xs={6}>
            <div className="form-control-bg-light">
              <label className="form-label small h6 fw-light">Check-in</label>
              <div className="position-relative">
                <Flatpickr
                  className="form-control"
                  value={checkIn}
                  placeholder="Date"
                  options={{
                    dateFormat: "d M Y",
                    minDate: "today",
                  }}
                  onChange={handleCheckInChange}
                />
                <FaCalendarAlt className="position-absolute top-50 end-0 translate-middle-y me-2 small opacity-50" />
              </div>
            </div>
          </Col>
          <Col xs={6}>
            <div className="form-control-bg-light">
              <label className="form-label small h6 fw-light">Check-out</label>
              <div className="position-relative">
                <Flatpickr
                  className="form-control"
                  value={checkOut}
                  placeholder="Date"
                  options={{
                    dateFormat: "d M Y",
                    minDate: checkIn
                      ? new Date(new Date(checkIn).getTime() + 86400000)
                      : "today",
                  }}
                  onChange={handleCheckOutChange}
                />
                <FaCalendarAlt className="position-absolute top-50 end-0 translate-middle-y me-2 small opacity-50" />
              </div>
            </div>
          </Col>
        </Row>

        {nights > 0 && (
          <div className="mb-3">
            {!isAvailable ? (
              <p className="text-danger fw-bold small">
                Property already booked for these dates.
              </p>
            ) : (
              <ul className="list-group list-group-borderless mb-0">
                <li className="list-group-item px-0 d-flex justify-content-between">
                  <span className="h6 fw-light">
                    {currency}
                    {rate} x {nights} nights
                  </span>
                  <span className="h6 fw-light">
                    {currency}
                    {total}
                  </span>
                </li>
              </ul>
            )}
          </div>
        )}

        <RatingStars rating={rating} />

        <div className="d-grid mt-3">
          <Button
            variant={checkIn && checkOut && isAvailable ? "dark" : "secondary"}
            size="lg"
            disabled={!checkIn || !checkOut || !isAvailable}
            onClick={handleBookNow}
          >
            {isAvailable ? "Continue To Book" : "Not Available"}
          </Button>
        </div>
      </Card>

      <div className="mt-4 d-none d-xl-block">
        {availableOffers?.length > 0 &&
          availableOffers?.map((offer, idx) => (
            <Card className="shadow rounded-3 overflow-hidden">
              <Row className="g-0 align-items-center">
                <Col lg={6}>
                  <Image src={offer?.image} className="card-img rounded-0" />
                </Col>
                <Col lg={6}>
                  <CardBody className="p-3">
                    <h6 className="card-title">
                      <Link to="#" className="stretched-link">
                        {offer?.title ?? ""}
                      </Link>
                    </h6>
                    <p className="mb-0 small">{offer?.description ?? ""}</p>
                  </CardBody>
                </Col>
              </Row>
            </Card>
          ))}
      </div>
    </Sticky>
  );
};

export default PriceOverView;
