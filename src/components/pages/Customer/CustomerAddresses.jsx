import React, { useContext, useEffect, useState } from "react";
import "../../../styles/customerAddresses.scss";
import {
  createAddress,
  deleteAddress,
  getAddresses,
  updateAddress,
} from "../../../services/CustomerService";
import CustomerAddressForm from "../../forms/customer/CustomerAddressForm";
import UserContext from "../../../config/UserContext";

const CustomerAddresses = ({ onError }) => {
  const [addresses, setAddresses] = useState([]);
  const { user } = useContext(UserContext);

  const throwError = (error) => {
    if (!onError) return;

    if (error.status === 500) {
      onError(
        "We're experiencing technical difficulties. Please try again shortly."
      );
    } else if (error.request) {
      onError(
        "The server seems to be taking too long to respond. Please try again in a moment."
      );
    } else {
      onError("Something went wrong. Please try again.");
    }

    console.log("CustomerAddresses error:", error);
  };

  const handleEdit = (id) => {
    setAddresses(
      addresses.map((addr) =>
        addr.id === id
          ? { ...addr, isEditing: true }
          : { ...addr, isEditing: false }
      )
    );
  };

  const handleSave = async (id, data) => {
    try {
      if (id === "0") {
        const createdAddress = await createAddress(user.id, data);

        setAddresses((prev) =>
          prev.map((addr) =>
            addr.id === id ? { ...createdAddress, isEditing: false } : addr
          )
        );
      } else {
        await updateAddress(user.id, id, data);

        setAddresses((prev) =>
          prev.map((addr) =>
            addr.id === id ? { ...addr, ...data, isEditing: false } : addr
          )
        );
      }
    } catch (error) {
      throwError(error);
    }
  };

  const handleAdd = () => {
    setAddresses([
      ...addresses,
      {
        id: "0",
        street: "",
        streetNumber: "",
        city: "",
        zipCode: "",
        customerId: user.id,
        isEditing: true,
      },
    ]);
  };

  const handleDelete = async (addressId) => {
    try {
      await deleteAddress(user.id, addressId);
      loadAddresses();
    } catch (error) {
      throwError(error);
    }
  };

  async function loadAddresses() {
    try {
      const data = await getAddresses(user.id);
      setAddresses(
        data.map((item) => ({
          ...item,
          isEditing: false,
        }))
      );
    } catch (error) {
      throwError(error);
    }
  }

  useEffect(() => {
    loadAddresses();
  }, []);

  const isAnyEditing = addresses.some((address) => address.isEditing);

  return (
    <div id="Content">
      <div className="addresses-content">
        <div className="addresses-div">
          <div className="addresses-header">
            <h1>Your Delivery Addresses</h1>
            <button
              onClick={handleAdd}
              id="add-button"
              className="add-button"
              disabled={isAnyEditing}
            >
              Add New Address
            </button>
          </div>

          {addresses.length > 0 ? (
            <div className="cards-container">
              {addresses.map((address) => (
                <CustomerAddressForm
                  key={address.id}
                  addressId={address.id}
                  defaultValues={address}
                  isEditing={address.isEditing}
                  onEdit={handleEdit}
                  onSave={handleSave}
                  onDelete={handleDelete}
                />
              ))}
            </div>
          ) : (
            <span className="empty-addresses">
              You don't have any address yet. Click on the button above to
              create one.
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default CustomerAddresses;
