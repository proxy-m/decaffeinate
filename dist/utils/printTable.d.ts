export interface Column {
    id: string;
    align: 'left' | 'right';
}
export interface Table {
    rows: Array<Array<string>>;
    columns: Array<Column>;
}
export default function printTable(table: Table, buffer?: string): string;
