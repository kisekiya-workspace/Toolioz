export interface Column {
    name: string;
    type: string;
}

export interface TableSchema {
    name: string;
    columns: Column[];
}
