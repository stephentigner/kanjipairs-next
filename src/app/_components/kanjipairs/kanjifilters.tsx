import { KanjiCardAction, KanjiCardActionType } from "@/interfaces/kanjipairs/kanjicardaction";
import { Dispatch, useCallback } from "react";

type Props = {
    gradeLevelFilters: Set<number>;
    jlptLevelFilters: Set<number>;
    dispatch: Dispatch<KanjiCardAction>;
};

const gradeLevels = [
    { level: 1, label: "First Grade (Jouyou Kanji)" },
    { level: 2, label: "Second Grade (Jouyou Kanji)" },
    { level: 3, label: "Third Grade (Jouyou Kanji)" },
    { level: 4, label: "Fourth Grade (Jouyou Kanji)" },
    { level: 5, label: "Fifth Grade (Jouyou Kanji)" },
    { level: 6, label: "Sixth Grade (Jouyou Kanji)" },
    { level: 8, label: "Junior High/Middle School (Jouyou Kanji)" },
    { level: 9, label: "For use in names (Jinmeiyou Kanji - Set 1)" },
    { level: 10, label: "For use in names (Jinmeiyou Kanji - Set 2)" },
    { level: 0, label: "Grade Not Specified" },
]

const jlptLevels = [
    { level: 1, label: "JLPT Level 1" },
    { level: 2, label: "JLPT Level 2" },
    { level: 3, label: "JLPT Level 3" },
    { level: 4, label: "JLPT Level 4" },
    { level: 0, label: "JLPT Level Not Specified" },
]

export default function KanjiFilters({ gradeLevelFilters, jlptLevelFilters, dispatch }: Props) {
    const handleCheck = useCallback((checkName: string, level: number) => {
        dispatch({ type: KanjiCardActionType.ToggleLevelFilter, value: checkName, numberValue: level });
    }, []);

    return (
        <div>
            <div className="">
                <div className="mb-5">
                    These filters are not mutually exclusive. <br />
                    It's possible to select a filter set that has no kanji. <br />
                    If you get no cards after hitting "New Set", try different filters. <br />
                </div>
            </div>

            <div className="">
                <div className="mb-5">
                    Check one or more grades to filter the next set by. <br />
                    These are (mostly) the grade/year in school in which <br />
                    the kanji is taught in the Japanese educational system. <br />
                    If none are checked, no filtering by grade level will be done. <br />
                </div>
                <div className="my-5">
                    {gradeLevels.map(({level, label}) => (
                        <div key={label}>
                            <input type="checkbox" id={`grade-level-${level}`}
                            name="grade-level" value={level}
                            checked={gradeLevelFilters.has(level)}
                            onChange={
                                () => handleCheck("grade-level", level)
                            } />
                            <label className="pl-5" htmlFor={`grade-level-${level}`}>{label}</label>
                        </div>
                    ))}
                </div>
                <div className="my-5">
                    <input type="button" value="New Set" className="mr-5" />
                    <input type="button" value="Shuffle" className="mr-5" />
                </div>
            </div>
            <div className="">
                <div className="mb-5">
                    Check one or more JLPT levels to filter the next set by. <br />
                    These are the original JLPT levels, not the new "N" levels. <br />
                    There are no publicly available official lists of kanji for <br />
                    the new levels. (At least not at the time this dataset was <br />
                    created.) <br />
                    If none are checked, no filtering by JLPT level will be done. <br />
                </div>
                <div className="my-5" kanjipairs-control="jlpt-filter">
                    {jlptLevels.map(({ level, label }) => (
                        <div key={label}>
                            <input type="checkbox" id={`jlpt-level-${level}`}
                            name="jlpt-level" value={level}
                            checked={jlptLevelFilters.has(level)}
                            onChange={
                                () => handleCheck("jlpt-level", level)
                            } />
                            <label className="pl-5" htmlFor={`jlpt-level-${level}`}>{label}</label>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}