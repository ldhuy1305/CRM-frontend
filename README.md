# CRM-frontend

This template should help get you started developing with Vue 3 in Vite.
## Project Structure
```text
.
├── assets
├── components              # App components
│   ├── partials
│   ├── common
│   └── ...
├── layouts                 # Layout components
│   ├── DefaultLayout.vue
│   └── AuthLayout.vue
├── views                   # Page
│   ├── index.vue
│   └── ...
├── static                 
│   ├── favicon.ico
│   └── ...
├── stores                  # Pinia
│   ├── index.js
│   ├── moduleA             # Vuex module
│   │   ├── actions.ts
│   │   ├── getters.ts
│   │   ├── mutations.ts
│   │   ├── state.ts
│   └── ...                 # Other vuex modules or vuex utils
├── types                   # Type definitions
│   ├── globals.d.ts        # Global types
│   └── interface           # Interface
├── utils                   # Utility functions
├── .env                    # Environment variables
├── .env.example            # An example of .env file
└── tsconfig.json           # Typescript config
```

## Recommended IDE Setup

[VSCode](https://code.visualstudio.com/) + [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (and disable Vetur).

## Type Support for `.vue` Imports in TS

TypeScript cannot handle type information for `.vue` imports by default, so we replace the `tsc` CLI with `vue-tsc` for type checking. In editors, we need [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) to make the TypeScript language service aware of `.vue` types.

## Customize configuration

See [Vite Configuration Reference](https://vite.dev/config/).

## Project Setup

```sh
npm install
```

### Compile and Hot-Reload for Development

```sh
npm run dev
```

### Type-Check, Compile and Minify for Production

```sh
npm run build
```

### Lint with [ESLint](https://eslint.org/)

```sh
npm run lint
```
