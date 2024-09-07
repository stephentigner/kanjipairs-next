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

'use client'

const globalKeyPrefix = "kanjipairs";

const localStorageSupported = () => {
    try {
        return ('localStorage' in window && window['localStorage'] !== null);
    }
    catch {
        return false;
    }
}

const saveSetting = (settingName: string, settingValue: string) => {
    if (localStorageSupported()) {
        return localStorage.setItem(settingName, settingValue);
    }
}

const getSetting = (settingName: string) => {
    if (localStorageSupported()) {
        return localStorage.getItem(settingName);
    }
    else {
        return undefined;
    }
}

const filterSettingKey = (filterName: string) => `${globalKeyPrefix}-filter:${filterName}`;

const saveFilterSet = (filterName: string, filterArray: Set<number>) => {
    if (localStorageSupported()) {
        const settingKey = filterSettingKey(filterName);
        const serializedSet = JSON.stringify([...filterArray.values()]);
        saveSetting(settingKey, serializedSet);
    }
}

const loadFilterSet = (filterName: string) => {
    if (localStorageSupported()) {
        const settingKey = filterSettingKey(filterName);
        const savedValue = getSetting(settingKey);
        try {
            const parsedFilterArray = JSON.parse(savedValue ?? "[]")
            return new Set<number>(parsedFilterArray);
        }
        catch {
            return new Set<number>();
        }
    }
    return new Set<number>();
}

export { saveFilterSet, loadFilterSet };
