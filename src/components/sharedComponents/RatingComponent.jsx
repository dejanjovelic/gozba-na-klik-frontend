import React from 'react';
import Box from '@mui/material/Box';
import Rating from '@mui/material/Rating';
import StarIcon from '@mui/icons-material/Star';

export default function RatingComponent({ rating }) {
    return (
        rating && (
            <Box sx={{ width: 250, display: 'flex', alignItems: 'center' }}>
                <Rating
                    name="text-feedback"
                    value={rating / 2}
                    readOnly
                    precision={0.5}
                    emptyIcon={<StarIcon style={{ opacity: 0.55 }} fontSize="inherit" />}
                />
                <Box sx={{ ml: 2 }}>{`${rating}/10`}</Box>
            </Box>
        )
    );
}

