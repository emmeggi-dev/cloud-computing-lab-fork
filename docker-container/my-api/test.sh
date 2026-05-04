#!/bin/bash
BASE="http://localhost:3000"

echo "=== Health check ==="
curl -s $BASE/ping | jq .

echo ""
echo "=== Lista contatti ==="
curl -s $BASE/contatti | jq .

echo ""
echo "=== Crea contatto ==="
NEW=$(curl -s -X POST $BASE/contatti \
  -H "Content-Type: application/json" \
  -d '{"nome":"Anna Bianchi","email":"anna@example.com","tel":"333-444"}')
echo $NEW | jq .
ID=$(echo $NEW | jq .id)

echo ""
echo "=== Leggi contatto $ID ==="
curl -s $BASE/contatti/$ID | jq .

echo ""
echo "=== Aggiorna contatto $ID ==="
curl -s -X PUT $BASE/contatti/$ID \
  -H "Content-Type: application/json" \
  -d '{"tel":"333-999"}' | jq .

echo ""
echo "=== Elimina contatto $ID ==="
curl -s -o /dev/null -w "HTTP status: %{http_code}\n" \
  -X DELETE $BASE/contatti/$ID

echo ""
echo "=== Lista finale ==="
curl -s $BASE/contatti | jq length
echo "contatti rimasti"