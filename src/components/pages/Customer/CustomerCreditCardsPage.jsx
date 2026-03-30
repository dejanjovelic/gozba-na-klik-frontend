import React, { useContext, useEffect, useState } from "react";
import "../../../styles/creditCards.scss";
import {
    getCreditCards,
    createCreditCard,
    updateCreditCard,
    deleteCreditCard,
    getCardBrands,
} from "../../../services/CreditCardService";
import CustomerCreditCardAddForm from "../../forms/customer/CustomerCreditCardAddForm";
import CustomerCreditCardEditFrom from "../../forms/customer/CustomerCreditCardEditFrom";
import UserContext from "../../../config/UserContext";
import ConfirmationPopup from "../Popups/ConfirmationPopup";

const getBrandLogo = (brand) => {
    switch (brand) {
        case "Visa": return "VISA";
        case "Mastercard": return "MC";
        case "AmericanExpress": return "AMEX";
        case "Dina": return "DINA";
        default: return brand;
    }
};

const maskCardNumber = (cardNumber) => {
    if (!cardNumber) return "**** **** **** ****";
    const clean = cardNumber.replace(/\s/g, "");
    if (clean.length < 4) return cardNumber;
    return `**** **** **** ${clean.slice(-4)}`;
};

const CustomerCreditCardsPage = ({ onError }) => {
    const [creditCards, setCreditCards] = useState([]);
    const [cardBrands, setCardBrands] = useState(null);
    const [openAddForm, setOpenAddForm] = useState(false);
    const [editingCardId, setEditingCardId] = useState(null);
    const [editFormData, setEditFormData] = useState({});
    const [showConfirmationPopUp, setShowConfirmationPopUp] = useState(false);
    const [cardToDelete, setCardToDelete] = useState(null);
    const { user } = useContext(UserContext);

    const throwError = (error) => {
        if (!onError) return;
        if (error.status === 500) {
            onError("We're experiencing technical difficulties. Please try again shortly.");
        } else if (error.request) {
            onError("The server seems to be taking too long to respond. Please try again in a moment.");
        } else {
            onError("Something went wrong. Please try again.");
        }
        console.log("CustomerCreditCardsPage error:", error);
    };

    async function loadCreditCards() {
        try {
            const data = await getCreditCards(user.id);
            setCreditCards(data);
        } catch (error) {
            throwError(error);
        }
    }

    async function loadCardBrands() {
        try {
            const data = await getCardBrands();
            setCardBrands(data);
        } catch (error) {
            setCardBrands([]);
            throwError(error);
        }
    }

    useEffect(() => {
        loadCreditCards();
        loadCardBrands();
    }, []);

    const handleAdd = async (data) => {
        try {
            const created = await createCreditCard(user.id, data);
            setCreditCards((prev) => [...prev, created]);
            setOpenAddForm(false);
        } catch (error) {
            setOpenAddForm(false);
            throwError(error);
        }
    };

    const handleEditStart = (card) => {
        setEditingCardId(card.id);
        setEditFormData({
            bank: card.bank,
            cardNumber: "",
            brand: card.brand,
            cardHolderFirstName: card.cardHolderFirstName,
            cardHolderLastName: card.cardHolderLastName,
        });
    };

    const handleEditCancel = () => {
        setEditingCardId(null);
        setEditFormData({});
    };

    const handleEditSave = async (card) => {
        try {
            const payload = {
                id: card.id,
                bank: editFormData.bank,
                cardNumber: editFormData.cardNumber,
                brand: editFormData.brand,
                cardHolderFirstName: editFormData.cardHolderFirstName,
                cardHolderLastName: editFormData.cardHolderLastName,
            };
            const updated = await updateCreditCard(user.id, card.id, payload);
            setCreditCards((prev) =>
                prev.map((c) => (c.id === card.id ? { ...c, ...updated } : c))
            );
            setEditingCardId(null);
            setEditFormData({});
        } catch (error) {
            throwError(error);
        }
    };

    const handleDeleteRequest = (cardId) => {
        setCardToDelete(cardId);
        setShowConfirmationPopUp(true);
    };

    const handleDeleteConfirm = async () => {
        try {
            await deleteCreditCard(user.id, cardToDelete);
            setCreditCards((prev) => prev.filter((c) => c.id !== cardToDelete));
        } catch (error) {
            throwError(error);
        } finally {
            setShowConfirmationPopUp(false);
            setCardToDelete(null);
        }
    };

    const handleEditFieldChange = (field, value) => {
        setEditFormData((prev) => ({ ...prev, [field]: value }));
    };

    const brandsLoaded = cardBrands !== null;
    const brandsAvailable = brandsLoaded && cardBrands.length > 0;

    return (
        <div id="customer-credit-cards-page-content">
            <div className="credit-cards-content">
                <div className="credit-cards-div">
                    <div className="credit-cards-header">
                        <h1 className="credit-cards-header-text">Your Credit Cards</h1>
                        <button
                            onClick={() => setOpenAddForm(true)}
                            id="add-card-button"
                            className="positive-action"
                            disabled={!brandsAvailable}
                        >
                            Add New Card
                        </button>
                    </div>

                    {brandsLoaded && !brandsAvailable && (
                        <span className="empty-credit-cards">
                            No card brands are currently available. Please try again later.
                        </span>
                    )}

                    <CustomerCreditCardAddForm
                        onSave={handleAdd}
                        open={openAddForm}
                        setOpen={setOpenAddForm}
                        cardBrands={cardBrands || []}
                    />

                    {showConfirmationPopUp && (
                        <ConfirmationPopup
                            message="Are you sure you want to delete this credit card?"
                            onNo={() => {
                                setShowConfirmationPopUp(false);
                                setCardToDelete(null);
                            }}
                            onYes={handleDeleteConfirm}
                        />
                    )}

                    {creditCards.length > 0 ? (
                        <div className="credit-cards-grid">
                            {creditCards.map((card) => {
                                const isEditing = editingCardId === card.id;
                                return (
                                    <div
                                        key={card.id}
                                        className={`credit-card-item${isEditing ? " editing" : ""}`}
                                    >
                                        {isEditing ? (
                                            <CustomerCreditCardEditFrom
                                                editFormData={editFormData}
                                                onFieldChange={handleEditFieldChange}
                                                onCancel={handleEditCancel}
                                                onSave={() => handleEditSave(card)}
                                                cardBrands={cardBrands || []}
                                            />
                                        ) : (
                                            <>
                                                <div className="credit-card-top-row">
                                                    <span className="credit-card-bank">{card.bank}</span>
                                                    <span className="credit-card-brand">{getBrandLogo(card.brand)}</span>
                                                </div>

                                                <div className="credit-card-number-row">
                                                    <span className="credit-card-number">{maskCardNumber(card.cardNumber)}</span>
                                                </div>

                                                <div className="credit-card-holder-row">
                                                    <span className="credit-card-holder">
                                                        {card.cardHolderFirstName} {card.cardHolderLastName}
                                                    </span>
                                                </div>

                                                <div className="credit-card-actions">
                                                    <button
                                                        type="button"
                                                        className="credit-card-action-button negative-action"
                                                        onClick={() => handleDeleteRequest(card.id)}
                                                    >
                                                        Delete
                                                    </button>
                                                    <button
                                                        type="button"
                                                        className="credit-card-action-button positive-action"
                                                        onClick={() => handleEditStart(card)}
                                                    >
                                                        Edit
                                                    </button>
                                                </div>
                                            </>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    ) : (
                        <span className="empty-credit-cards">
                            You don't have any credit cards yet. Click the button above to add one.
                        </span>
                    )}
                </div>
            </div>
        </div>
    );
};

export default CustomerCreditCardsPage;
