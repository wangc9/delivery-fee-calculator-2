import { render, screen, configure, cleanup } from "@testing-library/react";
import { beforeAll, describe, expect, test, afterEach } from "vitest";
import CalculationResult from "./CalculationResult";

describe("Test CalculationResult component", () => {
  beforeAll(() => {
    configure({ testIdAttribute: "data-test-id" });
  });

  afterEach(() => {
    cleanup();
  });

  test("All results can be rendered correctly", () => {
    render(
      <CalculationResult
        cartValue={10}
        deliveryFee={10}
        deliveryDistance={10}
        deliverySurcharge={10}
      />
    );

    const cartValueResult = screen.getByTestId("cart-value-result");

    expect(cartValueResult).toHaveTextContent("10 €");

    const deliveryFeeResult = screen.getByTestId("delivery-fee-result");

    expect(deliveryFeeResult).toHaveTextContent("10 €");

    const deliveryDistanceResult = screen.getByTestId(
      "delivery-distance-result"
    );

    expect(deliveryDistanceResult).toHaveTextContent("10 m");

    const deliverySurchargeResult = screen.getByTestId(
      "delivery-surcharge-result"
    );

    expect(deliverySurchargeResult).toHaveTextContent("10 €");

    const totalPriceReuslt = screen.getByTestId("total-price-result");

    expect(totalPriceReuslt).toHaveTextContent("30 €");
  });

  test("No result should be shown if data is missing", () => {
    render(
      <CalculationResult
        cartValue={10}
        deliveryFee={10}
        deliverySurcharge={10}
      />
    );

    expect(screen.queryByTestId("cart-value-result")).not.toBeInTheDocument();

    expect(screen.queryByTestId("delivery-fee-result")).not.toBeInTheDocument();

    expect(
      screen.queryByTestId("delivery-distance-result")
    ).not.toBeInTheDocument();

    expect(
      screen.queryByTestId("delivery-surcharge-result")
    ).not.toBeInTheDocument();

    expect(screen.queryByTestId("total-price-result")).not.toBeInTheDocument();
  });
});
