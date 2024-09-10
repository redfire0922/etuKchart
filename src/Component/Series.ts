module zsaltec.KChart {
    export class CompactSeries {
        public static DATETIME_FIELD: string = "DATETIME";
        public static OPEN_FIELD: string = "OPEN";
        public static HIGH_FIELD: string = "HIGH";
        public static LOW_FIELD: string = "LOW";
        public static CLOSE_FIELD: string = "CLOSE";
        public static VOLUME_FIELD: string = "VOL";
        public static AMOUNT_FIELD: string = "AMOUNT";

        public Chart: StockChartView;
        public MinValidIndex: number;
        public FullDataComplete: boolean;
        public Columns: SeriesColumnCollection;
        public Rows: SeriesRowCollection;

        constructor(chart: StockChartView) {
            this.Columns = new SeriesColumnCollection(this);
            this.Rows = new SeriesRowCollection(this);

            this.MinValidIndex = 0;
            this.Chart = chart;
        }

        public CreateNewRow(): SeriesRow {
            for (var i: number = 0; i < this.Columns.length; i++) {
                let column = this.Columns.Get(i);
                column.AddValue(null);
            }

            var row: SeriesRow = new SeriesRow(this, this.Rows.length - 1);
            return row;
        }
        public InsertNewRow(index: number): SeriesRow {
            for (var i: number = 0; i < this.Columns.length; i++) {
                let column = this.Columns.Get(i);
                column.InsertAt(index, 0);
            }
            var row: SeriesRow = new SeriesRow(this, index);
            return row;
        }
        public RemoveRow(index: number): void {
            for (var i: number = 0; i < this.Columns.length; i++) {
                let column = this.Columns.Get(i);
                column.RemoveAt(index);
            }
        }
        public Clear(): void {
            for (var i: number = 0; i < this.Columns.length; i++) {
                let column = this.Columns.Get(i);
                column.Clear();
            }
            this.FullDataComplete = false;
        }
    }

    export class SeriesRowCollection {
        private _series: CompactSeries;
        private _count: number;
        public Get(index: number): SeriesRow {
            var row: SeriesRow = new SeriesRow(this._series, index);
            return row;
        }
        public get length(): number {
            if (this._series.Columns.length <= 0) return 0;

            return this._series.Columns.Get(0).length;
        }

        constructor(series: CompactSeries) {
            this._series = series;
        }
    }

    export class SeriesColumnCollection {
        private _columnMap: {};
        private _columns: SeriesColumn[];
        private _series: CompactSeries;
        public get length(): number {
            return this._columns.length;
        }
        public Get(key: string | number): SeriesColumn { 
            if (typeof key == 'number') { 
                if (key >= this._columns.length)
                    throw new Error('列索引值超过最大');
                let col = this._columns[key];
                return col;
            }
            let col = this._columnMap[key];
            if (Utils.isNull(col))
                throw new Error('未知的列名称:' + key);
            return col;
        }

        constructor(series: CompactSeries) {
            this._series = series;
            this._columns = [];
            this._columnMap = {};
        }
        public Add(columnName: string): void { 

            var column = new SeriesColumn(columnName);
            if (this._columns.length > 0) {
                for (var i: number = 0; i < this._columns[0].length; i++) {
                    column.AddValue(0.0);
                }
            }
            this._columnMap[columnName] = column; 
            this._columns.push(column);
        }

        public Remove(columnName: string): void {
            var column = this._columnMap[columnName];
            delete this._columnMap[columnName];
             
            Utils.remove(this._columns, column);
        }

        public ContainsKey(columnName: string): boolean {
            return this._columnMap[columnName] != null;
        }
    }

    export class SeriesRow {
        private _series: CompactSeries;
        private _curP: number;
        public get RowIndex(): number {
            return this._curP;
        }
        public set RowIndex(value: number) {
            this._curP = value;
        }
        public Get(key: string | number, value: any): any {
            return this._series.Columns.Get(key).GetValue(this._curP);
        }
        public Set(key: string | number, value: any): void {
            this._series.Columns.Get(key).SetValue(this._curP, value);
        }

        constructor(series: CompactSeries, rowIndex: number) {
            this._curP = rowIndex;
            this._series = series;
        }

        public Dispose(): void {
            this._series = null;
        }

        public MoveNext(): boolean {
            this._curP++;
            return this._curP < this._series.Rows.length;
        }
        public Reset(): void {
            this._curP = -1;
        }
    }

    export class SeriesColumn {
        private _columnName: string;
        private _compactHeap: any[];
        public get ColumnName(): string {
            return this._columnName;
        }
        public set ColumnName(value: string) {
            this._columnName = value;
        }
        public get length(): number {
            return this._compactHeap.length;
        }
        constructor(columnName: string) {
            this._columnName = columnName;
            this._compactHeap = [];
        }
        public FindSortedValue(v: number): number {
            for (var m: number = 0, n = this.length - 1; m < n;) {
                if (n - m <= 1) {
                    if (v == this.GetValue(m)) {
                        return m;
                    }
                    else if (v == this.GetValue(n)) {
                        return n;
                    }
                    else {
                        return -1;
                    }
                }
                else {
                    var idx: number = (n - m) / 2 + m;
                    var tmp: number = this.GetValue(idx);
                    if (v > tmp) {
                        n = idx;
                    }
                    else if (v < tmp) {
                        m = idx;
                    }
                    else {
                        return idx;
                    }
                }
            }
            return -1;
        }

        public Clear(): void {
            this._compactHeap = [];
        }
        public SetValue(index: number, t: any): void {
            if (index > this._compactHeap.length - 1)
                throw new Error("索引超出最大值");
            this._compactHeap[index] = t;
        }
        public GetValue(index: number): any {
            if (index > this._compactHeap.length - 1)
                throw new Error("索引超出最大值");
            return this._compactHeap[index];
        }

        public GetNumberValue(index: number): number {
            let v = this.GetValue(index);
            if (typeof v === "number")
                return <number>v;
            else
                return undefined;
        }
        public AddValue(t: any): void {
            this._compactHeap.push(t);
        }

        public RemoveAt(index: number): void {
            this._compactHeap.splice(index);
        }

        public InsertAt(index: number, t: any): void {
            if (index >= 0) {
                this._compactHeap.splice(index, 0, t);
            }
        }
    }
}