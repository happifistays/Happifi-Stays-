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
                    backgroundImage: `url(${hotelImg6})`,
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
                            {/* <span className="position-absolute top-50 start-50 translate-middle z-index-n1 d-none d-md-block mt-4">
                                <svg
                                  width="390.5px"
                                  height="21.5px"
                                  viewBox="0 0 445.5 21.5"
                                >
                                  <path
                                    className="fill-primary opacity-7"
                                    d="M409.9,2.6c-9.7-0.6-19.5-1-29.2-1.5c-3.2-0.2-6.4-0.2-9.7-0.3c-7-0.2-14-0.4-20.9-0.5 c-3.9-0.1-7.8-0.2-11.7-0.3c-1.1,0-2.3,0-3.4,0c-2.5,0-5.1,0-7.6,0c-11.5,0-23,0-34.5,0c-2.7,0-5.5,0.1-8.2,0.1 c-6.8,0.1-13.6,0.2-20.3,0.3c-7.7,0.1-15.3,0.1-23,0.3c-12.4,0.3-24.8,0.6-37.1,0.9c-7.2,0.2-14.3,0.3-21.5,0.6 c-12.3,0.5-24.7,1-37,1.5c-6.7,0.3-13.5,0.5-20.2,0.9C112.7,5.3,99.9,6,87.1,6.7C80.3,7.1,73.5,7.4,66.7,8 B54,9.1,41.3,10.1,28.5,11.2c-2.7,0.2-5.5,0.5-8.2,0.7c-5.5,0.5-11,1.2-16.4,1.8c-0.3,0-0.7,0.1-1,0.1c-0.7,0.2-1.2,0.5-1.7,1 C0.4,15.6,0,16.6,0,17.6c0,1,0.4,2,1.1,2.7c0.7,0.7,1.8,1.2,2.7,1.1c6.6-0.7,13.2-1.5,19.8-2.1c6.1-0.5,12.3-1,18.4-1.6 c6.7-0.6,13.4-1.1,20.1-1.7c2.7-0.2,5.4-0.5,8.1-0.7c10.4-0.6,20.9-1.1,31.3-1.7c6.5-0.4,13-0.7,19.5-1.1c2.7-0.1,5.4-0.3,8.1-0.4 c10.3-0.4,20.7-0.8,31-1.2c6.3-0.2,12.5-0.5,18.8-0.7c2.1-0.1,4.2-0.2,6.3-0.2c11.2-0.3,22.3-0.5,33.5-0.8 c6.2-0.1,12.5-0.3,18.7-0.4c2.2-0.1,4.4-0.1,6.7-0.1c11.5-0.1,23-0.2,34.6-0.4c7.2-0.1,14.4-0.1,21.6-0.1c12.2,0,24.5,0.1,36.7,0.1 c2.4,0,4.8,0.1,7.2,0.2c6.8,0.2,13.5,0.4,20.3,0.6c5.1,0.2,10.1,0.3,15.2,0.4c3.6,0.1,7.2,0.4,10.8,0.6c10.6,0.6,21.1,1.2,31.7,1.8 c2.7,0.2,5.4,0.4,8,0.6c2.9,0.2,5.8,0.4,8.6,0.7c0.4,0.1,0.9,0.2,1.3,0.3c1.1,0.2,2.2,0.2,3.2-0.4c0.9-0.5,1.6-1.5,1.9-2.5 c0.6-2.2-0.7-4.5-2.9-5.2c-1.9-0.5-3.9-0.7-5.9-0.9c-1.4-0.1-2.7-0.3-4.1-0.4c-2.6-0.3-5.2-0.4-7.9-0.6 C419.7,3.1,414.8,2.9,409.9,2.6z"
                                  />
                                </svg>
                              </span> */}
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
                            image=""
                            className="d-flex align-items-center"
                          >
                            <div className="d-flex align-items-center">
                              <div className="avatar avatar-md z-index-1 position-relative me-2">
                                {/* <Image
                                  className="avatar-img rounded-circle"
                                  src={avatar12}
                                  alt="avatar"
                                /> */}
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
      {/* <Container>
        <AvailabilityFilter />
      </Container> */}
    </div>
  );
};
export default Hero;
