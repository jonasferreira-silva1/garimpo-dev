const https = require('https');
const http = require('http');

const eventos = [
  { id: 1, nome: 'Porto Digital Summit', link: 'https://www.portodigital.org/eventos' },
  { id: 2, nome: 'Meetup React Recife', link: 'https://www.meetup.com/pt-BR/react-recife/' },
  { id: 3, nome: 'Elas em Tech PE', link: 'https://www.instagram.com/elastechpe/' },
  { id: 4, nome: 'CESAR Tech Talks', link: 'https://www.cesar.org.br/' },
  { id: 5, nome: 'RecPlay 2026', link: 'https://www.portodigital.org/' },
  { id: 6, nome: 'DevOps Recife Meetup', link: 'https://www.meetup.com/pt-BR/devops-recife/' },
  { id: 7, nome: 'Python Recife (Pug-PE)', link: 'https://www.meetup.com/pt-BR/pug-pe/' }
];

async function checkUrl(url) {
  return new Promise((resolve) => {
    try {
      const client = url.startsWith('https') ? https : http;
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
  for (const e of eventos) {
    const res = await checkUrl(e.link);
    console.log(e.id, e.nome, '->', res.status || res.error);
  }
}

run();
