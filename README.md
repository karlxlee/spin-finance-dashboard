# Spin Finance Dashboard

### Live Demo: https://spin-finance-dashboard.vercel.app/

Spin Finance's spot markets are live on NEAR testnet, but there are no dedicated analytics to track its usage. Traders, investors and other stakeholders want to monitor Spin's performance using charts and metrics. Spin Finance Dashboard draws back the curtain and brings those metrics to the forefront.

## Technologies

Spin Finance Dashboard uses:

- Instant server-rendered pages + incremental static regeneration using the lastest data via [Next.js](https://nextjs.org/)
- Latest blockchain data from the [NEAR indexer](https://github.com/near/near-indexer-for-explorer/)
- Industry-standard charts and UI via [IBM's Carbon Design Framework](https://www.carbondesignsystem.com/), by using the [Carbon Components](https://github.com/carbon-design-system/carbon/tree/main/packages/react) & [Carbon Charts](https://github.com/carbon-design-system/carbon-charts/tree/master/packages/react) React packages

## Metrics

- Volume of orders placed (in USDC)<sup>1</sup>
- Volume of orders placed per market (in USDC)<sup>1</sup>
- Number of users
- Number of orders

<sup>1</sup> Note that volume of orders placed is the sum of all ask and bid orders (both market and limit orders) placed by users in a given time period. It does not take into account the removal of orders (`drop_order`).

## Spin Finance Dashboard API

Spin Finance Dashboard exposes API endpoints that anyone can use to obtain key metrics and data.

- All endpoints require the `?lastHours` url parameter (e.g. `lastHours=48`)
- Additionally, you may specify a `groupBy` parameter (e.g. `groupBy=hour` or `groupBy=day`)

#### Endpoints:

[`/api/orderCount`](https://spin-finance-dashboard.vercel.app/api/orderCount?lastHours=24&groupBy=hour)

[`/api/userCount`](https://spin-finance-dashboard.vercel.app/api/userCount?lastHours=24&groupBy=hour)

[`/volume`](https://spin-finance-dashboard.vercel.app/api/volume?lastHours=24&groupBy=hour)<sup>1</sup>

- For `/volume` endpoint, you can specify an optional `marketId` parameter which will filter for a specifc market (e.g. `marketId=1` filters for NEAR/USDC only)
- For `/volume` endpoint, omitting `marketId` returns data categorized for each market pair. Alternatively, `marketId=all` returns data summed and aggregated over all markets

`/api/orders` is a data-heavy endpoint and is available for local development only

## Adapting the project

As Spin Finance adds new markets and deploys to mainnet, Spin Finance Dashboard should be able to adapt with ease.

#### Adding new markets

- Append the market id and market pair name in `config.json` in the root of the project

#### Changing the Spin spot contract

- Change the account id in `config.json`

#### Switching to mainnet

- Change the account id to the mainnet spot contract in `config.json`
- Change the indexer_uri to the [mainnet indexer](https://github.com/near/near-indexer-for-explorer/) in `config.json`

#### Adding a new metric

- Create a new endpoint file in `/pages/api` for the metric. Fetch the data in this file.
- Call the API function and process the data in `/dashboard/Data`
- Use the data in a graph in `dashboard/UI`

## Local development

Clone, run `yarn install` or `npm install` and then start the development server:

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Deploy

The easiest way to deploy Spin Finance Dashboard is via Vercel:

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fkarlxlee%2Fspin-finance-dashboard)
