/// <reference path="VisualComponent.ts"/>

namespace zsaltec.KChart {
    export class PatternBase extends VisualComponent {

        public SeriesField: string = CompactSeries.CLOSE_FIELD;

        public ShowTitle: boolean = true;
        public Color: string = null;
        public IndicatorIndex: number = 0; 

        public GroupName: string;
        public CoordinateBaseFirst: boolean = true;
        public TipEnabled: boolean = true;

        public MaxValue: number = 1;
        public MinValue: number = 1;
        public MaxHighRecordIndex: number;
        public MinLowRecordIndex: number;

        public Title: string = "";

        constructor() {
            super();
        }

        public override OnPaintFloatingLayer(g: IGraphics): void {
            if (this.Selectable && this.Selected) {
                this.ShowSelectedStyle(g);
            }
        }

        public CalcValueRange(): number[] {
            var maxHigh: number = Number.MIN_VALUE;
            var minLow: number = Number.MAX_VALUE;
            var col: SeriesColumn = this.Chart.Source.Columns.Get(this.SeriesField);
            this.MaxHighRecordIndex = -1;
            this.MinLowRecordIndex = -1;

            for (var i: number = this.Chart.View.RightRecordIndex; i < this.Chart.View.LeftRecordIndex; i++) {
                var tmph: number = col.GetValue(i);
                if (Utils.isNotNull(tmph)) {
                    if (maxHigh < tmph) {
                        maxHigh = tmph;
                        this.MaxHighRecordIndex
                    }
                    if (minLow > tmph) {
                        minLow = tmph;
                        this.MinLowRecordIndex = -1;
                    }
                }
            }
            this.MaxValue = maxHigh;
            this.MinValue = minLow;
            return [maxHigh, minLow];
        }

        public GetYRecordValue(recordIndex: number): number {
            if (recordIndex >= 0 && recordIndex < this.Chart.Source.Rows.length) {
                var col: SeriesColumn = this.Chart.Source.Columns.Get(this.SeriesField);
                return col.GetValue(recordIndex);
            }
            return null;
        }

        public GetYRecordInfo(recordIndex: number): ScaleYInfo {
            if (recordIndex >= 0 && recordIndex < this.Chart.Source.Rows.length && this.SeriesField != null) {
                var panel = <ChartPanel>this.ParentVisualComponent;

                var col: SeriesColumn = this.Chart.Source.Columns.Get(this.SeriesField);
                var v: number = col.GetValue(recordIndex);
                var info: ScaleYInfo = Object.assign(new ScaleYInfo(), {
                    AY: this.Value2YA(v),
                    Value: v,
                    PanelAlias: panel.Alias
                });
                return info;
            }
            else return null;
        }

        public BuildTip(point: Point): void {
            if (this.TipEnabled) {
                var p: Point = new Point(point.X, point.Y + 20);
                if (point.X + 84 > this.XA(this.WorkAreaWidth))
                    p = new Point(p.X - 84, p.Y);

                this.Chart.ToolTip.Location = p;
                this.Chart.ToolTip.Type = ToolTipType.VolumnTip;
                this.Chart.ToolTip.Items = [];
                var view: DataView = this.Chart.View;
                var recordIndex: number = view.GetRecordIndex(point.X - this.LocationA.X);
                var col: SeriesColumn = this.Chart.Source.Columns.Get(this.SeriesField);
                var v: number = col.GetValue(recordIndex);
                this.Chart.ToolTip.GroupName = this.GroupName;
                this.Chart.ToolTip.Title = this.Title;
                if (Math.abs(v) < 1)
                    this.Chart.ToolTip.Items.push(v.toFixed(4));
                else if (Math.abs(v) > 500)
                    this.Chart.ToolTip.Items.push(v.toFixed(0));
                else this.Chart.ToolTip.Items.push(v.toFixed(2));
            }
        }

        protected ShowSelectedStyle(g: IGraphics): void {
            if (this.SeriesField != null) {
                var view: DataView = this.Chart.View;
                var step: number = Math.round(50 / view.RecordWidth);
                if (step == 0)
                    step = 1;
                var col: SeriesColumn = this.Chart.Source.Columns.Get(this.SeriesField);
                var right: number = view.RightRecordIndex;
                var left: number = view.LeftRecordIndex;
                for (var i: number = left - step; i >= right; i -= step) {
                    var v: number = col.GetValue(i);
                    if (!Utils.isNull(v)) {
                        var rx: number = this.Chart.Index2XA(i) - 2;
                        var ry: number = this.Value2YA(v) - 1;
                        var h: Point = new Point(rx, ry);
                        Drawer.FillRectangle(g, ThemePalette.Current.HightlightColor, new Rectangle(h.X, h.Y, 4, 4));
                    }
                }
            }
        }

        public GetTitleAndValues(recordIndex: number): TitleInfo[] {
            if (this.ShowTitle && !Utils.IsNullOrEmpty(this.Title)) {
                var yi: ScaleYInfo = this.GetYRecordInfo(recordIndex);
                var v: number = null;
                var text: string = "-";
                if (yi != null) {
                    v = yi.Value;
                    if (!Utils.isNull(v))
                        text = v + "";
                }
                var titleInfo: TitleInfo = Object.assign(new TitleInfo(this.Alias), { DisplayText: this.Title + ': ' + text, Color: this.Color, Value: v });
                return [titleInfo];
            }
            return [];
        }

        public Value2YA(value: number): number {
            var panel = <ChartPanel>this.ParentVisualComponent;
            return panel.Value2YA(value);
        }

        public ClearSelected() {
            if (this.Selected) this.Selected = false;
        }


        public override IsHit(p: Point): boolean {
            var panel: ChartPanel = <ChartPanel>this.ParentVisualComponent;
            var view: DataView = this.Chart.View;
            var col: SeriesColumn = this.Chart.Source.Columns.Get(this.SeriesField);
            var rd: number = view.GetRecordIndex(p.X - this.LocationA.X);
            if (rd < view.LeftRecordIndex && rd >= view.RightRecordIndex) {
                var v: number = col.GetValue(rd);
                var hy: number = panel.Value2YA(v);
                if (hy < p.Y + 5 && hy > p.Y - 5) {
                    return true;
                }
            }
            return false;
        }

        public OnMouseDoubleClick(e: MouseEventArgs): void {
            if (this.Children)
                for (var i = 0; i < this.Children.length; i++) {
                    if (e.CancelBubbling == 0 && this.Children[i].IsHit(new Point(e.X, e.Y)))
                        this.Children[i].OnMouseDoubleClick(e);
                }

            var view: DataView = this.Chart.View;
            var trdateCol: SeriesColumn = this.Chart.Source.Columns.Get(CompactSeries.DATETIME_FIELD);
            var rd: number = view.GetRecordIndex(e.X - this.LocationA.X);
            let pe = new PatternDbClickEventArgs(e);

            pe.RecordIndex = rd;
            pe.PanelAlias = (<VisualComponent>this.ParentVisualComponent).Alias;
            pe.FragmentAlias = this.Alias;
            pe.SelectedDate = <Date>trdateCol.GetValue(rd);

            this.Chart.OnPatternDbClick(pe);
            if (!Utils.isNull(this.MouseDoubleClick)) this.MouseDoubleClick.call(this, e);

            e.CancelBubbling = 1;
        }
    }

    export class CandlePattern extends PatternBase {

        public HighField: string = CompactSeries.HIGH_FIELD;
        public LowField: string = CompactSeries.LOW_FIELD;
        public OpenField: string = CompactSeries.OPEN_FIELD;
        public VolumeField: string = CompactSeries.VOLUME_FIELD;
        public AmountField: string = CompactSeries.AMOUNT_FIELD;

        constructor() {
            super();

        }

        public override CalcValueRange(): number[] {
            var maxHigh: number = Number.MIN_VALUE;
            var minLow: number = Number.MAX_VALUE;
            var highCol: SeriesColumn = this.Chart.Source.Columns.Get(this.HighField);
            var lowCol: SeriesColumn = this.Chart.Source.Columns.Get(this.LowField);
            this.MaxHighRecordIndex = -1;
            this.MinLowRecordIndex = -1;
            for (var i: number = this.Chart.View.RightRecordIndex; i < this.Chart.View.LeftRecordIndex; i++) {
                let tmph: number = highCol.GetValue(i);
                if (Utils.isNotNull(tmph)) {
                    if (maxHigh < tmph) {
                        maxHigh = tmph;
                        this.MaxHighRecordIndex = i;
                    }
                }

                let tmpl: number = lowCol.GetValue(i);
                if (Utils.isNotNull(tmpl)) {
                    if (minLow > tmpl) {
                        minLow = tmpl;
                        this.MinLowRecordIndex = i;
                    }
                }
            }
            this.MaxValue = maxHigh;
            this.MinValue = minLow;
            return [maxHigh, minLow];
        }

        public override IsHit(p: Point): boolean {
            var panel: ChartPanel = <ChartPanel>this.ParentVisualComponent;
            var view: DataView = this.Chart.View;
            var highCol: SeriesColumn = this.Chart.Source.Columns.Get(this.HighField);
            var lowCol: SeriesColumn = this.Chart.Source.Columns.Get(this.LowField);
            var rd: number = view.GetRecordIndex(p.X - this.LocationA.X);
            if (rd < view.LeftRecordIndex && rd >= view.RightRecordIndex) {
                var high: number = highCol.GetValue(rd);
                var low: number = lowCol.GetValue(rd);
                var hy: number = panel.Value2YA(high);
                if (hy < p.Y + 1) {
                    var lowY: number = panel.Value2YA(low);
                    if (lowY > p.Y - 1) {
                        return true;
                    }
                }
            }
            return false;
        }

        public BuildTip(point: Point): void {
            var p: Point = new Point(point.X, point.Y + 20);
            if (point.X + 84 > this.XA(this.WorkAreaWidth))
                p = new Point(p.X - 84, p.Y);

            this.Chart.ToolTip.Location = p;
            this.Chart.ToolTip.Type = ToolTipType.CandleTip;
            this.Chart.ToolTip.Items = [];
            var view: DataView = this.Chart.View;
            var recordIndex: number = view.GetRecordIndex(point.X - this.LocationA.X);
            var trdateCol: SeriesColumn = this.Chart.Source.Columns.Get(CompactSeries.DATETIME_FIELD);
            var highCol: SeriesColumn = this.Chart.Source.Columns.Get(this.HighField);
            var lowCol: SeriesColumn = this.Chart.Source.Columns.Get(this.LowField);
            var openCol: SeriesColumn = this.Chart.Source.Columns.Get(this.OpenField);
            var closeCol: SeriesColumn = this.Chart.Source.Columns.Get(this.SeriesField);
            var volumnCol: SeriesColumn = this.Chart.Source.Columns.Get(this.VolumeField);
            var amountCol: SeriesColumn = this.Chart.Source.Columns.Get(this.AmountField);
            var trdate: Date = trdateCol.GetValue(recordIndex);
            var open: number = openCol.GetValue(recordIndex);
            var close: number = closeCol.GetValue(recordIndex);
            var high: number = highCol.GetValue(recordIndex);
            var low: number = lowCol.GetValue(recordIndex);
            var vol: number = volumnCol.GetValue(recordIndex);
            var amount: number = amountCol.GetValue(recordIndex) / 10000;
            var trdateStr: string = Utils.format(trdate);
            this.Chart.ToolTip.GroupName = Utils.getYear(trdate) + "/" + Utils.getMonth(trdate) + "/" + Utils.getDay(trdate);
            this.Chart.ToolTip.Title = "";
            this.Chart.ToolTip.Items.push(open.toFixed(2));
            this.Chart.ToolTip.Items.push(high.toFixed(2));
            this.Chart.ToolTip.Items.push(low.toFixed(2));
            this.Chart.ToolTip.Items.push(close.toFixed(2));
            this.Chart.ToolTip.Items.push((vol / 100).toFixed(1) + "?");
            this.Chart.ToolTip.Items.push((amount / 100).toFixed(1) + "?");
        }

        public override OnPaint(g: IGraphics): void {
            var view: DataView = this.Chart.View;
            var panel: ChartPanel = <ChartPanel>this.ParentVisualComponent;
            var highCol: SeriesColumn = this.Chart.Source.Columns.Get(this.HighField);
            var lowCol: SeriesColumn = this.Chart.Source.Columns.Get(this.LowField);
            var openCol: SeriesColumn = this.Chart.Source.Columns.Get(this.OpenField);
            var closeCol: SeriesColumn = this.Chart.Source.Columns.Get(this.SeriesField);

            if (view.PatternWidth < 5) {
                var upStyle = ThemePalette.Current.Color2;
                var downStyle = ThemePalette.Current.Color3;
                var horStyle = ThemePalette.Current.Color9;
                for (var i: number = view.RightRecordIndex; i < view.LeftRecordIndex; i++) {
                    var open: number = openCol.GetValue(i);
                    var close: number = closeCol.GetValue(i);
                    if (Utils.isNotNull(close)) {
                        var high: number = highCol.GetValue(i);
                        var low: number = lowCol.GetValue(i);
                        var hx: number = this.Chart.Frame.Index2XA(i);
                        var hy: number = panel.Value2YA(high);
                        var h: Point = new Point(hx, hy);
                        var lowY: number = panel.Value2YA(low);
                        if (open < close) {
                            Drawer.DrawLine(g, upStyle, h, new Point(h.X, lowY));
                        }
                        else if (open > close) {
                            Drawer.DrawLine(g, downStyle, h, new Point(h.X, lowY));
                        }
                        else {
                            Drawer.DrawLine(g, horStyle, h, new Point(h.X, lowY));
                        }
                    }
                }
            }
            else {
                var sideWidth: number = (view.PatternWidth - 1) / 2;
                for (var i: number = view.RightRecordIndex; i < view.LeftRecordIndex; i++) {
                    var open: number = openCol.GetValue(i);
                    var close: number = closeCol.GetValue(i);
                    if (Utils.isNotNull(close)) {
                        var high: number = highCol.GetValue(i);
                        var low: number = lowCol.GetValue(i);
                        var hx: number = this.Chart.Frame.Index2XA(i);
                        var hy: number = panel.Value2YA(high);
                        var h: Point = new Point(hx, hy);
                        var openY: number = panel.Value2YA(open);
                        var closeY: number = panel.Value2YA(close);
                        var lowY: number = panel.Value2YA(low);
                        if (open < close) {
                            Drawer.DrawHollowUpCandlePattern(g, h, openY, closeY, lowY, sideWidth);
                        }
                        else if (open > close) {
                            Drawer.DrawSolidDownCandlePattern(g, h, openY, closeY, lowY, sideWidth);
                        }
                        else {
                            Drawer.DrawHorizontalCandlePattern(g, h, openY, lowY, sideWidth);
                        }
                    }
                }
            }
            if (this.MaxHighRecordIndex >= 0 && this.MinLowRecordIndex >= 0) {
                var maxValue: number = highCol.GetValue(this.MaxHighRecordIndex);
                var minValue: number = lowCol.GetValue(this.MinLowRecordIndex);
                var maxHigh: Point = new Point(this.Chart.Frame.Index2XA(this.MaxHighRecordIndex), panel.Value2YA(maxValue));
                var minLow: Point = new Point(this.Chart.Frame.Index2XA(this.MinLowRecordIndex), panel.Value2YA(minValue));
                Drawer.DrawCandleArrowMark(g, maxHigh, maxValue.toFixed(2), 5, maxHigh.X + 55 > this.XA(this.WorkAreaWidth));
                Drawer.DrawCandleArrowMark(g, minLow, minValue.toFixed(2), -5, minLow.X + 55 > this.XA(this.WorkAreaWidth));
            }
        }

    }

    export class LinePattern extends PatternBase {

        public override InitializeComponent(): void {
            if (this.Children)
                for (var i = 0; i < this.Children.length; i++) {
                    this.Children[i].InitializeComponent();
                }

            if (Utils.IsNullOrBlank(this.Title))
                this.Title = this.SeriesField;

            if (Utils.isNull(this.Color))
                this.Color = ThemePalette.Current.GetStyleByIndex(this.IndicatorIndex);

            this.Inited = true;
        }

        public override OnPaint(g: IGraphics): void {
            var view: DataView = this.Chart.View;
            var panel: ChartPanel = <ChartPanel>this.ParentVisualComponent;
            var col: SeriesColumn = this.Chart.Source.Columns.Get(this.SeriesField);

            let points = [];
            for (var i: number = view.RightRecordIndex; i < view.LeftRecordIndex; i++) {
                let v = col.GetValue(i);

                if (Utils.isNotNull(v)) {
                    let hx = this.Chart.Frame.Index2XA(i);
                    let hy = panel.Value2YA(v);
                    points.push(new Point(hx, hy));
                }
            }
            if (points.length > 1) {
                Drawer.DrawContinuousLine(g, this.Color, points);
            }
            else if (points.length == 1)
                Drawer.DrawPoint(g, this.Color, points[0]);

        }

    }
}