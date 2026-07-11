import { act, renderHook } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import useAlert from "./useAlert";

describe("useAlert", () => {
  it("starts hidden with default danger type", () => {
    const { result } = renderHook(() => useAlert());
    expect(result.current.alert).toEqual({
      show: false,
      text: "",
      type: "danger",
    });
  });

  it("shows an alert with provided text and type", () => {
    const { result } = renderHook(() => useAlert());

    act(() => {
      result.current.showAlert({ text: "Saved", type: "success" });
    });

    expect(result.current.alert).toEqual({
      show: true,
      text: "Saved",
      type: "success",
    });
  });

  it("defaults type to danger when omitted", () => {
    const { result } = renderHook(() => useAlert());

    act(() => {
      result.current.showAlert({ text: "Failed" });
    });

    expect(result.current.alert.type).toBe("danger");
  });

  it("hides the alert", () => {
    const { result } = renderHook(() => useAlert());

    act(() => {
      result.current.showAlert({ text: "Saved", type: "success" });
    });

    act(() => {
      result.current.hideAlert();
    });

    expect(result.current.alert).toEqual({
      show: false,
      text: "",
      type: "danger",
    });
  });
});
