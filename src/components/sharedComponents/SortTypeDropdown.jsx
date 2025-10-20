import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import React, { useState } from "react";

const SortTypeDropdown = ({ onSortTypeChange, sortTypes }) => {
    const [sortType, setSortType] = useState("");

    const handleChange = (event) => {
        const sortTypeChange = event.target.value
        setSortType(sortTypeChange)
        onSortTypeChange(sortTypeChange)
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
                        <MenuItem key={sortType.key} value={sortType.key}>{sortType.name}</MenuItem>
                    )}
                </Select>
            </FormControl>
        </div>
    );

}
export default SortTypeDropdown;