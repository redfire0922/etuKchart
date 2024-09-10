namespace zsaltec.KChart {
    export class DataView {
        public LeftRecordIndex: number;
        public RightRecordIndex: number;
        public RecordWidth: number;

        public PatternWidth: number;
        protected ZoomLevel: number;
        protected DisplayMaxRecordCount: number;
        protected _workAreaWidth: number;
        protected _chart: StockChartView;
        protected _zoomOriginIndex: number = 0;
        protected ScaleMode: TimeScaleMode;
        protected ShowAllData: number;


        public get WorkAreaWidth(): number {
            return this._workAreaWidth;
        }
        public set WorkAreaWidth(value: number) {
            if (this._workAreaWidth != value) {
                this._workAreaWidth = value;
                this.CalcElementWidth();
            }
        }
        public get RecordCount(): number {
            return this._chart.Source.Rows.length;
        }
        public get ZoomOriginIndex(): number {
            return this._zoomOriginIndex;
        }
        public set ZoomOriginIndex(value: number) {
            if (value < this.RightRecordIndex || value > this.LeftRecordIndex - 1) {
                this._zoomOriginIndex = -1;
            }
            else {
                this._zoomOriginIndex = value;
            }
        }

        constructor(chart: StockChartView) {
            this._chart = chart;
            this.PatternWidth = 1;
            this.ZoomLevel = 6;
            this.ShowAllData = -1;
            this.ScaleMode = TimeScaleMode.MarketATimeMode;

        }

        public InitializeComponent() { throw new Error('not implemented'); }
        protected CalcDisplayMaxRecordCount(): void { throw new Error('not implemented'); }
        public Zoomin(): void { throw new Error('not implemented'); }
        public Zoomout(): void { throw new Error('not implemented'); }
        public Pan(n: number): void { throw new Error('not implemented'); }
        public ZoomTo(displayLevel: number): void { throw new Error('not implemented'); }
        public Zoom(left: number, right: number): void { throw new Error('not implemented'); }
        public GetNextLevelCount(): number { throw new Error('not implemented'); }
        public GetRLeft(recordIndex: number): number { throw new Error('not implemented'); }
        public GetRecordIndex(relativeleft: number): number { throw new Error('not implemented'); }
        public CalcElementWidth(): void { throw new Error('not implemented'); }
        public Limit(recordIndex: number, direction: number): number { throw new Error('not implemented'); }
        public ViewUpdating(): void {
            this.CalcDisplayMaxRecordCount();
            this.CalcElementWidth();
            this.CalcDisplayRange();
        }

        protected CalcDisplayRange(): void { throw new Error('not implemented'); }
    }

    export class CandleDataView extends DataView {
        private _viewRanges: number[] = [8, 10, 20, 30, 50, 70, 110, 150, 200, 300, 500, 750, 1000, 1500, 2000, 2500, 3000, 3500, 4000, 4500, 5000, 5500, 6000, 6500, 7500, 8500, 10000, 11500, 13000, 15000, 17000, 20000, 23000, 27000, 31000, 35000, 40000, 45000, 50000, 60000, 70000, 90000, 130000];

        constructor(chart: StockChartView) {
            super(chart);
        }

        public InitializeComponent() {
        }

        public override Zoomin(): void {
            if (this.ZoomLevel == -1) {
                this.ZoomLevel = this.CalcLesserZoominLevel();
                this.ShowAllData = -1;
            }
            else {
                if (this.ShowAllData == 1) {
                    this.ZoomLevel = 0;
                    for (var i: number = this._viewRanges.length - 1; i >= 0; i--) {
                        if (this._viewRanges[i] < this.RecordCount + 3) {
                            this.ZoomLevel = i;
                            break;
                        }
                    }
                    this.ShowAllData = -1;
                }
                else {
                    if (this.ShowAllData == 0) {
                        this.ShowAllData = 1;
                    }
                    else {
                        if (this.ZoomLevel > 0) {
                            this.ZoomLevel--;
                            while (this.ZoomLevel > 0 && this._viewRanges[this.ZoomLevel] > this.RecordCount)
                                this.ZoomLevel--;
                        }
                    }
                }
            }
            this.ViewUpdating();
        }
        public override Zoomout(): void {
            if (this.ZoomLevel == -1) {
                this.ZoomLevel = this.CalcGreaterZoomLevel();
                this.ShowAllData = -1;
            }
            else {
                if (this.ShowAllData >= 0) {
                    if (this._chart.Source.FullDataComplete == false) {
                        this.ZoomLevel = this.CalcGreaterZoomLevel();
                        this.ShowAllData = 1;
                    }
                    else {
                        this.ShowAllData = 0;
                        this.ZoomLevel = this._viewRanges.length - 1;
                        for (var i: number = 0; i < this._viewRanges.length; i++) {
                            if (this._viewRanges[i] > this.RecordCount + 3) {
                                this.ZoomLevel = i;
                                break;
                            }
                        }
                    }
                }
                else {
                    if (this.RecordCount + 3 > this._viewRanges[this.ZoomLevel]) {
                        if (this._viewRanges[this.ZoomLevel + 1] > this.RecordCount) {
                            this.ZoomLevel = this.CalcGreaterZoomLevel();
                            this.ShowAllData = 1;
                        }
                        else {
                            this.ZoomLevel++;
                        }
                    }
                }
            }
            this.ViewUpdating();
        }
        public override Pan(n: number): void {
            if (n > 0) {
                if (this.LeftRecordIndex < this.RecordCount) {
                    var t: number = n;
                    if (this.LeftRecordIndex + n > this.RecordCount) {
                        t = this.RecordCount - this.LeftRecordIndex;
                    }
                    this.LeftRecordIndex += t;
                    this.RightRecordIndex += t;
                }
            }
            else {
                if (this.RightRecordIndex > 0) {
                    var t: number = n;
                    if (this.RightRecordIndex + n < 0) {
                        t = -this.RightRecordIndex;
                    }
                    this.LeftRecordIndex += t;
                    this.RightRecordIndex += t;
                }
            }
        }
        public override ZoomTo(displayLevel: number): void {
            if (displayLevel >= 0 && displayLevel < this._viewRanges.length - 1) {
                this.ZoomLevel = displayLevel;
            }
            this.ViewUpdating();
        }
        public override Zoom(left: number, right: number): void {
            if (this.RecordCount > 0) {
                if (left > this.RecordCount)
                    this.LeftRecordIndex = this.RecordCount;
                else this.LeftRecordIndex = left;
                this.RightRecordIndex = right;
                this.DisplayMaxRecordCount = left - right;
                this.ZoomLevel = -1;
                if (this.DisplayMaxRecordCount < 8) {
                    this.DisplayMaxRecordCount = 8;
                    this.CalcElementWidth();
                    this.CalcDisplayRange();
                }
                else this.CalcElementWidth();
                this.ShowAllData = -1;
            }
        }
        public override GetNextLevelCount(): number {
            if (this.ZoomLevel == -1)
                return this._viewRanges[this.CalcGreaterZoomLevel()];
            else return this._viewRanges[this.ZoomLevel + 1];
        }
        public override GetRLeft(recordIndex: number): number {
            var t: number = this.RecordWidth * (this.LeftRecordIndex - recordIndex - 0.5);
            return t;
        }
        public override GetRecordIndex(relativeleft: number): number {
            if (relativeleft < 0)
                return this.LeftRecordIndex;
            var t: number = this.LeftRecordIndex - 1 - Math.floor(relativeleft / this.RecordWidth);
            return t;
        }
        public override CalcElementWidth(): void {
            if (this.DisplayMaxRecordCount > 0 && this.WorkAreaWidth > 0) {
                this.RecordWidth = (this.WorkAreaWidth / this.DisplayMaxRecordCount);
                if (this.RecordWidth < 5) {
                    this.PatternWidth = 1;
                }
                else if (this.RecordWidth >= 5 && this.RecordWidth < 6) {
                    this.PatternWidth = 3;
                }
                else if (this.RecordWidth >= 6 && this.RecordWidth < 8) {
                    this.PatternWidth = 5;
                }
                if (this.RecordWidth >= 8) {
                    var rwd: number = this.RecordWidth * 0.75;
                    var up: number = this.NextOdd(<number>rwd);
                    var down: number = this.PreOdd(<number>rwd);
                    if (Math.abs(this.RecordWidth / up - 1.33) < Math.abs(this.RecordWidth / down - 1.33) && up < <number>this.RecordWidth)
                        this.PatternWidth = up;
                    else this.PatternWidth = down;
                }
            }
        }
        public override Limit(recordIndex: number, direction: number): number {
            return recordIndex;
        }
        private NextOdd(n: number): number {
            if (n % 2 == 1) {
                return n + 2;
            }
            else return n + 1;
        }
        private PreOdd(n: number): number {
            if (n % 2 == 1) {
                return n;
            }
            else return n - 1;
        }
        protected override CalcDisplayRange(): void {
            if (this.DisplayMaxRecordCount > 0) {
                if (this.ShowAllData == 1 || this.DisplayMaxRecordCount >= this.RecordCount) {
                    this.RightRecordIndex = 0;
                    this.LeftRecordIndex = this.RecordCount;
                }
                else if (this.LeftRecordIndex - this.RightRecordIndex != this.DisplayMaxRecordCount) {
                    if (this.ZoomOriginIndex <= 0) {
                        this.LeftRecordIndex = this.RightRecordIndex + this.DisplayMaxRecordCount;
                        if (this.LeftRecordIndex > this.RecordCount) {
                            this.LeftRecordIndex = this.RecordCount;
                            this.RightRecordIndex = this.LeftRecordIndex - this.DisplayMaxRecordCount;
                        }
                    }
                    else {
                        var bs: number = this.DisplayMaxRecordCount / 2;
                        var tmpright: number = this.ZoomOriginIndex - bs;
                        if (tmpright < 0) {
                            this.RightRecordIndex = 0;
                            this.LeftRecordIndex = this.DisplayMaxRecordCount;
                        }
                        else {
                            this.RightRecordIndex = tmpright;
                            var tmpleft: number = this.RightRecordIndex + this.DisplayMaxRecordCount;
                            if (tmpleft > this.RecordCount) {
                                this.LeftRecordIndex = this.RecordCount;
                                this.RightRecordIndex = this.LeftRecordIndex - this.DisplayMaxRecordCount;
                            }
                            else {
                                this.LeftRecordIndex = tmpleft;
                            }
                        }
                    }
                    if (this.RightRecordIndex == 0) {
                        this.LeftRecordIndex -= 3;
                    }
                }
            }
        }
        protected override CalcDisplayMaxRecordCount(): void {
            if (this.RecordCount < 8)
                this.DisplayMaxRecordCount = 8;
            else {
                if (this.ShowAllData == 1) {
                    this.DisplayMaxRecordCount = this.RecordCount + 3;
                }
                else if (this.ZoomLevel != -1) {
                    this.DisplayMaxRecordCount = this._viewRanges[this.ZoomLevel];
                }
            }
        }
        private CalcGreaterZoomLevel(): number {
            for (var i: number = 0; i < this._viewRanges.length; i++) {
                if (this._viewRanges[i] > this.DisplayMaxRecordCount) {
                    return i;
                }
            }
            return this._viewRanges.length - 1;
        }
        private CalcLesserZoominLevel(): number {
            for (var i: number = this._viewRanges.length - 1; i >= 0; i--) {
                if (this._viewRanges[i] < this.DisplayMaxRecordCount) {
                    return i;
                }
            }
            return 0;
        }
    }
}