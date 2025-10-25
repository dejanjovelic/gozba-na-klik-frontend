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

const RestaurantOwnerOrderView = () => {
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showForm, setShowForm] = useState(false);

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
      } catch (error) {
        console.error("Greška pri učitavanju porudžbina:", error);
      }
    };
    fetchOrders();
  }, [ownerId]);

  const translateStatus = (status) => {
    switch (status) {
      case "NaCekanju":
        return "Na čekanju";
      case "Prihvacena":
        return "Prihvaćena";
      case "Otkazana":
        return "Otkazana";
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
  const getCurrentTimeString = () => {
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, "0");
    const minutes = String(now.getMinutes()).padStart(2, "0");
    const seconds = String(now.getSeconds()).padStart(2, "0");
    return `${hours}:${minutes}:${seconds}`;
  };
  const handleCancel = async (order) => {
    try {
      const currentTime = getCurrentTimeString();
      await editOrdersStatus(order.orderId, "Otkazana", currentTime);
      changeStatus(order.orderId, "Otkazana", currentTime);
    } catch (err) {
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
      case "Na čekanju":
        return <Chip label={readableStatus} color="warning" />;
      case "Prihvaćena":
        return <Chip label={readableStatus} color="success" />;
      case "Otkazana":
        return <Chip label={readableStatus} color="error" />;
      default:
        return <Chip label={readableStatus} />;
    }
  };

  return (
    <div className="orderViewContainer">
      <TableContainer component={Paper} sx={{ mt: 3 }}>
        <Typography variant="h6" sx={{ m: 2 }}>
          Porudžbine
        </Typography>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>
                <b>ID</b>
              </TableCell>
              <TableCell>
                <b>Kupac</b>
              </TableCell>
              <TableCell>
                <b>Restoran</b>
              </TableCell>
              <TableCell>
                <b>Adresa kupca</b>
              </TableCell>
              <TableCell>
                <b>Vreme kada je porudžbina spremna</b>
              </TableCell>
              <TableCell>
                <b>Artikli</b>
              </TableCell>
              <TableCell>
                <b>Cena</b>
              </TableCell>
              <TableCell>
                <b>Status</b>
              </TableCell>
              <TableCell></TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {orders.map((row) => {
              const readableStatus = translateStatus(row.status);

              return (
                <TableRow key={row.orderId}>
                  <TableCell>{row.orderId}</TableCell>
                  <TableCell>{row.customerName}</TableCell>
                  <TableCell>{row.restaurantName}</TableCell>
                  <TableCell>{row.customerAddress}</TableCell>
                  <TableCell>
                    {row.orderTime ? row.orderTime.slice(0, 5) : "-"}
                  </TableCell>
                  <TableCell>{row.totalQuantity} artikla</TableCell>
                  <TableCell>{row.totalPrice} RSD</TableCell>
                  <TableCell>{getStatusChip(row.status)}</TableCell>
                  <TableCell>
                    {readableStatus === "Na čekanju" && (
                      <>
                        <Button
                          onClick={() => handleOpenForm(row)}
                          variant="contained"
                          color="success"
                          size="small"
                          sx={{ mr: 1 }}
                        >
                          Prihvati
                        </Button>
                        <Button
                          onClick={() => handleCancel(row)}
                          variant="contained"
                          color="error"
                          size="small"
                        >
                          Otkaži
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
            await editOrdersStatus(selectedOrder.orderId, "Prihvacena", time);
            changeStatus(selectedOrder.orderId, "Prihvacena", time);
            handleCloseForm();
          }}
        />
      )}
    </div>
  );
};

export default RestaurantOwnerOrderView;
