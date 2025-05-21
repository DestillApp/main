import { PlantForm } from "@/types/forms/plantForm";
import { DistillationForm } from "@/types/forms/distillationForm";
import { ResultsForm } from "@/types/forms/resultsForm";

/**
 * @function plantFormValidation
 * @description Function to validate the plant form data
 */
export const plantFormValidation = (form: PlantForm): boolean => {
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
export const distillationFormValidation = (form: DistillationForm): boolean => {
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
export const resultsFormValidation = (form: ResultsForm): boolean => {
  let isFormValid = true;

  // Validate required fields
  if (
    form.oilAmount === null ||
    form.hydrosolAmount === null ||
    form.hydrosolpH === null ||
    form.oilDescription === "" ||
    form.hydrosolDescription === "" ||
    form.hydrosolpH < 0 ||
    form.hydrosolpH > 14
  ) {
    isFormValid = false;
  }
  return isFormValid;
};

/**
 * @function editArchiveDistillationFormValidation
 * @description Function to validate the edit archive distillation form data
 * @param {Object} form - The edit archive distillation form data object
 * @returns {boolean} Returns true if the form is valid, otherwise false
 */
export const editArchiveDistillationFormValidation = (
  form: ResultsForm
): boolean => {
  let isFormValid = true;

  // Validate required fields for distillation data
  if (
    form.distillationData.weightForDistillation === null ||
    form.distillationData.distillationType === "" ||
    form.distillationData.distillationDate === "" ||
    form.distillationData.distillationApparatus === "" ||
    form.distillationData.waterForDistillation === null
  ) {
    isFormValid = false;
  }

  // Validate distillation time
  if (
    !form.distillationData.distillationTime.distillationHours &&
    !form.distillationData.distillationTime.distillationMinutes
  ) {
    isFormValid = false;
  }

  // Validate required fields for results data
  if (
    form.oilAmount === null ||
    form.hydrosolAmount === null ||
    form.hydrosolpH === null ||
    form.oilDescription === "" ||
    form.hydrosolDescription === "" ||
    form.hydrosolpH < 0 ||
    form.hydrosolpH > 14
  ) {
    isFormValid = false;
  }

  return isFormValid;
};

/**
 * @function registrationFormValidation
 * @description Function to validate the registration form data
 * @param {Object} form - The registration form data object
 * @returns {boolean} Returns true if the form is valid, otherwise false
 */
export const registrationFormValidation = (
  form: {
    username: string;
    email: string;
    password: string;
    confirmPassword: string;
  },
  username: boolean
): { isFormValid: boolean; isPasswordCorrect: boolean } => {
  let isFormValid = true;
  let isPasswordCorrect = true;

  // Initial form validation for required fields
  if (
    form.username === "" ||
    form.email === "" ||
    form.password === "" ||
    form.confirmPassword === ""
  ) {
    isFormValid = false;
  }

  if (username) {
    isFormValid = false;
  }

  // Password validation: at least 8 characters, one uppercase letter, one lowercase letter, and one number
  const passwordRegex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d).{8,}$/;
  if (!passwordRegex.test(form.password)) {
    isFormValid = false;
    isPasswordCorrect = false;
  }

  // Check if passwords match
  if (form.password !== form.confirmPassword) {
    isFormValid = false;
  }

  return { isFormValid, isPasswordCorrect };
};

/**
 * @function distillerFormValidation
 * @description Function to validate the distiller form data
 * @param {Object} form - The distiller form data object
 * @returns {boolean} Returns true if the form is valid, otherwise false
 */
export const distillerFormValidation = (form: {
  material: string;
  capacity: number;
  heating: string;
}): boolean => {
  let isFormValid = true;

  // Validate required fields
  if (
    form.material === "" ||
    form.capacity === null ||
    form.capacity <= 0 ||
    form.heating === ""
  ) {
    isFormValid = false;
  }

  return isFormValid;
};

/**
 * @function changePasswordFormValidation
 * @description Function to validate the change password form data
 * @param {Object} form - The change password form data object
 * @returns {Object} Returns an object with isFormValid and isPasswordCorrect properties
 */
export const changePasswordFormValidation = (form: {
  oldPassword: string;
  newPassword: string;
  confirmNewPassword: string;
}): { isFormValid: boolean; isPasswordCorrect: boolean } => {
  let isFormValid = true;
  let isPasswordCorrect = true;

  // Check if all values are not empty
  if (
    form.oldPassword === "" ||
    form.newPassword === "" ||
    form.confirmNewPassword === ""
  ) {
    isFormValid = false;
  }

  // Password validation: at least 8 characters, one uppercase letter, one lowercase letter, and one number
  const passwordRegex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d).{8,}$/;
  if (!passwordRegex.test(form.newPassword)) {
    isFormValid = false;
    isPasswordCorrect = false;
  }

  // Check if newPassword and confirmNewPassword are the same
  if (form.newPassword !== form.confirmNewPassword) {
    isFormValid = false;
  }

  return { isFormValid, isPasswordCorrect };
};
