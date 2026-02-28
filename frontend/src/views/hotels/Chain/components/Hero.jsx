import { TinySlider } from "@/components";
import { jarallax, jarallaxVideo } from "jarallax";
import { useEffect, useRef } from "react";
import { Card, Col, Container, Row } from "react-bootstrap";
import { renderToString } from "react-dom/server";
import { BsArrowLeft, BsArrowRight } from "react-icons/bs";
import { Link } from "react-router-dom";
import hotelImg6 from "@/assets/images/category/hotel/06.jpg";
import "jarallax/dist/jarallax.min.css";
import "tiny-slider/dist/tiny-slider.css";
import { GlightBox } from "@/components";
import avatar12 from "@/assets/images/avatar/12.jpg";
import { FaPlay } from "react-icons/fa6";
import AvailabilityFilter from "../../Home/components/AvailabilityFilter";

jarallaxVideo();
const Hero = () => {
  const heroSliderSettings = {
    gutter: 1,
    controls: true,
    nav: false,
    controlsText: [
      renderToString(<BsArrowLeft size={16} />),
      renderToString(<BsArrowRight size={16} />),
    ],
    items: 1,
  };
  const jarallaxRef = useRef(null);
  useEffect(() => {
    const jarallaxInstance = jarallaxRef.current;
    if (jarallaxInstance) {
      jarallax(jarallaxInstance, {
        speed: 0.2,
        videoSrc: "https://www.youtube.com/watch?v=j56YlCXuPFU",
      });
    }
    return () => {
      if (jarallaxInstance) {
        jarallax(jarallaxInstance, "destroy");
      }
    };
  }, []);
  return (
    <div className="">
      <div className="container-fluid">
        <Row className="g-4 g-lg-5 mb-4">
          <Col lg={11} className="mx-auto">
            <div className="tiny-slider arrow-round arrow-blur arrow-hover rounded-3 overflow-hidden">
              <TinySlider settings={heroSliderSettings}>
                <div
                  className="card overflow-hidden h-400px h-sm-600px rounded-0"
                  style={{
                    backgroundImage: `url('https://res.cloudinary.com/djnaor5ed/image/upload/v1772271051/luxury-hotel-room-with-modern-design-elegance-generated-by-ai_1_f9hp1f.webp')`,
                    backgroundPosition: "center left",
                    backgroundSize: "cover",
                  }}
                >
                  <div className="bg-overlay bg-dark opacity-3" />
                  <div className="card-img-overlay d-flex align-items-center">
                    <div className="container">
                      <Col
                        lg={8}
                        className="position-relative mb-4 mb-md-0 mx-auto text-center"
                      >
                        <h1 className="mb-4 mt-5 mt-md-5 display-5 text-white">
                          Find the top
                          <br />
                          <span className="position-relative z-index-9">
                            Hotels nearby.
                          </span>
                        </h1>
                        <p className="mb-4 text-white">
                          We bring you not only a stay option, but an experience
                          in your budget to enjoy the luxury.
                        </p>
                        <div className="hstack gap-4 flex-wrap align-items-center justify-content-center">
                          <a href="/hotels/grid">
                            <button
                              className="btn btn-primary-soft mb-0"
                              style={{
                                backgroundColor: "#5143d9",
                                color: "#fff",
                              }}
                            >
                              Book Now
                            </button>
                          </a>
                          <GlightBox
                            data-glightbox
                            data-gallery="office-tour"
                            href="https://www.youtube.com/watch?v=qemqQHaeCYo"
                            className="d-flex align-items-center"
                          >
                            <div
                              className="d-flex align-items-center"
                              style={{ cursor: "pointer" }}
                            >
                              <div className="avatar avatar-md z-index-1 position-relative me-2">
                                <div className="btn btn-xs btn-round btn-white shadow-sm position-absolute top-50 start-50 translate-middle z-index-9 mb-0 flex-centered">
                                  <FaPlay />
                                </div>
                              </div>
                              <h6 className="fw-normal small mb-0 text-white">
                                Watch our story
                              </h6>
                            </div>
                          </GlightBox>
                        </div>
                      </Col>
                    </div>
                  </div>
                </div>
                <Card
                  ref={jarallaxRef}
                  className="card jarallax overflow-hidden h-400px h-sm-600px bg-parallax text-center rounded-0"
                >
                  <div className="bg-overlay bg-dark opacity-3" />
                  <div className="card-img-overlay d-flex align-items-center">
                    <div className="container w-100 my-auto">
                      <Row className="row justify-content-center">
                        <Col xs={11} lg={8}>
                          <h1 className="text-white">
                            Taking luxury hospitality to new heights
                          </h1>
                          <Link to="" className="btn btn-dark mb-0">
                            Take Me There
                          </Link>
                        </Col>
                      </Row>
                    </div>
                  </div>
                </Card>
              </TinySlider>
            </div>
          </Col>
        </Row>
      </div>
    </div>
  );
};
export default Hero;
