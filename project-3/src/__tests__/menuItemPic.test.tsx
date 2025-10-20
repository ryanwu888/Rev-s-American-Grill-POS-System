import React from "react";
import { render } from "@testing-library/react";
import MenuItemPic from "../components/menuItemPic";

describe("Product Usage Component", () => {
  test("renders without crashing", () => {
    render(<MenuItemPic />);
    // No need for assertions as long as the component renders without throwing errors
  });
});
