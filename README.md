# SK Packaging — Box Costing & Specification Workspace

A standalone, offline-first corrugated box costing workspace. This repository is separate from the SK Packaging ERP.

## Run locally

Serve this folder over HTTPS or localhost (for example, `npx serve .`) and open `/`. The service worker caches the app shell after the first successful load. Browser-local Paper Rate Master and Saved Estimates use localStorage on this device/browser.

## Current capabilities

- Responsive estimator, cutting plan illustration, 2-Sheet Jointed and 1-Sheet RSC sizing
- Dimension unit conversion, sheet rounding and manual sheet override
- 3-ply, 5-ply and 7-ply layer models with independently configured roll sets
- Layer-wise paper weight, base cost, rupee-per-kg profit and batch calculations
- Factory flute consumption factors: Narrow 1.50×, Broad 1.60×, Fine E-Flute 1.35×
- Local Paper Rate Master, GSM sample checker, saved estimates, CSV export and copy quote
- ERP read-only snapshot panel showing latest posted reel purchase rates and currently remaining reel stock

## Flute calculation

Flute take-up increases the flute-paper consumption only. It is not a multiplier on the total board GSM. For a 100-inch liner reference, Narrow uses 150 inches of flute paper and Broad uses 160 inches.

## ERP integration

The calculator calls `GET /api/box-costing/v1/snapshot` using `credentials: 'include'`. It expects to be served on the same site as the ERP (for example, behind the ERP's same-site reverse proxy) so the ERP HTTP-only login cookie can authenticate the request. The ERP currently restricts these endpoints to the configured administrator account.

Returned ERP purchase and stock figures are for reference and are **not** copied automatically into the local Paper Rate Master. This avoids silently changing quote assumptions. Review the latest purchase rate, latest landed rate and remaining-stock weighted-average rate separately before choosing a quote basis. The current ERP API returns reel stock; duplex sheet stock requires a separate ERP data mapping.

## Data privacy

- Paper Rate Master and Saved Estimates remain in this browser's localStorage.
- Local data is not automatically shared between devices or users. Use the available CSV export for estimate backup; rate-master backup/import is a planned enhancement.
- Never commit ERP passwords, cookies, JWT secrets, database credentials or reusable API tokens.
- Until repository visibility is changed to private, anyone can read the source code. The calculator UI itself does not expose private ERP rate data to unauthenticated users; the ERP API requires the owner session.

## Validation boundaries

This is a first standalone implementation. Run real factory sample boxes through it and compare weights/costs with measured paper usage before relying on quotation outputs. Confirm the 7-ply physical layer order and cutting geometry with the factory. ERP live sync requires the read API to be merged and deployed first.
