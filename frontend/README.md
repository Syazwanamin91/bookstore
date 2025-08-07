## Create Frontend project sub-folder for Bookstore with React + vite

npm create vite@latest frontend -- --template react

## Navigate to frontend folder and install npm default libraries & dependencies

cd frontend
npm install

## Install Tailwind

```
npm install -D tailwindcss@^3.4.0 postcss autoprefixer
npx --verbose tailwindcss init -p
```

## Create `.vscode/settings.json` (optional)

```
{
  "css.validate": false,
  "tailwindCSS.includeLanguages": {
    "css": "css",
    "postcss": "postcss"
  },
  "editor.inlayHints.enabled": "on"
}
```

## Add the following at the top of `src/index.css`

```
@tailwind base;
@tailwind components;
@tailwind utilities;

/* Optional: Add line-clamp utility if not available */
@layer utilities {
  .line-clamp-2 {
    overflow: hidden;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
  }
}
```

## Install heroicons

```
npm install @heroicons/react
```

## Install React Router

```
npm install react-router-dom
```
