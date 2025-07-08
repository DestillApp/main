import { describe, it, expect, vi } from "vitest";
import { shallowMount } from "@vue/test-utils";
import DistillationData from "../DistillationData.vue";
import * as helpers from "@/helpers/formatHelpers";

describe("DistillationData.vue", () => {
  const createWrapper = (customProps = {}, storeGetters = {}) => {
    const mockStore = {
      dispatch: vi.fn(),
      getters: {
        "distillation/distillationForm": {
          distillationTime: { distillationMinutes: 30 },
        },
        "results/distillationData": {
          distillationTime: { distillationMinutes: 30 },
        },
        ...storeGetters,
      },
    };

    return shallowMount(DistillationData, {
      props: {
        isFormValid: true,
        wasSubmitted: false,
        isEditing: false,
        ...customProps,
      },
      global: {
        provide: { store: mockStore },
      },
    });
  };

  it("mounts properly with required props", () => {
    const wrapper = createWrapper();
    expect(wrapper.exists()).toBe(true);
  });

  it("returns correct storeName when isEditing is true", () => {
    const wrapper = createWrapper({ isEditing: true });
    expect(wrapper.vm.storeName).toBe("results");
  });

  it("computes isMinutesCorrect as false when minutes > 59", () => {
    const wrapper = createWrapper(
      {},
      {
        "distillation/distillationForm": {
          distillationTime: { distillationMinutes: 99 },
        },
      }
    );
    expect(wrapper.vm.isMinutesCorrect).toBe(false);
  });

  it("calls store.dispatch with correct params in saveTime()", () => {
    const wrapper = createWrapper();
    wrapper.vm.saveTime(25, "distillationMinutes");
    const store = wrapper.vm.store;
    expect(store.dispatch).toHaveBeenCalledWith(
      "distillation/setDistillationTime",
      { key: "distillationMinutes", value: 25 }
    );
  });

  it("calls helpers in handleKeyboard()", () => {
    const spySet = vi.spyOn(helpers, "setKeyboardIntegerNumber");
    const spyPrevent = vi.spyOn(helpers, "preventMinusNumber");
    const wrapper = createWrapper();
    const fakeEvent = new KeyboardEvent("keydown", { key: "e" });

    wrapper.vm.handleKeyboard(fakeEvent);

    expect(spySet).toHaveBeenCalledWith(fakeEvent);
    expect(spyPrevent).toHaveBeenCalledWith(fakeEvent);
  });

  it("shows validation message when wasSubmitted is true and input is invalid", () => {
    const wrapper = createWrapper(
      {
        isFormValid: false,
        wasSubmitted: true,
      },
      {
        "distillation/distillationForm": {
          waterForDistillation: null,
          distillationTime: {
            distillationHours: 0,
            distillationMinutes: 0,
          },
        },
      }
    );
    const input = wrapper.findComponent({ name: "BaseTextInput" });

    // Verify that the slot named "message" exists
    expect(input.exists()).toBe(true);
    expect(input.vm?.$slots?.message).toBeTruthy();
  });
});
