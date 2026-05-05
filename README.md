# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

## Run with PM2

Build the site before starting PM2:

```sh
npm install
npm run build
pm2 start ecosystem.config.cjs
```

If PM2 is not installed globally on the machine, install it with `npm install -g pm2` or run the same command through `npx pm2 start ecosystem.config.cjs`.

The PM2 process is named `potatotyper-site` and serves the built Vite app on `0.0.0.0:4173`.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
"# potatotyper.page" 
