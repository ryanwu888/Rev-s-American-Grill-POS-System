import React from "react";
import { render } from "@testing-library/react";
import OrderItemIcon from "../components/orderItemIcon";

describe("Product Usage Component", () => {
  test("renders without crashing", () => {
    render(<OrderItemIcon />);
    // No need for assertions as long as the component renders without throwing errors
  });
});
