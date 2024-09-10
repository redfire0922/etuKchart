/// <reference path="VisualComponent.ts"/>

namespace zsaltec.KChart {
    export class AccordionFrame extends VisualComponent {
        public SecondScaleYEnabled: boolean = false;
        public ScaleXHeight: number = 17;
        public CrosshairVisible: boolean;
        public MainScaleYWidth: number = 55;
        public SecondaryScaleYWidth: number = 55;
        public PanelBounds: AreaInfo[] = [];
        public SlideMode: boolean = false;


        public get DataViewWidth(): number {
            return this._panels.Get(0).WorkAreaWidth;
        }

        protected _xScale: XScaleBase;
        public get XScale(): XScaleBase {
            return this._xScale;
        }
        public set XScale(value: XScaleBase) {
            this.RemoveChild(this._xScale);
            this.AddChild(value);

            this._xScale = value;
        }

        protected _panels: Collection<ChartPanel>;
        public get Panels(): Collection<ChartPanel> {
            return this._panels;
        }

        public get SelectedPanel(): ChartPanel {
            for (var i: number = 0; i < this._panels.length; i++) {
                if (this._panels.Get(i).Visible && this._panels.Get(i).Selectable && this._panels.Get(i).Selected) {
                    return this._panels.Get(i);
                }
            }
            return null;
        }

        constructor() {
            super();

            this._panels = new Collection<ChartPanel>([], this);
        }

        public override DoLayout(): void {
            this.WorkAreaLocationA = new Point(this.LocationA.X + this.MainScaleYWidth + 1, this.LocationA.Y + 1);
            this.WorkAreaHeight = this.Height - this.ScaleXHeight - 2;
            this.WorkAreaWidth = this.Width - this.MainScaleYWidth - 1 - (this.SecondScaleYEnabled ? this.SecondaryScaleYWidth : 0);

            this.XScale.Width = this.WorkAreaWidth - 1;
            this.XScale.Height = this.ScaleXHeight;
            this.XScale.LocationA = new Point(this.XA(0), this.YA(this.WorkAreaHeight));
            this.XScale.DoLayout();

            this.ComputeLayout();
            this.ApplyToPanel(this.PanelBounds);

            for (var i = 0; i < this._panels.length; i++) {
                this._panels.Get(i).DoLayout();
            }
        }


        public override OnPaintFloatingLayer(g: IGraphics): void {
            for (var i = 0; i < this.Children.length; i++) {
                this.Children[i].OnPaintFloatingLayer(g);
            }

            this.DrawHairCross(g);
            this.DrawHightlightScaleValue(g);
        }

        public override OnMouseClick(e: MouseEventArgs): void {
            for (var i: number = 0; i < this._panels.length; i++) {
                let panel = this._panels.Get(i);
                if (e.CancelBubbling == 0 && panel.Visible && panel.IsHit(new Point(e.X, e.Y))) {
                    panel.OnMouseClick(e);
                }
            }
            if (e.CancelBubbling == 0 && this.XScale.IsHit(new Point(e.X, e.Y)))
                this.XScale.OnMouseClick(e);

            if (e.CancelBubbling == 0)
                if (!Utils.isNull(this.MouseClick)) this.MouseClick.call(this, e);
        }

        //<<继承

        public DrawHightlightScaleValue(g: IGraphics): void { throw new Error('not implemented'); }
        public GetXRecordValue(recordIndex: number): ScaleXInfo { throw new Error('not implemented'); }
        public GetYRecordValue(recordIndex: number): ScaleYInfo { throw new Error('not implemented'); }
        protected ComputeLayout(): void { throw new Error('not implemented'); }

        public ClearSelected(): void {
            for (var i = 0; i < this.Panels.length; i++) {
                var panel = this._panels.Get(i);
                panel.ClearSelected();
            }
        }

        public GetPanelByAlias(alias: string): ChartPanel {
            for (var i: number = 0; i < this._panels.length; i++) {
                if (this._panels.Get(i).Alias == alias)
                    return this._panels.Get(i);
            }
            return null;
        }

        public GetPanelByPoint(p: Point): ChartPanel {
            for (var i: number = 0; i < this._panels.length; i++) {
                if (this._panels.Get(i).IsHit(p))
                    return this._panels.Get(i);
            }
            return null;
        }

        protected ApplyToPanel(areas: AreaInfo[]): void {
            for (var i = 0; i < areas.length; i++) {
                var pair = areas[i];
                var cp: ChartPanel = this.GetPanelByAlias(pair.PanelAlias);
                cp.LocationA = new Point(pair.Left, pair.Top);
                cp.Width = this.WorkAreaWidth;
                cp.Height = pair.Height;
                cp.Visible = pair.Visible;
            }
        }

        private DrawHairCross(g: IGraphics): void {
            if (this.Chart.ShowCrosshair && !this.Chart.FocusInfo.OutWorkarea) {
                if (this._panels.length > 0) {
                    var fx: number = this.Chart.FocusInfo.FocusLocation.X;
                    var fy: number = this.Chart.FocusInfo.FocusLocation.Y;
                    var style = ThemePalette.Current.Color6;
                    if (fx - this.MainScaleYWidth >= 0 && fx - this.MainScaleYWidth <= this._panels.Get(0).WorkAreaWidth + 1 && fy < this.WorkAreaHeight - 2) {
                        for (var i = 0; i < this._panels.length; i++) {
                            var panel = this._panels.Get(i);
                            Drawer.DrawLine(g, style, new Point(fx, panel.WorkAreaLocationA.Y), new Point(fx, panel.LocationA.Y + panel.Height - 2));
                        }
                        Drawer.DrawLine(g, style, new Point(this.MainScaleYWidth, fy), new Point(this.MainScaleYWidth + this.WorkAreaWidth, fy));
                        this.ChangeCrosshair(true);
                    }
                    else {
                        this.ChangeCrosshair(false);
                    }
                }
                else {
                    this.ChangeCrosshair(false);
                }
            }
            else {
                this.ChangeCrosshair(false);
            }
        }

        private ChangeCrosshair(visible: boolean): void {
            if (this.CrosshairVisible != visible) {
                this.CrosshairVisible = visible;
                var e2: CrosshairVisibleChangedArgs = new CrosshairVisibleChangedArgs();
                e2.Visible = this.CrosshairVisible;

                if (!Utils.isNull(this.Chart.CrosshairVisibleChanged)) this.Chart.CrosshairVisibleChanged.call(this, e2);
            }
        }

        public GetFocusXValue(): ScaleXInfo {
            var ts: ScaleXInfo = this.XScale.GetXFocusValue();
            return ts;
        }

        public GetFocusYValue(): ScaleYInfo {
            var ns: ScaleYInfo = null;
            let ay: number = this.Chart.FocusInfo.FocusLocation.Y;
            var panel: ChartPanel = this.GetPanelByPoint(new Point(this.Chart.FocusInfo.FocusLocation.X, ay));
            if (Utils.isNotNull(panel)) {
                let v = panel.YA2Value(ay);
                if (Utils.isNotNull(v)) {
                    ns = new ScaleYInfo();
                    ns.AY = ay;
                    ns.Value = v;
                    ns.PanelAlias = panel.Alias;
                }
            }
            return ns;
        }

        public Value2YA(panelIndex: number, v: number): number {
            return this._panels.Get(panelIndex).Value2YA(v);
        }

        public YA2Value(panelIndex: number, ay: number): number {
            return this._panels.Get(panelIndex).YA2Value(ay);
        }

        public Index2XA(recordIndex: number): number {
            var dv: DataView = this.Chart.View;
            if (recordIndex < dv.LeftRecordIndex && recordIndex >= dv.RightRecordIndex) {
                return this.XA(dv.GetRLeft(recordIndex));
            }
            else return -1;
        }

        public XA2Index(ax: number): number {
            return this.Chart.View.GetRecordIndex(ax - this.WorkAreaLocationA.X);
        }

    }

    export class DateLineFrame extends AccordionFrame {

        public ShowTimeScale: boolean;

        protected _isExpanded: boolean;
        protected _originPercent: number;
        protected _slideBoundIndex: number;
        protected _slideOriginYValue: number;
        protected _slideOriginPValue: number;
        protected _slideOriginP2Value: number;

        constructor() {
            super();

            this.ShowTimeScale = true;
            this._isExpanded = false;
        }

        public override InitializeComponent(): void {
            if (this.XScale == null) {
                this.XScale = new DateScale(CompactSeries.DATETIME_FIELD);
            }
            this.XScale.InitializeComponent();

            if (this.Panels.length <= 0) {
                var mainPanel = new ChartPanel();
                mainPanel.Patterns.Add(new CandlePattern());
                this.Panels.Add(mainPanel);
                var panel1 = new ChartPanel();
                this.Panels.Add(panel1);
                var panel2 = new ChartPanel();
                this.Panels.Add(panel2);
            }
            for (var i: number = 0; i < this.Panels.length; i++) {
                this.Panels.Get(i).InitializeComponent();
            }

            this.Inited = true;
        }

        public override OnPaint(g: IGraphics): void {

            var frameStyle = ThemePalette.Current.FrameColor;
            Drawer.DrawLine(g, frameStyle, new Point(this.LocationA.X, this.LocationA.Y), new Point(this.LocationA.X + this.Width - 1, this.LocationA.Y));
            for (var i: number = 0; i < this.PanelBounds.length; i++) {
                if (this.PanelBounds[i].Visible) {
                    var y: number = this.PanelBounds[i].Top + this.PanelBounds[i].Height - 1;
                    Drawer.DrawLine(g, frameStyle, new Point(this.LocationA.X + 1, y), new Point(this.LocationA.X + this.Width - 1, y));
                }
            }
            Drawer.DrawLine(g, frameStyle, new Point(this.LocationA.X, this.LocationA.Y + this.Height - 1), new Point(this.LocationA.X + this.Width - 1, this.LocationA.Y + this.Height - 1));
            Drawer.DrawLine(g, frameStyle, new Point(this.MainScaleYWidth, 0), new Point(this.MainScaleYWidth, this.Height - 1 + 3 - this.XScale.Height));
            Drawer.DrawLine(g, frameStyle, new Point(this.Width, 0), new Point(this.Width, this.Height));
            if (this.SecondScaleYEnabled)
                Drawer.DrawLine(g, frameStyle, new Point(this.Width - this.SecondaryScaleYWidth, 0), new Point(this.Width - this.SecondaryScaleYWidth, this.Height - 1 + 3 - this.XScale.Height));

            for (var i = 0; i < this.Children.length; i++) {

                if (this.Children[i].Visible) {
                    this.Children[i].OnPaint(g);
                }
            }
        }

        public override OnMouseMove(e: MouseEventArgs): void {
            for (var i: number = 0; i < this._panels.length; i++) {
                let panel = this._panels.Get(i);
                if (e.CancelBubbling == 0 && panel.Visible && panel.IsHit(new Point(e.X, e.Y))) {
                    panel.OnMouseMove(e);
                }
            }
            if (e.CancelBubbling == 0 && this.XScale.IsHit(new Point(e.X, e.Y)))
                this.XScale.OnMouseMove(e);

            if (!this.SlideMode) {
                var onBoundBorder: boolean = false;
                for (var i: number = 1; i < this.PanelBounds.length; i++) {
                    var bound = this.PanelBounds[i];
                    if (e.Y >= bound.Top - 3 && e.Y <= bound.Top + 3) {
                        Drawer.ChangeCursor(this.Chart.Graphics, "n-resize");
                        onBoundBorder = true;
                        break;
                    }
                }
                if (!onBoundBorder)
                    Drawer.ChangeCursor(this.Chart.Graphics, "default");
            }
            else {
                if (this.WorkAreaHeight > 110) {
                    var current: AreaInfo = this.PanelBounds[this._slideBoundIndex];
                    var prev: AreaInfo = null;
                    if (this._isExpanded) {
                        prev = this.PanelBounds[0];
                    }
                    else prev = this.PanelBounds[this._slideBoundIndex - 1];
                    var rdp: number = (this._slideOriginYValue - e.Y) / <number>this.WorkAreaHeight;
                    var limit: number = 50 / <number>this.WorkAreaHeight;
                    if (this._slideOriginPValue + rdp < limit) {
                        rdp = limit - this._slideOriginPValue;
                    }
                    else if (this._slideOriginP2Value - rdp < limit) {
                        rdp = this._slideOriginP2Value - limit;
                    }
                    current.HeightPercent = this._slideOriginPValue + rdp;
                    prev.HeightPercent = this._slideOriginP2Value - rdp;
                }
                this.ComputeLayout();
                this.DoLayout();
                this.Chart.Refresh();
            }

            if (e.CancelBubbling == 0)
                if (!Utils.isNull(this.MouseMove)) this.MouseMove.call(this, e);
        }

        public override OnMouseDoubleClick(e: MouseEventArgs): void {
            for (var i: number = 0; i < this._panels.length; i++) {
                let panel = this._panels.Get(i);
                if (e.CancelBubbling == 0 && panel.Visible && panel.IsHit(new Point(e.X, e.Y))) {
                    panel.OnMouseDoubleClick(e);
                }
            }
            if (e.CancelBubbling == 0 && this.XScale.IsHit(new Point(e.X, e.Y)))
                this.XScale.OnMouseDoubleClick(e);

            if (e.CancelBubbling == 0) {
                var panel: ChartPanel = this.GetPanelByPoint(new Point(e.X, e.Y));
                if (panel != null) {
                    if (panel == this._panels.Get(0) || this.Panels.length <= 2) {
                        this.Chart.ShowCrosshair = !this.Chart.ShowCrosshair;
                        this.Chart.Refresh();
                    }
                    else {
                        if (!this._isExpanded) {
                            for (var i: number = 1; i < this.PanelBounds.length; i++) {
                                var panelBound = this.PanelBounds[i];
                                if (panelBound.PanelAlias != panel.Alias) {
                                    panelBound.Visible = false;
                                }
                                else {
                                    this._originPercent = panelBound.HeightPercent;
                                    panelBound.HeightPercent = (this.WorkAreaHeight - this.PanelBounds[0].Height) / <number>this.WorkAreaHeight;
                                }
                            }
                            this.ComputeLayout();
                            this.Chart.DoLayout();
                            this._isExpanded = true;
                        }
                        else {
                            this.Collapse(panel.Alias);
                        }
                    }
                }
            }
        }

        public override OnMouseDown(e: MouseEventArgs): void {
            for (var i: number = 0; i < this._panels.length; i++) {
                let panel = this._panels.Get(i);
                if (e.CancelBubbling == 0 && panel.Visible && panel.IsHit(new Point(e.X, e.Y))) {
                    panel.OnMouseDown(e);
                }
            }
            if (e.CancelBubbling == 0 && this.XScale.IsHit(new Point(e.X, e.Y)))
                this.XScale.OnMouseDown(e);

            if (e.Button == MouseButtons.Left) {
                for (var i: number = 1; i < this.PanelBounds.length; i++) {
                    var bound = this.PanelBounds[i];
                    if (bound.Visible) {
                        if (e.Y > bound.Top - 3 && e.Y < bound.Top + 3) {
                            //Cursor.Current = Cursors.SizeNS;
                            this.SlideMode = true;
                            this._slideBoundIndex = i;
                            this._slideOriginYValue = e.Y;
                            this._slideOriginPValue = bound.HeightPercent;
                            if (this._isExpanded)
                                this._slideOriginP2Value = this.PanelBounds[0].HeightPercent;
                            else this._slideOriginP2Value = this.PanelBounds[i - 1].HeightPercent;
                            break;
                        }
                    }
                }
            }

            if (e.CancelBubbling == 0)
                if (!Utils.isNull(this.MouseDown)) this.MouseDown.call(this, e);
        }

        public override OnMouseUp(e: MouseEventArgs): void {
            super.OnMouseUp(e);

            this.SlideMode = false;
        }

        public override DrawHightlightScaleValue(g: IGraphics): void {
            if (this.Chart.Source.Rows.length > 0) {
                var ts: ScaleXInfo = null;
                var ns: ScaleYInfo = null;
                if (this.Chart.FocusInfo.FocusClosePrice) {
                    var view: DataView = this.Chart.View;
                    ts = this.GetXRecordValue(this.Chart.FocusInfo.RecordIndex);
                    ns = this.GetYRecordValue(this.Chart.FocusInfo.RecordIndex);
                }
                else {
                    ts = this.GetFocusXValue();
                    ns = this.GetFocusYValue();
                }
                if (ts != null) {
                    var align: number = 1;
                    if (ts.PositionLeft + 79 > this.XA(this.XScale.Width))
                        align = -1;
                    Drawer.DrawSacleXValue(g, new Point(ts.PositionLeft, this.XScale.WorkAreaLocationA.Y), this.ScaleXHeight, align, ts.DisplayValue);
                }
                if (ns != null) {
                    var text: string = "";
                    if (ns.Value == null)
                        text = "--";
                    else if (Math.abs(ns.Value) > 100)
                        text = (<number>Math.round(ns.Value)) + "";
                    else text = ns.Value.toFixed(2);
                    if (this.CrosshairVisible) {
                        if (this.SecondScaleYEnabled)
                            Drawer.DrawSacleYValue(g, new Point(this.XA(this.WorkAreaWidth), ns.AY), this.MainScaleYWidth - 1, text);
                        else Drawer.DrawSacleYValue(g, new Point(this.XA(this.WorkAreaWidth - this.MainScaleYWidth), ns.AY), this.MainScaleYWidth - 1, text);
                    }
                    else {
                        Drawer.DrawSacleYValue(g, new Point(this.XA(-this.MainScaleYWidth), ns.AY), this.MainScaleYWidth - 1, text);
                    }
                }
            }
        }

        public override GetXRecordValue(recordIndex: number): ScaleXInfo {
            var ts: ScaleXInfo = this.XScale.GetXRecordValue(recordIndex);
            return ts;
        }
        public override GetYRecordValue(recordIndex: number): ScaleYInfo {
            var ns: ScaleYInfo = this._panels.Get(0).GetYRecordInfo(recordIndex);
            return ns;
        }

        protected override ComputeLayout(): void {
            if (this.PanelBounds.length <= 0) {
                if (this._isExpanded) {
                    for (var i: number = 1; i < this.Panels.length; i++) {
                        var panel = this._panels.Get(i);
                        panel.Visible = true;
                    }
                    this._isExpanded = false;
                }
                this.BuildDefaultLayout();
            }
            else {
                if (this.WorkAreaHeight > 0) {
                    var p: number = 0;
                    var temp: AreaInfo = null;
                    for (var i = 0; i < this.PanelBounds.length; i++) {
                        var bound = this.PanelBounds[i];
                        if (bound.Visible) {
                            temp = bound;
                            bound.Top = this.YA(p);
                            bound.Height = <number>(this.WorkAreaHeight * bound.HeightPercent);
                            bound.Width = this.WorkAreaWidth;
                            p += bound.Height;
                        }
                    }
                    if (this.WorkAreaHeight > p) {
                        temp.Height += this.WorkAreaHeight - p;
                    }
                }
            }
        }
        //--



        protected BuildDefaultLayout(): void {
            var count: number = 0;
            for (var i = 0; i < this.Panels.length; i++) {
                if (this._panels.Get(i).Visible)
                    count++;
            }

            if (this.WorkAreaHeight > 0 && count > 0) {
                var height: number;
                var hp: number[];
                var p: number = 0;
                switch (count) {
                    case 1:
                        this.PanelBounds.push(Object.assign(new AreaInfo(), {
                            RowIndex: 0,
                            ColumnIndex: 0,
                            Height: this.WorkAreaHeight,
                            Width: this.WorkAreaWidth,
                            Left: this.XA(0),
                            Top: this.YA(0),
                            HeightPercent: 1
                        }));
                        break;
                    case 2:
                        hp = [0.75, 0.25];
                        for (var i: number = 0; i < count; i++) {
                            height =this.WorkAreaHeight * hp[i];
                            this.PanelBounds.push(Object.assign(new AreaInfo(), {
                                RowIndex: i,
                                ColumnIndex: 0,
                                Height: height,
                                Width: this.WorkAreaWidth,
                                Left: this.XA(0),
                                Top: this.YA(p),
                                HeightPercent: hp[i]
                            }));
                            p += height;
                        }
                        break;
                    case 3:
                        hp = [0.6, 0.2, 0.2];
                        for (var i: number = 0; i < count; i++) {
                            height = <number>(this.WorkAreaHeight * hp[i]);
                            this.PanelBounds.push(Object.assign(new AreaInfo(), {
                                RowIndex: i,
                                ColumnIndex: 0,
                                Height: height,
                                Width: this.WorkAreaWidth,
                                Left: this.XA(0),
                                Top: this.YA(p),
                                HeightPercent: hp[i]
                            }));
                            p += height;
                        }
                        this.PanelBounds[2].Height = this.WorkAreaHeight - this.PanelBounds[2].Top;
                        break;
                    case 4:
                        hp = [0.5, 0.16, 0.16, 0.18];
                        for (var i: number = 0; i < count; i++) {
                            height = <number>(this.WorkAreaHeight * hp[i]);
                            this.PanelBounds.push(Object.assign(new AreaInfo(), {
                                RowIndex: i,
                                ColumnIndex: 0,
                                Height: height,
                                Width: this.WorkAreaWidth,
                                Left: this.XA(0),
                                Top: this.YA(p),
                                HeightPercent: hp[i]
                            }));
                            p += height;
                        }
                        this.PanelBounds[3].Height = this.WorkAreaHeight - this.PanelBounds[3].Top;
                        break;
                    case 5:
                        hp = [0.43, 0.14, 0.14, 0.14, 0.15];
                        for (var i: number = 0; i < count; i++) {
                            height = <number>(this.WorkAreaHeight * hp[i]);
                            this.PanelBounds.push(Object.assign(new AreaInfo(), {
                                RowIndex: i,
                                ColumnIndex: 0,
                                Height: height,
                                Width: this.WorkAreaWidth,
                                Left: this.XA(0),
                                Top: this.YA(p),
                                HeightPercent: hp[i]
                            }));
                            p += height;
                        }
                        this.PanelBounds[4].Height = this.WorkAreaHeight - this.PanelBounds[4].Top;
                        break;
                    case 6:
                        hp = [0.35, 0.13, 0.13, 0.13, 0.13, 0.13];
                        for (var i: number = 0; i < count; i++) {
                            height = <number>(this.WorkAreaHeight * hp[i]);
                            this.PanelBounds.push(Object.assign(new AreaInfo(), {
                                RowIndex: i,
                                ColumnIndex: 0,
                                Height: height,
                                Width: this.WorkAreaWidth,
                                Left: this.XA(0),
                                Top: this.YA(p),
                                HeightPercent: hp[i]
                            }));
                            p += height;
                        }
                        this.PanelBounds[5].Height = this.WorkAreaHeight - this.PanelBounds[4].Top;
                        break;
                    case 7:
                        hp = [0.28, 0.12, 0.12, 0.12, 0.12, 0.12, 0.12];
                        for (var i: number = 0; i < count; i++) {
                            height = <number>(this.WorkAreaHeight * hp[i]);
                            this.PanelBounds.push(Object.assign(new AreaInfo(), {
                                RowIndex: i,
                                ColumnIndex: 0,
                                Height: height,
                                Width: this.WorkAreaWidth,
                                Left: this.XA(0),
                                Top: this.YA(p),
                                HeightPercent: hp[i]
                            }));
                            p += height;
                        }
                        this.PanelBounds[6].Height = this.WorkAreaHeight - this.PanelBounds[4].Top;
                        break;
                    case 8:
                        hp = [0.265, 0.105, 0.105, 0.105, 0.105, 0.105, 0.105, 0.105];
                        for (var i: number = 0; i < count; i++) {
                            height = <number>(this.WorkAreaHeight * hp[i]);
                            this.PanelBounds.push(Object.assign(new AreaInfo(), {
                                RowIndex: i,
                                ColumnIndex: 0,
                                Height: height,
                                Width: this.WorkAreaWidth,
                                Left: this.XA(0),
                                Top: this.YA(p),
                                HeightPercent: hp[i]
                            }));
                            p += height;
                        }
                        this.PanelBounds[7].Height = this.WorkAreaHeight - this.PanelBounds[4].Top;
                        break;
                    case 9:
                        hp = [0.24, 0.095, 0.095, 0.095, 0.095, 0.095, 0.095, 0.095, 0.095];
                        for (var i: number = 0; i < count; i++) {
                            height = <number>(this.WorkAreaHeight * hp[i]);
                            this.PanelBounds.push(Object.assign(new AreaInfo(), {
                                RowIndex: i,
                                ColumnIndex: 0,
                                Height: height,
                                Width: this.WorkAreaWidth,
                                Left: this.XA(0),
                                Top: this.YA(p),
                                HeightPercent: hp[i]
                            }));
                            p += height;
                        }
                        this.PanelBounds[8].Height = this.WorkAreaHeight - this.PanelBounds[4].Top;
                        break;
                    case 10:
                        hp = [0.226, 0.086, 0.086, 0.086, 0.086, 0.086, 0.086, 0.086, 0.086, 0.086];
                        for (var i: number = 0; i < count; i++) {
                            height = <number>(this.WorkAreaHeight * hp[i]);
                            this.PanelBounds.push(Object.assign(new AreaInfo(), {
                                RowIndex: i,
                                ColumnIndex: 0,
                                Height: height,
                                Width: this.WorkAreaWidth,
                                Left: this.XA(0),
                                Top: this.YA(p),
                                HeightPercent: hp[i]
                            }));
                            p += height;
                        }
                        this.PanelBounds[9].Height = this.WorkAreaHeight - this.PanelBounds[4].Top;
                        break;
                }
                var index: number = 0;
                for (var i = 0; i < this.Panels.length; i++) {
                    var panel = this._panels.Get(i);
                    if (panel.Visible) {
                        this.PanelBounds[index].PanelAlias = panel.Alias;
                        index++;
                    }
                }
            }
        }

        private Collapse(panelAlias: string): void {
            var otherPercent: number = 0;
            for (var i: number = 1; i < this.PanelBounds.length; i++) {
                var panelBound = this.PanelBounds[i];
                panelBound.Visible = true;
                if (panelBound.PanelAlias == panelAlias) {
                    panelBound.HeightPercent = this._originPercent;
                }
                otherPercent += panelBound.HeightPercent;
            }
            this.PanelBounds[0].HeightPercent = 1 - otherPercent;
            this.ComputeLayout();
            this.Chart.DoLayout();
            this._isExpanded = false;
        }
    }
}