#!/usr/bin/env sh
# SPDX-License-Identifier: Apache-2.0
# Reproduce every output in this folder from index.md. Run from this directory.
set -e
MODEL=../../../model/bin/model.py
DECK=../../../markdown-deck/bin/markdown-deck.mjs

echo "1. the document is the model"
python "$MODEL" extract index.md --format json --out model.json

echo "2. generate the diagram (first time only; use sync afterwards)"
[ -f components.drawio ] || python "$MODEL" emit index.md --to drawio --out components.drawio

echo "3. reconcile, keeping whatever layout the author has given it"
python "$MODEL" sync index.md components.drawio

echo "4. check the document and the diagram agree"
python "$MODEL" validate index.md --against components.drawio

echo "5. render the structure and one image per scenario"
python "$MODEL" render components.drawio --out components.svg  --layer Structure
python "$MODEL" render components.drawio --out scenario-s1.svg --layer Structure --layer "S1 Grounded answer"
python "$MODEL" render components.drawio --out scenario-s2.svg --layer Structure --layer "S2 Source onboarding"

echo "6. publish the deck"
node "$DECK" build index.md --out dist --theme bnz --eyebrow "REF-002 Knowledge Retrieval"
node "$DECK" pdf dist/deck.html --out dist/deck.pdf
