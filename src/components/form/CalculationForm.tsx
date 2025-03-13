"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
// import { calculateDeliveryFee } from "@/services/calculationServices";
import { useState } from "react";
import CalculationResult from "./CalculationResult";
import { Loader2 } from "lucide-react";

const calculationFormSchema = z.object({
  venueSlug: z
    .string({
      required_error: "Please provide a venue slug",
      invalid_type_error: "The venue slug must be a string",
    })
    .min(1, "This appears to be too short"),
  cartValue: z.coerce.number({
    required_error: "Please provide a cart value",
    invalid_type_error: "This should be a number",
  }),
  userLatitude: z.coerce.number({
    required_error: "Latitude is missing",
    invalid_type_error: "This should be a number",
  }),
  userLongitude: z.coerce.number({
    required_error: "Longitude is missing",
    invalid_type_error: "This should be a number",
  }),
});

export default function CalculationForm() {
  const [loading, setLoading] = useState<boolean>(false);
  const [cartValue, setCartValue] = useState<number | undefined>(undefined);
  const [noDelivery, setNoDelivery] = useState<boolean | undefined>(undefined);
  const [deliveryFee, setDeliveryFee] = useState<number | undefined>(undefined);
  const [deliverySurcharge, setDeliverySurcharge] = useState<
    number | undefined
  >(undefined);
  const [deliveryDistance, setDeliveryDistance] = useState<number | undefined>(
    undefined
  );

  const form = useForm<z.infer<typeof calculationFormSchema>>({
    resolver: zodResolver(calculationFormSchema),
    defaultValues: {
      venueSlug: "",
      cartValue: 0.0,
      userLatitude: 0,
      userLongitude: 0,
    },
  });

  async function onSubmit(values: z.infer<typeof calculationFormSchema>) {
    setLoading(() => true);

    const data = await fetch(
      `/api/v1/delivery-order-price?venue_slug=${values.venueSlug}&cart_value=${
        values.cartValue * 100
      }&user_lat=${values.userLatitude}&user_lon=${values.userLongitude}`
    );
    const {
      error,
      small_order_surcharge: surcharge,
      delivery,
    } = await data.json();

    const distance = delivery?.distance ?? 0;
    const fee = delivery?.fee ?? 0;

    setNoDelivery(() => error);
    setCartValue(() => values.cartValue);
    setDeliveryFee(() => Math.round((fee / 100 + Number.EPSILON) * 100) / 100);
    setDeliverySurcharge(
      () => Math.round((surcharge / 100 + Number.EPSILON) * 100) / 100
    );
    setDeliveryDistance(() => distance);

    setLoading(() => false);
  }

  function onClick() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        form.setValue("userLatitude", position.coords.latitude);
        form.setValue("userLongitude", position.coords.longitude);
      });
    }
  }

  return (
    <>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="w-full max-w-md"
        >
          <FormField
            control={form.control}
            name="venueSlug"
            render={({ field }) => (
              <FormItem data-test-id="form-venue-slug-input">
                <FormLabel>Venue Slug</FormLabel>
                <FormControl>
                  <Input
                    placeholder="e.g. home-assignment-venue-helsinki"
                    aria-label="venue slug"
                    {...field}
                  />
                </FormControl>
                <FormMessage data-test-id="form-venue-slug-error" />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="cartValue"
            render={({ field }) => (
              <FormItem data-test-id="form-cart-value-input">
                <FormLabel>Cart Value (EUR)</FormLabel>
                <FormControl>
                  <Input
                    placeholder="e.g. 10.2"
                    type="number"
                    aria-label="cart value"
                    {...field}
                  />
                </FormControl>
                <FormMessage data-test-id="form-cart-value-error" />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="userLatitude"
            render={({ field }) => (
              <FormItem data-test-id="form-user-latitude-input">
                <FormLabel>User Latitude</FormLabel>
                <FormControl>
                  <Input
                    placeholder="e.g. 60.17"
                    type="number"
                    aria-label="user latitude"
                    {...field}
                  />
                </FormControl>
                <FormMessage data-test-id="form-user-latitude-error" />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="userLongitude"
            render={({ field }) => (
              <FormItem
                className="mb-2"
                data-test-id="form-user-longitude-input"
              >
                <FormLabel>User longitude</FormLabel>
                <FormControl>
                  <Input
                    placeholder="e.g. 24.93"
                    type="number"
                    aria-label="user longitude"
                    {...field}
                  />
                </FormControl>
                <FormMessage data-test-id="form-user-longitude-error" />
              </FormItem>
            )}
          />
          <Button
            type="button"
            aria-label="Get location"
            data-test-id="form-get-location-button"
            onClick={onClick}
          >
            Get Location
          </Button>
          <Button
            type="submit"
            aria-label="Calculate"
            data-test-id="form-submit-button"
            disabled={loading}
          >
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {loading ? "Calculating" : "Calculate"}
          </Button>
        </form>
      </Form>
      {noDelivery ? (
        <p
          className="text-red-500"
          role="alert"
          data-test-id="form-error-message"
        >
          The venue you&apos;ve chosen does not support delivery to your
          selected location!
        </p>
      ) : (
        <CalculationResult
          cartValue={cartValue}
          deliveryDistance={deliveryDistance}
          deliveryFee={deliveryFee}
          deliverySurcharge={deliverySurcharge}
        />
      )}
    </>
  );
}
