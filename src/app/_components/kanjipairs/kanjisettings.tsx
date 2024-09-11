import { KanjiCardAction, KanjiCardActionType } from "@/interfaces/kanjipairs/kanjicardaction";
import { KanjiCardShuffleOption } from "@/interfaces/kanjipairs/kanjicardshuffleoption"
import { Dispatch, useCallback } from "react";
import Button from "./button";
import { flipBackTimerOptions } from "@/interfaces/kanjipairs/flipBackTimerOptions";

const autoShuffleOptions = [
    { value: KanjiCardShuffleOption.Off, label: "Auto-shuffle off" },
    { value: KanjiCardShuffleOption.FailedMatch, label: "Shuffle after each failed match" },
]

const AUTO_SHUFFLE = "auto-shuffle";
const FAILED_MATCH_FLIP_BACK_TIMEOUT = "failed-match-flip-back-timeout";

type Props = {
    shuffleSetting: KanjiCardShuffleOption;
    flipBackTimeout: number,
    showSettings: boolean;
    dispatch: Dispatch<KanjiCardAction>;
}

export default function KanjiSettings({ shuffleSetting, flipBackTimeout, showSettings, dispatch }: Props) {
    const baseClass = "absolute top-0 left-0 overflow-auto dark:bg-slate-900 bg-white";
    const shadowClass = "shadow-[5px_5px_10px] shadow-gray-800 dark:shadow-gray-400";
    const displayClass = showSettings ? "" : "hidden";
    const fullClass = `${baseClass} ${shadowClass} ${displayClass}`;

    const handleShuffleChange = useCallback((value: string) => (
        dispatch({ type: KanjiCardActionType.ChangeShuffleSetting, value: value })
    ), []);

    const handleTimeoutChange = useCallback((value: string) => {
        dispatch({ type: KanjiCardActionType.SetFlipBackTimeout, value: value });
    }, []);

    const handleSettingsHide = useCallback(() => {
        dispatch({ type: KanjiCardActionType.HideSettings, value: "" });
    }, []);

    return (
        <div className={`absolute top-0 left-0 dark:bg-slate-900/50 bg-white/50 w-full h-full ${displayClass}`} onClick={handleSettingsHide}>
            <div className={fullClass} onClick={(e) => e.stopPropagation()}>
                <div className="text-right">
                    <Button label="X" onClick={handleSettingsHide} className="mr-1" />
                </div>
                <div className="px-5 pb-5">
                    <div className="grid grid-cols-1 mt-3">
                        <label className="font-bold" htmlFor={FAILED_MATCH_FLIP_BACK_TIMEOUT}>
                            <p>Failed match flip back timeout (seconds):</p>
                            <p>{flipBackTimeout.toLocaleString(undefined, { minimumFractionDigits: 1 })}</p>
                        </label>
                        <input type="range" min={flipBackTimerOptions.MIN} max={flipBackTimerOptions.MAX}
                        step={flipBackTimerOptions.STEP} value={flipBackTimeout} id={FAILED_MATCH_FLIP_BACK_TIMEOUT}
                        onChange={(e) => handleTimeoutChange(e.currentTarget.value)} />
                    </div>
                    <div className="mb-5">
                        <p className="font-bold">Auto-Shuffle settings</p>
                        {autoShuffleOptions.map((entry) => (
                            <div key={entry.value}>
                                <input type="radio" id={`${AUTO_SHUFFLE}-${entry.value.toLowerCase()}`} 
                                name={AUTO_SHUFFLE} value={entry.value}
                                checked={shuffleSetting == entry.value}
                                onChange={() => handleShuffleChange(entry.value)} />
                                <label className="pl-5" htmlFor={`${AUTO_SHUFFLE}-${entry.value.toLowerCase()}`}>{entry.label}</label>
                            </div>
                        ))}
                    </div>
                    <div className="text-right">
                        <Button label="Close" onClick={handleSettingsHide} className="mr-0" />
                    </div>
                </div>
            </div>
        </div>
    )
}