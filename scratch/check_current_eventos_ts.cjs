const https = require('https');
const http = require('http');

const currentEventos = [
  { id: 1, nome: 'Porto Digital Summit 2026', link: 'https://portodigital.org/eventos' },
  { id: 2, nome: 'Meetup React Recife', link: 'https://meetup.com/react-recife' },
  { id: 3, nome: 'Elas em Tech PE', link: 'https://elastech.org/recife' },
  { id: 4, nome: 'CESAR Tech Talk', link: 'https://cesar.org.br/techtalks' },
  { id: 5, nome: 'RecPlay 2026', link: 'https://recplay.com.br' },
  { id: 6, nome: 'DevOps Recife Meetup', link: 'https://meetup.com/devops-recife' },
  { id: 7, nome: 'Python Recife', link: 'https://pythonpe.org' },
];

async function checkUrl(url) {
  return new Promise((resolve) => {
    try {
      const parsed = new URL(url);
      const client = parsed.protocol === 'https:' ? https : http;
      const req = client.request(url, { method: 'GET', headers: { 'User-Agent': 'Mozilla/5.0' } }, (res) => {
        resolve({ url, status: res.statusCode, redirect: res.headers.location });
      });
      req.on('error', (err) => resolve({ url, error: err.message }));
      req.setTimeout(4000, () => {
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
  for (const e of currentEventos) {
    const res = await checkUrl(e.link);
    console.log(`[ID ${e.id}] ${e.nome}\n  URL: ${e.link}\n  Result: ${res.status || res.error} ${res.redirect ? '-> ' + res.redirect : ''}\n`);
  }
}

run();
