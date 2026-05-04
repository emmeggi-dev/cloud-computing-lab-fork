const express = require('express');
const app = express();
app.use(express.json());

// Dati in memoria (array — non persistenti)
let contatti = [
  { id: 1, nome: 'Mario Rossi',   email: 'mario@example.com',   tel: '333-111' },
  { id: 2, nome: 'Lucia Verdi',   email: 'lucia@example.com',   tel: '333-222' },
  { id: 3, nome: 'Paolo Neri',    email: 'paolo@example.com',   tel: '333-333' },
];
let nextId = 4;

// GET /ping — health check
app.get('/ping', (req, res) => {
  res.json({ status: 'ok', contatti: contatti.length });
});

// GET /contatti — lista tutti i contatti
app.get('/contatti', (req, res) => {
  res.json(contatti);
});

// GET /contatti/:id — ottieni un contatto
app.get('/contatti/:id', (req, res) => {
  const c = contatti.find(x => x.id === Number(req.params.id));
  if (!c) return res.status(404).json({ error: 'Non trovato' });
  res.json(c);
});

// POST /contatti — crea contatto
app.post('/contatti', (req, res) => {
  const { nome, email, tel } = req.body;
  if (!nome || !email) return res.status(400).json({ error: 'nome e email sono obbligatori' });
  const nuovo = { id: nextId++, nome, email, tel: tel ?? '' };
  contatti.push(nuovo);
  res.status(201).json(nuovo);
});

// PUT /contatti/:id — aggiorna contatto
app.put('/contatti/:id', (req, res) => {
  const idx = contatti.findIndex(x => x.id === Number(req.params.id));
  if (idx === -1) return res.status(404).json({ error: 'Non trovato' });
  contatti[idx] = { ...contatti[idx], ...req.body, id: contatti[idx].id };
  res.json(contatti[idx]);
});

// DELETE /contatti/:id — elimina contatto
app.delete('/contatti/:id', (req, res) => {
  const idx = contatti.findIndex(x => x.id === Number(req.params.id));
  if (idx === -1) return res.status(404).json({ error: 'Non trovato' });
  contatti.splice(idx, 1);
  res.status(204).send();
});

const PORT = process.env.PORT ?? 3000;
app.listen(PORT, () => console.log(`API rubrica in ascolto su http://localhost:${PORT}`));