# Delivery fee calculator 2

This is a revamped version of the [Delivery fee calculator](https://github.com/wangc9/delivery-fee-calculator) built with **Next.js**, **TypeScript**, **TailwindCSS** and tested with **Vitest** and **Playwright**.

This project allows you to calculate the price of delivery from a venue to your choice of destination. The project can be reached through this [link](https://delivery-fee-calculator-2.vercel.app/).

## Local development and testing

### Development

First, clone this project:

```bash
git clone https://github.com/wangc9/delivery-fee-calculator-2.git
```

This project is built with Node v22, make sure that you are using an appropriate Node version. Then, install all dependencies:

```bash
yarn install
```

Finally, start the development server:

```bash
yarn run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

### Testing

This project comes with unit tests and e2e tests. To run unit tests, use the following command:

```bash
yarn run test
```

To run e2e tests, there are two options:

a) Run tests and see results in command line:

```bash
yarn run test:e2e
```

b) Run interactive tests:

```bash
yarn run test:e2e-ui
```
