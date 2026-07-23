This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

#### Set environment variables

First, create a file named `.env` in the root directory of the project and add the following content:
```env
NEXT_PUBLIC_API_URL=http://localhost:30000
NEXT_PUBLIC_CONNECTOR_BFF_URL=http://localhost:4000
NEXT_PUBLIC_DEFAULT_ORIGINAL_SENDER:alice
NEXT_PUBLIC_DEFAULT_FINAL_RECIPIENT:bob
```

#### Run the app

Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.
