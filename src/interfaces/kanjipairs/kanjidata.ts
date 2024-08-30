export type KanjiReading = {
    readingType: string;
    readingText: string;
}

export type KanjiMetadata = {
    grade: string;
    strokeCount: string;
    frequency: string;
    radicalNames: string[];
    jlpt: string;
}

export type KanjiDataEntry = {
    literal: string;
    readings: Array<KanjiReading>;
    nameReadings: Array<KanjiReading>;
    miscMetaData: KanjiMetadata;
};

export type KanjiDataset = Array<KanjiDataEntry>;
