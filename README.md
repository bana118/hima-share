# node-container-template

Template of vscode remote development container with Node.js

# Install dependencies

```
yarn install --frozen-lockfile
```

# For React

```
yarn add react react-dom
yarn add --dev @types/react @types/react-dom eslint-plugin-react eslint-plugin-react-hooks
```

tsconfig.json

```
{
  "compilerOptions": {
    "allowSyntheticDefaultImports": true,
    "jsx": "react",
    "lib": ["dom", "esnext"],
    "moduleResolution": "node",
    "noEmit": true,
    "skipLibCheck": true,
    "resolveJsonModule": true,
    "strict": true,
    "typeRoots": ["src/@types"]
  }
}
```

.eslintrc.json

```
{
  "extends": [
    "eslint:recommended",
    "plugin:@typescript-eslint/eslint-recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:prettier/recommended",
    "plugin:react/recommended",
    "prettier/@typescript-eslint"
  ],
  "plugins": ["@typescript-eslint"],
  "env": {
    "node": true,
    "es6": true
  },
  "parser": "@typescript-eslint/parser",
  "parserOptions": {
    "sourceType": "module",
    "project": "./tsconfig.json"
  },
  "rules": {},
  "settings": {
    "react": {
      "version": "detect"
    }
  }
}
```
