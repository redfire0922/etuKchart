namespace zsaltec.KChart {
    export class EnumBaseFieldName {
        public static DATETIME_FIELD: string = "DATETIME";
        public static OPEN_FIELD: string = "OPEN";
        public static HIGH_FIELD: string = "HIGH";
        public static LOW_FIELD: string = "LOW";
        public static CLOSE_FIELD: string = "CLOSE";
        public static VOLUME_FIELD: string = "VOL";
        public static AMOUNT_FIELD: string = "AMOUNT";
    }



    export class CompactSeries implements IChartSeries {

        public Chart: KChartView;
        //public MinValidIndex: number;

        public LoadComplete: boolean = false;
        private _columns: SeriesColumnCollection;

        public get RowCount() {
            return this._columns.Get(EnumBaseFieldName.DATETIME_FIELD).length;
        }

        constructor(chart: KChartView) {
            this._columns = new SeriesColumnCollection();

            //this.MinValidIndex = 0;
            this.Chart = chart;
        }
        public GetRow(index: number | Date): ChartDataRow {
            if (Utils.isNull(index)) index = 0;
            if (typeof index == 'number') {
                if (newidx < 0) return null;
                return new ChartDataRow(<any>this, index);
            } else {
                var date: Date = <Date>index;
                var newidx: number = this.GetColumn(EnumBaseFieldName.DATETIME_FIELD).IndexOf(date);
                return this.GetRow(newidx);
            }
        }

        public AddNewRow(): ChartDataRow {
            const index = this.RowCount;
            return this.InsertNewRow(index);
        }
        public InsertNewRow(index: number): ChartDataRow {
            for (var i: number = 0; i < this._columns.length; i++) {
                let column = this._columns.Get(i);
                column.InsertAt(index, null);
            }
            var row: ChartDataRow = new ChartDataRow(<IChartSeries><unknown>this, index);
            return row;
        }
        public RemoveRow(index: number): void {
            for (var i: number = 0; i < this._columns.length; i++) {
                let column = this._columns.Get(i);
                column.RemoveAt(index);
            }
        }
        public Clear(): void {
            for (var i: number = 0; i < this._columns.length; i++) {
                let column = this._columns.Get(i);
                column.Clear();
            }
            this.LoadComplete = false;
        }
        public Reset(): void {
            this._columns = new SeriesColumnCollection();
            this.LoadComplete = false;
        }


        public GetColumn(columnName: string | number): IChartSeriesColumn {
            return this._columns.Get(columnName);
        }

        public AddColumn(columnN: string | IChartSeriesColumn): void {
            if (typeof columnN == 'string') {
                if (columnN == EnumBaseFieldName.DATETIME_FIELD) {
                    const column = new DateCompactColumn(columnN);
                    column.series = this;
                    this._columns.Add(column);
                }

                else {
                    const column = new CompactColumn(columnN);
                    column.series = this;
                    this._columns.Add(column);
                }
            } else {
                const column: IChartSeriesColumn = <IChartSeriesColumn>columnN;
                column.series = this;
                this._columns.Add(column);
            }
        }


        // public Foreach(vector: (row: ChartDataRow) => void): void {
        //     const row = new ChartDataRow(<IChartSeries><unknown>this, 0);
        //     for (var i: number = 0; i < this.RowCount; i++) {
        //         row.RowIndex = i;
        //         vector(row);
        //     }
        // }
    }

    export class ChartDataRow {
        private _series: IChartSeries;
        public RowIndex: number;
        public Get(key: string | number): any {
            return this._series.GetColumn(key).GetValue(this.RowIndex);
        }
        public Set(key: string | number, value: any): void {
            this._series.GetColumn(key).SetValue(this.RowIndex, value);
        }

        constructor(series: IChartSeries, rowIndex: number) {
            this.RowIndex = rowIndex;
            this._series = series;
        }
    }

    export class CompactColumn implements IChartSeriesColumn {
        private _columnName: string;
        private _compactHeap: any[];
        public series: IChartSeries;
        public get ColumnName(): string {
            return this._columnName;
        }
        public get length(): number {
            return this._compactHeap.length;
        }
        constructor(columnName: string) {
            this._columnName = columnName;
            this._compactHeap = [];
        }
        public IndexOf(v: any): number {
            throw new Error("Not Implemented");
        }

        public Clear(): void {
            this._compactHeap = [];
        }
        public SetValue(index: number, value: any): void {
            if (index > this._compactHeap.length - 1)
                throw new Error("索引超出最大值");
            this._compactHeap[index] = value;
        }
        public GetValue(index: number): any {
            if (index < 0 || index > this._compactHeap.length - 1)
                return null;
            return this._compactHeap[index];
        }

        public RemoveAt(index: number): void {
            this._compactHeap.splice(index);
        }

        public InsertAt(index: number, v: any): void {
            if (index >= 0) {
                for (var i = this._compactHeap.length; i < index; i++)
                    this._compactHeap.push(null);
                this._compactHeap.splice(index, 0, v);
            }
        }
    }


    export class DateCompactColumn extends CompactColumn {

        public IndexOf(v: any): number {
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
    }


    class SeriesColumnCollection {
        private _columnMap: {};
        private _columns: IChartSeriesColumn[];
        public get length(): number {
            return this._columns.length;
        }
        public Get(key: string | number): IChartSeriesColumn {
            if (typeof key == 'number') {
                if (key < 0 || key >= this._columns.length)
                    throw new Error('列索引值超过最大');
                let col = this._columns[key];
                return col;
            } else {
                let col = this._columnMap[key];
                if (Utils.isNull(col))
                    throw new Error('未知的列名称:' + key);
                return col;
            }
        }

        constructor() {
            this._columns = [];
            this._columnMap = {};
        }
        public Add(column: IChartSeriesColumn): void {
            if (this.ContainsKey(column.ColumnName))
                throw new Error('列' + column.ColumnName + '已存在');

            this._columnMap[column.ColumnName] = column;
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
}