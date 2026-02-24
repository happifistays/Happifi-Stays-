import { Col, Container, Row, Spinner } from "react-bootstrap";
import HotelGridCard from "./HotelGridCard";
import { FaAngleLeft, FaAngleRight } from "react-icons/fa6";
import { useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { API_BASE_URL } from "../../../../config/env";

const HotelGridLayout = ({ filters }) => {
  const [hotelsData, setHotelsData] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);

  const [searchParams] = useSearchParams();
  const searchLocation = searchParams.get("location");

  const fetchHotels = async () => {
    try {
      setLoading(true);
      let url = `${API_BASE_URL}/api/v1/customer/properties`;
      let params = {
        page,
        limit: 6,
        ...filters,
      };

      if (searchLocation) {
        url = `${API_BASE_URL}/api/v1/customer/search-location`;
        params.location = searchLocation;
      }

      const response = await axios.get(url, { params });
      setHotelsData(response.data.data);
      setTotalPages(response.data.totalPages || 1);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setPage(1);
  }, [filters, searchLocation]);

  useEffect(() => {
    fetchHotels();
  }, [page, searchLocation, filters]);

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPage(newPage);
      window.scrollTo(0, 0);
    }
  };

  return (
    <section className="pt-0">
      <Container>
        <Row className="g-4">
          {loading ? (
            <Col className="text-center">
              <Spinner />
            </Col>
          ) : hotelsData.length > 0 ? (
            hotelsData.map((hotel, idx) => (
              <Col key={idx} md={6} xl={4} className="grid-height-style">
                <HotelGridCard
                  id={hotel._id}
                  name={hotel.listingName}
                  price={hotel.basePrice}
                  feature={hotel.amenities}
                  images={hotel.gallery}
                  rating={hotel.starRating}
                  sale={hotel.discount}
                  showChip={true}
                  offerText={hotel?.availableOffers[0]?.title ?? ""}
                />
              </Col>
            ))
          ) : (
            <Col className="text-center">
              <h4>No hotels found.</h4>
            </Col>
          )}
        </Row>
        {totalPages > 1 && (
          <Row>
            <Col xs={12}>
              <nav className="mt-4 d-flex justify-content-center">
                <ul className="pagination pagination-primary-soft d-md-flex rounded mb-0">
                  <li
                    className={`page-item mb-0 ${page === 1 ? "disabled" : ""}`}
                  >
                    <button
                      className="page-link"
                      onClick={() => handlePageChange(page - 1)}
                    >
                      <FaAngleLeft />
                    </button>
                  </li>
                  {[...Array(totalPages)].map((_, index) => (
                    <li
                      key={index}
                      className={`page-item mb-0 ${
                        page === index + 1 ? "active" : ""
                      }`}
                    >
                      <button
                        className="page-link"
                        onClick={() => handlePageChange(index + 1)}
                      >
                        {index + 1}
                      </button>
                    </li>
                  ))}
                  <li
                    className={`page-item mb-0 ${
                      page === totalPages ? "disabled" : ""
                    }`}
                  >
                    <button
                      className="page-link"
                      onClick={() => handlePageChange(page + 1)}
                    >
                      <FaAngleRight />
                    </button>
                  </li>
                </ul>
              </nav>
            </Col>
          </Row>
        )}
      </Container>
    </section>
  );
};

export default HotelGridLayout;
