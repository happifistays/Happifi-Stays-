import React, { useEffect, useState, useCallback } from "react";
import { PageMetaData, SelectFormInput } from "@/components";
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
} from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import clsx from "clsx";
import { BsBookmarkHeart, BsThreeDotsVertical } from "react-icons/bs";
import { FaSearch, FaEye, FaEdit } from "react-icons/fa";
import NotFound from "../../../components/NotFound/NotFound";
import { API_BASE_URL } from "../../../config/env";
import { DEFAULT_AVATAR_IMAGE } from "../../../constants/images";

const AgentOffers = () => {
  const [loading, setLoading] = useState(false);
  const [totalOffer, setTotalOffer] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const token = localStorage.getItem("token");
  const [showModal, setShowModal] = useState(false);
  const [selectedOffer, setSelectedOffer] = useState(null);

  const navigate = useNavigate();
  const [offers, setOffers] = useState([]);

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
        const response = await fetch(
          `${API_BASE_URL}/api/v1/shops/offers?page=${page}`,
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
          setOffers(data.data);
          setTotalOffer(data.total);
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

  if (!loading && offers.length === 0) {
    return (
      <NotFound
        title={"No Offers found!"}
        description={"You dont have any offers yet!"}
      />
    );
  }

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
                          placeholder="Search offers..."
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
                      <SelectFormInput className="form-select">
                        <option value={-1}>Sort by</option>
                        <option>Newest</option>
                        <option>Oldest</option>
                      </SelectFormInput>
                    </Col>
                  </div>

                  {/* Removed table-shrink and adjusted overflow */}
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
                            <td colSpan="5" className="text-center py-5">
                              <div
                                className="spinner-border text-primary"
                                role="status"
                              ></div>
                            </td>
                          </tr>
                        ) : (
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
                                  style={{ maxWidth: "300px" }}
                                >
                                  {offer?.description}
                                </p>
                              </td>
                              <td className="text-end">
                                <Dropdown
                                  align="end"
                                  className="d-inline-block"
                                >
                                  <Dropdown.Toggle
                                    as="button"
                                    className="btn btn-sm btn-light btn-round mb-0 border shadow-none"
                                  >
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
                                  </Dropdown.Menu>
                                </Dropdown>
                              </td>
                            </tr>
                          ))
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

      {/* View Modal */}
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
