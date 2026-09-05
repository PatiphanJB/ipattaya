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
npm test        # 24 tests, no dependencies, no credentials
npm run typecheck
```

Tests run on Node's native TypeScript support, which is why relative imports
carry an explicit `.ts` extension.

## What is built

| Layer | Files | State |
| --- | --- | --- |
| Domain (pure, no I/O) | `src/domain/` | Done, tested |
| Broker access | `src/broker/` | Interface done; `MockBrokerAdapter` done; real adapter not written |
| Storage ports | `src/storage/` | Interfaces done; in-memory implementation done; Firestore not written |
| Link service | `src/services/link-account.ts` | Done, tested |
| Daily jobs | `src/jobs/sync.ts` | Done, tested |
| HTTP + UI | — | Not started |

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

## Open questions blocking the next step

- **Exness Partnership API response shape.** Whether the client endpoint
  returns a masked email, a registration date, and per-client daily rewards
  decides which ownership proof is usable. If there is no email at all, the
  registration-date path becomes primary and the admin review queue carries
  more load.
- **Real commission per lot** per account type, to replace the placeholder
  numbers in `src/broker/mock.ts`.
