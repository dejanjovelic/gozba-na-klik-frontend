import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import React, { useState } from "react";

const SortTypeDropdown = ({ onSortTypeChange, sortTypes }) => {
    const [sortType, setSortType] = useState("");

    const handleChange = (event) => {
        const sortTypeChange = event.target.value
        setSortType(sortTypeChange)
        onSortTypeChange(sortTypeChange)
    }

    const sortTypeLabels = {
        NAME_ASC: "Name (A → Z)",
        NAME_DESC: "Name (Z → A)",
        CAPACITY_ASC: "Capacity  \u2191",
        CAPACITY_DESC: "Capacity  \u2193",
        AVERAGE_RATING_ASC: "Rating  \u2191",
        AVERAGE_RATING_DECS: "Rating  \u2193"
    }

    function getLabelsName(name) {
        return sortTypeLabels[name] || name
    }
    
    return (
        <div className="sort-container">
            <FormControl sx={{ m: 1, minWidth: 150 }}>
                <InputLabel id="restaurant-sortType-label">Sort Type</InputLabel>
                <Select
                    labelId="restaurant-sortType-label"
                    id="restaurant-sortType-select"
                    value={sortType}
                    onChange={handleChange}
                    autoWidth
                    label="SortType"
                >
                    {sortTypes.map(sortType =>
                        <MenuItem key={sortType.key} value={sortType.key}>{getLabelsName(sortType.name)}</MenuItem>
                    )}
                </Select>
            </FormControl>
        </div>
    );

}
export default SortTypeDropdown;