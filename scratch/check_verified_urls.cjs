const https = require('https');
const http = require('http');

const urls = [
  'https://www.portodigital.org/noticias-e-eventos/agenda',
  'https://www.sympla.com.br/eventos/recife-pe/tecnologia',
  'https://recnplay.pe/',
  'https://www.cesar.org.br/',
  'https://pugpe.github.io/',
  'https://www.instagram.com/elastechpe/',
  'https://github.com/react-recife'
];

async function checkUrl(url) {
  return new Promise((resolve) => {
    try {
      const parsed = new URL(url);
      const client = parsed.protocol === 'https:' ? https : http;
      const req = client.request(url, { method: 'GET', headers: { 'User-Agent': 'Mozilla/5.0' } }, (res) => {
        resolve({ url, status: res.statusCode });
      });
      req.on('error', (err) => resolve({ url, error: err.message }));
      req.setTimeout(5000, () => {
        req.destroy();
        resolve({ url, error: 'timeout' });
      });
      req.end();
    } catch (e) {
      resolve({ url, error: e.message });
    }
  });
}

async function run() {
  for (const u of urls) {
    const res = await checkUrl(u);
    console.log(u, '->', res.status || res.error);
  }
}

run();
