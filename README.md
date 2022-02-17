# Spin Finance Dashboard

### Live Demo: https://spin-finance-dashboard.vercel.app/

Spin Finance's spot markets are live on NEAR testnet, but there are no dedicated analytics to track its usage. Traders, investors and other stakeholders want to monitor Spin's performance using charts and metrics. Spin Finance Dashboard draws back the curtain and brings those metrics to the forefront.

## Technologies

Spin Finance Dashboard uses:

- Instant server-rendered pages + incremental static regeneration using the lastest data via Next.js
- Latest blockchain data from the NEAR indexer
- Industry-standard charts and UI via IBM's Carbon Design Framework

## Metrics

- Volume of orders placed (in USDC)<sup>1</sup>
- Volume of orders placed per market (in USDC)<sup>1</sup>
- Number of users
- Number of orders

<sup>1</sup> Note that volume of orders placed is the sum of all ask and bid orders (both market and limit orders) placed by users in a given time period. It does not take into account the removal of orders (`drop_order`).

## Spin Finance Dashboard API

Spin Finance Dashboard exposes API endpoints that anyone can use to obtain key metrics and data:

[`/api/orderCount`](https://spin-finance-dashboard.vercel.app/api/orderCount?lastHours=24&groupBy=hour)

[`/api/userCount`](https://spin-finance-dashboard.vercel.app/api/userCount?lastHours=24&groupBy=hour)

[`/volume`](https://spin-finance-dashboard.vercel.app/api/volume?lastHours=24&groupBy=hour)<sup>1</sup>

- All endpoints require the `?lastHours` url parameter.
- Additionally, you may specify a `groupBy` parameter (e.g. `groupBy=hour` or `groupBy=day`).
- For `/volume` endpoint, you can specify an optional `marketId` parameter which will filter for a specifc market (e.g. `marketId=1` filters for NEAR/USDC only)
- For `/volume` endpoint, omitting `marketId` returns data categorized for each market pair. Alternatively, `marketId=all` returns data summed and aggregated over all markets
- The `/api/orders` is a data-heavy endpoint and is available for local development only

## Project Sustainability

As Spin Finance adds new markets and deploys to mainnet, Spin Finance Dashboard must be able to adapt with ease.

**Adding new markets**

Adding a new market is simple; append the market id and market pair name in `config.json` in the root of the project.

**Changing the Spin spot contract**

Change the account id in `config.json`

**Switching to mainnet**

Change the account id to the mainnet spot contract and change the indexer_uri to the mainnet indexer in `config.json`

**Adding a new metric**

Create a new endpoint file in `/pages/api` for the metric. Fetch and process the data within that file. Then use the metric in `index.js` or `[timeframe].js`.

This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `pages/index.js`. The page auto-updates as you edit the file.

[API routes](https://nextjs.org/docs/api-routes/introduction) can be accessed on [http://localhost:3000/api/hello](http://localhost:3000/api/hello). This endpoint can be edited in `pages/api/hello.js`.

The `pages/api` directory is mapped to `/api/*`. Files in this directory are treated as [API routes](https://nextjs.org/docs/api-routes/introduction) instead of React pages.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.
