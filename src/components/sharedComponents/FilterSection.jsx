import { TextField, Box, Grid, Button } from "@mui/material";
import React, { useState } from "react";
const FilterSection = (props) => {
    const [name, setName] = useState('');
    const [city, setCity] = useState('');
    const [capacityFrom, setCapacityFrom] = useState(0);
    const [capacityTo, setCapacityTo] = useState(0);
    const [averageRatingFrom, setAverageRatingFrom] = useState(0);
    const [averageRatingTo, setAverageRatingTo] = useState(0);

    const filter = () => {
        props.onFilter({
            name: name ? name : null,
            city: city ? city : null,
            capacityFrom: capacityFrom ? capacityFrom : null,
            capacityTo: capacityTo ? capacityTo : null,
            averageRatingFrom: averageRatingFrom ? averageRatingFrom : null,
            averageRatingTo: averageRatingTo ? averageRatingTo : null
        })
    }

    const handleNumberChange = (event) => {
        const value = event.target.value;
        const name = event.target.name;

        const input = value === '' ? 0 : parseFloat(value);
        if (name === "capacityFrom") {
            setCapacityFrom(isNaN(input) ? 0 : input);
        } else if (name === "capacityTo") {
            setCapacityTo(isNaN(input) ? 0 : input);
        } else if (name === "averageRatingFrom") {
            setAverageRatingFrom(isNaN(input) ? 0 : input);
        } else if (name === "averageRatingTo") {
            setAverageRatingTo(isNaN(input) ? 0 : input);
        }
    }

    return (
        <Box >
            <Grid container spacing={2} >
                <Grid item size={3}>
                    <TextField fullWidth id="resturant-name" label="Name" variant="filled"
                        value={name} onChange={(e) => setName(e.target.value)} />
                </Grid>
                <Grid item size={3}>
                    <TextField fullWidth id="resturant-city" label="City" variant="filled"
                        value={city} onChange={(e) => setCity(e.target.value)} />
                </Grid>
                <Grid item size={3}>
                    <TextField fullWidth id="resturant-capaityFrom" type="number" label="Capaciti From"
                        variant="filled" name="capacityFrom" value={capacityFrom} onChange={(e) => handleNumberChange(e)} />
                </Grid>
                <Grid item size={3}>
                    <TextField fullWidth id="resturant-capaityTo" type="number" label="Capacity To"
                        variant="filled" name="capacityTo" value={capacityTo} onChange={(e) => handleNumberChange(e)} />
                </Grid>
                <Grid item size={6}>
                    <TextField fullWidth id="resturant-averageRatingFrom" type="number" label="Average Rating From"
                        variant="filled" name="averageRatingFrom" value={averageRatingFrom} onChange={(e) => handleNumberChange(e)} />
                </Grid>
                <Grid item size={6}>
                    <TextField fullWidth id="resturant-averageRatingTo" type="number" label="Average Rating To"
                        variant="filled" name="averageRatingTo" value={averageRatingTo} onChange={(e) => handleNumberChange(e)} />
                </Grid>
                <Grid item size={4}>
                    <Button  id="restaurant-filter-button" variant="outlined" onClick={filter}>Filter</Button>
                </Grid>
            </Grid>
        </Box>
    );
}
export default FilterSection;
