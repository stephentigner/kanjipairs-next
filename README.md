# Kanji Pairs

**A concentration-style matching game. Match kanji by paired readings.**

This is a small game written in TypeScript using Next.js (and thus React).

This is a re-write of my previous Kanji Pairs game.

This app uses a trimmed-down JS object based on the the KANJIDIC2 XML file for its datasource.
This file is Copyright the [Electronic Dictionary Research and Development Group](https://www.edrdg.org/edrdg/licence.html) and is licensed under a [Creative Commons Attribution-ShareAlike License (V3.0)](https://creativecommons.org/licenses/by-sa/3.0/).

The file itself is available from the [KANJIDIC project page](https://www.edrdg.org/wiki/index.php/KANJIDIC_Project).
The version I am using is also available in the kanjidic2 directory/folder.

## Setup and run locally
1. Clone the repository
2. cd into cloned repo directory
3. run `npm install` (or `pnpm install` if you prefer `pnpm`) to install dependencies
4. you have a couple of options for running it now
    * use `npm run dev` (or `pnpm run dev`) to run in dev mode
    * for a production mode
        1. use `npm run build` (or `pnpm run build`) to create a production build
        2. then `npm start` (or `pnpm start`) to run it
5. Either way, unless you have something else already running on that port, the app should now be running locally on port 3000
    * If http://localhost:3000 does not work, check the messages output to the console to see what port it is running on

## How to play
* Click on the kanji one at a time to "flip over" the cards
* As the card is flipped over a randomly chosen reading (on or kun) will be shown
* Once a pair of cards is flipped over, one of two things will happen
    1. If the readings of those two cards match, then both "sides" of the card become visible and those cards are no longer clickable
    2. If the readings of those two cards don't match, then the cards are flipped over after a small delay

