import { Col, Container, Row } from "react-bootstrap";
import { useParams } from "react-router-dom";
const Hero = () => {
  const { id } = useParams();
  const title = id ? "Edit Listing" : "Add New Listing";
  return (
    <section className="pb-0">
      <Container>
        <Row>
          <Col xs={12} className="text-center">
            <h1 className="fs-2 mb-2">{title}</h1>
            <p className="mb-0">
              Praise effects wish change way and any wanted. Lively use looked
              latter regard had.
            </p>
          </Col>
        </Row>
      </Container>
    </section>
  );
};
export default Hero;
