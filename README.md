# SK Packaging — Box Costing & Specification Workspace

A standalone, offline-first corrugated box costing workspace. This repository is independent of the SK Packaging ERP.

## Run locally

Serve this folder over HTTPS or localhost (for example, `npx serve .`) and open `/`. The service worker caches the app shell after the first successful load. Paper Rate Master and Saved Estimates use browser localStorage on this device/browser.

## Costing specification

The original factory costing specification is the source of truth. Preserve the existing dimensions, cutting modes, sheet rounding, layer structure, rate inputs, profit-per-kg settings, gum, wastage and per-box extras unless the owner explicitly changes them.

- 2-Sheet Jointed: roll width = W + H (plus optional OD/crease allowance); cut length = L + W + stitching flap (plus optional OD/crease allowance); 2 sheets per box.
- 1-Sheet RSC: roll width = W + H (plus optional OD/crease allowance); cut length = 2L + 2W + stitching flap (plus optional OD/crease allowance); 1 sheet per box.
- Dimension inputs support inches, centimetres and millimetres.
- Sheet rounding: nearest 0.5 inch, next 0.5 inch up, nearest 1 inch, or next 1 inch up; optional manual roll/cut override.
- 3-ply: top facing + one flute/backing pair (one 2-ply roll).
- 5-ply: top facing + two flute/backing pairs (two 2-ply rolls).
- 7-ply: top facing + three flute/backing pairs (three independently configurable 2-ply rolls).
- Each paper layer has its own quality, BF, GSM and ₹/kg rate; roll 2 and roll 3 can optionally reuse roll 1 specifications.
- Layer cost = layer weight × (paper rate + gum/pasting ₹/kg); layer profit = layer weight × configured profit ₹/kg. Final box price = sum of layer costs + per-box extras + sum of layer profits.

## Critical flute take-up rule

Flute take-up is **extra flute-paper consumption length**, not extra GSM applied to the complete board.

- Narrow flute: 50% extra = 1.50× flute paper consumption.
- Broad flute: 60% extra = 1.60× flute paper consumption.
- Fine E-Flute: 35% extra = 1.35× flute paper consumption.
- Custom: every flute roll has its own editable custom take-up percentage. A custom value of 0% is valid and means 1.00×.
- Roll 1, Roll 2 and Roll 3 custom values are independent unless the corresponding “Same as Roll #1” option is enabled.
- The factor applies only to that roll's flute-paper layer; it does not multiply the backing liner, top facing, or total board GSM.

For a 100-inch liner reference, Narrow uses 150 inches of flute paper and Broad uses 160 inches.

## ERP integration

The calculator calls `GET /api/box-costing/v1/snapshot` with `credentials: 'include'`. It must be served from the same site/origin as the ERP (for example, behind the ERP's same-site reverse-proxy path) so the ERP HTTP-only owner session cookie is sent securely. The API is restricted to the designated owner account.

ERP data is displayed separately from the local Paper Rate Master. The owner explicitly chooses a rate basis and presses “Apply matching ERP rates” to copy matching reel-paper rates into active Kraft-paper layer inputs. The three bases are latest purchase rate, latest landed rate, and weighted-average landed rate of remaining stock. Matching is by quality, BF and GSM; rates across available reel widths are considered because the calculator's sheet width is a cut dimension, not necessarily the purchased reel width. Duplex top facing is excluded from the reel-rate import and has a separate batch selector.

ERP refresh never overwrites the local rate master, profit settings, saved estimates or custom flute values. Reel stock is displayed by actual width/BF/GSM/quality. Duplex sheet stock still needs a separate ERP endpoint.

## Data privacy

- Paper Rate Master and Saved Estimates remain in this browser's localStorage.
- Local data is not shared across devices/users automatically.
- Never commit ERP passwords, cookies, JWT secrets, database credentials or reusable API tokens.
- This repository must be made private before source-code confidentiality can be assumed.

## Validation boundaries

This is an initial implementation. Compare multiple real factory boxes and measured paper weights before relying on quote outputs. Confirm the exact 7-ply physical layer order, box cutting geometry and factory allowances. Runtime/browser testing and live ERP testing are required before production use.
