import { Col, Container, Row, Button, Form } from "react-bootstrap";
import { useForm, FormProvider, useWatch } from "react-hook-form";
import { useLocation, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import GuestDetails from "./GuestDetails";
import HotelInformation from "./HotelInformation";
import LoginAdvantages from "./LoginAdvantages";
import OfferAndDiscounts from "./OfferAndDiscounts";
import PaymentOptions from "./PaymentOptions";
import PriceSummary from "./PriceSummary";
import { API_BASE_URL } from "../../../../config/env";
import { useState, useEffect } from "react";
import confetti from "canvas-confetti";

const BookingDetails = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const searchParams = new URLSearchParams(location.search);
  const propertyId = searchParams.get("property_id");
  const roomId = searchParams.get("room_id");
  const [submitting, setSubmitting] = useState(false);
  const [appliedOffer, setAppliedOffer] = useState(null);

  const bookingData = location.state || {};
  console.log("bookingData-----------", bookingData);
  const token = localStorage.getItem("token");

  // --- START CALCULATIONS ---
  const calculateNights = (start, end) => {
    if (!start || !end) return 1;
    const sDate = new Date(start);
    const eDate = new Date(end);
    const diffTime = Math.abs(eDate - sDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 1;
  };

  const nights =
    bookingData.nights ||
    calculateNights(bookingData.checkIn, bookingData.checkOut);
  const roomPrice = bookingData.roomPrice || 0;
  const serviceFee = 0; // For now
  const initialDiscount = bookingData.discount || 0;

  const roomCharges = roomPrice * nights;
  const priceAfterInitialDiscount = roomCharges + serviceFee - initialDiscount;

  // Calculate offer discount if applied
  let offerDiscountAmount = 0;
  if (appliedOffer) {
    const match = appliedOffer.title.match(/\d+/);
    const percentage = match ? parseInt(match[0]) : 0;
    offerDiscountAmount = (priceAfterInitialDiscount * percentage) / 100;
  }

  const finalCalculatedTotal = priceAfterInitialDiscount - offerDiscountAmount;
  // --- END CALCULATIONS ---

  const methods = useForm({
    defaultValues: {
      guests: [
        {
          title: "Mr",
          firstName: "",
          lastName: "",
        },
      ],
      email: "",
      phone: "",
      specialRequests: [],
      paymentMethod: "online", // added for radio toggle
      selectedPaymentTypeId: 1,
      cardNumber: "",
      expirationDate: "",
      expirationYear: "",
      cvv: "",
      cardName: "visa",
      checkInDate: bookingData.checkIn || "2026-12-12",
      checkOutDate: bookingData.checkOut || "2026-12-14",
      totalAmount: finalCalculatedTotal,
      paymentStatus: "unpaid",
      status: "booked",
    },
  });

  // Sync the form total whenever finalCalculatedTotal changes
  useEffect(() => {
    methods.setValue("totalAmount", finalCalculatedTotal);
  }, [finalCalculatedTotal, methods]);

  const handleApplyOffer = (offer) => {
    setAppliedOffer(offer);
    confetti({
      particleCount: 150,
      spread: 70,
      origin: { y: 0.6 },
      colors: [
        "#26ccff",
        "#a25afd",
        "#ff5e7e",
        "#88ff5a",
        "#fcff42",
        "#ffa62d",
        "#ff36ff",
      ],
    });
    Swal.fire({
      icon: "success",
      title: "Offer Applied!",
      text: `${offer.title} has been applied to your booking.`,
      timer: 2000,
      showConfirmButton: false,
    });
  };

  const paymentMethod = useWatch({
    control: methods.control,
    name: "paymentMethod",
  });

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const onSubmit = async (data) => {
    try {
      if (
        data.guests &&
        data.guests.length == 1 &&
        data.guests[0].firstName?.trim() == ""
      ) {
        Swal.fire({
          icon: "error",
          title: "Guest details are missing",
          text: "Please add guest details",
        });
        return;
      }

      if (data.paymentMethod === "online") {
        const resScript = await loadRazorpayScript();

        if (!resScript) {
          alert("Razorpay SDK failed to load. Are you online?");
          return;
        }

        // 1. Create order on backend
        const orderRes = await fetch(
          `${API_BASE_URL}/api/v1/customer/create-order`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              // amount: Math.round(finalCalculatedTotal * 100),
              amount: 10 * 100,
              currency: "INR",
            }),
          }
        );

        const orderData = await orderRes.json();
        console.log("orderData------------", orderData);

        // 2. Open Razorpay Checkout
        const options = {
          key: import.meta.env.VITE_RAZORPAY_KEY_ID,
          amount: orderData.amount,
          currency: orderData.currency,
          name: "Happifi",
          description: "Booking Payment",
          order_id: orderData.id,
          handler: async function (response) {
            // 3. Verify and Create Booking
            console.log("response--------------", response);
            const verifyRes = await fetch(
              `${API_BASE_URL}/api/v1/customer/booking/${propertyId}`,
              {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                  ...data,
                  totalAmount: finalCalculatedTotal,
                  razorpay_payment_id: response.razorpay_payment_id,
                  razorpay_order_id: response.razorpay_order_id,
                  razorpay_signature: response.razorpay_signature,
                  appliedOfferId: appliedOffer?._id, // Send offer ID if needed
                }),
              }
            );

            const result = await verifyRes.json();
            console.log("result-------------", result);

            if (result.success) {
              navigate(`/booking-confirmed/${result?.booking?._id}`);
            } else {
              alert(result.message || "Payment verification failed");
            }
          },
          prefill: {
            name: `${data.guests[0].firstName} ${data.guests[0].lastName}`,
            email: data.email,
            contact: data.phone,
          },
          theme: { color: "#3399cc" },
        };

        const paymentObject = new window.Razorpay(options);
        console.log("paymentObject------------", paymentObject);
        paymentObject.open();
      } else {
        // Handle offline payment
        // setSubmitting(true);
        const response = await fetch(
          `${API_BASE_URL}/api/v1/customer/booking/${propertyId}`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              ...data,
              totalAmount: finalCalculatedTotal,
              appliedOfferId: appliedOffer?._id,
            }),
          }
        );

        const result = await response.json();
        setSubmitting(false);

        if (result.success) {
          navigate(`/booking-confirmed/${result?.booking?._id}`);
        } else {
          Swal.fire({
            icon: "error",
            title: "Booking failed",
            text: "Error while booking",
          });
        }
      }
    } catch (error) {
      console.error("Error submitting booking:", error);
      alert("An error occurred. Please try again.");
    }
  };

  const handlePayAtHotelClick = async () => {
    const isValid = await methods.trigger(["guests", "email", "phone"]);
    if (!isValid) return;

    Swal.fire({
      title: "Confirm Booking",
      text: "Do you want to confirm that pay at hotel?",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, confirm it!",
    }).then((result) => {
      if (result.isConfirmed) {
        methods.setValue("paymentStatus", "unpaid");
        methods.setValue("paymentMethod", "pay_at_hotel");
        methods.handleSubmit(onSubmit)();
      }
    });
  };

  return (
    <section>
      <FormProvider {...methods}>
        <form onSubmit={methods.handleSubmit(onSubmit)}>
          <Container>
            <Row className="g-4 g-lg-5">
              <Col xl={8}>
                <div className="vstack gap-5">
                  <HotelInformation />
                  <GuestDetails control={methods.control} />

                  {/* Price Summary for Mobile (Visible below xl breakpoint) */}
                  <div className="d-xl-none">
                    <PriceSummary
                      nights={nights}
                      roomCharges={roomCharges}
                      discount={initialDiscount}
                      serviceFee={serviceFee}
                      totalAmount={finalCalculatedTotal}
                      displayCurrency={bookingData.currency}
                      availableOffers={bookingData?.availableOffers}
                      appliedOffer={appliedOffer}
                      onApplyOffer={handleApplyOffer}
                      offerDiscountAmount={offerDiscountAmount}
                    />
                  </div>

                  <div className="card shadow-sm p-4">
                    <h5 className="mb-3">Select Payment Method</h5>
                    <div className="d-flex gap-4">
                      <Form.Check
                        type="radio"
                        id="pay-at-hotel"
                        label="Pay at hotel"
                        value="pay_at_hotel"
                        {...methods.register("paymentMethod")}
                      />
                      <Form.Check
                        type="radio"
                        id="online-payment"
                        label="Online payment"
                        value="online"
                        {...methods.register("paymentMethod")}
                      />
                    </div>
                  </div>

                  {paymentMethod === "online" ? (
                    <div className="vstack gap-4">
                      <div className="d-grid mt-4">
                        <Button variant="primary" size="lg" type="submit">
                          Proceed to Online Payment
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="d-grid mt-4">
                      <Button
                        variant="success"
                        size="lg"
                        type="button"
                        onClick={handlePayAtHotelClick}
                        disabled={submitting}
                      >
                        Confirm Booking (Pay at Hotel)
                      </Button>
                    </div>
                  )}
                </div>
              </Col>
              <Col as="aside" xl={4}>
                <Row className="g-4">
                  {/* Price Summary for Desktop (Hidden below xl breakpoint) */}
                  <Col md={6} xl={12} className="d-none d-xl-block">
                    <PriceSummary
                      nights={nights}
                      roomCharges={roomCharges}
                      discount={initialDiscount}
                      serviceFee={serviceFee}
                      totalAmount={finalCalculatedTotal}
                      displayCurrency={bookingData.currency}
                      availableOffers={bookingData?.availableOffers}
                      appliedOffer={appliedOffer}
                      onApplyOffer={handleApplyOffer}
                      offerDiscountAmount={offerDiscountAmount}
                    />
                  </Col>
                </Row>
              </Col>
            </Row>
          </Container>
        </form>
      </FormProvider>
    </section>
  );
};

export default BookingDetails;
