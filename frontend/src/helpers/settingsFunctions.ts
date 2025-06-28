import {
  UPDATE_LIST_SORTING,
  UPDATE_LIST_SETTINGS,
} from "@/graphql/mutations/settings";
import { ApolloClient, NormalizedCacheObject } from "@apollo/client/core";

/**
 * Updates the list sorting setting for the user.
 * @param {ApolloClient<NormalizedCacheObject>} apolloClient - The Apollo Client instance.
 * @param {string} key - The sorting setting key to update.
 * @param {string} value - The new sorting value.
 * @returns {Promise<boolean | string>} Returns true if successful, "Unauthorized" if unauthorized, or false on error.
 */
export const updateListSorting = async (
  apolloClient: ApolloClient<NormalizedCacheObject>,
  key: string,
  value: string
): Promise<boolean | string> => {
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
    return true;
  } catch (error: any) {
    if (error.message === "Unauthorized") {
      return "Unauthorized";
    }
    console.error("Failed to update plant list settings:", error);
    return false;
  }
};

/**
 * Updates the list length setting for the user.
 * @param {ApolloClient<NormalizedCacheObject>} apolloClient - The Apollo Client instance.
 * @param {string} key - The list length setting key to update.
 * @param {number} value - The new list length value.
 * @returns {Promise<boolean | string>} Returns true if successful, "Unauthorized" if unauthorized, or false on error.
 */
export const updateListSettings = async (
  apolloClient: ApolloClient<NormalizedCacheObject>,
  key: string,
  value: number
): Promise<boolean | string> => {
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
    return true;
  } catch (error: any) {
    if (error.message === "Unauthorized") {
      return "Unauthorized";
    }
    console.error("Failed to update plant list settings:", error);
    return false;
  }
};
