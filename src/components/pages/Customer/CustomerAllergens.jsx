import React, { useContext, useEffect, useState } from "react";
import {
  Autocomplete,
  Button,
  Checkbox,
  Card,
  CardContent,
  CardHeader,
  TextField,
  Alert,
} from "@mui/material";
import CheckBoxOutlineBlankIcon from "@mui/icons-material/CheckBoxOutlineBlank";
import CheckBoxIcon from "@mui/icons-material/CheckBox";
import { getAllAllergens } from "../../../services/AllergenService";
import {
  getCustomerAllergens,
  updateCustomersAllergens,
} from "../../../services/CustomerService";
import "../../../styles/allergensPage.scss";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import UserContext from "../../../config/UserContext";

const CustomerAllergens = ({ onError }) => {
  const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
  const checkedIcon = <CheckBoxIcon fontSize="small" />;

  const [allergens, setAllergens] = useState([]);
  const [customerAllergens, setCustomerAllergens] = useState([]);
  const [successMsg, setSuccessMsg] = useState("");

  const { user } = useContext(UserContext);

  const throwError = (error) => {
    if (!onError) return;

    if (error.status === 404) {
      onError("Customer not found.");
    } else if (error.status === 400) {
      onError("One or more allergens do not exist.");
    } else if (error.status === 500) {
      onError("Server is temporarily unavailable. Please try again later.");
    } else if (error.request) {
      onError("The server is not responding. Please try again later.");
    } else {
      onError("Something went wrong. Please try again.");
    }

    console.log("CustomerAllergens error:", error);
  };

  const getLoadingData = async () => {
    try {
      const allergensFromDb = await getAllAllergens();
      setAllergens(allergensFromDb);

      const customerAllergensFromDb = await getCustomerAllergens(user.id);
      setCustomerAllergens(customerAllergensFromDb);

      await new Promise((resolve) => setTimeout(resolve, 300));
    } catch (error) {
      throwError(error);
    }
  };

  const showMessage = (message) => {
    setSuccessMsg(message);
    setTimeout(() => setSuccessMsg(""), 2000);
  };

  const handleSave = async () => {
    try {
      const allergenIds = customerAllergens.map((a) => a.id);
      await updateCustomersAllergens(user.id, allergenIds);

      showMessage("You successfully updated your allergen list.");
    } catch (error) {
      throwError(error);
    }
  };

  useEffect(() => {
    getLoadingData();
  }, []);

  return (
    <div id="Container">
      <div id="allergenContainer">
        <Card
          variant="outlined"
          style={{ height: "400px", width: "980px" }}
          id="AllergenFormCard"
        >
          <CardHeader
            title="Select your allergens"
            subheader="Select all ingredients you'd like to avoid."
            sx={{ paddingBottom: 1 }}
            style={{ color: "#ea9332" }}
          />
          <CardContent>
            <Autocomplete
              multiple
              id="allergens-checkbox"
              options={allergens}
              disableCloseOnSelect
              value={customerAllergens}
              onChange={(event, newValue) => setCustomerAllergens(newValue)}
              isOptionEqualToValue={(option, value) => option.id === value.id}
              getOptionLabel={(option) => option.name}
              renderOption={(props, option, { selected }) => (
                <li {...props}>
                  <Checkbox
                    icon={icon}
                    checkedIcon={checkedIcon}
                    style={{ marginRight: 8 }}
                    checked={selected}
                  />
                  {option.name}
                </li>
              )}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Allergens"
                  placeholder="Select..."
                />
              )}
            />

            {successMsg && (
              <Alert
                icon={<CheckCircleOutlineIcon fontSize="inherit" />}
                severity="success"
                sx={{ mt: 2 }}
              >
                {successMsg}
              </Alert>
            )}

            <Button
              className="saveBtn"
              onClick={handleSave}
              variant="contained"
              color="primary"
              sx={{ mt: 2 }}
            >
              Save
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CustomerAllergens;
