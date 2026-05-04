const express = require('express');
const app = express();
app.use(express.json());

// URL del products-service: usa il nome del container come hostname
const PRODUCTS_URL = process.env.PRODUCTS_URL ?? 'http://products-service:3001';

let orders = [];
let nextId = 1;

// GET /ping
app.get('/ping', (req, res) => {
  res.json({ service: 'orders-service', status: 'ok', ordini: orders.length });
});

// GET /orders — lista tutti gli ordini
app.get('/orders', (req, res) => {
  res.json(orders);
});

// GET /orders/:id — singolo ordine
app.get('/orders/:id', (req, res) => {
  const o = orders.find(x => x.id === Number(req.params.id));
  if (!o) return res.status(404).json({ error: 'Ordine non trovato' });
  res.json(o);
});

// POST /orders — crea un ordine
// Body: { "product_id": 1, "quantita": 2, "cliente": "Mario Rossi" }
app.post('/orders', async (req, res) => {
  const { product_id, quantita, cliente } = req.body;

  if (!product_id || !quantita || !cliente) {
    return res.status(400).json({ error: 'product_id, quantita e cliente sono obbligatori' });
  }

  // ── Chiama products-service per verificare il prodotto ──
  let prodotto;
  try {
    const response = await fetch(`${PRODUCTS_URL}/products/${product_id}`);
    if (!response.ok) {
      return res.status(404).json({ error: `Prodotto ${product_id} non trovato` });
    }
    prodotto = await response.json();
  } catch (err) {
    return res.status(503).json({
      error: 'products-service non raggiungibile',
      detail: err.message,
    });
  }

  if (!prodotto.disponibile) {
    return res.status(409).json({ error: `Prodotto "${prodotto.nome}" non disponibile` });
  }

  const ordine = {
    id: nextId++,
    product_id: prodotto.id,
    nome_prodotto: prodotto.nome,
    prezzo_unitario: prodotto.prezzo,
    totale: +(prodotto.prezzo * quantita).toFixed(2),
    quantita,
    cliente,
    stato: 'confermato',
    creato_il: new Date().toISOString(),
  };

  orders.push(ordine);
  res.status(201).json(ordine);
});

// DELETE /orders/:id — cancella un ordine
app.delete('/orders/:id', (req, res) => {
  const idx = orders.findIndex(x => x.id === Number(req.params.id));
  if (idx === -1) return res.status(404).json({ error: 'Ordine non trovato' });
  orders.splice(idx, 1);
  res.status(204).send();
});

const PORT = process.env.PORT ?? 3002;
app.listen(PORT, () =>
  console.log(`[orders-service] in ascolto su http://localhost:${PORT}`)
);