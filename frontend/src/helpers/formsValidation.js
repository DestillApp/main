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

/**
 * @function distillationFormValidation
 * @description Function to validate the distillation form data
 */
export const distillationFormValidation = (form) => {
  console.log("form", form);
  let isFormValid = true;

  if (
    form.choosedPlant.name === "" ||
    form.weightForDistillation === null ||
    form.distillationType === "" ||
    form.distillationDate === "" ||
    form.distillationApparatus === "" ||
    form.waterForDistillation === null
  ) {
    isFormValid = false;
  }

  if (
    !form.distillationTime.distillationHours &&
    !form.distillationTime.distillationMinutes
  ) {
    isFormValid = false;
    console.log("no");
  }

  if (form.isPlantSoaked) {
    // Additional validation for soaked plants
    if (form.soakingTime === null || form.weightAfterSoaking === null) {
      isFormValid = false;
    }
  }

  return isFormValid;
};

/**
 * @function resultsFormValidation
 * @description Function to validate the results form data
 * @param {Object} form - The results form data object
 * @returns {boolean} Returns true if the form is valid, otherwise false
 */
export const resultsFormValidation = (form) => {
  console.log("form", form);
  let isFormValid = true;

  // Validate required fields
  if (
    form.oilAmount === null ||
    form.hydrosolAmount === null ||
    form.hydrosolpH === null ||
    form.oilDescription === "" ||
    form.hydrosolDescription === ""
  ) {
    isFormValid = false;
  }

  // Additional validation for pH value
  if (form.hydrosolpH < 0 || form.hydrosolpH > 14) {
    isFormValid = false;
  }

  return isFormValid;
};
