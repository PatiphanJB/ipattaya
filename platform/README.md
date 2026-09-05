# Rebate platform

Trading-account linking, the rebate ledger and the referral tree for the
Vietnam rebate business.

This is a separate package from the Pattaya guide app that shares the repo.
That app is `output: 'export'` — a static export — so it cannot host the API
routes, scheduled jobs or server-side broker calls this needs. Nothing here
imports from `../src`, so the whole folder can move to its own repository by
copying it.

## Running

```bash
npm install
npm test        # 43 tests, no credentials needed
npm run typecheck
npm run dev     # http://localhost:3000
```

Tests run on Node's native TypeScript support, which is why relative imports
carry an explicit `.ts` extension. Turbopack accepts the same imports, so one
spelling works for both.

With no `EXNESS_PARTNER_LOGIN` / `EXNESS_PARTNER_PASSWORD` set, the app runs on
`MockBrokerAdapter` and says so on the linking page. Useful fixtures:

| Number | What it exercises |
| --- | --- |
| `80001111` | Visible email mask — links immediately |
| `80002222` | Mask hides everything — needs the registration date, otherwise goes to review |
| `80003333` | Cent account, reported in cent-lots |
| `80004444` | Under us but has never traded |
| anything else | Sits under a different partner |

### Environment

| Variable | Effect |
| --- | --- |
| `EXNESS_PARTNER_LOGIN`, `EXNESS_PARTNER_PASSWORD` | Switch from the mock to the real partner API |
| `EXNESS_PARTNER_BASE_URL` | Override the partner API host |
| `NEXT_PUBLIC_PARTNER_CODE` | Shown in the partner-change instructions |

## What is built

| Layer | Files | State |
| --- | --- | --- |
| Domain (pure, no I/O) | `src/domain/` | Done, tested |
| Broker access | `src/broker/` | Interface done; `MockBrokerAdapter` done; real adapter not written |
| Storage ports | `src/storage/` | Interfaces done; in-memory implementation done; Firestore not written |
| Link service | `src/services/link-account.ts` | Done, tested |
| Daily jobs | `src/jobs/sync.ts` | Done, tested |
| Wiring | `src/server/` | In-memory; auth is a development stub |
| HTTP | `src/app/api/accounts/link/route.ts` | Done |
| UI | `src/app/` | Landing page and linking form; Vietnamese copy in `src/i18n/vi.ts` |

Every layer is built against `MockBrokerAdapter` and the in-memory
repositories, so the flow works end to end today without a broker token. When
real credentials arrive, only the factory that picks an adapter changes.

## The linking flow, and why it is shaped this way

1. **Normalise before judging.** People paste account numbers out of MT5, out
   of Zalo messages and out of screenshots read aloud. Everything that is not a
   digit is stripped rather than rejected.

2. **Knowing the number proves nothing.** Account numbers are sequential and
   get pasted into public groups all day. Before an account earns on someone's
   dashboard, a second fact only its owner has must line up: the broker's
   masked client email against the platform account, falling back to the
   account's registration date. A mask that hides the whole local part
   (`****@gmail.com`) is not treated as evidence.

3. **"Not under us" is the money path, not an error.** An account under a
   different partner gets its own status and its own row, because the partner
   change is the single highest-intent action in this business. The daily
   reconciliation re-checks those rows and links them by itself the morning the
   change lands, using the claim the user made when they first tried — nobody
   has to come back and re-enter anything.

4. **Unproven owners wait, they are not rejected.** They land in `pending` for
   review rather than being told no.

5. **The form is rate limited.** An unlimited link form is an oracle for "which
   accounts sit under this partner", so attempts are capped per user per hour.

6. **Every attempt is written down.** The first time two people claim the same
   account, the audit trail is the only thing that can settle it.

7. **The three real answers are all `200`.** Linked, waiting for review and
   "under another partner" are outcomes, not failures. Only a malformed number
   (`400`) and an account someone else already holds (`409`) are errors. The
   form branches on the code, not on the status class.

## Not built yet, and load-bearing

- **Authentication.** `src/server/session.ts` returns a seeded development user
  and returns `null` in production, so the endpoint is closed rather than open
  until Firebase Auth (phone number) replaces it. The fence is `NODE_ENV`, not
  a flag, because a bypass that is merely configured off is still a bypass.
- **Storage.** Everything is in memory and resets on restart. The Firestore
  implementations go behind the same ports in `src/storage/ports.ts`.
- **Payout.** Nothing here moves money. Rebates reach traders through the
  broker's own autorebate system; the platform only computes and displays.

## Open questions blocking the next step

- **Exness Partnership API response shape.** Whether the client endpoint
  returns a masked email, a registration date, and per-client daily rewards
  decides which ownership proof is usable. If there is no email at all, the
  registration-date path becomes primary and the admin review queue carries
  more load.
- **Real commission per lot** per account type, to replace the placeholder
  numbers in `src/broker/mock.ts`. Until these are real, the tier table in
  `src/domain/tiers.ts` cannot be checked for whether the top rung is
  affordable.
