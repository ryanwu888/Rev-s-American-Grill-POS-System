import React from "react";
import { render } from "@testing-library/react";
import MenuItemIcon from "../components/menuItemIcon";

describe("MenuItemIcon Component", () => {
  test("renders without crashing", () => {
    render(<MenuItemIcon />);
    // No need for assertions as long as the component renders without throwing errors
  });
});
