import { currency } from "@/states";
import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  CardTitle,
} from "react-bootstrap";

// Utility function to add commas and handle 2 decimal places
const formatCurrency = (amount) => {
  if (isNaN(amount) || amount === null) return "0.00";
  return new Intl.NumberFormat("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
};

const PriceSummary = ({
  nights,
  roomCharges,
  discount,
  serviceFee,
  totalAmount,
  displayCurrency,
  availableOffers,
  onApplyOffer,
  appliedOffer,
  offerDiscountAmount,
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
              {symbol} {formatCurrency(roomCharges)}
            </span>
          </li>

          <li className="list-group-item d-flex justify-content-between align-items-center">
            <span className="h6 fw-light mb-0">
              Total Discount
              <span className="badge text-bg-danger smaller mb-0 ms-2">
                Saved {symbol} {formatCurrency(discount)}
              </span>
            </span>
            <span className="fs-5 text-success">
              {symbol} {formatCurrency(discount)}
            </span>
          </li>

          <li className="list-group-item d-flex justify-content-between align-items-center">
            <span className="h6 fw-light mb-0">Price after discount</span>
            <span className="fs-5">
              {symbol} {formatCurrency(roomCharges - discount)}
            </span>
          </li>

          {appliedOffer && (
            <li className="list-group-item d-flex justify-content-between align-items-center bg-light-success rounded">
              <span className="h6 fw-light mb-0 text-success">
                Rate after offer ({appliedOffer.title})
              </span>
              <span className="fs-5 text-success">
                -{symbol} {formatCurrency(offerDiscountAmount)}
              </span>
            </li>
          )}
        </ul>

        {!appliedOffer && availableOffers && availableOffers.length > 0 && (
          <div className="mt-3 p-3 border rounded border-dashed text-center bg-light">
            <p className="small mb-2">
              Available Offer: <strong>{availableOffers[0].title}</strong>
            </p>
            <Button
              variant="outline-primary"
              size="sm"
              onClick={() => onApplyOffer(availableOffers[0])}
            >
              Apply Offer
            </Button>
          </div>
        )}
      </CardBody>
      <CardFooter className="border-top">
        <div className="d-flex justify-content-between align-items-center">
          <span className="h5 mb-0">Payable Now</span>
          <span className="h5 mb-0 text-primary">
            {symbol} {formatCurrency(totalAmount)}
          </span>
        </div>
      </CardFooter>
    </Card>
  );
};

export default PriceSummary;
