import { defineConfig } from "vitepress";

export default defineConfig({
  title: "DestillationApp Frontend Docs",
  description: "Documentation for the DestillationApp frontend",
  cleanUrls: true,
  themeConfig: {
    nav: [
      { text: "Guide", link: "/" },
      { text: "Vue API", link: "/api/App.vue/App", activeMatch: "^/api/" },
      { text: "TypeScript API", link: "/typedoc/modules", activeMatch: "^/typedoc/" },
    ],
    sidebar: {
      "/api/": [
        {
          text: "App",
          link: "/api/App.vue/App",
        },
        {
          text: "Components",
          items: [
            { text: "AskModal", link: "/api/components/AskModal" },
            {
              text: "DeleteItemModal",
              link: "/api/components/DeleteItemModal",
            },
            {
              text: "DistillationData",
              link: "/api/components/DistillationData",
            },
            {
              text: "DistillationPlant",
              link: "/api/components/DistillationPlant",
            },
            {
              text: "DistillationProcess",
              link: "/api/components/DistillationProcess",
            },
            { text: "DistillerForm", link: "/api/components/DistillerForm" },
            {
              text: "ListLengthSettings",
              link: "/api/components/ListLengthSettings",
            },
            { text: "ListSorting", link: "/api/components/ListSorting" },
            {
              text: "PasswordChangeForm",
              link: "/api/components/PasswordChangeForm",
            },
            { text: "PlantData", link: "/api/components/PlantData" },
            { text: "PlantDetails", link: "/api/components/PlantDetails" },
            {
              text: "PlantIdentification",
              link: "/api/components/PlantIdentification",
            },
            { text: "PlantOrigin", link: "/api/components/PlantOrigin" },
            { text: "ResultsData", link: "/api/components/ResultsData" },
            {
              text: "ResultsDescriptions",
              link: "/api/components/ResultsDescriptions",
            },
            {
              text: "ResultsDistillation",
              link: "/api/components/ResultsDistillation",
            },
            { text: "ResultsPlant", link: "/api/components/ResultsPlant" },
          ],
        },
        {
          text: "Layout",
          items: [
            { text: "MobileMenu", link: "/api/layout/MobileMenu" },
            {
              text: "TabletAccountMenu",
              link: "/api/layout/TabletAccountMenu",
            },
            { text: "TheHeader", link: "/api/layout/TheHeader" },
          ],
        },
        {
          text: "Pages",
          items: [
            {
              text: "AddDistillationPage",
              link: "/api/pages/AddDistillationPage",
            },
            { text: "AddPlantPage", link: "/api/pages/AddPlantPage" },
            { text: "AddResultsPage", link: "/api/pages/AddResultsPage" },
            {
              text: "ArchiveDistillationDetailsPage",
              link: "/api/pages/ArchiveDistillationDetailsPage",
            },
            {
              text: "DistillationArchivesPage",
              link: "/api/pages/DistillationArchivesPage",
            },
            {
              text: "DistillationDetailsPage",
              link: "/api/pages/DistillationDetailsPage",
            },
            {
              text: "EditArchiveDistillationPage",
              link: "/api/pages/EditArchiveDistillationPage",
            },
            {
              text: "EditDistillationPage",
              link: "/api/pages/EditDistillationPage",
            },
            { text: "EditPlantPage", link: "/api/pages/EditPlantPage" },
            {
              text: "InProgressDistillationsPage",
              link: "/api/pages/InProgressDistillationsPage",
            },
            { text: "LoginPage", link: "/api/pages/LoginPage" },
            { text: "MyAccountPage", link: "/api/pages/MyAccountPage" },
            { text: "MyDataPage", link: "/api/pages/MyDataPage" },
            { text: "PlantDetailsPage", link: "/api/pages/PlantDetailsPage" },
            { text: "PlantListPage", link: "/api/pages/PlantListPage" },
            { text: "RegistrationPage", link: "/api/pages/RegistrationPage" },
          ],
        },
        {
          text: "UI",
          items: [
            {
              text: "BaseAutocompleteInput",
              link: "/api/ui/BaseAutocompleteInput",
            },
            { text: "BaseButton", link: "/api/ui/BaseButton" },
            { text: "BaseCard", link: "/api/ui/BaseCard" },
            { text: "BaseDatePicker", link: "/api/ui/BaseDatePicker" },
            {
              text: "BaseInputDatePicker",
              link: "/api/ui/BaseInputDatePicker",
            },
            { text: "BaseModal", link: "/api/ui/BaseModal" },
            { text: "BaseRadioInput", link: "/api/ui/BaseRadioInput" },
            { text: "BaseSearchItem", link: "/api/ui/BaseSearchItem" },
            { text: "BaseTextArea", link: "/api/ui/BaseTextArea" },
            { text: "BaseTextInput", link: "/api/ui/BaseTextInput" },
          ],
        },
      ],
      "/typedoc/": [
        {
          text: "Overview",
          items: [
            { text: "Modules", link: "/typedoc/modules" },
            { text: "README", link: "/typedoc/README" },
          ],
        },
        {
            text: "main",
            link: "/typedoc/main/README.md",
        },
        {
            text: "router",
            link: "/typedoc/router/README.md"
        },
        {
          text: "Store",
          items: [
            {
              text: "auth",
              items: [
                {
                  text: "interfaces",
                  link: "/typedoc/store/auth/interfaces/AuthState",
                },
                {
                  text: "variables",
                  link: "/typedoc/store/auth/variables/default",
                },
                {
                  text: "actions",
                  link: "/typedoc/store/auth/actions/variables/default",
                },
                {
                  text: "getters",
                  link: "/typedoc/store/auth/getters/variables/default",
                },
                {
                  text: "mutations",
                  link: "/typedoc/store/auth/mutations/variables/default",
                },
              ],
            },
            {
              text: "distillation",
              items: [
                {
                  text: "variables",
                  link: "/typedoc/store/distillation/variables/default",
                },
                {
                  text: "actions",
                  link: "/typedoc/store/distillation/actions/variables/default",
                },
                {
                  text: "getters",
                  link: "/typedoc/store/distillation/getters/variables/default",
                },
                {
                  text: "mutations",
                  link: "/typedoc/store/distillation/mutations/variables/default",
                },
              ],
            },
            {
              text: "plant",
              items: [
                {
                  text: "variables",
                  link: "/typedoc/store/plant/variables/default",
                },
                {
                  text: "actions",
                  link: "/typedoc/store/plant/actions/variables/default",
                },
                {
                  text: "getters",
                  link: "/typedoc/store/plant/getters/variables/default",
                },
                {
                  text: "mutations",
                  link: "/typedoc/store/plant/mutations/variables/default",
                },
              ],
            },
            {
              text: "results",
              items: [
                {
                  text: "variables",
                  link: "/typedoc/store/results/variables/default",
                },
                {
                  text: "actions",
                  link: "/typedoc/store/results/actions/variables/default",
                },
                {
                  text: "getters",
                  link: "/typedoc/store/results/getters/variables/default",
                },
                {
                  text: "mutations",
                  link: "/typedoc/store/results/mutations/variables/default",
                },
              ],
            },
            {
              text: "settings",
              items: [
                {
                  text: "settings interface",
                  link: "/typedoc/store/settings/interfaces/SettingsForm",
                },
                {
                  text: "distiller interface",
                  link: "/typedoc/store/settings/interfaces/Distiller",
                },
                {
                  text: "variables",
                  link: "/typedoc/store/settings/variables/default",
                },
                {
                  text: "actions",
                  link: "/typedoc/store/settings/actions/variables/default",
                },
                {
                  text: "getters",
                  link: "/typedoc/store/settings/getters/variables/default",
                },
                {
                  text: "mutations",
                  link: "/typedoc/store/settings/mutations/variables/default",
                },
              ],
            },
            { text: "store", link: "/typedoc/store/README" },
            {
              text: "useStore",
              link: "/typedoc/store/useStore/functions/useStore",
            },
          ],
        },
        {
          text: "Types",
          items: [
            {
              text: "distiller",
              items: [
                {
                  text: "Distiller",
                  link: "/typedoc/types/distiller/interfaces/Distiller",
                },
                {
                  text: "DistillerWithId",
                  link: "/typedoc/types/distiller/interfaces/DistillerWithId",
                },
              ],
            },
            {
              text: "enums",
              items: [
                {
                  text: "DistillationType",
                  link: "/typedoc/types/enums/enumerations/DistillationType",
                },
                {
                  text: "ListSortingOptions",
                  link: "/typedoc/types/enums/enumerations/ListSortingOptions",
                },
                {
                  text: "PlantOrigin",
                  link: "/typedoc/types/enums/enumerations/PlantOrigin",
                },
                {
                  text: "PlantState",
                  link: "/typedoc/types/enums/enumerations/PlantState",
                },
              ],
            },
            {
              text: "events",
              items: [
                {
                  text: "AskModalEvents",
                  link: "/typedoc/types/events/interfaces/AskModalEvents",
                },
                {
                  text: "BaseDatePickerEvents",
                  link: "/typedoc/types/events/interfaces/BaseDatePickerEvents",
                },
                {
                  text: "BaseInputDatePickerEvents",
                  link: "/typedoc/types/events/interfaces/BaseInputDatePickerEvents",
                },
                {
                  text: "BaseRadioInputEvents",
                  link: "/typedoc/types/events/interfaces/BaseRadioInputEvents",
                },
                {
                  text: "BaseSearchEvents",
                  link: "/typedoc/types/events/interfaces/BaseSearchEvents",
                },
                {
                  text: "BaseTextEvents",
                  link: "/typedoc/types/events/interfaces/BaseTextEvents",
                },
                {
                  text: "CloseModal",
                  link: "/typedoc/types/events/interfaces/CloseModal",
                },
                {
                  text: "DeleteItemModalEvents",
                  link: "/typedoc/types/events/interfaces/DeleteItemModalEvents",
                },
                {
                  text: "InputEvents",
                  link: "/typedoc/types/events/interfaces/InputEvents",
                },
                {
                  text: "ListLengthSettingsEvents",
                  link: "/typedoc/types/events/interfaces/ListLengthSettingsEvents",
                },
                {
                  text: "ListSortingEvents",
                  link: "/typedoc/types/events/interfaces/ListSortingEvents",
                },
                {
                  text: "ToggleMenu",
                  link: "/typedoc/types/events/interfaces/ToggleMenu",
                },
              ],
            },
            {
              text: "forms",
              items: [
                {
                  text: "distillationForm",
                  items: [
                    {
                      text: "DistillationForm",
                      link: "/typedoc/types/forms/distillationForm/interfaces/DistillationForm",
                    },
                    {
                      text: "DistillationFormSubmit",
                      link: "/typedoc/types/forms/distillationForm/interfaces/DistillationFormSubmit",
                    },
                    {
                      text: "DistillationTime",
                      link: "/typedoc/types/forms/distillationForm/interfaces/DistillationTime",
                    },
                    {
                      text: "ChoosedPlant",
                      link: "/typedoc/types/forms/distillationForm/interfaces/ChoosedPlant",
                    },
                    {
                      text: "FormChoosedPlant",
                      link: "/typedoc/types/forms/distillationForm/interfaces/FormChoosedPlant",
                    },
                    {
                      text: "GetDistillationById",
                      link: "/typedoc/types/forms/distillationForm/interfaces/GetDistillationById",
                    },
                    {
                      text: "ShortPlant",
                      link: "/typedoc/types/forms/distillationForm/interfaces/ShortPlant",
                    },
                  ],
                },
                {
                  text: "loginForm",
                  items: [
                    {
                      text: "LoginForm",
                      link: "/typedoc/types/forms/loginForm/interfaces/LoginForm",
                    },
                  ],
                },
                {
                  text: "plantForm",
                  items: [
                    {
                      text: "PlantForm",
                      link: "/typedoc/types/forms/plantForm/interfaces/PlantForm",
                    },
                    {
                      text: "BasicPlant",
                      link: "/typedoc/types/forms/plantForm/interfaces/BasicPlant",
                    },
                    {
                      text: "GetPlantById",
                      link: "/typedoc/types/forms/plantForm/interfaces/GetPlantById",
                    },
                    {
                      text: "NormalizedPlantById",
                      link: "/typedoc/types/forms/plantForm/interfaces/NormalizedPlantById",
                    },
                    {
                      text: "PlantFormSubmit",
                      link: "/typedoc/types/forms/plantForm/interfaces/PlantFormSubmit",
                    },
                  ],
                },
                {
                  text: "registrationForm",
                  items: [
                    {
                      text: "RegistrationForm",
                      link: "/typedoc/types/forms/registrationForm/interfaces/RegistrationForm",
                    },
                  ],
                },
                {
                  text: "resultsForm",
                  items: [
                    {
                      text: "ResultsForm",
                      link: "/typedoc/types/forms/resultsForm/interfaces/ResultsForm",
                    },
                    {
                      text: "ResultsDistillation",
                      link: "/typedoc/types/forms/resultsForm/interfaces/ResultsDistillation",
                    },
                    {
                      text: "ResultsPlant",
                      link: "/typedoc/types/forms/resultsForm/interfaces/ResultsPlant",
                    },
                    {
                      text: "DistillationArchive",
                      link: "/typedoc/types/forms/resultsForm/interfaces/DistillationArchive",
                    },
                    {
                      text: "DistillationArchivePlant",
                      link: "/typedoc/types/forms/resultsForm/interfaces/DistillationArchivePlant",
                    },
                  ],
                },
              ],
            },
            {
              text: "store",
              items: [
                {
                  text: "RootState",
                  link: "/typedoc/types/store/interfaces/RootState",
                },
                {
                  text: "RootStateOnly",
                  link: "/typedoc/types/store/interfaces/RootStateOnly",
                },
              ],
            },
          ],
        },
        {
          text: "Helpers",
          items: [
            {
              text: "dateHelpers",
              items: [
                {
                  text: "getMinutesFromTime",
                  link: "/typedoc/helpers/dateHelpers/functions/getMinutesFromTime",
                },
                {
                  text: "setTimeFromMinutesAmount",
                  link: "/typedoc/helpers/dateHelpers/functions/setTimeFromMinutesAmount",
                },
              ],
            },
            {
              text: "displayHelpers",
              items: [
                {
                  text: "plantAgeWithSuffix",
                  link: "/typedoc/helpers/displayHelpers/functions/plantAgeWithSuffix",
                },
                {
                  text: "scrollToTop",
                  link: "/typedoc/helpers/displayHelpers/functions/scrollToTop",
                },
              ],
            },
            {
              text: "errorHandling",
              items: [
                {
                  text: "handleUserError",
                  link: "/typedoc/helpers/errorHandling/functions/handleUserError",
                },
              ],
            },
            {
              text: "formatHelpers",
              items: [
                {
                  text: "preventMinusNumber",
                  link: "/typedoc/helpers/formatHelpers/functions/preventMinusNumber",
                },
                {
                  text: "setIntegerNumber",
                  link: "/typedoc/helpers/formatHelpers/functions/setIntegerNumber",
                },
                {
                  text: "setKeyboardIntegerNumber",
                  link: "/typedoc/helpers/formatHelpers/functions/setKeyboardIntegerNumber",
                },
                {
                  text: "setNumberFormat",
                  link: "/typedoc/helpers/formatHelpers/functions/setNumberFormat",
                },
              ],
            },
            {
              text: "formsInitialState",
              items: [
                {
                  text: "initialDistillationForm",
                  link: "/typedoc/helpers/formsInitialState/variables/initialDistillationForm",
                },
                {
                  text: "initialPlantForm",
                  link: "/typedoc/helpers/formsInitialState/variables/initialPlantForm",
                },
                {
                  text: "initialResultsForm",
                  link: "/typedoc/helpers/formsInitialState/variables/initialResultsForm",
                },
              ],
            },
            {
              text: "formsMapping",
              items: [
                {
                  text: "mapDistillationForm",
                  link: "/typedoc/helpers/formsMapping/functions/mapDistillationForm",
                },
                {
                  text: "mapPlantForm",
                  link: "/typedoc/helpers/formsMapping/functions/mapPlantForm",
                },
                {
                  text: "mapResultsForm",
                  link: "/typedoc/helpers/formsMapping/functions/mapResultsForm",
                },
              ],
            },
            {
              text: "formsNormalize",
              items: [
                {
                  text: "normalizeSelectedFields",
                  link: "/typedoc/helpers/formsNormalize/functions/normalizeSelectedFields",
                },
              ],
            },
            {
              text: "formsValidation",
              items: [
                {
                  text: "changePasswordFormValidation",
                  link: "/typedoc/helpers/formsValidation/functions/changePasswordFormValidation",
                },
                {
                  text: "distillationFormValidation",
                  link: "/typedoc/helpers/formsValidation/functions/distillationFormValidation",
                },
                {
                  text: "distillerFormValidation",
                  link: "/typedoc/helpers/formsValidation/functions/distillerFormValidation",
                },
                {
                  text: "editArchiveDistillationFormValidation",
                  link: "/typedoc/helpers/formsValidation/functions/editArchiveDistillationFormValidation",
                },
                {
                  text: "plantFormValidation",
                  link: "/typedoc/helpers/formsValidation/functions/plantFormValidation",
                },
                {
                  text: "registrationFormValidation",
                  link: "/typedoc/helpers/formsValidation/functions/registrationFormValidation",
                },
                {
                  text: "resultsFormValidation",
                  link: "/typedoc/helpers/formsValidation/functions/resultsFormValidation",
                },
              ],
            },
            {
              text: "routerGuards",
              items: [
                {
                  text: "comingFromRouteGuard",
                  link: "/typedoc/helpers/routerGuards/functions/comingFromRouteGuard",
                },
              ],
            },
            {
              text: "settingsFunctions",
              items: [
                {
                  text: "updateListSettings",
                  link: "/typedoc/helpers/settingsFunctions/functions/updateListSettings",
                },
                {
                  text: "updateListSorting",
                  link: "/typedoc/helpers/settingsFunctions/functions/updateListSorting",
                },
              ],
            },
          ],
        },
        {
          text: "GraphQL",
          items: [
            {
              text: "mutations",
              items: [
                {
                  text: "auth",
                  items: [
                    {
                      text: "CHANGE_PASSWORD",
                      link: "/typedoc/graphql/mutations/auth/variables/CHANGE_PASSWORD",
                    },
                    {
                      text: "LOGIN",
                      link: "/typedoc/graphql/mutations/auth/variables/LOGIN",
                    },
                    {
                      text: "LOGOUT",
                      link: "/typedoc/graphql/mutations/auth/variables/LOGOUT",
                    },
                    {
                      text: "REGISTER_USER",
                      link: "/typedoc/graphql/mutations/auth/variables/REGISTER_USER",
                    },
                  ],
                },
                {
                  text: "distillation",
                  items: [
                    {
                      text: "CREATE_DISTILLATION",
                      link: "/typedoc/graphql/mutations/distillation/variables/CREATE_DISTILLATION",
                    },
                    {
                      text: "DELETE_DISTILLATION",
                      link: "/typedoc/graphql/mutations/distillation/variables/DELETE_DISTILLATION",
                    },
                    {
                      text: "UPDATE_DISTILLATION",
                      link: "/typedoc/graphql/mutations/distillation/variables/UPDATE_DISTILLATION",
                    },
                  ],
                },
                {
                  text: "plant",
                  items: [
                    {
                      text: "CHANGE_AVAILABLE_WEIGHT",
                      link: "/typedoc/graphql/mutations/plant/variables/CHANGE_AVAILABLE_WEIGHT",
                    },
                    {
                      text: "CREATE_PLANT",
                      link: "/typedoc/graphql/mutations/plant/variables/CREATE_PLANT",
                    },
                    {
                      text: "DELETE_PLANT",
                      link: "/typedoc/graphql/mutations/plant/variables/DELETE_PLANT",
                    },
                    {
                      text: "UPDATE_AVAILABLE_WEIGHT",
                      link: "/typedoc/graphql/mutations/plant/variables/UPDATE_AVAILABLE_WEIGHT",
                    },
                    {
                      text: "UPDATE_PLANT",
                      link: "/typedoc/graphql/mutations/plant/variables/UPDATE_PLANT",
                    },
                  ],
                },
                {
                  text: "results",
                  items: [
                    {
                      text: "CREATE_DISTILLATION_ARCHIVE",
                      link: "/typedoc/graphql/mutations/results/variables/CREATE_DISTILLATION_ARCHIVE",
                    },
                    {
                      text: "DELETE_DISTILLATION_ARCHIVE",
                      link: "/typedoc/graphql/mutations/results/variables/DELETE_DISTILLATION_ARCHIVE",
                    },
                    {
                      text: "UPDATE_DISTILLATION_ARCHIVE",
                      link: "/typedoc/graphql/mutations/results/variables/UPDATE_DISTILLATION_ARCHIVE",
                    },
                  ],
                },
                {
                  text: "settings",
                  items: [
                    {
                      text: "ADD_DISTILLER",
                      link: "/typedoc/graphql/mutations/settings/variables/ADD_DISTILLER",
                    },
                    {
                      text: "CREATE_SETTINGS",
                      link: "/typedoc/graphql/mutations/settings/variables/CREATE_SETTINGS",
                    },
                    {
                      text: "DELETE_DISTILLER",
                      link: "/typedoc/graphql/mutations/settings/variables/DELETE_DISTILLER",
                    },
                    {
                      text: "UPDATE_DARK_THEME",
                      link: "/typedoc/graphql/mutations/settings/variables/UPDATE_DARK_THEME",
                    },
                    {
                      text: "UPDATE_LIST_SETTINGS",
                      link: "/typedoc/graphql/mutations/settings/variables/UPDATE_LIST_SETTINGS",
                    },
                    {
                      text: "UPDATE_LIST_SORTING",
                      link: "/typedoc/graphql/mutations/settings/variables/UPDATE_LIST_SORTING",
                    },
                  ],
                },
              ],
            },
            {
              text: "queries",
              items: [
                {
                  text: "auth",
                  items: [
                    {
                      text: "CHECK_USERNAME_EXISTENCE",
                      link: "/typedoc/graphql/queries/auth/variables/CHECK_USERNAME_EXISTENCE",
                    },
                    {
                      text: "GET_USER_DETAILS",
                      link: "/typedoc/graphql/queries/auth/variables/GET_USER_DETAILS",
                    },
                    {
                      text: "VERIFY_AUTH",
                      link: "/typedoc/graphql/queries/auth/variables/VERIFY_AUTH",
                    },
                  ],
                },
                {
                  text: "country",
                  items: [
                    {
                      text: "GET_COUNTRY_NAMES",
                      link: "/typedoc/graphql/queries/country/variables/GET_COUNTRY_NAMES",
                    },
                  ],
                },
                {
                  text: "distillation",
                  items: [
                    {
                      text: "GET_DISTILLATION_BY_ID",
                      link: "/typedoc/graphql/queries/distillation/variables/GET_DISTILLATION_BY_ID",
                    },
                    {
                      text: "GET_DISTILLATIONS",
                      link: "/typedoc/graphql/queries/distillation/variables/GET_DISTILLATIONS",
                    },
                  ],
                },
                {
                  text: "plant",
                  items: [
                    {
                      text: "GET_BASIC_PLANT_BY_ID",
                      link: "/typedoc/graphql/queries/plant/variables/GET_BASIC_PLANT_BY_ID",
                    },
                    {
                      text: "GET_PLANT_BY_ID",
                      link: "/typedoc/graphql/queries/plant/variables/GET_PLANT_BY_ID",
                    },
                    {
                      text: "GET_PLANTS",
                      link: "/typedoc/graphql/queries/plant/variables/GET_PLANTS",
                    },
                  ],
                },
                {
                  text: "results",
                  items: [
                    {
                      text: "GET_ARCHIVE_DISTILLATION_BY_ID",
                      link: "/typedoc/graphql/queries/results/variables/GET_ARCHIVE_DISTILLATION_BY_ID",
                    },
                    {
                      text: "GET_DISTILLATION_ARCHIVES",
                      link: "/typedoc/graphql/queries/results/variables/GET_DISTILLATION_ARCHIVES",
                    },
                  ],
                },
                {
                  text: "settings",
                  items: [
                    {
                      text: "GET_USER_SETTINGS",
                      link: "/typedoc/graphql/queries/settings/variables/GET_USER_SETTINGS",
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
    },
  },
});
