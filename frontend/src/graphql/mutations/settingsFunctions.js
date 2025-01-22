import { UPDATE_LIST_SORTING, UPDATE_LIST_SETTINGS } from "@/graphql/mutations/settings.js";

export const updateListSorting = async (apolloClient, key, value) => {
  try {
    await apolloClient.mutate({
      mutation: UPDATE_LIST_SORTING,
      variables: {
        input: {
          settingKey: key,
          settingValue: value,
        },
      },
    });
    console.log("UPDATED sorting!");
    return true;
  } catch (error) {
    console.error("Failed to update plant list settings:", error);
    return false;
  }
};


export const updateListSettings = async (apolloClient, key, value) => {
  try {
    await apolloClient.mutate({
      mutation: UPDATE_LIST_SETTINGS,
      variables: {
        input: {
          settingKey: key,
          settingValue: value,
        },
      },
    });
    console.log("UPDATED!");
    return true;
  } catch (error) {
    console.error("Failed to update plant list settings:", error);
    return false;
  }
};