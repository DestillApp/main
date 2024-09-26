/**
 * @function plantFormValidation
 * @description Function to validate the plant form data
 */
export const plantFormValidation = (form) => {
  console.log("form", form.plantOrigin);
  let isFormValid = true;
  // Initial form validation for required fields
  if (
    form.plantName === "" ||
    form.plantPart === "" ||
    form.plantOrigin === "" ||
    form.plantWeight === null ||
    form.plantState === ""
  ) {
    isFormValid = false;
  }

  // Additional validation for "kupno" origin
  if (form.plantOrigin === "kupno") {
    if (
      form.plantBuyDate === "" ||
      form.plantProducer === "" ||
      form.countryOfOrigin === ""
    ) {
      isFormValid = false;
    }
  }

  // Additional validation for "zbiór" origin
  if (form.plantOrigin === "zbiór") {
    if (
      form.harvestDate === "" ||
      form.harvestTemperature === null ||
      form.harvestStartTime === "" ||
      form.harvestEndTime === ""
    ) {
      isFormValid = false;
    }
  }

  // Additional validation for "podsuszony" state
  if (form.plantState === "podsuszony") {
    if (form.dryingTime === null) {
      isFormValid = false;
    }
  }

  // Additional validation for "suchy" state
  if (form.plantState === "suchy" && form.plantOrigin === "kupno") {
    if (form.plantAge === null) {
      isFormValid = false;
    }
  }
  return isFormValid;
};
