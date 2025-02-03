import { calculateDeliveryFee } from "@/services/calculationServices";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const venue_slug = request.nextUrl.searchParams.get("venue_slug");
  const cart_value = request.nextUrl.searchParams.get("cart_value");
  const user_lat = request.nextUrl.searchParams.get("user_lat");
  const user_lon = request.nextUrl.searchParams.get("user_lon");

  if (!venue_slug) {
    return NextResponse.json(
      { error: "venue_slug is missing" },
      { status: 400 }
    );
  }
  if (!cart_value) {
    return NextResponse.json(
      { error: "cart_value is missing" },
      { status: 400 }
    );
  }
  if (!user_lat) {
    return NextResponse.json({ error: "user_lat is missing" }, { status: 400 });
  }
  if (!user_lon) {
    return NextResponse.json({ error: "user_lon is missing" }, { status: 400 });
  }

  if (typeof venue_slug !== "string") {
    return NextResponse.json(
      { error: "venue_slug should be a string" },
      { status: 400 }
    );
  }
  if (isNaN(parseInt(cart_value))) {
    return NextResponse.json(
      { error: "cart_value should be a number" },
      { status: 400 }
    );
  }
  if (isNaN(parseFloat(user_lat))) {
    return NextResponse.json(
      { error: "user_lat should be a number" },
      { status: 400 }
    );
  }
  if (isNaN(parseFloat(user_lon))) {
    return NextResponse.json(
      { error: "user_lon should be a number" },
      { status: 400 }
    );
  }

  const { distance, fee, surcharge, error } = await calculateDeliveryFee(
    venue_slug,
    [parseFloat(user_lon), parseFloat(user_lat)],
    parseInt(cart_value) / 100
  );

  if (error) {
    return NextResponse.json(
      {
        error:
          "We've received information from the venue that the delivery is not possible because of the long distance",
      },
      { status: 400 }
    );
  } else {
    return NextResponse.json({
      total_price: fee * 100 + surcharge * 100,
      small_order_surcharge: surcharge * 100,
      cart_value: parseInt(cart_value),
      delivery: { fee: fee * 100, distance: Math.round(distance) },
    });
  }
}
