import React, { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import "../../../styles/creditCards.scss";
import { SquareX } from "lucide-react";

const CustomerCreditCardAddForm = ({ onSave, open, setOpen, cardBrands }) => {
    const { control, handleSubmit, reset } = useForm({
        defaultValues: {
            bank: "",
            cardNumber: "",
            brand: "",
            cardHolderFirstName: "",
            cardHolderLastName: "",
        },
    });

    useEffect(() => {
        if (open) {
            reset({
                bank: "",
                cardNumber: "",
                brand: cardBrands[0] ?? "",
                cardHolderFirstName: "",
                cardHolderLastName: "",
            });
        }
    }, [open, reset, cardBrands]);

    const onSubmit = (data) => {
        onSave(data);
    };

    if (!open) return null;

    return (
        <div className="credit-card-form-overlay">
            <div className="credit-card-add-form">
                <div className="credit-card-form-close">
                    <span onClick={() => setOpen(false)} className="address-card-close-button-wrapper">
                        <SquareX />
                    </span>
                </div>
                <div className="credit-card-form-title-container">
                    <h3 className="credit-card-form-title-text">Add new credit card</h3>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="credit-card-form-body">
                    <div className="credit-card-form-row">
                        <div className="input-wrapper">
                            <label htmlFor="bank-input">Bank</label>
                            <Controller
                                name="bank"
                                control={control}
                                rules={{ required: "Bank is required" }}
                                render={({ field, fieldState: { error } }) => (
                                    <input
                                        id="bank-input"
                                        style={error ? { borderColor: "red" } : {}}
                                        {...field}
                                        placeholder="Bank name"
                                    />
                                )}
                            />
                        </div>
                        <div className="input-wrapper">
                            <label htmlFor="brand-input">Brand</label>
                            <Controller
                                name="brand"
                                control={control}
                                rules={{ required: "Brand is required" }}
                                render={({ field, fieldState: { error } }) => (
                                    <select
                                        id="brand-input"
                                        style={error ? { borderColor: "red" } : {}}
                                        {...field}
                                    >
                                        {cardBrands.map((b) => (
                                            <option key={b} value={b}>{b}</option>
                                        ))}
                                    </select>
                                )}
                            />
                        </div>
                    </div>

                    <div className="credit-card-form-row">
                        <div className="input-wrapper full-width">
                            <label htmlFor="cardNumber-input">Card Number</label>
                            <Controller
                                name="cardNumber"
                                control={control}
                                rules={{
                                    required: "Card number is required",
                                    pattern: {
                                        value: /^\d{16}$/,
                                        message: "Card number must be 16 digits",
                                    },
                                }}
                                render={({ field, fieldState: { error } }) => (
                                    <>
                                        <input
                                            id="cardNumber-input"
                                            style={error ? { borderColor: "red" } : {}}
                                            {...field}
                                            placeholder="16-digit card number"
                                            maxLength={16}
                                        />
                                        {error && <span className="field-error">{error.message}</span>}
                                    </>
                                )}
                            />
                        </div>
                    </div>

                    <div className="credit-card-form-row">
                        <div className="input-wrapper">
                            <label htmlFor="firstName-input">First Name</label>
                            <Controller
                                name="cardHolderFirstName"
                                control={control}
                                rules={{ required: "First name is required" }}
                                render={({ field, fieldState: { error } }) => (
                                    <input
                                        id="firstName-input"
                                        style={error ? { borderColor: "red" } : {}}
                                        {...field}
                                        placeholder="First name"
                                    />
                                )}
                            />
                        </div>
                        <div className="input-wrapper">
                            <label htmlFor="lastName-input">Last Name</label>
                            <Controller
                                name="cardHolderLastName"
                                control={control}
                                rules={{ required: "Last name is required" }}
                                render={({ field, fieldState: { error } }) => (
                                    <input
                                        id="lastName-input"
                                        style={error ? { borderColor: "red" } : {}}
                                        {...field}
                                        placeholder="Last name"
                                    />
                                )}
                            />
                        </div>
                    </div>

                    <div className="credit-card-form-actions">
                        <button type="button" className="negative-action" onClick={() => setOpen(false)}>
                            Cancel
                        </button>
                        <button type="submit" className="positive-action">
                            Save
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CustomerCreditCardAddForm;
