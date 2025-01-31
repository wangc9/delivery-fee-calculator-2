/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, test, expect } from "vitest";
import {
  calculateDeliveryFee,
  calculateDistance,
  calculateFeeBasedOnRange,
  calculateSurcharge,
  getDistance,
  getDynamicInfo,
  getVenueLocation,
} from "./calculationServices";

describe("Test calculation services", () => {
  describe("Test distance calculation", () => {
    test("getDistance function should get correct distance between two points", () => {
      const result = getDistance([0, 0], [0, 1]);

      expect(result).toBeCloseTo(111195, -2);
    });

    test("Calculated distance should stay the same regardless of the order of locations", () => {
      const result = getDistance([0, 0], [0, 1]);
      const resultReverse = getDistance([0, 1], [0, 0]);

      expect(result === resultReverse).toBe(true);
    });

    test("getDistance function should get correct long distances", () => {
      const result = getDistance(
        [-74.005974, 40.714268],
        [2.350987, 48.856667]
      );

      expect(result).toBeCloseTo(5837070, -3);
    });

    test("Distance should be 0 when calculating distance between two same locations", () => {
      const result = getDistance([0, 1], [0, 1]);

      expect(result).toBe(0);
    });
  });

  describe("Test getting venue location", () => {
    test("Get correct venue location from Helsinki", async () => {
      const location = await getVenueLocation("home-assignment-venue-helsinki");

      expect(location).toEqual([24.92813512, 60.17012143]);
    });

    test("Get correct venue location from Tallinn", async () => {
      const location = await getVenueLocation("home-assignment-venue-tallinn");

      expect(location).toEqual([24.7513679, 59.4385937]);
    });
  });

  describe("Test distance calculation to venue", () => {
    test("Should return correct distance between venue and given coordinate", async () => {
      const distance = await calculateDistance(
        "home-assignment-venue-helsinki",
        [24.93087, 60.17094]
      );

      expect(distance).toBeCloseTo(177, -2);
    });
  });

  describe("Test getting dynamic info of venues", () => {
    test("Get correct venue info from Helsinki", async () => {
      const location = await getDynamicInfo("home-assignment-venue-helsinki");

      expect(location).toEqual({
        minimumValue: 1000,
        baseFee: 190,
        distanceRanges: [
          {
            min: 0,
            max: 500,
            a: 0,
            b: 0,
            flag: null,
          },
          {
            min: 500,
            max: 1000,
            a: 100,
            b: 0,
            flag: null,
          },
          {
            min: 1000,
            max: 1500,
            a: 200,
            b: 0,
            flag: null,
          },
          {
            min: 1500,
            max: 2000,
            a: 200,
            b: 1,
            flag: null,
          },
          {
            min: 2000,
            max: 0,
            a: 0,
            b: 0,
            flag: null,
          },
        ],
      });
    });

    test("Get correct venue info from Tallinn", async () => {
      const location = await getDynamicInfo("home-assignment-venue-tallinn");

      expect(location).toEqual({
        minimumValue: 1000,
        baseFee: 190,
        distanceRanges: [
          {
            min: 0,
            max: 500,
            a: 0,
            b: 0,
            flag: null,
          },
          {
            min: 500,
            max: 1000,
            a: 100,
            b: 0,
            flag: null,
          },
          {
            min: 1000,
            max: 1500,
            a: 200,
            b: 0,
            flag: null,
          },
          {
            min: 1500,
            max: 2000,
            a: 200,
            b: 1,
            flag: null,
          },
          {
            min: 2000,
            max: 0,
            a: 0,
            b: 0,
            flag: null,
          },
        ],
      });
    });
  });

  describe("Test calculating surcharge", () => {
    test("Surcharge should be calculated correctly if cartValue is smaller than minimumValue", () => {
      const result = calculateSurcharge(1000, 700);

      expect(result).toBe(3);
    });

    test("Surcharge should be rounded to cent", () => {
      const result = calculateSurcharge(1000, 259);

      expect(result).toBe(7.41);
    });

    test("No surcharge should accumulate if cartValue is greater than minimumValue", () => {
      const result = calculateSurcharge(700, 1000);

      expect(result).toBe(0.0);
    });

    test("No surcharge should accumulate if cartValue is equal to minimumValue", () => {
      const result = calculateSurcharge(1000, 1000);

      expect(result).toBe(0.0);
    });
  });

  describe("Test fee calculation helper", () => {
    test("Delivery fee should be calculated correctly if delivery is possible", () => {
      const result = calculateFeeBasedOnRange(177, 190, [
        {
          min: 0,
          max: 500,
          a: 0,
          b: 0,
          flag: null,
        },
        {
          min: 500,
          max: 1000,
          a: 100,
          b: 0,
          flag: null,
        },
        {
          min: 1000,
          max: 1500,
          a: 200,
          b: 0,
          flag: null,
        },
        {
          min: 1500,
          max: 2000,
          a: 200,
          b: 1,
          flag: null,
        },
        {
          min: 2000,
          max: 0,
          a: 0,
          b: 0,
          flag: null,
        },
      ]);

      expect(result).toBe(1.9);
    });

    test("Delivery fee should be -1 if delivery is not possible", () => {
      const result = calculateFeeBasedOnRange(2000, 190, [
        {
          min: 0,
          max: 500,
          a: 0,
          b: 0,
          flag: null,
        },
        {
          min: 500,
          max: 1000,
          a: 100,
          b: 0,
          flag: null,
        },
        {
          min: 1000,
          max: 1500,
          a: 200,
          b: 0,
          flag: null,
        },
        {
          min: 1500,
          max: 2000,
          a: 200,
          b: 1,
          flag: null,
        },
        {
          min: 2000,
          max: 0,
          a: 0,
          b: 0,
          flag: null,
        },
      ]);

      expect(result).toBe(-1);
    });
  });

  describe("Test delivery fee calculation", () => {
    test("Error should be returned if delivery is not possible", async () => {
      const result = await calculateDeliveryFee(
        "home-assignment-venue-helsinki",
        [24.93087, 60.77094],
        1000
      );

      expect(result.error).toBe(true);
    });

    test("Surcharge should not be added if not necessary", async () => {
      const result = await calculateDeliveryFee(
        "home-assignment-venue-helsinki",
        [24.93087, 60.17094],
        10
      );

      expect(result.error).toBe(false);
      expect(result.distance).toBeCloseTo(177, -2);
      expect(result.fee).toBe(1.9);
      expect(result.surcharge).toBe(0.0);
    });

    test("Surcharge should be added if necessary", async () => {
      const result = await calculateDeliveryFee(
        "home-assignment-venue-helsinki",
        [24.93087, 60.17094],
        7
      );

      expect(result.error).toBe(false);
      expect(result.distance).toBeCloseTo(177, -2);
      expect(result.fee).toBe(1.9);
      expect(result.surcharge).toBe(3.0);
    });
  });
});
