import React from "react";
import { render } from "@testing-library/react";
import GoogleTranslate from "../components/Translate";

describe("GoogleTranslate Component", () => {
  test("renders without crashing", () => {
    render(<GoogleTranslate />);
    // No need for assertions as long as the component renders without throwing errors
  });
});
