enum KanjiCardShuffleOption {
    Off = "OFF",
    FailedMatch = "FAILED_MATCH"
}

const DEFAULT_SHUFFLE_OPTION = KanjiCardShuffleOption.FailedMatch;

const shuffleOptionMap = new Map<string, KanjiCardShuffleOption>(Object.values(KanjiCardShuffleOption).map((v) => [v, v]));

const parseShuffleOption = (shuffleOption: string) => {
    return shuffleOptionMap.get(shuffleOption);
}

export { KanjiCardShuffleOption, parseShuffleOption, DEFAULT_SHUFFLE_OPTION };
