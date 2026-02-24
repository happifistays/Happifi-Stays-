import { SelectFormInput, TextFormInput } from "@/components";
import { useToggle } from "@/hooks";
import { yupResolver } from "@hookform/resolvers/yup";
import Nouislider from "nouislider-react";
import { useState } from "react";
import {
  Button,
  Card,
  Col,
  Collapse,
  Container,
  FormCheck,
  Row,
  CardBody,
} from "react-bootstrap";
import FormCheckInput from "react-bootstrap/esm/FormCheckInput";
import FormCheckLabel from "react-bootstrap/esm/FormCheckLabel";
import { useForm } from "react-hook-form";
import { BsStarFill, BsSliders } from "react-icons/bs";
import * as yup from "yup";

const amenitiesList = [
  "Free WiFi",
  "Air Conditioning",
  "Dining",
  "Swimming pool",
  "Spa",
  "Fitness Centre",
];

const HotelListFilter = ({ onApplyFilters }) => {
  const { isOpen, toggle } = useToggle();
  const [priceRange, setPriceRange] = useState([0, 5000]);
  const [selectedAmenities, setSelectedAmenities] = useState([]);
  const [selectedStar, setSelectedStar] = useState(null);

  const filterSchema = yup.object({
    hotelName: yup.string(),
  });

  const { control, handleSubmit, reset } = useForm({
    resolver: yupResolver(filterSchema),
  });

  const handleAmenityChange = (amenity) => {
    if (selectedAmenities.includes(amenity)) {
      setSelectedAmenities(selectedAmenities.filter((a) => a !== amenity));
    } else {
      setSelectedAmenities([...selectedAmenities, amenity]);
    }
  };

  const onSubmit = (data) => {
    const filterData = {
      name: data.hotelName,
      minPrice: priceRange[0],
      maxPrice: priceRange[1],
      amenities: selectedAmenities.join(","),
      starRating: selectedStar,
    };
    onApplyFilters(filterData);
  };

  const handleClear = () => {
    reset({ hotelName: "" });
    setPriceRange([0, 5000]);
    setSelectedAmenities([]);
    setSelectedStar(null);
    onApplyFilters({});
  };

  return (
    <section className="pt-0 pb-4">
      <Container className="position-relative">
        <Row>
          <Col xs={12}>
            <div className="d-flex justify-content-between">
              <label
                onClick={toggle}
                className="btn btn-primary-soft mb-0 items-center"
              >
                <BsSliders className="me-2" /> Show Filters
              </label>
            </div>
          </Col>
        </Row>
        <Collapse in={isOpen}>
          <Card as={CardBody} className="bg-light p-4 mt-4 z-index-9">
            <form onSubmit={handleSubmit(onSubmit)} className="row g-4">
              <Col md={6} lg={4}>
                <TextFormInput
                  name="hotelName"
                  className="form-control-lg"
                  control={control}
                  label="Enter Hotel Name"
                  containerClass="form-control-borderless"
                />
              </Col>
              <Col md={6} lg={4}>
                <div className="form-control-borderless">
                  <label className="form-label">Price Range ($)</label>
                  <div className="noui-wrapper">
                    <div className="d-flex justify-content-between mb-2">
                      <span>${priceRange[0]}</span>
                      <span>${priceRange[1]}</span>
                    </div>
                    <Nouislider
                      start={priceRange}
                      range={{ min: 0, max: 5000 }}
                      step={10}
                      onChange={(val) => setPriceRange(val.map(Number))}
                      connect
                    />
                  </div>
                </div>
              </Col>
              <Col md={6} lg={4}>
                <div className="form-control-borderless">
                  <label className="form-label">Star Rating</label>
                  <ul className="list-inline mb-0 g-3">
                    {[1, 2, 3, 4, 5].map((val) => (
                      <li className="list-inline-item" key={val}>
                        <input
                          type="radio"
                          className="btn-check"
                          name="starRating"
                          id={`star-${val}`}
                          onChange={() => setSelectedStar(val)}
                          checked={selectedStar === val}
                        />
                        <label
                          className="btn btn-white btn-primary-soft-check items-center"
                          htmlFor={`star-${val}`}
                        >
                          {val} <BsStarFill className="ms-1" />
                        </label>
                      </li>
                    ))}
                  </ul>
                </div>
              </Col>
              <Col xs={12}>
                <div className="form-control-borderless">
                  <label className="form-label">Amenities</label>
                  <Row className="g-3">
                    {amenitiesList.map((item, idx) => (
                      <Col key={idx} sm={6} md={4} lg={3}>
                        <FormCheck>
                          <FormCheckInput
                            type="checkbox"
                            id={`amenity-${idx}`}
                            checked={selectedAmenities.includes(item)}
                            onChange={() => handleAmenityChange(item)}
                          />
                          <FormCheckLabel
                            className="h6 fw-light mb-0"
                            htmlFor={`amenity-${idx}`}
                          >
                            {item}
                          </FormCheckLabel>
                        </FormCheck>
                      </Col>
                    ))}
                  </Row>
                </div>
              </Col>
              <div className="text-end">
                <Button variant="link" onClick={handleClear}>
                  Clear all
                </Button>
                <Button type="submit" variant="dark">
                  Apply filter
                </Button>
              </div>
            </form>
          </Card>
        </Collapse>
      </Container>
    </section>
  );
};
export default HotelListFilter;
