type CalculationResultProps = {
  cartValue?: number;
  deliveryFee?: number;
  deliveryDistance?: number;
  deliverySurcharge?: number;
};

export default function CalculationResult({
  cartValue,
  deliveryFee,
  deliveryDistance,
  deliverySurcharge,
}: CalculationResultProps) {
  return (
    <>
      {cartValue !== undefined &&
        deliveryFee !== undefined &&
        deliveryDistance !== undefined &&
        deliverySurcharge !== undefined && (
          <section className="grid grid-cols-2 py-4">
            <h3 className="font-semibold col-span-2 mb-4">Price breakdown</h3>

            <p className="font-semibold">Cart Value</p>
            <p className="justify-self-end" data-test-id="cart-value-result">
              {cartValue} €
            </p>

            <p className="font-semibold">Delivery fee</p>
            <p className="justify-self-end" data-test-id="delivery-fee-result">
              {deliveryFee} €
            </p>

            <p className="font-semibold">Delivery distance</p>
            <p
              className="justify-self-end"
              data-test-id="delivery-distance-result"
            >
              {deliveryDistance} m
            </p>

            <p className="font-semibold">Small order surcharge</p>
            <p
              className="justify-self-end"
              data-test-id="delivery-surcharge-result"
            >
              {deliverySurcharge} €
            </p>

            <p className="font-semibold">Total price</p>
            <p className="justify-self-end" data-test-id="total-price-result">
              {cartValue + deliveryFee + deliverySurcharge} €
            </p>
          </section>
        )}
    </>
  );
}
