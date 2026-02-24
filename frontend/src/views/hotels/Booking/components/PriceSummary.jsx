import { currency } from "@/states";
import {
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  CardTitle,
} from "react-bootstrap";

const PriceSummary = ({
  nights,
  roomCharges,
  discount,
  serviceFee,
  totalAmount,
  displayCurrency,
}) => {
  const symbol = currency || displayCurrency || "Rs";

  return (
    <Card className="shadow rounded-2">
      <CardHeader className="border-bottom">
        <CardTitle as="h5" className="mb-0">
          Price Summary
        </CardTitle>
      </CardHeader>
      <CardBody>
        <ul className="list-group list-group-borderless">
          <li className="list-group-item d-flex justify-content-between align-items-center">
            <span className="h6 fw-light mb-0">
              Room Charges ({nights} {nights > 1 ? "nights" : "night"})
            </span>
            <span className="fs-5">
              {symbol} {roomCharges}
            </span>
          </li>

          {/* {serviceFee > 0 && (
            <li className="list-group-item d-flex justify-content-between align-items-center">
              <span className="h6 fw-light mb-0">Service Fee</span>
              <span className="fs-5">
                {symbol} {serviceFee}
              </span>
            </li>
          )} */}

          <li className="list-group-item d-flex justify-content-between align-items-center">
            <span className="h6 fw-light mb-0">
              Total Discount
              <span className="badge text-bg-danger smaller mb-0 ms-2">
                Saved {symbol} {discount}
              </span>
            </span>
            <span className="fs-5 text-success">
              -{symbol}
              {discount}
            </span>
          </li>

          <li className="list-group-item d-flex justify-content-between align-items-center">
            <span className="h6 fw-light mb-0">Price after discount</span>
            <span className="fs-5">
              {symbol} {totalAmount}
            </span>
          </li>
        </ul>
      </CardBody>
      <CardFooter className="border-top">
        <div className="d-flex justify-content-between align-items-center">
          <span className="h5 mb-0">Payable Now</span>
          <span className="h5 mb-0">
            {symbol}
            {totalAmount}
          </span>
        </div>
      </CardFooter>
    </Card>
  );
};

export default PriceSummary;
