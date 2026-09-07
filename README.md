This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## AI chat (drive.8n.ai)

`/[locale]/chat` is an assistant that posts each turn to a chat workflow hosted
on drive.8n.ai. The app is a static export, so there is no server to proxy
through: the browser calls the webhook directly and the URL is inlined at build
time.

```bash
cp .env.example .env.local   # then set the webhook URL
```

| Variable | Effect |
| --- | --- |
| `NEXT_PUBLIC_CHAT_ENDPOINT` | Webhook the chat posts to. Unset — the default — runs the page in demo mode, where it answers with a labelled placeholder instead of calling anything. |

Because the call is made from the browser, the endpoint must send CORS headers
allowing the site's origin, and it must not require a secret — anything put in
this variable ships to every visitor.

### The contract

Each turn is a `POST` with a JSON body:

```json
{
  "action": "sendMessage",
  "sessionId": "b1f2…",
  "chatInput": "Where can I eat seafood near Jomtien?",
  "message": "Where can I eat seafood near Jomtien?",
  "locale": "th",
  "history": [{ "role": "user", "content": "…" }]
}
```

`action`, `sessionId` and `chatInput` are the fields n8n's chat trigger reads,
so a stock workflow works unchanged. `sessionId` is generated per browser and
kept in `localStorage`, so a workflow with memory can key on it; `locale` is the
language the visitor is reading the site in, and the reply is expected in it.

The reply is read leniently: a plain-text body is used as is, and a JSON body is
searched for the first non-empty string under `output`, `reply`, `response`,
`answer`, `text`, `message`, `content`, `result`, `data` or `json` — `output`
first, because that is what an n8n AI agent node returns. A request that times
out (45s), fails, returns a non-2xx status or carries no readable reply leaves
the question in the transcript with a retry button.
