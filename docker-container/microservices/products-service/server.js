const express = require('express');
const app = express();
app.use(express.json());

const products = [
  { id: 1, nome: 'Laptop',    prezzo: 999.99, disponibile: true  },
  { id: 2, nome: 'Mouse',     prezzo:  29.99, disponibile: true  },
  { id: 3, nome: 'Monitor',   prezzo: 349.99, disponibile: false },
  { id: 4, nome: 'Tastiera',  prezzo:  59.99, disponibile: true  },
];

// GET /ping
app.get('/ping', (req, res) => {
  res.json({ service: 'products-service', status: 'ok', prodotti: products.length });
});

// GET /products — lista tutti i prodotti
app.get('/products', (req, res) => {
  res.json(products);
});

// GET /products/:id — singolo prodotto
app.get('/products/:id', (req, res) => {
  const p = products.find(x => x.id === Number(req.params.id));
  if (!p) return res.status(404).json({ error: 'Prodotto non trovato' });
  res.json(p);
});

const PORT = process.env.PORT ?? 3001;
app.listen(PORT, () =>
  console.log(`[products-service] in ascolto su http://localhost:${PORT}`)
);