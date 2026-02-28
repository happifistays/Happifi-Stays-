import React, { useEffect, useState, useCallback } from "react";
import { PageMetaData } from "@/components";
import {
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Col,
  Container,
  Row,
  Modal,
  Button,
  Form,
} from "react-bootstrap";
import { Link } from "react-router-dom";
import clsx from "clsx";
import { BsBookmarkHeart, BsCloudDownload } from "react-icons/bs";
import { FaSearch } from "react-icons/fa";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import { API_BASE_URL } from "../../../config/env";

const Bookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [totalBooking, setTotalBooking] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const token = localStorage.getItem("token");
  const [showModal, setShowModal] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);

  // Search and Sort States
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("newest");

  const handleView = (booking) => {
    setSelectedBooking(booking);
    setShowModal(true);
  };

  const fetchBookings = useCallback(
    async (page, search = "", sort = "") => {
      try {
        setLoading(true);
        const response = await fetch(
          `${API_BASE_URL}/api/v1/shops/bookings?page=${page}&search=${search}&sort=${sort}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            credentials: "include",
          }
        );
        const data = await response.json();
        if (data && data.success) {
          setBookings(data.data);
          setTotalBooking(data.total);
          setTotalPages(data.totalPages);
          setCurrentPage(data.currentPage);
        }
        setLoading(false);
      } catch (error) {
        console.error(error);
        setLoading(false);
      }
    },
    [token]
  );

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchBookings(currentPage, searchTerm, sortBy);
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [currentPage, searchTerm, sortBy, fetchBookings]);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const handleSortChange = (e) => {
    setSortBy(e.target.value);
    setCurrentPage(1);
  };

  const downloadAllBookingsPDF = () => {
    if (bookings.length === 0) return;
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text("BOOKINGS REPORT", 14, 20);
    doc.setFontSize(10);
    doc.text(`Generated on: ${new Date().toLocaleString()}`, 14, 28);
    doc.text(`Total Bookings: ${totalBooking}`, 14, 34);

    const tableRows = bookings.map((booking, idx) => [
      idx + 1,
      booking.propertyName || booking.roomName || "N/A",
      `${booking.checkInDate} to ${booking.checkOutDate}`,
      booking.status.toUpperCase(),
      booking.paymentStatus.toUpperCase(),
      `INR ${booking.totalAmount}`,
    ]);

    autoTable(doc, {
      startY: 40,
      head: [["#", "Property Name", "Duration", "Status", "Payment", "Amount"]],
      body: tableRows,
      theme: "grid",
      headStyles: { fillColor: [13, 110, 253] },
      styles: { fontSize: 8 },
    });

    doc.save(`Bookings_Report_${new Date().getTime()}.pdf`);
  };

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const renderPagination = () => {
    const items = [];
    for (let i = 1; i <= totalPages; i++) {
      items.push(
        <li
          key={i}
          className={clsx("page-item", { active: i === currentPage })}
        >
          <button className="page-link" onClick={() => handlePageChange(i)}>
            {i}
          </button>
        </li>
      );
    }
    return items;
  };

  const startEntry = bookings.length > 0 ? (currentPage - 1) * 10 + 1 : 0;
  const endEntry = Math.min(currentPage * 10, totalBooking);

  return (
    <>
      <PageMetaData title="Agent Bookings" />
      <section className="pt-0">
        <Container className="vstack gap-4">
          <Row>
            <Col xs={12}>
              <h1 className="fs-4 mb-0 items-center gap-1">
                <BsBookmarkHeart className=" fa-fw me-1" />
                Bookings
              </h1>
            </Col>
          </Row>
          <Row>
            <Col xs={12}>
              <Card className="border">
                <CardHeader className="border-bottom d-flex justify-content-between align-items-center">
                  <h5 className="card-header-title mb-0">
                    Bookings
                    <span className="badge bg-primary bg-opacity-10 text-primary ms-2">
                      {totalBooking} Rooms
                    </span>
                  </h5>
                  <Button
                    variant="primary"
                    size="sm"
                    className="d-flex align-items-center gap-2"
                    onClick={downloadAllBookingsPDF}
                    disabled={loading || bookings.length === 0}
                  >
                    <BsCloudDownload /> Download All
                  </Button>
                </CardHeader>
                <CardBody>
                  <div className="row g-3 align-items-center justify-content-between mb-3">
                    <div className="col-md-8">
                      <div className="rounded position-relative">
                        <input
                          className="form-control pe-5"
                          type="search"
                          placeholder="Search property name..."
                          value={searchTerm}
                          onChange={handleSearchChange}
                        />
                        <button
                          className="btn border-0 px-3 py-0 position-absolute top-50 end-0 translate-middle-y"
                          type="button"
                        >
                          <FaSearch className="mb-1" />
                        </button>
                      </div>
                    </div>
                    <Col md={3}>
                      <Form.Select
                        className="form-select"
                        value={sortBy}
                        onChange={handleSortChange}
                      >
                        <option value="newest">Newest</option>
                        <option value="oldest">Oldest</option>
                      </Form.Select>
                    </Col>
                  </div>
                  <div className="table-responsive border-0">
                    <table className="table align-middle p-4 mb-0 table-hover">
                      <thead className="table-light">
                        <tr>
                          <th scope="col">#</th>
                          <th scope="col">Name</th>
                          <th scope="col">Date</th>
                          <th scope="col">Status</th>
                          <th scope="col">Payment</th>
                          <th scope="col">Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {loading ? (
                          <tr>
                            <td colSpan="6" className="text-center">
                              Loading...
                            </td>
                          </tr>
                        ) : bookings?.length === 0 ? (
                          <tr>
                            <td colSpan="6" className="text-center py-4">
                              No bookings found
                            </td>
                          </tr>
                        ) : (
                          bookings.map((booking, idx) => (
                            <tr key={booking._id}>
                              <td>{(currentPage - 1) * 10 + idx + 1}</td>
                              <td>{booking?.propertyName ?? "N/A"}</td>
                              <td>{booking.checkInDate}</td>
                              <td>
                                <div
                                  className={clsx(
                                    "badge",
                                    booking.status === "cancelled"
                                      ? "bg-danger"
                                      : "bg-success"
                                  )}
                                >
                                  {booking.status}
                                </div>
                              </td>
                              <td>
                                <div
                                  className={clsx(
                                    "badge bg-opacity-10",
                                    booking.paymentStatus === "paid"
                                      ? "bg-success text-success"
                                      : "bg-warning text-warning"
                                  )}
                                >
                                  {booking.paymentStatus}
                                </div>
                              </td>
                              <td>
                                <button
                                  onClick={() => handleView(booking)}
                                  className="btn btn-sm btn-light"
                                >
                                  View
                                </button>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </CardBody>
                <CardFooter>
                  <div className="d-sm-flex justify-content-sm-between align-items-sm-center">
                    <p className="mb-sm-0">
                      Showing {startEntry} to {endEntry} of {totalBooking}{" "}
                      entries
                    </p>
                    <nav>
                      <ul className="pagination pagination-sm mb-0">
                        <li
                          className={clsx("page-item", {
                            disabled: currentPage === 1,
                          })}
                        >
                          <button
                            className="page-link"
                            onClick={() => handlePageChange(currentPage - 1)}
                          >
                            Prev
                          </button>
                        </li>
                        {renderPagination()}
                        <li
                          className={clsx("page-item", {
                            disabled: currentPage === totalPages,
                          })}
                        >
                          <button
                            className="page-link"
                            onClick={() => handlePageChange(currentPage + 1)}
                          >
                            Next
                          </button>
                        </li>
                      </ul>
                    </nav>
                  </div>
                </CardFooter>
              </Card>
            </Col>
          </Row>
        </Container>
      </section>

      <Modal
        show={showModal}
        onHide={() => setShowModal(false)}
        centered
        size="lg"
      >
        <Modal.Header closeButton />
        <Modal.Body>
          {selectedBooking && (
            <div className="p-2">
              <h4>{selectedBooking.propertyName}</h4>
              <p>Booking ID: #{selectedBooking._id.slice(-6)}</p>
              <p>Amount: ₹{selectedBooking.totalAmount}</p>
            </div>
          )}
        </Modal.Body>
      </Modal>
    </>
  );
};

export default Bookings;
