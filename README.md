# Personal Portfolio Website

A responsive single-page portfolio built with plain HTML, CSS and JavaScript.
No frameworks, no build step — open `index.html` and it runs.

## Files

```
portfolio/
├── index.html              the whole page: Home, About, Skills, Projects, Resume, Contact
├── css/style.css           all styling, numbered in sections to match the HTML
├── js/script.js            nav, scrollspy, reveals, filters, form validation
├── assets/
│   ├── resume.pdf          the file the download buttons serve
│   └── img/                project artwork, portrait, favicon (all SVG)
└── README.md
```

## Running it

Double-click `index.html`, or serve it locally so relative paths behave exactly
as they will in production:

```bash
python3 -m http.server 8000   # then open http://localhost:8000
```

## Requirements checklist

| Requirement | Where it lives |
|---|---|
| Responsive across breakpoints | `style.css` section 11 — breaks at 1080 / 900 / 820 / 620 / 380px |
| Six separate sections | `index.html` — each `<section>` has an `id` and `data-nav` |
| Project cards with image, description, links | `.card` blocks in the Projects section |
| Smooth scrolling | CSS `scroll-behavior` plus a JS fallback that offsets the fixed header |
| Hover animations | Cards lift, images scale, links underline-wipe, chips and buttons respond |
| Interactive elements | Project filter, reading-progress bar, animated skill meters, back-to-top, pointer-tracked hero light |
| Mobile navigation | Hamburger opens a slide-in drawer with a scrim; closes on link click, scrim click, Escape, or resize |
| Downloadable resume | Three `<a href="assets/resume.pdf" download>` buttons — nav, hero, Resume section |
| Form validation | `script.js` section 7 — per-field rules, validates on blur, live once a field is marked bad, blocks submit and focuses the first problem |
| Cross-browser | No experimental CSS; ES5-compatible JavaScript; `IntersectionObserver` degrades gracefully |

## Making it yours

Search and replace these, in this order:

1. **Name** — `Aarav Mehta` and `Aarav` appear in the title, meta tags, nav brand,
   hero, footer and resume. Replace all of them.
2. **Contact details** — the email, phone and city sit in the Contact section's
   `.contact-list`, and again in the `mailto:` / `tel:` links.
3. **Social links** — the three `<a href="#">` in `.socials`. Point them at your
   real GitHub, LinkedIn and anything else.
4. **Projects** — each `<article class="card">` holds a title, kicker, description,
   tag list and two links. The `data-tags` attribute drives the filter buttons
   (`app`, `ui`, `js`), so keep those values in sync with the filters.
5. **Skills** — each `<li class="meter">` has a `data-level` number and a matching
   `%` label. Change both.
6. **Resume** — update the timeline entries, then replace `assets/resume.pdf` with
   your own PDF. Keep the filename or update the three links.
7. **Project images** — replace the SVGs in `assets/img/` with your own screenshots.
   Keep them roughly 3:2; the lead card looks best around 800×500.

### Colours

Every colour is a variable at the top of `style.css`:

```css
--ink: #071a1f;    /* page background     */
--amber: #f2a65a;  /* primary accent      */
--mint: #5fd3b2;   /* secondary accent    */
```

Change those three and the whole site re-themes.

## Connecting the contact form

The form validates fully in the browser but does not send anything — the submit
handler simulates a send. To make it real, open `js/script.js`, find the comment
`Front-end only:` in section 7, and replace the `setTimeout` block with a request
to your backend. With Formspree, for example:

```js
fetch('https://formspree.io/f/YOUR_ID', {
  method: 'POST',
  headers: { 'Accept': 'application/json' },
  body: new FormData(form)
})
  .then(function (r) { /* show the success status */ })
  .catch(function () { /* show an error status */ });
```

## Accessibility and performance notes

- Skip link, visible focus rings, and `aria-expanded` on the menu button.
- Errors use `role="alert"`; the submit status uses `aria-live="polite"`.
- All animation is disabled under `prefers-reduced-motion: reduce`.
- Images are SVG and lazy-loaded; there are no third-party scripts.
- Only one network request beyond your own files: the Google Fonts stylesheet.
  To go fully offline, drop that `<link>` and the fallback fonts take over.
