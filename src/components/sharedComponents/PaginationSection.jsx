import React, { useState } from "react";
import { Box, Typography, Select, MenuItem, IconButton, useTheme } from "@mui/material";
import { KeyboardArrowLeft, KeyboardArrowRight } from "@mui/icons-material";

const PagionationSection = ({
    onPageChange,
    onPageSizeChange,
    totalRowsCount,
    hasNextPage,
    hasPreviousPage,
    page,
    pageSize
}) => {

    const theme = useTheme();

    const handlePrevious = () => {
        if (hasPreviousPage) {
            const newPage = page - 1;

            onPageChange(newPage);
        }
    };

    const handleNext = () => {
        if (hasNextPage) {
            const newPage = page + 1;
            onPageChange(newPage);
        }
    };

    const handlePageSizeChange = (e) => {
        const newSize = parseInt(e.target.value, 10);
        onPageSizeChange(newSize);
        onPageChange(0);
    };

    return (
        <Box
            sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 2,
                mt: 3,
            }}
        >
            <IconButton onClick={handlePrevious} disabled={!hasPreviousPage}>
                {theme.direction === 'rtl' ? <KeyboardArrowRight /> : <KeyboardArrowLeft />}
            </IconButton>

            <Typography variant="body1">
                Page <b>{page + 1}</b>
            </Typography>

            <IconButton onClick={handleNext} disabled={!hasNextPage}>
                {theme.direction === 'rtl' ? <KeyboardArrowLeft /> : <KeyboardArrowRight />}
            </IconButton>
            {pageSize >= 6 || pageSize <= 18 &&
                <Select
                    value={pageSize}
                    onChange={handlePageSizeChange}
                    size="small"
                    sx={{ ml: 2 }}
                >
                    {[6, 12, 18].map((size) => (
                        <MenuItem key={size} value={size}>
                            {size} / page
                        </MenuItem>
                    ))}
                </Select>
            }

            <Typography variant="body2" sx={{ ml: 2 }}>
                Total: {totalRowsCount}
            </Typography>
        </Box>
    );
};

export default PagionationSection;
