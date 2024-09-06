type Props = {
    value: string;
    onClick?: () => void;
    className?: string;
}

export default function Button({ value, onClick, className }: Props) {
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
