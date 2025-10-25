import React, { useEffect, useRef, useState } from "react";
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import ListItemText from '@mui/material/ListItemText';
import Select from '@mui/material/Select';
import Checkbox from '@mui/material/Checkbox';

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

export default function MultipleSelectCheckmarksComponent({ allAllergens, onChange, customerAllergens }) {
  const [selectedNames, setSelectedNames] = useState([]);
  const initialLockedNamesRef = useRef([]);
  console.log(customerAllergens)

  useEffect(() => {
    const initialLocked = customerAllergens
      .map(a => a.name);

    initialLockedNamesRef.current = initialLocked;
    console.log(initialLockedNamesRef.current)

    setSelectedNames(prev => [...new Set([...prev, ... initialLockedNamesRef.current])]);
  }, [allAllergens]);

  const handleChange = (event) => {
    const { value } = event.target;
    const newSelection = typeof value === 'string' ? value.split(',') : value;
    setSelectedNames(newSelection);
  };

  const handleSaveClick = () => {
    const additional = selectedNames.filter(name =>
      !initialLockedNamesRef.current.includes(name)
    );

    const additionalIds = allAllergens
      .filter(a => additional.includes(a.name))
      .map(a => a.id);

    if (onChange) {
      onChange(additionalIds);
    }
  };

  return (
    <>
      <FormControl sx={{ m: 1, width: 300 }}>
        <InputLabel id="allergen-select-label">Additional allergens</InputLabel>
        <Select
          labelId="allergen-select-label"
          multiple
          value={selectedNames}
          onChange={handleChange}
          input={<OutlinedInput label="Additional allergens" />}
          renderValue={(selected) => selected.join(', ')}
          MenuProps={MenuProps}
        >
          {allAllergens.map((allergen) => (
            <MenuItem key={allergen.id} value={allergen.name}
              disabled={initialLockedNamesRef.current.includes(allergen.name)}
            >
              <Checkbox checked={selectedNames.includes(allergen.name)} />
              <ListItemText primary={allergen.name} />
            </MenuItem>
          ))}
          <div id="multipleSelectionSaveBtn-container">
            <button id='multipleSelectionSaveBtn' onClick={handleSaveClick}>Save Allergens</button>
          </div>
        </Select>
      </FormControl>
    </>
  );
}