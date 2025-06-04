import {
  UPDATE_LIST_SORTING,
  UPDATE_LIST_SETTINGS,
} from "@/graphql/mutations/settings";
import { ApolloClient, NormalizedCacheObject } from "@apollo/client/core";

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
