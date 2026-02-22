import React, { useState } from "react";
import { Container, Row, Col, Card, Modal, Carousel } from "react-bootstrap";
import NoImg from "@/assets/images/gallery/NoImage.jpg";

const HotelMediaGallery = ({ gallery }) => {
  const [show, setShow] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);

  const images = gallery && gallery.length > 0 ? gallery : [NoImg];

  const openModal = (index) => {
    setActiveIndex(index);
    setShow(true);
  };

  const closeModal = () => setShow(false);

  // 1 Image
  if (images.length === 1) {
    return (
      <>
        <Container style={{ paddingBottom: "2.8rem" }}>
          <Row>
            <Col>
              <Card
                className="overflow-hidden cursor-pointer"
                onClick={() => openModal(0)}
                style={{
                  backgroundImage: `url(${images[0]})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  height: "400px",
                }}
              />
            </Col>
          </Row>
        </Container>

        <ImageModal
          show={show}
          handleClose={closeModal}
          images={images}
          activeIndex={activeIndex}
        />
      </>
    );
  }

  // 2 Images
  if (images.length === 2) {
    return (
      <>
        <Container style={{ paddingBottom: "2.8rem" }}>
          <Row className="g-2">
            {images.map((img, index) => (
              <Col md={6} key={index}>
                <Card
                  className="overflow-hidden cursor-pointer"
                  onClick={() => openModal(index)}
                  style={{
                    backgroundImage: `url(${img})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    height: "400px",
                  }}
                />
              </Col>
            ))}
          </Row>
        </Container>

        <ImageModal
          show={show}
          handleClose={closeModal}
          images={images}
          activeIndex={activeIndex}
        />
      </>
    );
  }

  // 3 or More Images
  return (
    <>
      <Container style={{ paddingBottom: "2.8rem" }}>
        <Row className="g-2">
          <Col md={6}>
            <Card
              className="overflow-hidden cursor-pointer"
              onClick={() => openModal(0)}
              style={{
                backgroundImage: `url(${images[0]})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                height: "400px",
              }}
            />
          </Col>

          <Col md={6}>
            <Row className="g-2">
              {/* 2nd Image */}
              <Col xs={12}>
                <Card
                  className="overflow-hidden cursor-pointer"
                  onClick={() => openModal(1)}
                  style={{
                    backgroundImage: `url(${images[1]})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    height: "195px",
                  }}
                />
              </Col>

              {/* 3rd Image with +More */}
              <Col xs={12}>
                <Card
                  className="position-relative overflow-hidden cursor-pointer"
                  onClick={() => openModal(2)}
                  style={{
                    backgroundImage: `url(${images[2]})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    height: "195px",
                  }}
                >
                  {images.length > 3 && (
                    <>
                      <div className="bg-dark position-absolute w-100 h-100 opacity-50" />
                      <div className="position-absolute top-50 start-50 translate-middle text-white">
                        <h5>+{images.length - 3} More</h5>
                      </div>
                    </>
                  )}
                </Card>
              </Col>
            </Row>
          </Col>
        </Row>
      </Container>

      <ImageModal
        show={show}
        handleClose={closeModal}
        images={images}
        activeIndex={activeIndex}
      />
    </>
  );
};

const ImageModal = ({ show, handleClose, images, activeIndex }) => {
  const [index, setIndex] = React.useState(activeIndex);

  React.useEffect(() => {
    setIndex(activeIndex);
  }, [activeIndex]);

  const handleSelect = (selectedIndex) => {
    setIndex(selectedIndex);
  };

  return (
    <Modal show={show} onHide={handleClose} size="xl" centered>
      <Modal.Body className="p-0 ">
        <Carousel
          activeIndex={index}
          onSelect={handleSelect}
          controls
          indicators
          interval={null}
        >
          {images.map((img, i) => (
            <Carousel.Item key={i}>
              <div
                className="d-flex justify-content-center align-items-center"
                style={{ height: "80vh" }}
              >
                <img
                  src={img}
                  alt=""
                  style={{
                    maxHeight: "100%",
                    maxWidth: "100%",
                    objectFit: "contain",
                    height:"100%", width:"100%"
                  }}
                />
              </div>
            </Carousel.Item>
          ))}
        </Carousel>
      </Modal.Body>
    </Modal>
  );
};

export default HotelMediaGallery;