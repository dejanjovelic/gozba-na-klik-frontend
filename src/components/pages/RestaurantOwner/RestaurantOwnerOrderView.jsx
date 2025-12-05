import React, { useState, useEffect, useContext } from "react";
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
  updateRestaurantOrdersStatus,
} from "../../../services/OrderService";
import ErrorPopup from "../../pages/Popups/ErrorPopup";
import UserContext from "../../../config/UserContext";
import "../../../styles/global.scss";

const RestaurantOwnerOrderView = () => {
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const handleCloseError = () => setShowError(false);
  const { user } = useContext(UserContext);

  let ownerId = null;
  if (user) {
    ownerId = user.id;
  }

  const fetchOrders = async () => {
    try {
      const data = await getOrdersByOwnerId(ownerId);
      setOrders(data);
    } catch (error) {
      setErrorMessage(error.message);
      setShowError(true);
      console.error("Greška pri učitavanju porudžbina:", error);
    }
  };
  useEffect(() => {
    fetchOrders();
  }, [ownerId]);

  const translateStatus = (status) => {
    switch (status) {
      case "Pending":
        return "Pending";
      case "Accepted":
        return "Accepted";
      case "Cancelled":
        return "Cancelled";
      case "PickupInProgress":
        return "Pickup in progress"
      case "DeliveryInProgress":
        return "Delivery in progress"
      case "Delivered":
        return "Delivered"
      default:
        return status;
    }
  };

  const handleCancel = async (order) => {
    try {
      await updateRestaurantOrdersStatus(order.orderId, "Cancelled");
      await fetchOrders();
    } catch (error) {
      setErrorMessage(error.message);
      setShowError(true);
      console.error("Greška prilikom otkazivanja porudžbine", error);
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
        return <Chip label={readableStatus} className="status-pending" />;
      case "Accepted":
        return <Chip label={readableStatus} className="status-accepted" />;
      case "Cancelled":
        return <Chip label={readableStatus} className="status-cancelled" />;
      case "Pickup in progress":
        return <Chip label={readableStatus} className="status-pickup" />;
      case "Delivery in progress":
        return <Chip label={readableStatus} className="status-delivery" />;
      case "Delivered":
        return <Chip label="Delivered" />
      default:
        return <Chip label={readableStatus} />;
    }
  };

  return (
    <div className="orderViewContainer">
      <TableContainer className="scrollWrapper" component={Paper} sx={{ mt: 3 }}>
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
                <b>Restaurant</b>
              </TableCell>
              <TableCell>
                <b>Ordered At</b>
              </TableCell>
              <TableCell>
                <b>Customer</b>
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
                  <TableCell>{order.restaurantName}</TableCell>
                  <TableCell>
                    {new Date(order.orderTime).toLocaleString("sr-RS").slice(0, -3)}
                  </TableCell>
                  <TableCell>{order.customerName}</TableCell>
                  <TableCell>{order.customerAddress}</TableCell>
                  <TableCell>
                    {order.pickupReadyAt ? new Date(order.pickupReadyAt).toLocaleTimeString("sr-RS").slice(0, -3) : "-"}
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
          onSubmitMinutes={async (minutes) => {
            await updateRestaurantOrdersStatus(selectedOrder.orderId, "Accepted", minutes);

            await fetchOrders();

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