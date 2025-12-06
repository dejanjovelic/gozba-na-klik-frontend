import React, { useEffect, useState } from "react";
import PagionationSection from "../../sharedComponents/PaginationSection";
import { fetchRestaurantReviewsPaginated } from "../../../services/OrderReviewService";
import {
    Dialog,
    DialogTitle,
    DialogContent,
    IconButton,
    Box,
    Typography,
    Divider,
    Chip
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import RatingComponent from "../../sharedComponents/RatingComponent";

const RestaurantReviewsModal = ({ reviews, onClose, handlePageChange }) => {
    return (
        <Dialog className="reviews-dialog"
            open={true}
            onClose={onClose}
            maxWidth={false}
            slotProps={{
                sx: {
                    width: "500px !important",
                    backgroundColor: "#d4d4d4ff !important",
                    borderRadius: "20px !important",
                    p: 1,
                    boxShadow: "0px 4px 30px rgba(0,0,0,0.25) !important",
                }
            }}
        >
            <DialogTitle sx={{ textAlign: "center", fontWeight: 700, backgroundColor: "white" }}>
                Reviews
                <IconButton
                    onClick={onClose}
                    sx={{ position: "absolute", right: 16, top: 16 }}
                >
                    <CloseIcon />
                </IconButton>
            </DialogTitle>

            <DialogContent dividers sx={{ pt: 2, backgroundColor: "white" }}>
                {/* All reviews list */}
                {reviews.items.map((r) => (
                    <Box key={r.id} sx={{ mb: 3 }}>
                        {/* Customer header */}
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                            <Box
                                sx={{
                                    width: 40,
                                    height: 40,
                                    borderRadius: "50%",
                                    background: "#ffe8b2",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    fontSize: 20,
                                    flexShrink: 0
                                }}
                            >
                                👤
                            </Box>

                            <Box>
                                <Typography sx={{ fontWeight: 600 }}>
                                    {r.customerName}
                                </Typography>

                                <Typography sx={{ color: "green", fontSize: 14 }}>
                                    <RatingComponent rating={r.restaurantRating} />
                                </Typography>
                            </Box>
                        </Box>

                        {/* Comment */}
                        <Typography sx={{ mt: 1 }}>{r.restaurantComment}</Typography>
                        {r.restaurantReviewImage && <img src={r.restaurantReviewImage} alt="Review image" style={{ marginTop: "5px", width: "30%" }} />}

                        {/* Tags */}
                        {r.tags?.length > 0 && (
                            <Box
                                sx={{
                                    mt: 1,
                                    display: "flex",
                                    flexWrap: "wrap",
                                    gap: 1,
                                }}
                            >
                                {r.tags.map((tag) => (
                                    <Chip
                                        key={tag}
                                        label={tag}
                                        size="small"
                                        sx={{
                                            background: "#deeed1",
                                            color: "#4c7c3b",
                                            fontWeight: 600,
                                        }}
                                    />
                                ))}
                            </Box>
                        )}

                        <Divider sx={{ mt: 2 }} />
                    </Box>
                ))}
            </DialogContent>

            {/* Pagination footer bar */}
            <Box
                sx={{
                    p: 2,
                    background: "#f8f8f8",
                    borderTop: "1px solid #ddd",
                }}
            >
                <PagionationSection
                    page={reviews.pageIndex}
                    hasNextPage={reviews.hasNextPage}
                    hasPreviousPage={reviews.hasPreviousPage}
                    totalRowsCount={reviews.totalRowsCount}
                    onPageChange={(e, newPage) => handlePageChange(newPage)}
                />
            </Box>
        </Dialog>
    );
};

export default RestaurantReviewsModal;
