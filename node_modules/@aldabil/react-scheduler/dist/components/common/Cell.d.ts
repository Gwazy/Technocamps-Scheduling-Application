/// <reference types="react" />
interface CellProps {
    start: Date;
    end: Date;
    resourceKey: string;
    resourceVal: string | number;
    children?: JSX.Element;
}
declare const Cell: ({ start, end, resourceKey, resourceVal, children, }: CellProps) => JSX.Element;
export { Cell };
