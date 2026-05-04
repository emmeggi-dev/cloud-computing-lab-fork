#!/bin/bash
set -e
P="http://localhost:3001"
O="http://localhost:3002"

echo "=== [1] Health check ==="
curl -sf $P/ping | jq .name
curl -sf $O/ping | jq .name

echo ""
echo "=== [2] Prodotti disponibili ==="
curl -sf $P/products | jq '[.[] | select(.disponibile==true) | .nome]'

echo ""
echo "=== [3] Ordine su prodotto disponibile (Laptop) ==="
curl -sf -X POST $O/orders \
  -H "Content-Type: application/json" \
  -d '{"product_id":1,"quantita":2,"cliente":"Test User"}' | jq '{id, nome_prodotto, totale, stato}'

echo ""
echo "=== [4] Ordine su prodotto NON disponibile (Monitor) ==="
curl -s -o /dev/null -w "HTTP %{http_code}\n" -X POST $O/orders \
  -H "Content-Type: application/json" \
  -d '{"product_id":3,"quantita":1,"cliente":"Test User"}'

echo ""
echo "=== [5] Ordine su prodotto INESISTENTE ==="
curl -s -o /dev/null -w "HTTP %{http_code}\n" -X POST $O/orders \
  -H "Content-Type: application/json" \
  -d '{"product_id":99,"quantita":1,"cliente":"Test User"}'

echo ""
echo "=== [6] Lista ordini ==="
curl -sf $O/orders | jq 'length'
echo "ordini creati"

echo ""
echo "✅ Tutti i test superati"