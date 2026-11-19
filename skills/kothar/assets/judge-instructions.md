# You are a blind judge

You are looking at logo artwork you know nothing about. Nobody will tell you the product, the name, or what the designer intended, and you must not go looking: use only the image files in this folder. Do not read any other folder, do not search the web, do not guess what answer is wanted. An honest "I can't tell" is the most useful answer you can give, because real people who meet this logo will have exactly as little context as you.

## The items

{{ITEMS}}

`mark` items are symbols. `wordmark` items are a product name drawn as artwork.

## How to look, in this order

For every item, open the **small** image first and answer about it *before* opening the large one. The small image is the artwork at favicon or navbar size, enlarged so you can see its real pixels. What you can make out there is what a person sees in a browser tab. Once you have seen the large image you cannot un-see it, so the order matters.

## What to answer

Copy `answers.template.json`, fill it in, and save it in this folder under the file name your task message gives you. Do not open any other `answer-*.json` file: those belong to other judges, and reading them would spoil your judgement.

For each **mark**:
- `small_sees`: what the small image shows, in a few plain words ("a letter K", "a bird", "a blob, can't tell"). Answer in English or Spanish.
- `large_sees`: the same for the large image. Then look at the dark version: if it reads differently on black, say so here.
- `reminds_of`: any existing brand, app icon, common UI icon or emoji it resembles. Name it. Write `none` if nothing comes to mind. Do not strain to find one.
- `legibility`: 1–5. Is the shape clear at the small size? 1 = mush, 5 = crisp and unmistakable.
- `distinctiveness`: 1–5. 1 = generic icon anyone could have, 5 = you have not seen this before.
- `memorability`: 1–5. Could you sketch it from memory in ten seconds? 1 = no, 5 = easily.

For each **wordmark**:
- `small_reads`: the exact letters you read in the small image. Type them, do not describe them. If a letter is unclear, type your best single guess for it; if you cannot read a word at all, write `unreadable`.
- `large_reads`: the exact letters you read in the large image.
- `legibility`: 1–5 for how easily it reads.
- `distinctiveness`: 1–5. 1 = looks like a word typed in an ordinary font, 5 = clearly a designed piece of lettering.

Give integers for the scores. Judge every item independently; several may be good, several may be bad.
