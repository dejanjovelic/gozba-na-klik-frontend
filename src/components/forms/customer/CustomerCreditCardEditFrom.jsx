import React from "react";

const CARD_BRANDS = ["Visa", "Mastercard", "AmericanExpress", "Dina"];

const CustomerCreditCardEditFrom = ({
    editFormData,
    onFieldChange,
    onCancel,
    onSave,
}) => {
    return (
        <>
            <div className="credit-card-top-row">
                <input
                    className="cc-inline-input cc-bank-input"
                    value={editFormData.bank || ""}
                    onChange={(e) => onFieldChange("bank", e.target.value)}
                    placeholder="Bank name"
                />
                <select
                    className="cc-inline-input cc-brand-select"
                    value={editFormData.brand || "Visa"}
                    onChange={(e) => onFieldChange("brand", e.target.value)}
                >
                    {CARD_BRANDS.map((brand) => (
                        <option key={brand} value={brand}>{brand}</option>
                    ))}
                </select>
            </div>

            <div className="credit-card-number-row">
                <input
                    className="cc-inline-input cc-number-input"
                    value={editFormData.cardNumber || ""}
                    onChange={(e) => onFieldChange("cardNumber", e.target.value)}
                    placeholder="New 16-digit number"
                    maxLength={16}
                />
            </div>

            <div className="credit-card-holder-row">
                <div className="cc-holder-inputs">
                    <input
                        className="cc-inline-input"
                        value={editFormData.cardHolderFirstName || ""}
                        onChange={(e) => onFieldChange("cardHolderFirstName", e.target.value)}
                        placeholder="First name"
                    />
                    <input
                        className="cc-inline-input"
                        value={editFormData.cardHolderLastName || ""}
                        onChange={(e) => onFieldChange("cardHolderLastName", e.target.value)}
                        placeholder="Last name"
                    />
                </div>
            </div>

            <div className="credit-card-actions">
                <button
                    type="button"
                    className="credit-card-action-button negative-action"
                    onClick={onCancel}
                >
                    Cancel
                </button>
                <button
                    type="button"
                    className="credit-card-action-button positive-action"
                    onClick={onSave}
                >
                    Save
                </button>
            </div>
        </>
    );
};

export default CustomerCreditCardEditFrom;
