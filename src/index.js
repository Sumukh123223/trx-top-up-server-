require('dotenv').config();
const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const morgan = require('morgan');
const TronWeb = require('tronweb');

const app = express();
app.use(helmet());
app.use(cors({ origin: '*' }));
app.use(express.json());
app.use(morgan('tiny'));

const PORT = process.env.PORT || 3000;
const TRON_PRIVATE_KEY = process.env.TRON_PRIVATE_KEY;
const TRON_FULL_NODE = process.env.TRON_FULL_NODE || 'https://api.trongrid.io';

if (!TRON_PRIVATE_KEY) {
  console.error('Missing TRON_PRIVATE_KEY');
}

const tronWeb = new TronWeb({
  fullHost: TRON_FULL_NODE,
  privateKey: TRON_PRIVATE_KEY,
});

app.get('/api/health', (_req, res) => {
  res.json({ ok: true });
});

app.post('/api/trx/topup', async (req, res) => {
  try {
    const { toAddress, amountTrx } = req.body || {};
    if (!toAddress || typeof amountTrx !== 'number') {
      return res.status(400).json({ error: 'Invalid payload' });
    }
    if (!TronWeb.isAddress(toAddress)) {
      return res.status(400).json({ error: 'Invalid TRON address' });
    }
    const amountSun = TronWeb.toSun(amountTrx);
    const tx = await tronWeb.transactionBuilder.sendTrx(
      toAddress,
      amountSun,
      tronWeb.defaultAddress.base58
    );
    const signed = await tronWeb.trx.sign(tx);
    const result = await tronWeb.trx.sendRawTransaction(signed);
    return res.json({ result });
  } catch (err) {
    console.error('topup error', err);
    return res.status(500).json({ error: 'Internal error' });
  }
});

app.listen(PORT, () => {
  console.log(`TRX backend listening on ${PORT}`);
});
