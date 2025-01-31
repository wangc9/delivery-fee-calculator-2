import distance from "@turf/distance";
import { z } from "zod";

const locationSchema = z.tuple([z.number().finite(), z.number().finite()]);
const distanceArraySchema = z.array(
  z.object({
    min: z.number(),
    max: z.number(),
    a: z.number(),
    b: z.number(),
    flag: z.any(),
  })
);

/**
 * Calculate the distance between two coordinates in meters
 *
 * @param locationA Coordinate of location A in [longitude, latitude]
 * @param locationB Coordinate of location B in [longitude, latitude]
 *
 * @returns Distance in meters
 */
export function getDistance(
  locationA: [number, number],
  locationB: [number, number]
): number {
  const result = distance(locationA, locationB, { units: "meters" });

  return result;
}

/**
 * A function to retrieve the location of a venue
 *
 * @param venueSlug A string of venue slug
 *
 * @returns Venue coordinate in [longitude, latitude]
 */
export async function getVenueLocation(
  venueSlug: string
): Promise<[number, number]> {
  const data = await fetch(
    `https://consumer-api.development.dev.woltapi.com/home-assignment-api/v1/venues/${venueSlug}/static`
  );
  const venueDetail = await data.json();

  return locationSchema.parse(venueDetail.venue_raw.location.coordinates);
}

/**
 * A function to calculate the distance between current location and venue
 *
 * @param venueSlug A string of venue slug
 * @param currentLocation Coordinate of current location in [longitude, latitude]
 *
 * @returns Distance in m
 */
export async function calculateDistance(
  venueSlug: string,
  currentLocation: [number, number]
) {
  const venueLocation = await getVenueLocation(venueSlug);
  return getDistance(currentLocation, venueLocation);
}

/**
 * A function to retrieve dynamic info about venue from API
 *
 * @param venueSlug A string of venue slug
 *
 * @returns minimumValue in cents, baseFee in cents, and array of distanceRanges
 */
export async function getDynamicInfo(venueSlug: string): Promise<{
  minimumValue: number;
  baseFee: number;
  distanceRanges: Array<{
    min: number;
    max: number;
    a: number;
    b: number;
    flag?: null;
  }>;
}> {
  const data = await fetch(
    `https://consumer-api.development.dev.woltapi.com/home-assignment-api/v1/venues/${venueSlug}/dynamic`
  );
  const venueDetail = await data.json();

  const minimumValue = z
    .number()
    .parse(venueDetail.venue_raw.delivery_specs.order_minimum_no_surcharge);
  const baseFee = z
    .number()
    .parse(venueDetail.venue_raw.delivery_specs.delivery_pricing.base_price);
  const distanceRanges = distanceArraySchema.parse(
    venueDetail.venue_raw.delivery_specs.delivery_pricing.distance_ranges
  );

  return { minimumValue, baseFee, distanceRanges };
}

/**
 * A function to calculate surcharge
 *
 * @param minimumValue Minimum value required by venue in cents
 * @param cartValue Cart value in cents
 *
 * @returns Surcharge in euros
 */
export function calculateSurcharge(
  minimumValue: number,
  cartValue: number
): number {
  return minimumValue > cartValue
    ? Math.round(((minimumValue - cartValue) / 100 + Number.EPSILON) * 100) /
        100
    : 0.0;
}

/**
 * A function to calculate the basic delivery fee, without surcharge
 * @param distance Distance in m
 * @param baseFee Base fee in cents
 * @param distanceRanges An array of distances from the API
 *
 * @returns Basic delivery fee in euros. Return -1 if delivery is not possible
 */
export function calculateFeeBasedOnRange(
  distance: number,
  baseFee: number,
  distanceRanges: Array<{
    min: number;
    max: number;
    a: number;
    b: number;
    flag?: null;
  }>
) {
  let fee = -1;
  for (const range of distanceRanges) {
    if (distance >= range.min && distance < range.max) {
      const feeInCents = baseFee + range.a + (range.b * distance) / 2;
      fee = Math.round((feeInCents / 100 + Number.EPSILON) * 100) / 100;
      break;
    }
  }

  return fee;
}

/**
 * A function to calculate delivery fee, with details of distance, delivery
 * fee without surcharge, and the surcharge. If delivery is not possible,
 * an error flag will return
 *
 * @param venueSlug A string of venue slug
 * @param currentLocation The coordinate of current location in [longitude, latitude]
 * @param cartValue The cart value in euros
 *
 * @returns \{error: boolean, distance: number in m, fee: number in euros, surcharge: number in euros}
 */
export async function calculateDeliveryFee(
  venueSlug: string,
  currentLocation: [number, number],
  cartValue: number
) {
  const distance = await calculateDistance(venueSlug, currentLocation);
  const { minimumValue, baseFee, distanceRanges } = await getDynamicInfo(
    venueSlug
  );

  const surcharge = calculateSurcharge(minimumValue, cartValue * 100);
  const fee = calculateFeeBasedOnRange(distance, baseFee, distanceRanges);

  if (fee === -1) {
    return {
      error: true,
      distance: Math.round((distance + Number.EPSILON) * 100) / 100,
      fee,
      surcharge,
    };
  } else {
    return {
      error: false,
      distance: Math.round((distance + Number.EPSILON) * 100) / 100,
      fee,
      surcharge,
    };
  }
}
