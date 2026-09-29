# Vendored from AI-Assisted Work

`bundle.schema.json` and `../validate-bundle.mjs` are copies of the files of the same name in
[AI-Assisted Work](https://github.com/dermot-obrien/ai-assisted-work) (`schemas/` and
`scripts/`), taken at commit 793aca9. `work.schema.json`, where present, is AAW's work
ontology module, which this bundle's own ontology module extends.

They are copied rather than fetched so CI needs no network and no other repository. Do not
edit them here: change them in AAW, then copy them again and update the commit above.
