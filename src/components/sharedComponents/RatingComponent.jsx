import React from "react";
import { FaStar, FaStarHalfAlt, FaRegStar } from "react-icons/fa";
import Rating from "react-rating";

export default function RatingComponent({ rating }) {
    const starsValue = rating / 2;

    return (
        <Rating
            readonly
            initialRating={starsValue}
            emptySymbol={<FaRegStar color="#ffc400ff" size={20} />}
            fullSymbol={<FaStar color="#ffc400ff" size={20} />}
            placeholderSymbol={<FaStarHalfAlt color="#ffc400ff" size={20} />}
            fractions={2}
        />
    );
}