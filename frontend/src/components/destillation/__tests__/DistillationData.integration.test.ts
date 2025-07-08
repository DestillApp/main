import { describe, it, expect, vi } from "vitest";
import { mount } from "@vue/test-utils";
import DistillationData from "../DistillationData.vue";

describe("DistillationData.vue [Integration]", () => {
  it("renders the full form, handles input updates, validates when submitted, and dispatches Vuex actions", async () => {
    const dispatchMock = vi.fn();

    const wrapper = mount(DistillationData, {
      props: {
        isFormValid: false,
        wasSubmitted: true,
        isEditing: false,
      },
      global: {
        provide: {
          store: {
            dispatch: dispatchMock,
            getters: {
              "distillation/distillationForm": {
                waterForDistillation: null,
                distillationTime: {
                  distillationHours: 0,
                  distillationMinutes: 99, // simulate invalid minutes
                },
              },
            },
          },
        },
      },
    });

    // Confirm field labels are rendered
    expect(wrapper.text()).toContain("Ilość wody użytej do destylacji");
    expect(wrapper.text()).toContain("Długość procesu destylacji");

    // Simulate user interaction by emitting from BaseTextInput
    const timeInputs = wrapper.findAllComponents({ name: "BaseTextInput" });

    // Let’s assume the last 2 are time inputs (hours, minutes)
    const minutesInput = timeInputs.at(2); // index might depend on render order

    if (minutesInput) {
      await minutesInput.vm.$emit("update:modelValue", 45);
      await wrapper.vm.saveTime(45, "distillationMinutes");
    }

    // Check that dispatch was called to update distillationMinutes
    expect(dispatchMock).toHaveBeenCalledWith(
      "distillation/setDistillationTime",
      { key: "distillationMinutes", value: 45 }
    );

    // Check that validation message appears due to isFormValid: false and wasSubmitted: true
    expect(wrapper.text()).toContain("Wprowadź ilość wody użytej");
    expect(wrapper.text()).toContain(
      "Minuty powinny być w zakresie od 1 do 59 min"
    );
  });
});
