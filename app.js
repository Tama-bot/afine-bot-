const express = require('express');
const https = require('https');
const app = express();
app.use(express.json());

const GAS_URL = "https://script.google.com/macros/s/AKfycbyUs1mXQp5cr5UoPSemMbSiR1Mv6lIHho_1iSxnS-Yrt5faIn6SxhZggI7ovmnCW_ky7A/exec";

app.post('/', (req, res) => {
  console.log('Mensaje recibido de Telegram:', JSON.stringify(req.body));
  res.json({ status: 'ok' });
  
  const body = JSON.stringify(req.body);
  
  const makeRequest = (url, redirectCount) => {
    if (redirectCount > 5) {
      console.log('Demasiados redirects, abortando');
      return;
    }
    console.log('Enviando a:', url);
    const urlObj = new URL(url);
    const r = https.request({
      hostname: urlObj.hostname,
      path: urlObj.pathname + urlObj.search,
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(body) }
    }, (resp) => {
      console.log('Respuesta de Google, status:', resp.statusCode);
      if (resp.statusCode === 301 || resp.statusCode === 302) {
        console.log('Redirect hacia:', resp.headers.location);
        makeRequest(resp.headers.location, redirectCount + 1);
      } else {
        let data = '';
        resp.on('data', chunk => data += chunk);
        resp.on('end', () => console.log('Body de respuesta:', data));
      }
    });
    r.on('error', (e) => console.log('ERROR en request:', e.message));
    r.write(body);
    r.end();
  };
  
  makeRequest(GAS_URL, 0);
});

app.get('/', (req, res) => res.send('AFINE Bot OK'));
app.listen(process.env.PORT || 10000, () => console.log('Corriendo'));
