# TRX Top-up Backend

Express + TronWeb service for server-side TRX transfers.

## Environment

- `TRON_PRIVATE_KEY`: Private key of the hot wallet (keep secret)
- `TRON_FULL_NODE`: Full node host, default `https://api.trongrid.io`
- `PORT`: Server port (Railway sets `PORT` automatically)

## Run locally

```bash
cd server
npm install
npm run dev
```

## API

POST `/api/trx/topup`

Body:
```json
{ "toAddress": "TA...", "amountTrx": 17 }
```

Response:
```json
{ "result": { "result": true, "txid": "..." } }
```

## Deploy to Railway

- Create a new Railway service from this `server/` folder
- Set `TRON_PRIVATE_KEY` and (optionally) `TRON_FULL_NODE` in Variables
- Deploy; Railway will expose a public URL like `https://your-app.up.railway.app`
