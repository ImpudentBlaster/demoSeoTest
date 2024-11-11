import {
    Page,
    Card,
    TextField,
    Checkbox,
    RangeSlider,
    Select,
    Button,
    Stack,
  } from "@shopify/polaris";
  import { useState } from "react";
  import "./ProductShippingForm.css";
  import { useNavigate } from "react-router-dom"; // Import useNavigate for navigation
  function ProductShippingForm() {
    const [shippingFee, setShippingFee] = useState("0");
    const [globalShipping, setGlobalShipping] = useState(false);
    const [shippingCountry, setShippingCountry] = useState([]);
    const [handlingTime, setHandlingTime] = useState({ min: 0, max: 10 }); // Default 10 days
    const [transitTime, setTransitTime] = useState({ min: 0, max: 10 }); // Default 10 days
    const [returnPolicy, setReturnPolicy] = useState("No return");
    const [returnMethod, setReturnMethod] = useState("Return in store");
    const [returnFee, setReturnFee] = useState("Free return");
    const [returnCountry, setReturnCountry] = useState([]);
  
    const handleGlobalShippingChange = (value) => setGlobalShipping(value);
    const handleShippingCountryChange = (value) => setShippingCountry(value);
  
    // Update both TextField and RangeSlider for Handling Time
    const handleHandlingMinChange = (value) => {
      setHandlingTime((prev) => ({ ...prev, min: parseInt(value) }));
    };
    const handleHandlingMaxChange = (value) => {
      setHandlingTime((prev) => ({ ...prev, max: parseInt(value) }));
    };
    const handleHandlingTimeChange = (value) => {
      setHandlingTime({ min: value[0], max: value[1] });
    };
  
    // Update both TextField and RangeSlider for Transit Time
    const handleTransitMinChange = (value) => {
      setTransitTime((prev) => ({ ...prev, min: parseInt(value) }));
    };
    const handleTransitMaxChange = (value) => {
      setTransitTime((prev) => ({ ...prev, max: parseInt(value) }));
    };
    const handleTransitTimeChange = (value) => {
      setTransitTime({ min: value[0], max: value[1] });
    };
  
    const handleReturnPolicyChange = (value) => setReturnPolicy(value);
    const handleReturnMethodChange = (value) => setReturnMethod(value);
    const handleReturnFeeChange = (value) => setReturnFee(value);
    const handleReturnCountryChange = (value) => setReturnCountry(value);
    const navigate = useNavigate(); // Initialize useNavigate hook
    const returnPolicyOptions = [
      { label: "No return", value: "No return" },
      { label: "Unlimited", value: "Unlimited" },
      { label: "Limited Period", value: "Limited Period" },
    ];
    const returnMethodOptions = [
      { label: "Return in store", value: "Return in store" },
      { label: "Return by mail", value: "Return by mail" },
      { label: "Return at store", value: "Return at store" },
    ];
    const returnFeeOptions = [
      { label: "Free return", value: "Free return" },
      { label: "Customer Responsibility", value: "Customer Responsibility" },
      { label: "Return Shipping fee", value: "Return Shipping fee" },
    ];
    const handleBack = () => {
      navigate("/Structured_data"); // Navigate back to SEO_Booster page
    };
    return (
      <Page
        title="Product"
        primaryAction={{
          content: "Save",
          onAction: () => alert("Product save"),
          disabled: false,
        }}
        secondaryActions={[
          // Use an array for secondaryActions
          {
            content: "Cancel",
            onAction: () => alert("Cancelled"), // Add an action to the Cancel button
            disabled: false, // Change to false if you want the button to be enabled
          },
        ]}
        backAction={{ content: "Products", onAction: handleBack }}
      >
        <Card sectioned>
          <Stack vertical>
            {/* Shipping Fee */}
            <TextField
              label="Shipping fee"
              value={shippingFee}
              onChange={setShippingFee}
              type="number"
              suffix="INR"
            />
  
            {/* Shipping Country */}
            <Checkbox
              label="Global shipping"
              checked={globalShipping}
              onChange={handleGlobalShippingChange}
            />
            {!globalShipping && (
              <TextField
                label="Shipping country"
                value={shippingCountry}
                onChange={handleShippingCountryChange}
                placeholder="Search shipping country"
              />
            )}
  
            {/* Handling Time */}
            <RangeSlider
              label="Handling time"
              min={0}
              max={100} // Set the range between 0 to 100
              value={[handlingTime.min, handlingTime.max]}
              onChange={handleHandlingTimeChange}
              output
              prefix="day"
            />
            <Stack distribution="fillEvenly">
              <TextField
                label="min"
                value={handlingTime.min}
                onChange={handleHandlingMinChange}
                type="number"
                suffix="day"
              />
              <TextField
                label="max"
                value={handlingTime.max}
                onChange={handleHandlingMaxChange}
                type="number"
                suffix="day"
              />
            </Stack>
  
            {/* Transit Time */}
            <RangeSlider
              label="Transit time"
              min={0}
              max={100} // Set the range between 0 to 100
              value={[transitTime.min, transitTime.max]}
              onChange={handleTransitTimeChange}
              output
              prefix="day"
            />
            <Stack distribution="fillEvenly">
              <TextField
                label="min"
                value={transitTime.min}
                onChange={handleTransitMinChange}
                type="number"
                suffix="day"
              />
              <TextField
                label="max"
                value={transitTime.max}
                onChange={handleTransitMaxChange}
                type="number"
                suffix="day"
              />
            </Stack>
  
            {/* Return Policy */}
            <Select
              label="Product return policy"
              options={returnPolicyOptions}
              onChange={handleReturnPolicyChange}
              value={returnPolicy}
            />
            {returnPolicy !== "No return" && (
              <Select
                label="Product method"
                options={returnMethodOptions}
                onChange={handleReturnMethodChange}
                value={returnMethod}
              />
            )}
            {returnPolicy !== "No return" && (
              <Select
                label="Return Fee"
                options={returnFeeOptions}
                onChange={handleReturnFeeChange}
                value={returnFee}
              />
            )}
            {/* Applicable Country for Return */}
  
            <TextField
              label="Applicable country for return"
              value={returnCountry}
              onChange={handleReturnCountryChange}
              placeholder="Search return country"
            />
          </Stack>
        </Card>
      </Page>
    );
  }
  
  export default ProductShippingForm;
  