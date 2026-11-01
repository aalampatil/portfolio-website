# Aalam Patil Portfolio

Next.js portfolio with three Japanese-inspired themes: Sakura (soft cherry blossom pink, the default), Samurai (red and beige), and Moonlight (dark plum and pink). The header theme selector remembers your preference locally. Content follows a project-first layout: featured work, grouped toolkit, Hashnode writing, a short about section, and social links. Build updates and portfolio history are expandable.

## Scripts

- `npm run dev` starts the local development server.
- `npm run build` creates the production build.
- `npm run lint` runs ESLint.
- `npm run start` serves the production build.

Development output lives in `.next-dev`; production build and start use `.next`. This keeps `npm run build` from overwriting a running development server’s bundles and React client manifests. Restart `npm run dev` once after changing this configuration.

## Structure

- `app/components` contains shared UI and layout components.
- `app/components/sections` contains one component per portfolio section.
- `app/data/portfolio.js` contains portfolio content.
- `app/lib/hashnode.js` contains Hashnode feed configuration.
