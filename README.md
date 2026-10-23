# My Site — standalone version

The whole site as plain files: HTML pages, one stylesheet, one script, and the data that drives
the menu, the search and the changelog. No build step, no dependencies, no server code.

---

## What is in this folder

```
index.html          home page
.nojekyll           keep this file — it stops GitHub from processing the site
README.md           this file
assets/
  site.css          all the styling (colours are variables at the top)
  app.js            header, menus, search, full screen, changelog, home cards
data/
  site.json         site name, tagline, contact email, default menu style
changelog/
  index.json        the list of release files, newest first
  _template.json    copy this to add a release
  0001-launch.json
  0002-games-and-html.json
pages/              one complete HTML file per page
  games.html  tic-tac-toe.html  memory-match.html
  changelog.html  documentation.html  github-setup.html
  faq.html  contact.html  gallery.html  testimonials.html
  contribute.html  resources.html  html-demo.html
  about.html  privacy.html  terms.html
```

Open `index.html` in a browser to look around. The changelog frame needs a web server (or
GitHub Pages) because browsers block loading files from a local folder — everything else works
straight from disk.

---

## Put it on GitHub Pages (beginner steps)

1. **Create an account** at github.com — the free plan is enough.
2. **Create a repository:** New repository → name it (for example `my-site`) → **Public** → Create.
3. **Upload the files:** on the repository page, **Add file → Upload files**. Drag in
   `index.html`, `.nojekyll`, `README.md` and the folders `assets`, `pages`, `data` and `changelog`.
   Press **Commit changes**. Everything must sit at the top level of the repository — not inside
   another folder.
4. **Turn on Pages:** repository **Settings → Pages**. Under *Build and deployment* choose
   **Deploy from a branch**, branch **main**, folder **/ (root)**, then **Save**.
5. **Open the site:** after a minute or two the same panel shows your address:
   `https://your-username.github.io/my-site/`

To update later, upload the changed files and commit — the site refreshes in about a minute.

### If something looks wrong

| Symptom | Cause |
| --- | --- |
| 404 on a link | File-name case. GitHub Pages is case-sensitive: `faq.html` is not `FAQ.html`. |
| No styling | The `assets` folder is not next to `index.html`. |
| "Not published yet" | The first deploy can take a few minutes. Hard-refresh afterwards. |
| Empty changelog | The frame loads files over the network; it needs GitHub Pages or a local server. |
| Folder appears in the file list as a file | The folder was zipped. Upload the folder, not an archive. |

---

## Editing it

**Site name, tagline, contact email, default menu:** `data/site.json`

```json
{
  "name": "My Site",
  "tagline": "Games, notes and pages.",
  "contactEmail": "hello@example.com",
  "menuStyle": "side"
}
```

`menuStyle` is `"side"` or `"dropdown"`. Visitors can still switch it with the button in the
header; their choice is remembered in their own browser.

**Colours and type:** the variables at the top of `assets/site.css`.

**Add a page:**

1. Copy a file in `pages/`, for example `about.html`, and rename it (`my-page.html`).
2. Keep the skeleton: the head with `../assets/site.css`, the `<header id="site-header">`, the
   `<aside id="site-sidebar">`, your content inside `<main class="page">`, the footer div and the
   `<script src="../assets/app.js"></script>` at the end. Only `data-root=".."` pages link with
   `../assets/`.
3. Add one line to the page list at the top of `assets/app.js`:

```js
{ path: "pages/my-page.html", title: "My page", group: "Pages", desc: "One line about it." }
```

That line is enough: the side menu, the drop-down, the search and the home page cards all read
from it.

**Add a game:** same as a page, with `group: "Games"`. Keep the game's CSS in a `<style>` tag and
its logic in a `<script>` tag inside the same file, like `pages/tic-tac-toe.html`.

**Add a changelog entry:**

1. Copy `changelog/_template.json` to `changelog/0003-my-release.json` and fill it in.

```json
{
  "version": "1.3.0",
  "date": "2026-11-10",
  "title": "A short title",
  "type": "Added",
  "summary": "One sentence about the release.",
  "items": ["First change", "Second change"]
}
```

2. Add the file name to `changelog/index.json`, newest first. The changelog page renders whatever
   is listed there, in a scrolling frame.

---

## What is included

- Side menu **or** drop-down menu, switchable from the header and remembered per browser
- Search across every page, in the menu and in the header
- Full screen mode, with Escape to leave
- Every page of the app version: game library, documentation, gallery, testimonials, FAQ,
  contact, changelog, about, contributor guidelines, resources, privacy, terms, GitHub setup
- Two playable games and one self-contained HTML demo page
- A changelog driven by a folder of JSON files, with a template
- Setup instructions in this file, in the site's GitHub Setup page, and in `pages/github-setup.html`
