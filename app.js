const express = require('express');
const https = require('https');
const app = express();
app.use(express.json());

const GAS_URL = "https://script.google.com/macros/s/AKfycbyUs1mXQp5cr5UoPSemMbSiR1Mv6lIHho_1iSxnS-Yrt5faIn6SxhZggI7ovmnCW_ky7A/exec";

app.post('/', (req, res) => {
  res.json({ status: 'ok' });
  const body = JSON.stringify(req.body);
  const makeRequest = (url) => {
    const urlObj = new URL(url);
    const r = require('https').request({
      hostname: urlObj.hostname,
      path: urlObj.pathname + urlObj.search,
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(body) }
    }, (resp) => {
      if (resp.statusCode === 301 || resp.statusCode === 302) {
        makeRequest(resp.headers.location);
      }
    });
    r.on('error', (e) => console.error(e));
    r.write(body);
    r.end();
  };
  makeRequest(GAS_URL);
});

app.get('/', (req, res) => res.send('AFINE Bot OK'));
app.listen(process.env.PORT || 10000, () => console.log('Corriendo'));