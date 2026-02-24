import { TinySlider } from "@/components";
import { useLayoutContext } from "@/states";
import { Card, CardBody, CardImg, Col, Container, Row } from "react-bootstrap";
import { Link } from "react-router-dom";
import { renderToString } from "react-dom/server";
import { BsArrowLeft, BsArrowRight } from "react-icons/bs";
import "tiny-slider/dist/tiny-slider.css";
import { useEffect, useState } from "react";
import axios from "axios";
import { API_BASE_URL } from "../../../../config/env";

const OfferSlider = () => {
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOffers = async () => {
      try {
        setLoading(true);
        const res = await axios.get(
          `${API_BASE_URL}/api/v1/customer/offers/all`
        );
        if (res && res.data && res.data.data) {
          setOffers(res.data.data);
        }
      } catch (error) {
        console.error("Error fetching offers:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchOffers();
  }, []);

  const { dir } = useLayoutContext();

  const offerSliderSettings = {
    arrowKeys: true,
    autoplayButton: false,
    autoplayButtonOutput: false,
    nested: "inner",
    controlsText: [
      renderToString(<BsArrowLeft size={16} />),
      renderToString(<BsArrowRight size={16} />),
    ],
    autoplay: true,
    controls: true,
    edgePadding: 2,
    items: 3,
    autoplayDirection: dir !== "rtl" ? "forward" : "backward",
    nav: false,
    responsive: {
      1: { items: 1, gutter: 10 },
      768: { items: 1, gutter: 10 },
      992: { items: 2, gutter: 30 },
      1200: { items: 3, gutter: 30 },
    },
  };

  if (loading) return null; // Or a spinner

  return (
    <section className="pb-2 pb-lg-5">
      <Container>
        <div className="tiny-slider arrow-round arrow-blur arrow-hover">
          {offers.length > 0 ? (
            <TinySlider settings={offerSliderSettings}>
              {/* IMPORTANT: Each child of TinySlider is treated as a slide. 
                  Do not wrap the map in a <div> */}
              {offers.map((offer) => (
                <div key={offer._id}>
                  <Card
                    className="border rounded-3 overflow-hidden h-100 mx-2"
                    onClick={() => {
                      window.location.href = "/hotels/grid";
                    }}
                  >
                    <Row className="row g-0 align-items-center">
                      <Col sm={6}>
                        {/* Use the dynamic base64 image from API */}
                        <CardImg
                          src={offer.image}
                          alt={offer.title}
                          className="rounded-0"
                          style={{ height: "150px", objectFit: "cover" }}
                        />
                      </Col>

                      <Col sm={6}>
                        <CardBody className="px-3">
                          <h6 className="card-title mb-1">
                            <Link to="" className="stretched-link">
                              {offer.title}
                            </Link>
                          </h6>
                          <p className="mb-0 small text-truncate">
                            {offer.description}
                          </p>
                        </CardBody>
                      </Col>
                    </Row>
                  </Card>
                </div>
              ))}
            </TinySlider>
          ) : (
            <div className="text-center">No offers available</div>
          )}
        </div>
      </Container>
    </section>
  );
};

export default OfferSlider;
