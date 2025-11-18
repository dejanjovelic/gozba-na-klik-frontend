import React, { useState, useEffect } from "react";
import "../../../styles/RestaurantOwnerOrderView.scss";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Chip,
  Typography,
} from "@mui/material";
import RestaurantOwnerOrderTimeForm from "./RestaurantOwnerOrderTimeForm";
import {
  getOrdersByOwnerId,
  editOrdersStatus,
} from "../../../services/OrderService";
import ErrorPopup from "../../pages/Popups/ErrorPopup";

const RestaurantOwnerOrderView = () => {
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const handleCloseError = () => setShowError(false);
  const userString = sessionStorage.getItem("user");
  let ownerId = null;
  if (userString) {
    const user = JSON.parse(userString);
    ownerId = user.id;
  }

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const data = await getOrdersByOwnerId(ownerId);
        setOrders(data);
        console.log(data);
      } catch (error) {
        setErrorMessage(error.message);
        setShowError(true);
        console.error("Greška pri učitavanju porudžbina:", error);
      }
    };
    fetchOrders();
  }, [ownerId]);

  const translateStatus = (status) => {
    switch (status) {
      case "Pending":
        return "Pending";
      case "Accepted":
        return "Accepted";
      case "Canceled":
        return "Canceled";
      default:
        return status;
    }
  };

  const changeStatus = (orderId, newStatus, newTime = null) => {
    setOrders((prevOrders) =>
      prevOrders.map((order) =>
        order.orderId === orderId
          ? {
              ...order,
              status: newStatus,
              orderTime: newTime || order.orderTime,
            }
          : order
      )
    );
  };
  /* const getCurrentTimeString = () => {
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, "0");
    const minutes = String(now.getMinutes()).padStart(2, "0");
    const seconds = String(now.getSeconds()).padStart(2, "0");
    return `${hours}:${minutes}:${seconds}`;
  };*/
  const handleCancel = async (order) => {
    try {
      //const currentTime = getCurrentTimeString();
      await editOrdersStatus(order.orderId, "Canceled", null);
      changeStatus(order.orderId, "Canceled", null);
    } catch (err) {
      setErrorMessage(error.message);
      setShowError(true);
      console.error("Greška prilikom otkazivanja porudžbine", err);
    }
  };

  const handleOpenForm = (order) => {
    setSelectedOrder(order);
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setSelectedOrder(null);
  };

  const getStatusChip = (status) => {
    const readableStatus = translateStatus(status);
    switch (readableStatus) {
      case "Pending":
        return <Chip label={readableStatus} color="warning" />;
      case "Accepted":
        return <Chip label={readableStatus} color="success" />;
      case "Canceled":
        return <Chip label={readableStatus} color="error" />;
      default:
        return <Chip label={readableStatus} />;
    }
  };

  return (
    <div className="orderViewContainer">
      <TableContainer component={Paper} sx={{ mt: 3 }}>
        <Typography variant="h6" sx={{ m: 2 }}>
          Orders
        </Typography>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>
                <b>ID</b>
              </TableCell>
              <TableCell>
                <b>Customer</b>
              </TableCell>
              <TableCell>
                <b>Restaurant</b>
              </TableCell>
              <TableCell>
                <b>Customer address</b>
              </TableCell>
              <TableCell>
                <b>Time when order is ready</b>
              </TableCell>
              <TableCell>
                <b>Order details</b>
              </TableCell>
              <TableCell>
                <b>Price</b>
              </TableCell>
              <TableCell>
                <b>Status</b>
              </TableCell>
              <TableCell></TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {orders.map((order) => {
              const readableStatus = translateStatus(order.status);

              return (
                <TableRow key={order.orderId}>
                  <TableCell>{order.orderId}</TableCell>
                  <TableCell>{order.customerName}</TableCell>
                  <TableCell>{order.restaurantName}</TableCell>
                  <TableCell>{order.customerAddress}</TableCell>
                  <TableCell>
                    {order.orderTime ? order.orderTime.substring(11, 16) : "-"}
                  </TableCell>
                  <TableCell>
                    {order.orderItems && order.orderItems.length > 0
                      ? order.orderItems
                          .map((item) => `${item.quantity} ${item.mealName}`)
                          .join(", ")
                      : "-"}
                  </TableCell>
                  <TableCell>{order.totalPrice} €</TableCell>
                  <TableCell>{getStatusChip(order.status)}</TableCell>
                  <TableCell>
                    {readableStatus === "Pending" && (
                      <>
                        <Button
                          onClick={() => handleOpenForm(order)}
                          variant="contained"
                          color="success"
                          size="small"
                          sx={{ mr: 1 }}
                        >
                          Accept
                        </Button>
                        <Button
                          onClick={() => handleCancel(order)}
                          variant="contained"
                          color="error"
                          size="small"
                        >
                          Cancel
                        </Button>
                      </>
                    )}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>

      {showForm && selectedOrder && (
        <RestaurantOwnerOrderTimeForm
          order={selectedOrder}
          onClose={handleCloseForm}
          onSubmitTime={async (time) => {
            // time is "HH:mm"
            const [hour, minute] = time.split(":");

            // Create a full Date object
            const isoDateTime = new Date();
            isoDateTime.setHours(parseInt(hour, 10));
            isoDateTime.setMinutes(parseInt(minute, 10));
            isoDateTime.setSeconds(0);
            isoDateTime.setMilliseconds(0);

            const fullISO = isoDateTime.toISOString();

            // Send full ISO string to backend
            await editOrdersStatus(selectedOrder.orderId, "Accepted", fullISO);

            // Update frontend state with full ISO string
            changeStatus(selectedOrder.orderId, "Accepted", fullISO);

            handleCloseForm();
          }}
        />
      )}
      {showError && (
        <ErrorPopup message={errorMessage} onClose={handleCloseError} />
      )}
    </div>
  );
};

export default RestaurantOwnerOrderView;
