# CRM-frontend

This template should help get you started developing with Vue 3 in Vite.
## Project Structure
```text
project
│   
├── src/                          # Main source code folder
│   │
│   ├── api/                      # Folder containing API requests
│   │   ├── axiosInstance.js      # Axios configuration (if using Axios)
│   │   ├── user.js               # API for user-related operations
│   │   └── auth.js               # API for authentication
│   │
│   ├── assets/                   # Assets folder (images, icons, fonts, etc.)
│   │   ├── images/
│   │   ├── icons/
│   │   └── fonts/
│   │
│   ├── components/               # Shared components
│   │   ├── ui/                   # Common UI components (buttons, modals, etc.)
│   │   └── layout/               # Layout components (header, footer, sidebar, etc.)
│   │
│   ├── composables/              # Custom hooks (Vue 3 Composition API)
│   │   ├── useAuth.js
│   │   └── useTheme.js
│   │
│   ├── layouts/                  # Layout views (Admin, Auth, Main, etc.)
│   │   ├── DefaultLayout.vue
│   │   └── AdminLayout.vue
│   │
│   ├── router/                   # Vue Router configuration
│   │   ├── index.js              # Main router setup
│   │   ├── routes.js             # Route definitions
│   │   └── guards.js             # Navigation guards (optional)
│   │
│   ├── store/                    # Pinia
│   │   ├── index.js              # Main store
│   │   ├── moduleA               # Vuex module
│   │   │   ├── actions.ts
│   │   │   ├── getters.ts
│   │   │   ├── mutations.ts
│   │   │   └── state.ts
│   │   └── ...                   # Other vuex modules or vuex utils
│   │
│   ├── styles/                   # CSS/SCSS styles
│   │   ├── main.css              # Main stylesheet
│   │   ├── variables.scss        # SCSS variables
│   │   ├── mixins.scss           # SCSS mixins
│   │   └── tailwind.css          # TailwindCSS (if used)
│   │
│   ├── views/                    # Main page views
│   │   ├── Home.vue
│   │   ├── Login.vue
│   │   ├── Dashboard.vue
│   │   └── Profile.vue
│   │
│   ├── types                     # Type definitions
│   │   ├── globals.d.ts          # Global types
│   │   └── interface             # Interface
│   │
│   ├── App.vue                   # Root component
│   ├── i18n.js                   # Internationalization (if using Vue I18n)
│   ├── main.js                   # Vue entry file
│   └── permission.js             # Middleware for access control
│
├── puplic/                       # Static files (favicon, manifest, etc.)
│   ├── index.html                # Main HTML template
│   ├── favicon.ico
│   └── ...
│   
├── .vscode/                      # VSCode settings (extensions, preferences, etc.)
├── .gitignore                    # Git ignore configuration
├── .editorconfig                 # Code formatting rules
├── .env                           # Environment variables
├── .env.example                   # An example of .env file
├── utils                          # Utility functions
├── tsconfig.json                  # Typescript config
├── package.json                  # Dependency management
├── vite.config.js                # Vite configuration (or vue.config.js if using Vue CLI)
├── tailwind.config.js          # TailwindCSS configuration (if used)
└── ...
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
