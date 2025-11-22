import React, { useContext, useEffect, useState } from "react";
import {
  Autocomplete,
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Card,
  CardContent,
  CardHeader,
  Alert,
  AlertTitle,
  Backdrop,
  CircularProgress,
} from "@mui/material";
import CheckBoxOutlineBlankIcon from "@mui/icons-material/CheckBoxOutlineBlank";
import CheckBoxIcon from "@mui/icons-material/CheckBox";
import { getAllAllergens } from "../../../services/AllergenService";
import {
  getCustomerAllergens,
  updateCustomersAllergens,
} from "../../../services/CustomerService";
import { useNavigate } from "react-router-dom";
import "../../../styles/allergensPage.scss";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import UserContext from "../../../config/UserContext";

const CustomerAllergens = () => {

  const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
  const checkedIcon = <CheckBoxIcon fontSize="small" />;

  const [allergens, setAllergens] = useState([]);
  const [customerAllergens, setCustomerAllergens] = useState([]);
  const navigate = useNavigate();
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [isLoading, setIsloading] = useState(true);

  const {user} = useContext(UserContext);

  const getLoadingData = async () => {
    try {
      const allergensFromDb = await getAllAllergens();
      setAllergens(allergensFromDb);
      const customerAllergensFromDb = await getCustomerAllergens(user.id);
      setCustomerAllergens(customerAllergensFromDb);
      await new Promise((resolve) => setTimeout(resolve, 500));
    } catch (error) {
      if (error.status) {
        if (error.status === 404) {
          showMessageAndNavigate(
            `Customer with ${user.id} ${user.name} not found`,
            setErrorMsg
          );
        } else if (error.status === 500) {
          showMessageAndNavigate(
            "Server is temporarily unavailable. Please refresh or try again later.",
            setErrorMsg
          );
        } else {
          showMessageAndNavigate(`Error: ${error.status}`, setErrorMsg);
        }
      } else if (error.request) {
        showMessageAndNavigate(
          "The server is not responding. Please try again later.",
          setErrorMsg
        );
      } else {
        showMessageAndNavigate(
          "Something went wrong. Please try again.",
          setErrorMsg
        );
      }
      console.log(`An error occured while creating Customer:`, error);
    } finally {
      setIsloading(false);
    }
  };

  const showMessageAndNavigate = (message, setMessage) => {
    setMessage(message);
    setTimeout(() => {
      setMessage("");
      navigate("/customer");
    }, 2000);
  };

  const handleSave = async () => {
    try {
      const allergensId = customerAllergens.map((allergen) => allergen.id);
      await updateCustomersAllergens(user.id, allergensId);
      showMessageAndNavigate(
        "You successfuly updated your allergen list.",
        setSuccessMsg
      );
    } catch (error) {
      if (error.status) {
        if (error.status === 404) {
          showMessageAndNavigate(
            `Customer with ${user.id} ${user.name} not found`,
            setErrorMsg
          );
        } else if (error.status === 400) {
          showMessageAndNavigate(
            "One or more allergens do not exist.",
            setErrorMsg
          );
        } else if (error.status === 500) {
          showMessageAndNavigate(
            "Server is temporarily unavailable. Please refresh or try again later.",
            setErrorMsg
          );
        } else {
          showMessageAndNavigate(`Error: ${error.status}`, setErrorMsg);
        }
      } else if (error.request) {
        showMessageAndNavigate(
          "The server is not responding. Please try again later.",
          setErrorMsg
        );
      } else {
        showMessageAndNavigate(
          "Something went wrong. Please try again.",
          setErrorMsg
        );
      }
      console.log(
        `An error occured while creating Customer:`,
        error,
        setErrorMsg
      );
    }
  };

  useEffect(() => {
    getLoadingData();
  }, []);

  const onClose = () => {
    navigate("/customer");
  };

  return (
    <>
      <Backdrop
        sx={(theme) => ({ color: "#fff", zIndex: theme.zIndex.drawer + 1 })}
        open={isLoading}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
      {errorMsg && !isLoading && (
        <Dialog open={true} onClose={onClose} fullWidth maxWidth="sm">
          <Alert severity="error">
            <AlertTitle>Error</AlertTitle>
            {errorMsg}
          </Alert>
        </Dialog>
      )}
      {!isLoading && !errorMsg && (
        <Dialog
          open={true}
          onClose={onClose}
          fullWidth
          maxWidth="md"
          slotProps={{
            paper: {
              style: {
                height: "70vh",
              },
            },
          }}
        >
          <DialogTitle>Choose Allergens</DialogTitle>
          <DialogContent dividers>
            <Card variant="outlined">
              <CardHeader
                title="Select your allergens"
                subheader="To keep your meals safe and enjoyable, please select all ingredients you'd like to avoid."
                sx={{ paddingBottom: 1 }}
              />

              <CardContent>
                <Autocomplete
                  multiple
                  id="allergens-checkbox"
                  options={allergens}
                  disableCloseOnSelect
                  value={customerAllergens}
                  isOptionEqualToValue={(option, value) =>
                    option.id === value.id
                  }
                  onChange={(event, newValue) => setCustomerAllergens(newValue)}
                  getOptionLabel={(option) => option.name}
                  slotProps={{
                    popper: {},
                    listbox: {
                      sx: {
                        maxHeight: 150,
                        overflowY: "auto",
                      },
                    },
                  }}
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
              </CardContent>
              {successMsg && (
                <Alert
                  icon={<CheckCircleOutlineIcon fontSize="inherit" />}
                  severity="success"
                  sx={{ mx: 3, mb: 1 }}
                >
                  {successMsg}
                </Alert>
              )}
            </Card>
          </DialogContent>
          <DialogActions>
            <Button className="cancelBtn" onClick={onClose}>
              Cancel
            </Button>
            <Button
              className="saveBtn"
              onClick={handleSave}
              variant="contained"
              color="primary"
            >
              Save
            </Button>
          </DialogActions>
        </Dialog>
      )}
    </>
  );
};

export default CustomerAllergens;
