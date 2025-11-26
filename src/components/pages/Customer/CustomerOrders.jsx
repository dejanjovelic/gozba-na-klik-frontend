import React, { useEffect, useState } from "react";
import { fetchCustomerActiveOrders, fetchCustomerInactiveOrders, fetchOrderPdfInvoiceAsync } from "../../../services/OrderService";
import PaginationSection from "../../sharedComponents/PaginationSection";
import "../../../styles/customerOrders.scss";

const CustomerOrders = () => {
    const [activeOrders, setActiveOrders] = useState([]);
    const [inactiveOrders, setInactiveOrders] = useState([]);
    const [inactivePage, setInactivePage] = useState(1);
    const [inactivePageSize, setInactivePageSize] = useState(6);
    const [inactiveTotalRowsCount, setInactiveTotalRowsCount] = useState(0);
    const [inactiveTotalPages, setInactiveTotalPages] = useState(0);
    const [inactiveHasNextPage, setInactiveHasNextPage] = useState(false);
    const [inactiveHasPreviousPage, setInactiveHasPreviousPage] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [showError, setShowError] = useState(false);

    const loadActiveOrders = async () => {
        try {
            setIsLoading(true)
            const data = await fetchCustomerActiveOrders();
            setActiveOrders(data);
        } catch (error) {
            if (error.status && error.status === 500) {
                setErrorMessage("We're experiencing technical difficulties. Please try again shortly.")
            } else if (error.request) {
                setErrorMessage("The server seems to be taking too long to respond. Please try again in a moment.");
            } else {
                setErrorMessage("Something went wrong. Please try again.");
            }
            console.log("An error occurred while fetching active orders:", error);
            setShowError(true);
            setIsLoading(false);
        } finally {
            setInterval(() => {
                setIsLoading(false);
            }, 1000);
        }
    }

    const loadInactiveOrders = async () => {
        try {
            setIsLoading(true);
            const data = await fetchCustomerInactiveOrders(inactivePage, inactivePageSize);
            setInactiveOrders(data.items);
            setInactiveTotalRowsCount(data.totalRowsCount);
            setInactiveTotalPages(data.totalPages);
            setInactiveHasPreviousPage(data.hasPreviousPage);
            setInactiveHasNextPage(data.hasNextPage);
        } catch (error) {
            if (error.status && error.status === 500) {
                setErrorMessage("We're experiencing technical difficulties. Please try again shortly.")
            } else if (error.request) {
                setErrorMessage("The server seems to be taking too long to respond. Please try again in a moment.");
            } else {
                setErrorMessage("Something went wrong. Please try again.");
            }
            console.log("An error occurred while fetching inactive orders:", error);
            setShowError(true);
            setIsLoading(false);
        } finally {
            setInterval(() => {
                setIsLoading(false);
            }, 1000);
        }
    }

    const handlePageChange = (newPageIndex) => {
        setInactivePage(newPageIndex + 1);
    };

    const handlePageSizeChange = (newSize) => {
        setInactivePageSize(newSize);
        setInactivePage(1);
    }

    const handleInvoiceBtnClick = (orderId)=>{
        downloadPdf(orderId)
    }

    const downloadPdf = async (orderId) => {
        try {
          const response = await fetchOrderPdfInvoiceAsync(orderId);
    
          const url = window.URL.createObjectURL(new Blob([response.data]));
          const link = document.createElement("a");
          link.href = url;
          link.setAttribute("download", "Faktura.pdf");
          document.body.appendChild(link);
          link.click();
          link.remove();
        } catch (err) {
          console.error("Download error:", err);
        }
      };


    useEffect(() => {
        loadActiveOrders();
    }, []);

    useEffect(() => {
        loadInactiveOrders();
    }, [inactivePage, inactivePageSize]);

    return (
        <div className="customer-orders-container">

            {/* Active Orders */}
            <h2 style={{ borderBottom: "2px solid #4caf50" }}>Active Orders</h2>
            <div className="orders-section">
                {isLoading ? (
                    <span className="spinner"></span>
                ) : activeOrders.length === 0 ? (
                    <p className="info-text">You currently have no active orders.</p>
                ) : (
                    activeOrders.map((order) => (
                        <div className="customer-order-card active" key={order.id}>
                            <div className="customer-order-card-left">
                                <img src={order.restaurantImageUrl} alt="Restaurant image" style={{ width: "50px", height: "50px", borderRadius: "50%" }} />
                                <span style={{ color: "#4caf50" }}>Order #{order.id}</span>
                                <span className="restaurant-name">{order.restaurantName}</span>
                            </div>
                            <div className="customer-order-card-right">
                                <span className="status">{order.status}</span>
                                <span className="total-price">${order.totalPrice.toFixed(2)}</span>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Inactive Orders / History */}
            <h2 style={{ borderBottom: "2px solid #ea9332" }}>Order History</h2>
            <div className="orders-section">
                {isLoading ? (
                    <span className="spinner"></span>
                ) : inactiveOrders.length === 0 ? (
                    <p className="info-text">No delivered or cancelled orders found.</p>
                ) : (
                    <>
                        {inactiveOrders.map((order) => (
                            <div className="customer-order-card inactive" key={order.id}>
                                <div className="customer-order-card-left">
                                    <span style={{ color: "#ea9332" }}>Order #{order.id}</span>
                                    <span className="restaurant-name">{order.restaurantName}</span>
                                </div>
                                <div className="customer-order-card-right">
                                    <span className="date">{order.orderDate}</span>
                                    <span className="status">{order.status}</span>
                                    <span className="total-price">${order.totalPrice.toFixed(2)}</span>
                                    <button className={
                                        order.status.toLowerCase() == "delivered"? "invoiceBtn" : "invoiceBtn-hidden"}
                                        onClick={()=>handleInvoiceBtnClick(order.id)}>
                                        Download Invoice
                                    </button>
                                </div>
                            </div>
                        ))}

                        <PaginationSection
                            onPageChange={handlePageChange}
                            onPageSizeChange={handlePageSizeChange}
                            totalRowsCount={inactiveTotalRowsCount}
                            hasNextPage={inactiveHasNextPage}
                            hasPreviousPage={inactiveHasPreviousPage}
                            page={inactivePage - 1} // zero-based for PaginationSection
                            pageSize={inactivePageSize}
                        />
                    </>
                )}
            </div>
        </div>

    );
}

export default CustomerOrders;