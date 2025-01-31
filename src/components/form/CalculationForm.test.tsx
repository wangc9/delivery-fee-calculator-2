import {
  render,
  screen,
  configure,
  cleanup,
  within,
  waitFor,
} from "@testing-library/react";
import { beforeAll, describe, expect, test, afterEach } from "vitest";
import CalculationForm from "./CalculationForm";
import userEvent from "@testing-library/user-event";

describe("Test CalculationForm component", () => {
  beforeAll(() => {
    configure({ testIdAttribute: "data-test-id" });
  });

  afterEach(() => {
    cleanup();
  });

  test("All form components can be rendered correctly", () => {
    render(<CalculationForm />);

    const venueSlugInput = screen.getByTestId("form-venue-slug-input");

    expect(venueSlugInput).toBeDefined();

    const cartValueInput = screen.getByTestId("form-cart-value-input");

    expect(cartValueInput).toBeDefined();

    const userLatitudeInput = screen.getByTestId("form-user-latitude-input");

    expect(userLatitudeInput).toBeDefined();

    const userLongitudeInput = screen.getByTestId("form-user-longitude-input");

    expect(userLongitudeInput).toBeDefined();

    const getLocationButton = screen.getByTestId("form-get-location-button");
    const submitButton = screen.getByTestId("form-submit-button");

    expect(getLocationButton).toBeDefined();
    expect(submitButton).toBeDefined();
  });

  test("CalculationResult should not be shown in first render", () => {
    render(<CalculationForm />);

    expect(screen.queryByTestId("cart-value-result")).not.toBeInTheDocument();
  });

  test("cartValue should only accept number", async () => {
    render(<CalculationForm />);

    const user = userEvent.setup();

    const venueSlugInput = screen.getByTestId("form-venue-slug-input");
    const cartValueInput = screen.getByTestId("form-cart-value-input");
    const submitButton = screen.getByTestId("form-submit-button");
    await user.type(
      within(venueSlugInput).getByLabelText("venue slug"),
      "home-assignment-venue-tallinn"
    );
    await user.type(within(cartValueInput).getByLabelText("cart value"), "abc");
    await user.click(submitButton);

    waitFor(() => {
      const errorMessage = screen.getByTestId("form-cart-value-error");

      expect(errorMessage).toHaveTextContent("This should be a number");
      expect(screen.queryByTestId("cart-value-result")).not.toBeInTheDocument();
    });
  });

  test("userLatitude should only accept number", async () => {
    render(<CalculationForm />);

    const user = userEvent.setup();

    const venueSlugInput = screen.getByTestId("form-venue-slug-input");
    const userLatitudeInput = screen.getByTestId("form-user-latitude-input");
    const submitButton = screen.getByTestId("form-submit-button");
    await user.type(
      within(venueSlugInput).getByLabelText("venue slug"),
      "home-assignment-venue-tallinn"
    );
    await user.type(
      within(userLatitudeInput).getByLabelText("user latitude"),
      "abc"
    );
    await user.click(submitButton);

    waitFor(() => {
      const errorMessage = screen.getByTestId("form-user-latitude-error");

      expect(errorMessage).toHaveTextContent("This should be a number");
      expect(screen.queryByTestId("cart-value-result")).not.toBeInTheDocument();
    });
  });

  test("userLongitude should only accept number", async () => {
    render(<CalculationForm />);

    const user = userEvent.setup();

    const venueSlugInput = screen.getByTestId("form-venue-slug-input");
    const userLongitudeInput = screen.getByTestId("form-user-longitude-input");
    const submitButton = screen.getByTestId("form-submit-button");
    await user.type(
      within(venueSlugInput).getByLabelText("venue slug"),
      "home-assignment-venue-tallinn"
    );
    await user.type(
      within(userLongitudeInput).getByLabelText("user longitude"),
      "abc"
    );
    await user.click(submitButton);

    waitFor(() => {
      const errorMessage = screen.getByTestId("form-user-longitude-error");

      expect(errorMessage).toHaveTextContent("This should be a number");
      expect(screen.queryByTestId("cart-value-result")).not.toBeInTheDocument();
    });
  });

  test("Can get location by pressing get location button", async () => {
    render(<CalculationForm />);

    const user = userEvent.setup();
    const userLatitudeInput = screen.getByTestId("form-user-latitude-input");
    const userLongitudeInput = screen.getByTestId("form-user-longitude-input");

    expect(
      within(userLongitudeInput).getByLabelText("user longitude")
    ).toHaveDisplayValue("0");
    expect(
      within(userLatitudeInput).getByLabelText("user latitude")
    ).toHaveDisplayValue("0");

    const getLocationButton = screen.getByTestId("form-get-location-button");

    await user.click(getLocationButton);

    waitFor(() => {
      expect(
        within(userLongitudeInput).getByLabelText("user longitude")
      ).not.toHaveDisplayValue("0");
      expect(
        within(userLatitudeInput).getByLabelText("user latitude")
      ).not.toHaveDisplayValue("0");
      expect(screen.queryByTestId("cart-value-result")).not.toBeInTheDocument();
    });
  });

  test("CalculationResult should show after inputting all correct values", async () => {
    render(<CalculationForm />);

    const user = userEvent.setup();

    const venueSlugInput = screen.getByTestId("form-venue-slug-input");
    const cartValueInput = screen.getByTestId("form-cart-value-input");
    const userLatitudeInput = screen.getByTestId("form-user-latitude-input");
    const userLongitudeInput = screen.getByTestId("form-user-longitude-input");
    const submitButton = screen.getByTestId("form-submit-button");

    expect(screen.queryByTestId("cart-value-result")).not.toBeInTheDocument();

    await user.type(
      within(venueSlugInput).getByLabelText("venue slug"),
      "home-assignment-venue-tallinn"
    );
    await user.type(
      within(cartValueInput).getByLabelText("cart value"),
      "20.1"
    );
    await user.type(
      within(userLatitudeInput).getByLabelText("user latitude"),
      "20.1"
    );
    await user.type(
      within(userLongitudeInput).getByLabelText("user longitude"),
      "60.1"
    );
    await user.click(submitButton);

    waitFor(() => {
      expect(screen.getByTestId("cart-value-result")).toBeInTheDocument();
    });
  });
});
