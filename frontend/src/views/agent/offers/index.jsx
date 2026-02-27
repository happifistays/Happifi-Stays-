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
  Dropdown,
  Badge,
} from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import clsx from "clsx";
import { BsBookmarkHeart, BsThreeDotsVertical } from "react-icons/bs";
import { FaSearch, FaEye, FaEdit, FaPowerOff, FaTrash } from "react-icons/fa";
import { API_BASE_URL } from "../../../config/env";
import { DEFAULT_AVATAR_IMAGE } from "../../../constants/images";
import axios from "axios";
import Swal from "sweetalert2";

// Custom Toggle component to remove the default arrow
const CustomToggle = React.forwardRef(({ children, onClick }, ref) => (
  <button
    ref={ref}
    className="btn btn-sm btn-light btn-round mb-0 border shadow-none"
    onClick={(e) => {
      e.preventDefault();
      onClick(e);
    }}
  >
    {children}
  </button>
));

const AgentOffers = () => {
  const [loading, setLoading] = useState(true);
  const [totalOffer, setTotalOffer] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("createdAt:desc"); // Matches backend format
  const [offers, setOffers] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedOffer, setSelectedOffer] = useState(null);

  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  const handleView = (offer) => {
    setSelectedOffer(offer);
    setShowModal(true);
  };

  const handleEdit = (offer) => {
    navigate(`/offer/edit/${offer._id}`);
  };

  const fetchOffers = useCallback(
    async (page) => {
      try {
        setLoading(true);
        const config = {
          headers: { Authorization: `Bearer ${token}` },
          params: {
            page: page,
            limit: 10,
            sort: sortBy,
            title: searchTerm, // Matches backend 'title' param
          },
        };

        const response = await axios.get(
          `${API_BASE_URL}/api/v1/shops/offers`,
          config
        );

        if (response.data && response.data.success) {
          setOffers(response.data.data);
          setTotalOffer(response.data.total);
          setTotalPages(response.data.totalPages);
          setCurrentPage(response.data.currentPage);
        }
      } catch (error) {
        console.error("Fetch error:", error);
      } finally {
        setLoading(false);
      }
    },
    [token, searchTerm, sortBy]
  );

  const handleToggleStatus = async (offer) => {
    try {
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const payload = { isDisabled: !offer.isDisabled };

      const resp = await axios.patch(
        `${API_BASE_URL}/api/v1/shops/offer/${offer._id}`,
        payload,
        config
      );

      if (resp.data.success) {
        fetchOffers(currentPage);
      }
    } catch (error) {
      console.error("Error updating offer status:", error);
    }
  };

  const handleDeleteOffer = async (offerId) => {
    Swal.fire({
      title: "Are you sure?",
      text: "Do you want to delete the offer ?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        const config = { headers: { Authorization: `Bearer ${token}` } };
        const resp = await axios.delete(
          `${API_BASE_URL}/api/v1/shops/offer/${offerId}`,
          config
        );

        if (resp.data.success) {
          fetchOffers(currentPage);
        }
        Swal.fire({
          title: "Deleted!",
          text: "Your file has been deleted.",
          icon: "success",
        });
      }
    });
  };

  useEffect(() => {
    fetchOffers(currentPage);
  }, [fetchOffers, currentPage]);

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

  const startEntry = offers.length > 0 ? (currentPage - 1) * 10 + 1 : 0;
  const endEntry = Math.min(currentPage * 10, totalOffer);

  return (
    <>
      <PageMetaData title="Agent Bookings" />
      <section className="pt-0">
        <Container className="vstack gap-4">
          <Row>
            <Col xs={12}>
              <h1 className="fs-4 mb-0 d-flex align-items-center gap-2">
                <BsBookmarkHeart className="text-primary" />
                Offers
              </h1>
            </Col>
          </Row>

          <Row>
            <Col xs={12}>
              <Card className="border">
                <CardHeader className="border-bottom d-flex justify-content-between align-items-center">
                  <h5 className="card-header-title mb-0">
                    Offers List
                    <span className="badge bg-primary bg-opacity-10 text-primary ms-2">
                      {totalOffer} total
                    </span>
                  </h5>
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => navigate("/offer/add")}
                  >
                    + Add New Offer
                  </Button>
                </CardHeader>

                <CardBody>
                  <div className="row g-3 align-items-center justify-content-between mb-4">
                    <div className="col-md-8">
                      <div className="position-relative">
                        <input
                          className="form-control pe-5"
                          type="search"
                          placeholder="Search by title..."
                          value={searchTerm}
                          onChange={(e) => {
                            setSearchTerm(e.target.value);
                            setCurrentPage(1);
                          }}
                        />
                        <button
                          className="btn border-0 px-3 py-0 position-absolute top-50 end-0 translate-middle-y"
                          type="button"
                        >
                          <FaSearch />
                        </button>
                      </div>
                    </div>
                    <Col md={3}>
                      <select
                        className="form-select"
                        value={sortBy}
                        onChange={(e) => {
                          setSortBy(e.target.value);
                          setCurrentPage(1);
                        }}
                      >
                        <option value="createdAt:desc">Newest</option>
                        <option value="createdAt:asc">Oldest</option>
                        <option value="title:asc">Title (A-Z)</option>
                      </select>
                    </Col>
                  </div>

                  <div className="table-responsive-md border-0">
                    <table className="table align-middle p-4 mb-0 table-hover">
                      <thead className="table-light">
                        <tr>
                          <th scope="col" className="border-0 rounded-start">
                            #
                          </th>
                          <th scope="col" className="border-0">
                            Image
                          </th>
                          <th scope="col" className="border-0">
                            Title
                          </th>
                          <th scope="col" className="border-0">
                            Description
                          </th>
                          <th scope="col" className="border-0">
                            Status
                          </th>
                          <th
                            scope="col"
                            className="border-0 rounded-end text-end"
                          >
                            Action
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {loading ? (
                          <tr>
                            <td colSpan="6" className="text-center py-5">
                              <div
                                className="spinner-border text-primary"
                                role="status"
                              ></div>
                            </td>
                          </tr>
                        ) : offers.length > 0 ? (
                          offers.map((offer, idx) => (
                            <tr key={offer._id || idx}>
                              <td>{(currentPage - 1) * 10 + idx + 1}</td>
                              <td>
                                <img
                                  src={offer?.image ?? DEFAULT_AVATAR_IMAGE}
                                  alt="offer"
                                  className="rounded"
                                  style={{
                                    width: "50px",
                                    height: "50px",
                                    objectFit: "cover",
                                  }}
                                />
                              </td>
                              <td>
                                <h6 className="mb-0">{offer?.title}</h6>
                              </td>
                              <td>
                                <p
                                  className="mb-0 small text-truncate"
                                  style={{ maxWidth: "250px" }}
                                >
                                  {offer?.description}
                                </p>
                              </td>
                              <td>
                                <Badge
                                  bg={offer.isDisabled ? "danger" : "success"}
                                  className={clsx(
                                    "bg-opacity-10",
                                    offer.isDisabled
                                      ? "text-danger"
                                      : "text-success"
                                  )}
                                >
                                  {offer.isDisabled ? "Disabled" : "Active"}
                                </Badge>
                              </td>
                              <td className="text-end">
                                <Dropdown
                                  align="end"
                                  className="d-inline-block"
                                >
                                  <Dropdown.Toggle as={CustomToggle}>
                                    <BsThreeDotsVertical />
                                  </Dropdown.Toggle>
                                  <Dropdown.Menu className="shadow border-0">
                                    <Dropdown.Item
                                      onClick={() => handleView(offer)}
                                    >
                                      <FaEye className="me-2 text-info" /> View
                                      Details
                                    </Dropdown.Item>
                                    <Dropdown.Item
                                      onClick={() => handleEdit(offer)}
                                    >
                                      <FaEdit className="me-2 text-warning" />{" "}
                                      Edit Offer
                                    </Dropdown.Item>
                                    <Dropdown.Item
                                      onClick={() => handleToggleStatus(offer)}
                                    >
                                      <FaPowerOff
                                        className={clsx(
                                          "me-2",
                                          offer.isDisabled
                                            ? "text-success"
                                            : "text-danger"
                                        )}
                                      />
                                      {offer.isDisabled
                                        ? "Reactivate"
                                        : "Deactivate"}
                                    </Dropdown.Item>
                                    <Dropdown.Divider />
                                    <Dropdown.Item
                                      className="text-danger"
                                      onClick={() =>
                                        handleDeleteOffer(offer._id)
                                      }
                                    >
                                      <FaTrash className="me-2" /> Delete Offer
                                    </Dropdown.Item>
                                  </Dropdown.Menu>
                                </Dropdown>
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td
                              colSpan="6"
                              className="text-center py-5 text-muted"
                            >
                              No offers found matching your criteria.
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </CardBody>

                <CardFooter className="pt-0 border-top-0">
                  <div className="d-sm-flex justify-content-sm-between align-items-sm-center">
                    <p className="mb-sm-0 text-center text-sm-start">
                      Showing {startEntry} to {endEntry} of {totalOffer} entries
                    </p>
                    <nav className="mb-sm-0 d-flex justify-content-center">
                      <ul className="pagination pagination-sm pagination-primary-soft mb-0">
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

      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Offer Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedOffer && (
            <div className="text-center">
              <img
                src={selectedOffer?.image ?? DEFAULT_AVATAR_IMAGE}
                className="img-fluid rounded mb-3"
                alt="offer"
                style={{ maxHeight: "200px" }}
              />
              <h5 className="fw-bold">{selectedOffer.title}</h5>
              <p className="text-muted">{selectedOffer.description}</p>
              <Badge bg={selectedOffer.isDisabled ? "danger" : "success"}>
                {selectedOffer.isDisabled ? "Disabled" : "Active"}
              </Badge>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default AgentOffers;
