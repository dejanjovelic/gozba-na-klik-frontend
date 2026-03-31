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
import ConfirmationPopup from "../Popups/ConfirmationPopup";

const CustomerAddresses = ({ onError }) => {
  const [addresses, setAddresses] = useState([]);
  const [address, setAddress] = useState(null);
  const [open, setOpen] = useState(false);
  const { user } = useContext(UserContext);
  const [showConfirmationPopUp, setShowConfirmationPopUp] = useState(false)

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

  const handleEdit = (address) => {
    setAddress(address);
    setOpen(true);
  }

  const handleSave = async (id, data) => {
    try {
      if (id === "0") {
        const createdAddress = await createAddress(user.id, data);

        setAddresses((prev) =>
          prev.map((addr) =>
            addr.id === id ? { ...prev, ...createdAddress } : addr
          ));
      } else {
        const newAddress = { ...data, id };
        await updateAddress(user.id, id, newAddress);

        setAddresses((prev) =>
          prev.map((addr) =>
            addr.id === id ? { ...addr, ...data } : addr
          )
        );
      }
      setOpen(false);
    } catch (error) {
      setOpen(false);
      throwError(error);
    }
  };

  const handleAdd = () => {
    setAddress({
      id: "0",
      street: "",
      streetNumber: "",
      city: "",
      zipCode: "",
      customerId: user.id,
      isEditing: true,
    });
    setOpen(true);
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
      setAddresses(data);
    } catch (error) {
      throwError(error);
    }
  }

  useEffect(() => {
    loadAddresses();
  }, []);

  return (
    <div id="customer-addresses-page-content">
      <div className="addresses-content">
        <div className="addresses-div">
          <div className="addresses-header">
            <h1 className="addresses-header-text">Your Delivery Addresses</h1>
            <button
              onClick={handleAdd}
              id="add-button"
              className="positive-action"
            >
              Add New Address
            </button>
          </div>

          {addresses.length > 0 ? (
            <div className="cards-container">

              <CustomerAddressForm
                addressId={address?.id}
                defaultValues={address}
                onSave={handleSave}
                open={open}
                setOpen={setOpen}
              />

              <table className="customer-addresses-table">
                <thead>
                  <tr>
                    <th>Street</th>
                    <th>Number</th>
                    <th>City</th>
                    <th>Zip code</th>
                    <th></th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {addresses.map((address) => (
                    <tr key={address.id}>
                      <td>{address.street}</td>
                      <td>{address.streetNumber}</td>
                      <td>{address.city}</td>
                      <td>{address.zipCode}</td>
                      <td>
                        <button
                          type="button"
                          className="customer-address-button negative-action"
                          onClick={() => setShowConfirmationPopUp(true)}
                        >
                          Delete
                        </button>
                        {showConfirmationPopUp && (
                          <ConfirmationPopup
                            message={`Are you sure you want to delete address?`}
                            onNo={() => setShowConfirmationPopUp(false)}
                            onYes={() => {
                              handleDelete(address.id);
                              setShowConfirmationPopUp(false);
                            }}
                          />
                        )}
                      </td>
                      <td>
                        <button
                          type="button"
                          className="customer-address-button positive-action"
                          onClick={() => handleEdit(address)}
                        >
                          Edit
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

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
