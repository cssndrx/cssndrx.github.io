# Writing on cassandraxia.com

New writing uses Jekyll and Markdown. Existing HTML articles and projects keep their URLs. Each new post gets a shared layout, a date, and a link in the homepage's Writing section automatically.

## For each blog post

### 1. Write a draft

Create a draft using its slug (the filename without `.md`), from any directory:

```sh
blognew my-new-piece
```

This creates `_drafts/my-new-piece.md`, makes the drafts folder if needed, and fills in the title and template below. Open the generated file in your editor and replace the sample text. The command refuses to overwrite an existing draft.

Use lowercase letters, numbers, and single hyphens in the slug. The template starts with an editable title derived from it: `my-new-piece` becomes `My new piece`. Change the title in the file to whatever you like; the filename and URL stay the same.

```markdown
---
title: "My new piece"
# Optional homepage preview:
# description: "A short preview of this post."
# image: "/images/landscape.jpeg"
# image_alt: "Northern lights above mountains and a lake"
---

Start writing here. The opening paragraph also becomes the homepage excerpt.

## A heading

A paragraph with **bold**, *italic*, and [a link](https://example.com).

![Describe the image](/images/landscape.jpeg)
```

Only the title is required above the text. Add pictures to `images/` and reference them as `/images/filename.jpg`. Use filenames without spaces. Images automatically fit the article width, including on phones.

For a homepage card like the older writing previews, uncomment the optional fields (remove the leading `#`) and fill them in:

```yaml
---
title: "My new piece"
description: "A short preview that makes someone want to read more."
image: "/images/landscape.jpeg"
image_alt: "Northern lights above mountains and a lake"
---
```

An `image` enables the card with a title, preview text, and image. Without it, the post keeps the simple text preview. `description` is optional in either format; when omitted, the opening paragraph supplies the preview text. `image_alt` describes the preview image for screen readers. The preview image appears on the homepage; include an image in the Markdown body if you also want it in the article.

Git ignores `_drafts/`, so regular add, commit, and push commands leave drafts out of GitHub. Jekyll can still preview them locally. Drafts have no Git history or backup on GitHub until you move them into `_posts/` and commit them. The ignore rule covers `_drafts/`; add new files in `images/` when you are ready to publish them.

### 2. Preview while writing

```sh
blogwithdrafts
```

Open <http://localhost:4000/writing/my-new-piece/> for your new draft, or <http://localhost:4000/#writing> for its automatic homepage entry. On this computer, the example is at <http://localhost:4000/writing/a-small-beginning/>.

Saved changes rebuild automatically; refresh the browser to see them. Stop the server with Control-C. If a preview is already running, use it or stop it before starting another on the same port.

The preview labels drafts as “Draft preview.” A draft's displayed date comes from its file modification time. Published posts use the date in their filename.

### 3. Make the draft ready to publish

Move it to `_posts/`, adding today's date to the filename:

```sh
blogpromote my-new-piece
```

This works from any directory and moves `_drafts/my-new-piece.md` to `_posts/YYYY-MM-DD-my-new-piece.md`. You can also pass `my-new-piece.md` or `_drafts/my-new-piece.md`. Use lowercase letters, numbers, and hyphens in draft names. The command refuses to overwrite an existing post and prints its new filename. Publish it using your usual Git workflow.

For example, a file named `_posts/2026-09-17-my-new-piece.md` produces `/writing/my-new-piece/`. The title in the file controls the displayed heading. The first paragraph becomes the homepage excerpt. The homepage link is generated automatically.

You can use a different publication date in the filename. Jekyll excludes future-dated posts until a build runs after that date; this setup does not schedule builds automatically.

To check exactly what will publish, stop the draft preview with Control-C and run:

```sh
blognodrafts
```

### 4. Publish using your Git workflow

Use your usual Git workflow to review, commit, and push the promoted file in `_posts/` and any new images. GitHub Pages publishes the site when those changes reach `master`.

Watch [the repository's Actions page](https://github.com/cssndrx/cssndrx.github.io/actions) for the build to finish, then open `https://cassandraxia.com/writing/my-new-piece/`.

For later edits, change the same Markdown file and publish it through your Git workflow again. Keep its filename to keep the same URL. Generated `_site/` files and installed dependencies are ignored by Git.

Brevo checks the published feed daily at 9 a.m. Eastern and automatically emails new posts to confirmed subscribers (one-time setup below). The email uses the post's title, `description` (or opening paragraph), optional preview image, and a link back to the article. You do not need to write a separate newsletter. Keep the post's filename/URL stable when editing so it retains the same identity in the feed.

## Shortcut reference

| Shortcut | What it does |
| --- | --- |
| `blog` | Switch to the website repository. |
| `blognew <slug>` | Create `_drafts/<slug>.md` with an editable title and Markdown template. |
| `blogwithdrafts` | Preview the site with drafts at <http://localhost:4000/>. |
| `blognodrafts` | Preview the site with drafts excluded, as it will publish. |
| `blogpromote <draft-name>` | Move a draft into `_posts/` with today's date. |

The shortcuts work from any directory. `blogwithdrafts` runs `sh bin/preview` with `JEKYLL_PREVIEW_DRAFTS=true`; `blognodrafts` uses `JEKYLL_PREVIEW_DRAFTS=false`. The preview script uses this computer's project-local Bundler when available.

## One-time setup

### 1. Install local dependencies

**Already done on this computer.** On a fresh checkout, install Python 3 (for `blognew`), Ruby, and Bundler, then run these commands from the repository folder:

```sh
cd "$HOME/Google Drive/GitHub/cssndrx.github.io"
bundle config set --local path vendor/bundle
bundle install
```

If the Mac's bundled Ruby causes installation trouble, use a maintained Ruby installation as described in the [Jekyll macOS setup guide](https://jekyllrb.com/docs/installation/macos/). GitHub builds the public site itself; readers need nothing installed.

### 2. Add shell shortcuts

The following block is also installed in `~/.zshrc` on this computer. On another computer, add it there once, adjusting the repository path if needed:

```zsh
# >>> cassandraxia.com blog shortcuts >>>
alias blog='cd "$HOME/Google Drive/GitHub/cssndrx.github.io"'
alias blognew='python3 "$HOME/Google Drive/GitHub/cssndrx.github.io/bin/new"'
alias blogwithdrafts='JEKYLL_PREVIEW_DRAFTS=true sh "$HOME/Google Drive/GitHub/cssndrx.github.io/bin/preview"'
alias blognodrafts='JEKYLL_PREVIEW_DRAFTS=false sh "$HOME/Google Drive/GitHub/cssndrx.github.io/bin/preview"'
alias blogpromote='sh "$HOME/Google Drive/GitHub/cssndrx.github.io/bin/promote"'
# <<< cassandraxia.com blog shortcuts <<<
```

Open a new terminal, or load the shortcuts into an existing terminal once:

```sh
source ~/.zshrc
```

### 3. Publish the Jekyll setup once

**Do this once before publishing your first Markdown post.** Use your usual Git workflow to commit and publish the Jekyll setup: `.gitignore`, `_config.yml`, `Gemfile`, `Gemfile.lock`, `_layouts/`, `_posts/.gitkeep`, `bin/`, `writing/post.css`, and `index.html`.

GitHub Pages is configured to build the root of this repository's `master` branch and serve it at <https://cassandraxia.com/>.

Drafts are ignored by Git and excluded from public site builds. The shell shortcuts in `~/.zshrc` stay on your computer.

### 4. Connect Brevo for email subscriptions

**Site configured:** `brevo_form_url` in `_config.yml` connects the footer signup to the Brevo form **Cassandra Xia - Blog signup** and its **Blog readers** list. This is a public form URL; no password or API key belongs in the repository. Restart a running Jekyll preview after changing the config. The signup form is hidden when this value is empty.

The signup appears at the bottom of each blog post, including the six existing HTML articles, and is omitted from the homepage. Both the Markdown post layout and existing articles use `_includes/subscribe.html`, so edits apply everywhere. The form uses Brevo's Simple HTML field names, a honeypot, and email confirmation. Readers enter an email address and confirm via their inbox; they do not need an RSS reader. Subscriber addresses stay in Brevo, outside this repository.

Publish `_config.yml`, `_includes/subscribe.html`, `writing/subscribe.css`, and `feed.xml` through your usual Git workflow to put this switch on the live site. Keep this README, `AGENTS.md`, and `_drafts/` local and ignored. Do not force-add them.

The feed at <https://cassandraxia.com/feed.xml> includes only published Markdown posts in `_posts/`. Drafts, future-dated posts, and `published: false` posts stay out even in a draft preview. Existing hand-written HTML articles are not added to the feed. An empty feed is expected until the first Markdown post is published.

In [Brevo's integrations](https://app.brevo.com/app-store/manage-integrations), **Cassandra Xia New Writing** is configured with:

- Feed: `https://cassandraxia.com/feed.xml`.
- Recipients: **Blog readers**, populated by the signup form after double confirmation.
- Schedule: every day at **09:00 America/New_York**, automatically send when new items appear.
- Sender name and subject: **Cassandra Xia** / **New writing from Cassandra Xia**.
- Email: title, date, optional preview image, short preview, and a **Read more** link for each new post, plus unsubscribe and Brevo's free-plan branding.

Allow an hour between publishing a post and the daily check; later posts may wait until the next day's email. Brevo sends only when there are new items, with up to ten posts in one email. Keep post URLs stable when editing. Publishing remains the same Markdown + Git workflow; there is no separate newsletter to write.

The selected sender is `cssndrx@gmail.com`. Brevo reports that it replaces the sending domain with `@brevosend.com` because Gmail cannot be authenticated as your own domain. A sender on an authenticated domain can be configured later if desired.

Brevo's Free plan allows **300 email deliveries per day**, shared across campaigns and confirmation/test emails, and includes Brevo branding. One newsletter delivered to 100 people uses 100 sends. If a campaign exceeds the remaining daily allowance, it needs to be requeued on another day; unused daily sends do not roll over. Revisit this limit before the list approaches 300 subscribers.

For a one-time delivery check, subscribe with your own address, click the confirmation link, and use the saved email template's **Preview & test**. This does not require publishing a dummy blog post. A browser preview verifies the design but cannot prove inbox delivery.

The RSS email template repeats `params.items`, uses `item.TITLE`, `item.PUBDATE`, and `item.LINK`, and renders `item.CONTENT_ENCODED | safe` with `item.DESCRIPTION | safe` as a fallback. The feed supplies escaped preview HTML, including an image only when the post has one. Retain Brevo's unsubscribe link when editing the template.

Official guides: [RSS campaign setup](https://help.brevo.com/hc/en-us/articles/360013130059-RSS-Campaign-integration-Automatically-share-your-blog-posts-with-your-subscribers), [signup forms](https://help.brevo.com/hc/en-us/articles/208771869-Create-a-sign-up-form-in-Brevo), and [Free plan limits](https://help.brevo.com/hc/en-us/articles/208580669-FAQs-What-are-the-limits-of-the-Free-plan).
