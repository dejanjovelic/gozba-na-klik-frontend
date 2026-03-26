import React, { useEffect } from "react";
import { useForm, Controller } from 'react-hook-form';
import "../../../styles/customerAddresses.scss";
import { SquareX } from "lucide-react";
const CustomerAddressForm = ({ addressId, defaultValues = {}, onSave, open, setOpen }) => {
    const { control, handleSubmit, reset, isValid } = useForm({
        defaultValues: {
            street: defaultValues?.street || "",
            streetNumber: defaultValues?.streetNumber || "",
            city: defaultValues?.city || "",
            zipCode: defaultValues?.zipCode || "",
        }
    });

    const onSubmit = (data) => {

        onSave(addressId, data);
    };

    useEffect(() => {
        reset({
            street: defaultValues?.street || "",
            streetNumber: defaultValues?.streetNumber || "",
            city: defaultValues?.city || "",
            zipCode: defaultValues?.zipCode || "",
        });
    }, [defaultValues, reset]);

    return (

        <div className="customer-address-card-form-container">
            {open ? (
                <div className="customer-address-card-form-wrapper">
                    <div className="address-card">
                        <div
                            className="address-card-close-button-conteiner"
                        >
                            <span
                                onClick={() => setOpen(false)}
                                className="address-card-close-button-wrapper">
                                <SquareX />
                            </span>

                        </div>
                        <div className="customer-address-card-title-container">
                            <h3
                                className="customer-address-card-title-text"
                            >
                                {addressId &&
                                    addressId === "0"
                                    ? "Add new address" : "Update address data"
                                }
                            </h3>
                        </div>

                        <div className="first-row">
                            <div className="input-wrapper">
                                <label htmlFor="street-input">Street</label>
                                <Controller
                                    name="street"
                                    control={control}
                                    rules={{ required: "Street is required" }}
                                    render={({ field, fieldState: { error } }) => (
                                        <input style={error && { borderColor: "red" }}
                                            id="street-input"
                                            {...field}
                                            placeholder="Street"
                                        />
                                    )}
                                />
                            </div>

                            <div className="input-wrapper">
                                <label htmlFor="streetNumber-input">Number</label>
                                <Controller
                                    name="streetNumber"
                                    control={control}
                                    rules={{ required: "Street number is required" }}
                                    render={({ field, fieldState: { error } }) => (
                                        <input style={error && { borderColor: "red" }}
                                            id="streetNumber-input"
                                            {...field}
                                            placeholder="Number"
                                        />
                                    )}
                                />
                            </div>
                        </div>

                        <div className="second-row">
                            <div className="input-wrapper">
                                <label htmlFor="city-input">City</label>
                                <Controller
                                    name="city"
                                    control={control}
                                    rules={{ required: "City is required" }}
                                    render={({ field, fieldState: { error } }) => (
                                        <>
                                            <input style={error && { borderColor: "red" }}
                                                id="city-input"
                                                {...field}
                                                placeholder="City"
                                            />
                                        </>
                                    )}
                                />
                            </div>
                            <div className="input-wrapper">
                                <label htmlFor="zipCode-input">Zip Code</label>
                                <Controller
                                    name="zipCode"
                                    control={control}
                                    rules={{
                                        required: "ZIP code is required",
                                        pattern: {
                                            value: /^[0-9]{5}$/,
                                            message: "ZIP code must be exactly 5 digits"
                                        }
                                    }}
                                    render={({ field, fieldState: { error } }) => (
                                        <input style={error && { borderColor: "red" }}
                                            id="zipCode-input"
                                            {...field}
                                            placeholder="ZIP code"
                                        />
                                    )}
                                />
                            </div>
                        </div>

                        <div className="button-wrapper">

                            <button
                                className="customer-address-button positive-action save-button"
                                type="button"
                                onClick={handleSubmit(onSubmit)}
                            >
                                Save
                            </button>
                        </div>
                    </div>
                </div>
            ) : null}
        </div>
    );
};

export default CustomerAddressForm;