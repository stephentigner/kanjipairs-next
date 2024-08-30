/*
    Copyright (C) 2024 Stephen Tigner

    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU Affero General Public License as published
    by the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU Affero General Public License for more details.

    You should have received a copy of the GNU Affero General Public License
    along with this program.  If not, see <http://www.gnu.org/licenses/>.
*/

import { KanjiDataset, KanjiReading } from "@/interfaces/kanjipairs/kanjidata"
import { kanjiData } from "./kanjidata";

type ReadingsIndex = Map<string, Array<number>>;
type NormalizationsIndex = Map<number, Map<string, string>>;
type KanjiItem = {
    kanjiIndex: number;
    selectedReading?: string;
}

const NUMBER_OF_CARDS = 40;

//This normalizes all katakana to hiragana; if the string has hiragana, that remains untouched
export const normalizeReading = (readingToNormalize: string) => {
    var hiraganaString = readingToNormalize.replace(/[ァ-ン]/g, function (s) {
        return String.fromCharCode(s.charCodeAt(0) - 0x60);
    });

    return hiraganaString;
}

const indexReadings = (kanjiData: KanjiDataset) => {
    let indexedReadings: ReadingsIndex = new Map<string, Array<number>>();
    let readingNormalizations: NormalizationsIndex = new Map<number, Map<string, string>>();

    //Using array.forEach here because we need both the item and its index in the array
    kanjiData.forEach((currChar, index) => {
        for (const currReading of currChar.readings) {
            let normalizedReading = normalizeReading(currReading.readingText);

            if (!indexedReadings.has(normalizedReading)) {
                indexedReadings.set(normalizedReading, []);
            }
            indexedReadings.get(normalizedReading)!.push(index);

            if (currReading.readingText != normalizedReading) {
                if (!readingNormalizations.has(index)) {
                    readingNormalizations.set(index, new Map<string, string>());
                }
                readingNormalizations.get(index)!.set(normalizedReading, currReading.readingText);
            }
        }
    });

    return {indexedReadings, readingNormalizations};
}

const pruneIndexedReadings = (indexedReadings: ReadingsIndex, minResults: number) => {
    //This function prunes the readings index to only those readings where there are at least minResults
    //that have the same reading
    var prunedReadings = new Map<string, Array<number>>();

    for (const [key, value] of indexedReadings) {
        if (value.length >= minResults) {
            prunedReadings.set(key, value);
        }
    }

    return prunedReadings;
}

const checkForKanji = (kanjiArray: Array<KanjiItem>, kanjiItem: KanjiItem) => {
    return kanjiArray.findIndex((val) => {
        if (typeof val === 'undefined') {
            return false;
        }
        else {
            return val.kanjiIndex == kanjiItem.kanjiIndex;
        }
    }) > -1;
}

const pickRandomReading = (indexedReadings: ReadingsIndex, usedReadings: Array<string>) => {
    const readingKeys = [...indexedReadings.keys()];

    if (usedReadings.length >= indexedReadings.size) {
        return null;
    }
    else {
        //The bit shift (<<) is shorthand that truncates the value to an integer value
        var randomIndex = readingKeys[readingKeys.length * Math.random() << 0];
        usedReadings.push(randomIndex);
        return randomIndex;
    }
}

const pickRandomReadings = (indexedReadings: ReadingsIndex, usedReadings: Array<string>, numberOfReadings: number) => {
    const readingKeys = [...indexedReadings.keys()];
    let readingPicks: Array<string> = [];

    if (numberOfReadings >= readingKeys.length) {
        readingPicks = readingKeys;
    }
    else {
        for (let i = 0; i < numberOfReadings;) {
            //The bit shift (<<) is shorthand that truncates the value to an integer value
            const randomIndex = readingKeys[readingKeys.length * Math.random() << 0];
            if (readingPicks.findIndex((r) => r == randomIndex) === -1) {
                readingPicks.push(randomIndex);
                usedReadings.push(randomIndex);
                i++;
            }
        }
    }

    return readingPicks;
}

const initializeDataset = (kanjiData: KanjiDataset) => {
    const { indexedReadings, readingNormalizations } = indexReadings(kanjiData);
    const prunedReadingIndex = pruneIndexedReadings(indexedReadings, 2);

    return {indexedReadings, readingNormalizations, prunedReadingIndex};
}

const createKanjiSet = (
    indexedReadings: ReadingsIndex, readingNormalizations: NormalizationsIndex,
    numberOfKanji: number, kanjiSetSize: number
) => {
    //Can't produce more kanji than we have in our (possibly filtered) set
    numberOfKanji = (numberOfKanji > kanjiSetSize ? kanjiSetSize : numberOfKanji);

    //Force number of kanji to be an integer
    numberOfKanji = numberOfKanji << 0;

    //Since this is a pairs game, the number of kanji must be an even number. 
    if (numberOfKanji % 2 !== 0) {
        //If not even, subtract one.
        numberOfKanji--;
    }

    //Number of kanji must be at least 2
    if (numberOfKanji < 2) {
        numberOfKanji = 2;
    }

    //sanity check, for when we have an empty filtered set or a filtered set with only one kanji
    if (numberOfKanji > kanjiSetSize) {
        return []; //exit the function w/o creating any kanji
    }


    const usedReadings: Array<string> = [];
    //Grab enough readings for half the number of kanji (as each pair of kanji must share a reading)
    let randomReadings = pickRandomReadings(indexedReadings, usedReadings, numberOfKanji / 2);

    let kanjiArray: Array<KanjiItem> = [];

    for (let currentReadingIndex = 0; currentReadingIndex < (numberOfKanji / 2);) {
        //Get random kanji from this loop's reading
        let currReading = randomReadings[currentReadingIndex];
        let currReadingKanjiFull = indexedReadings.get(currReading) ?? [];

        let currReadingKanji = [];

        //Filter out kanji that have already been added
        for (let currKanji of currReadingKanjiFull) {
            if (!checkForKanji(kanjiArray, { kanjiIndex: currKanji })) {
                currReadingKanji.push(currKanji);
            }
        };

        let numKanjiForReading = currReadingKanji.length;

        //Need to make sure there's at least two. Those with only one should have already been pruned off, but this is here just in case
        if (numKanjiForReading >= 2) {
            for (let numKanjiForPair = 0; numKanjiForPair < 2;) {
                let kanjiOkToAdd: boolean;
                let kanjiItem: KanjiItem;

                if (numKanjiForReading === 2) {
                    //If there are only two kanji for the reading, add both of them, one at a time
                    let randomKanji = currReadingKanji[numKanjiForPair];
                    kanjiItem = { kanjiIndex: randomKanji, selectedReading: currReading };
                    kanjiOkToAdd = true;
                }
                else {
                    let randomKanji = currReadingKanji[numKanjiForReading * Math.random() << 0];
                    kanjiItem = { kanjiIndex: randomKanji, selectedReading: currReading };
                    kanjiOkToAdd = (!checkForKanji(kanjiArray, kanjiItem));
                }


                if (kanjiOkToAdd) {
                    if (readingNormalizations.has(kanjiItem.kanjiIndex) && readingNormalizations.get(kanjiItem.kanjiIndex)!.has(kanjiItem.selectedReading!)) {
                        kanjiItem.selectedReading = readingNormalizations.get(kanjiItem.kanjiIndex)?.get(kanjiItem.selectedReading!);
                    }

                    let foundOpenSpot = false;
                    while (!foundOpenSpot) {
                        let randomIndex = numberOfKanji * Math.random() << 0;
                        if (typeof kanjiArray[randomIndex] === 'undefined') {
                            kanjiArray[randomIndex] = kanjiItem;
                            foundOpenSpot = true;
                            numKanjiForPair++;
                        }
                    }
                }
            }
            currentReadingIndex++;
        }
        else {
            //get a different random reading to replace this one
            let newRandomReading = pickRandomReading(indexedReadings, usedReadings);
            if (newRandomReading === null) {
                //we ran out of new readings, continue to the next reading
                currentReadingIndex++;
            }
            else {
                randomReadings[currentReadingIndex] = newRandomReading;
            }
        }
    }

    return kanjiArray;
}

export const newCardSet = () => {
    //TODO: Implement filters to limit set of kanji to be reviewed
    const { indexedReadings, readingNormalizations, prunedReadingIndex} = initializeDataset(kanjiData);
    const kanjiSet = createKanjiSet(indexedReadings, readingNormalizations, NUMBER_OF_CARDS, kanjiData.length);
    return kanjiSet.map((item) => {
        const kanjiCharacter = kanjiData[item.kanjiIndex];
        return {
            reading: item.selectedReading!, kanji: kanjiCharacter.literal,
            active: true, flipped: false, triggerCooldown: false
        };
    });
}