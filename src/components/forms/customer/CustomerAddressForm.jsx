import React, { useEffect } from "react";
import { useForm, Controller } from 'react-hook-form';
import "../../../styles/customerAddresses.scss";
const CustomerAddressForm = ({ addressId, defaultValues, onSave, isEditing, onEdit, onDelete }) => {
    const { control, handleSubmit, reset, isValid } = useForm({
        defaultValues
    });

    const onSubmit = (data) => {
        onSave(addressId, data);
    };

    useEffect(() => {
        reset({
            id: defaultValues.id,
            street: defaultValues.street || '',
            streetNumber: defaultValues.streetNumber || '',
            city: defaultValues.city || '',
            zipCode: defaultValues.zipCode || ''
        });
    }, [
        defaultValues.street,
        defaultValues.streetNumber,
        defaultValues.city,
        defaultValues.zipCode,
        reset
    ]);

    return (
        <div className="address-card">
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
                                disabled={!isEditing}
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
                                disabled={!isEditing}
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
                                    disabled={!isEditing}
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
                                disabled={!isEditing}
                                placeholder="ZIP code"
                            />
                        )}
                    />
                </div>
            </div>

            <div className="button-wrapper">
                {isEditing ? (
                    <button
                        type="button"
                        onClick={handleSubmit(onSubmit)}
                    >
                        Save
                    </button>
                ) : (
                    <button
                        type="button"
                        onClick={() => onEdit(addressId)}
                    >
                        Edit
                    </button>
                )}
                <button id="delete-button" type="button" disabled={isEditing} onClick={() => onDelete(addressId)}>Delete</button>
            </div>

        </div>
    );
};

export default CustomerAddressForm;
