const express = require('express');
const https = require('https');
const app = express();
app.use(express.json());

const GAS_URL = "https://script.google.com/macros/s/AKfycbyUs1mXQp5cr5UoPSemMbSiR1Mv6lIHho_1iSxnS-Yrt5faIn6SxhZggI7ovmnCW_ky7A/exec";

app.post('/', (req, res) => {
  console.log('Mensaje recibido de Telegram:', JSON.stringify(req.body));
  res.json({ status: 'ok' });

  const payload = encodeURIComponent(JSON.stringify(req.body));
  const fullUrl = GAS_URL + "?payload=" + payload;

  const sendGet = (url) => {
    console.log('GET a:', url.substring(0, 100));
    const urlObj = new URL(url);
    const r = https.request({
      hostname: urlObj.hostname,
      path: urlObj.pathname + urlObj.search,
      method: 'GET'
    }, (resp) => {
      console.log('Status:', resp.statusCode);
      if (resp.statusCode === 301 || resp.statusCode === 302) {
        const loc = resp.headers.location;
        console.log('Redirect a:', loc.substring(0, 100));
        sendGet(loc);
      } else {
        let data = '';
        resp.on('data', chunk => data += chunk);
        resp.on('end', () => console.log('Respuesta final:', data.substring(0, 300)));
      }
    });
    r.on('error', (e) => console.log('ERROR:', e.message));
    r.end();
  };

  sendGet(fullUrl);
});

app.get('/', (req, res) => res.send('AFINE Bot OK'));
app.listen(process.env.PORT || 10000, () => console.log('Corriendo'));
