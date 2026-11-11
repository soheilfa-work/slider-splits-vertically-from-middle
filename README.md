# Slider Splits Vertically from the Middle

A full-screen fashion slider. Each photo is cut down the center: the left half wipes up from the bottom and the right half wipes down from the top. Scroll or swipe to move between looks.

**Live demo:** [slider-splits-vertically-from-middl.vercel.app](https://slider-splits-vertically-from-middl.vercel.app/)

## Run locally

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Scripts

| Command | What it does |
|---|---|
| `npm run dev` | Start the dev server |
| `npm run build` | Build for production |
| `npm start` | Run the production build |
| `npm run lint` | Lint the project |

## Project

- `app/page.tsx` builds the two columns, reveals each slide, and follows wheel and touch input.
- `app/libs/libs.ts` holds the slide list (`title`, `tags`, `accent`, `link`, `image`) and the motion settings.
- `app/components/ScrollCursor.tsx` replaces the pointer with a scroll icon.
- `public/images` stores the slide photos.
