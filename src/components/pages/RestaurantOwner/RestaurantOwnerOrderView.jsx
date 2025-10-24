import React, { useState } from "react";
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
import RestaurauntOwnerOrderTimeForm from "./RestaurantOwnerOrderTimeForm";

const RestaurantOwnerOrderView = () => {
  const [orders, setOrders] = useState([
    {
      id: "#124",
      customer: "Marko Jovanović",
      time: "12:30",
      items: "3 artikla",
      status: "Na čekanju",
    },
    {
      id: "#125",
      customer: "Ana Petrović",
      time: "12:35",
      items: "2 artikla",
      status: "Prihvaćena",
    },
    {
      id: "#126",
      customer: "Luka Ilić",
      time: "12:40",
      items: "1 artikal",
      status: "Otkazana",
    },
  ]);

  const [selectedOrder, setSelectedOrder] = useState(null); // store order being edited
  const [showForm, setShowForm] = useState(false);

  const handleOpenForm = (order) => {
    setSelectedOrder(order);
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setSelectedOrder(null);
  };

  // function to update order status and/or time
  const changeStatus = (id, newStatus, newTime = null) => {
    setOrders((prevOrders) =>
      prevOrders.map((order) =>
        order.id === id
          ? { ...order, status: newStatus, time: newTime || order.time }
          : order
      )
    );
  };

  const getStatusChip = (status) => {
    switch (status) {
      case "Na čekanju":
        return <Chip label={status} color="warning" />;
      case "Prihvaćena":
        return <Chip label={status} color="success" />;
      case "Otkazana":
        return <Chip label={status} color="error" />;
      default:
        return <Chip label={status} />;
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
            {orders.map((row) => (
              <TableRow key={row.id}>
                <TableCell>{row.id}</TableCell>
                <TableCell>{row.customer}</TableCell>
                <TableCell>Ime Restorana</TableCell>
                <TableCell>Adresa kupca</TableCell>
                <TableCell>{row.time}</TableCell>
                <TableCell>{row.items}</TableCell>
                <TableCell>200</TableCell>
                <TableCell>{getStatusChip(row.status)}</TableCell>
                <TableCell>
                  {row.status === "Na čekanju" && (
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
                        onClick={() => changeStatus(row.id, "Otkazana")}
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
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {showForm && selectedOrder && (
        <RestaurauntOwnerOrderTimeForm
          order={selectedOrder}
          onClose={handleCloseForm}
          onSubmitTime={(time) => {
            changeStatus(selectedOrder.id, "Prihvaćena", time);
            handleCloseForm();
          }}
        />
      )}
    </div>
  );
};

export default RestaurantOwnerOrderView;
