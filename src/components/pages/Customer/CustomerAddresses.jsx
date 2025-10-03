import React, { useEffect, useState } from "react";
import "../../../styles/customerAddresses.scss";
import { createAddress, deleteAddress, getAddresses, updateAddress } from "../../../services/CustomerService";
import CustomerAddressForm from "../../forms/customer/CustomerAddressForm";
import ErrorPopup from "../Popups/ErrorPopup";

const CustomerAddresses = () => {
    const [addresses, setAddresses] = useState([]);
    const user = JSON.parse(sessionStorage.getItem("user") || "{}");
    const [showError, setShowError] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const handleCloseError = () => setShowError(false);

    const handleEdit = (id) => {
        setAddresses(addresses.map(addr =>
            addr.id === id ? { ...addr, isEditing: true } : { ...addr, isEditing: false }
        ));
    };

    const handleSave = async (id, data) => {
        try {
            if (id === '0') {
                const createdAddress = await createAddress(user.id, data);

                setAddresses(prev =>
                    prev.map(addr => addr.id === id ? { ...createdAddress, isEditing: false } : addr)
                );
            } else {
                await updateAddress(user.id, id, data);

                setAddresses(prevAddresses => {
                    const updated = prevAddresses.map(addr =>
                        addr.id === id ? { ...addr, ...data, isEditing: false } : addr
                    );
                    return updated;
                });
            }
        } catch (error) {
            console.error("An error occured while saving address:", error);
        }
    };

    const handleAdd = () => {
        setAddresses([
            ...addresses,
            {
                id: '0',
                street: '',
                streetNumber: '',
                city: '',
                zipCode: '',
                customerId: user.id,
                isEditing: true
            }
        ]);
    };

    const handleDelete = async (addressId) => {
        try {
            await deleteAddress(user.id, addressId);
            loadAddresses();
        } catch (error) {
            if (error.status && error.status === 500) {
                setErrorMessage("We're experiencing technical difficulties. Please try again shortly.");
            } else if (error.request) {
                setErrorMessage("The server seems to be taking too long to respond. Please try again in a moment.");
            } else {
                setErrorMessage("Something went wrong. Please try again.");
            }
            console.log("An error occurred while deleting Address:", error);
            setShowError(true);
        }
    }

    async function loadAddresses() {
        try {
            const data = await getAddresses(user.id);
            const dataWithEdit = data.map(data => ({
                ...data,
                isEditing: false
            }))
            setAddresses(dataWithEdit);
        }
        catch (error) {
            if (error.status && error.status === 500) {
                setErrorMessage("We're experiencing technical difficulties. Please try again shortly.")
            } else if (error.request) {
                setErrorMessage("The server seems to be taking too long to respond. Please try again in a moment.");
            } else {
                setErrorMessage("Something went wrong. Please try again.");
            }
            console.log("An error occurred while fetching Addresses:", error);
            setShowError(true);
        }
    }

    useEffect(() => {
        loadAddresses();
    }, []);

    const isAnyEditing = addresses?.some(address => address.isEditing);

    return (
        <>
            <div className="addresses-content">
                <div className="addresses-div">
                    <div className="addresses-header">
                        <h1>Your Delivery Addresses</h1>
                        <button onClick={handleAdd} id="add-button" className="add-button" disabled={isAnyEditing}>Add New Address</button>
                    </div>


                    {addresses.length > 0 ?
                        <div className="cards-container">
                            <>
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
                            </>
                        </div>

                        : <span className="empty-addresses">You don't have any address yet. Click on the button above to create one.</span>}

                </div>
            </div>
            {showError && <ErrorPopup message={errorMessage} onClose={handleCloseError} />}
        </>

    )
}

export default CustomerAddresses;