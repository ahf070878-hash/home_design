# HuniBangun.id Engineering Rules

## Product invariants

- Steps 1–7 are guest-accessible. Preserve land, city, design, variants, BOM, and contractor interest until the session is linked to a verified user.
- Land comes first. Always show all designs; mark non-fitting designs with exact width/length shortfalls and offer nearest-type or custom-adaptation paths.
- Checkout charges only the blueprint package and optional custom-adaptation fee. Material RAB, discounts, and contractors never enter the platform payment total.
- A material selection is a branded BOM specification. Redemption happens at a partner store through one six-month, single-use QR voucher.
- Record city/category demand whenever no partner product serves the build city.
- Contractor data is Phase 2 demo data and remains optional.

## Consumer architecture

1. Landing: guest session, staged 3D build, gallery, and process explanation.
2. Land: width, length, and city/district; show fits, shortfalls, and unfulfilled requests.
3. Type: Types 36–120, exterior/floor-plan previews, IKK-adjusted RAB, compare up to three.
4. Variant: select pre-drawn facade and layout variants; update preview and RAB.
5. Material: choose branded BOM products with package and application visuals; log “Beli Sendiri” demand.
6. Contractor: optional Phase 2 interest bookmark; zero checkout impact.
7. Summary: separate blueprint/custom fees from RAB and QR discount estimates.
8. Account: collect name, phone, and build location; verify OTP; link guest state.
9. Checkout: VA/QRIS invoice with expiry, retry, and preserved selections.
10. Issuance: release DED/DWG/BOM/RAB/credit files and the single-use QR voucher.

## Database and API invariants

- PostgreSQL is authoritative after account linkage. Store order BOMs and voucher BOMs as immutable JSON snapshots.
- QR redemption is one short database transaction. Recheck `is_redeemed = false` and `expires_at > now()` in the conditional update so concurrent scans cannot both succeed.
- The same redemption transaction writes the redemption log, partner-store counters, and user-notification outbox row.
- Treat `redemption_logs` as the producer-dashboard audit source; derive aggregates rather than maintaining duplicate metric tables.
- Route Handlers validate untrusted JSON and return stable Indonesian error messages with appropriate 4xx/5xx status codes.
- External notification delivery occurs after commit from `user_notifications`; never call a third-party provider inside the redemption transaction.

## Completion checks

Run `npm run prisma:validate`, `npm run prisma:generate`, `npm run typecheck`, and `npm run build`. When PostgreSQL is available, also run `npm run db:push` and `npm run db:seed`.

<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
