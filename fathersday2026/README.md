# Father's Day Problem

A little static website: Dad clicks each math problem, and every correct answer
uncovers another piece of a secret picture. Solve them all → the whole picture
is revealed.

## How to open it
Just **double-click `index.html`** — it opens in any web browser. No internet or
install needed (an internet connection only makes the fonts prettier).

## Add the secret picture
Save your image **in this folder** and name it **`secret.png`**.
(To use a different filename, change `secretImage` near the top of `config.js`.)

## Change the questions & answers — edit `config.js` only
Open `config.js` in any text editor. You'll see each problem with its question
and an `answers` list. Change the text inside the quotes.

```js
answers: ["13"],                       // accepts: 13
answers: ["300", "300 m", "300 meters"] // any of these spellings count
```

- Answers are **not** case-sensitive ("Thirteen" = "thirteen").
- For number answers you can instead allow a little wiggle room:
  ```js
  numericValue: 2.4, tolerance: 0.05   // 2.35–2.45 all count as correct
  ```
- A problem can ask more than one thing — see Problem 1 (it has two answer boxes).
  Both must be right to reveal that problem's piece.

### ⚠️ The answers are placeholders right now
For testing, the answers are `ANSWER_1A`, `ANSWER_1B`, `ANSWER_2`, `ANSWER_3`,
`ANSWER_4`, `ANSWER_5`. Type those exact words to test the reveal. Replace them
with the real answers when ready.

## Other tweaks (all in `config.js`)
- `recipient` — name in the title ("Happy Father's Day, Dad!")
- `finishedMessage` — the message shown when the picture is fully revealed
- `revealRows` / `revealCols` — how many tiles cover the picture (finer reveal)

## Notes
- Progress is saved in the browser, so closing and reopening keeps it solved.
- The small **"↺ start over"** link at the bottom clears progress and re-hides
  the picture.
