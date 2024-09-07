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

type Props = {
    label: string;
    onClick?: () => void;
    className?: string;
}

export default function Button({ label: value, onClick, className }: Props) {
    const baseClass = "mr-5 px-5 py-1 bg-blue-800 text-white flex-col content-start";
    const shadowClass = "shadow-[5px_5px_10px] shadow-gray-800 dark:shadow-gray-400";
    const activeClass = "active:bg-blue-600"

    const fullClass = `${baseClass} ${shadowClass} ${activeClass} ${className}`;

    return (
        <button onClick={onClick} className={fullClass}>
            {value}
        </button>
    )
}
