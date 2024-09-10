/// <reference path="VisualComponent.ts"/>

namespace zsaltec.KChart {
    export class ChartPanel extends VisualComponent {

        public TitleHeight: number = 20;
        public ScaleYWidth: number = 56;
        public Tag: string = null;
        public MaxValue: number = 1;
        public MinValue: number = 1;
        public PaddingBottom: number = 6;
        public ShowTitle: boolean = true;
        public Text: string = " ";
        public Selectable: boolean = true;
        public Selected: boolean = false;
        protected _lastCursor: Point = null;
        protected _showMainIndicator: boolean = true;




        protected _patterns: Collection<PatternBase>;
        public get Patterns(): Collection<PatternBase> {
            return this._patterns;
        }

        //protected _auxPatterns: Collection<AuxPattern>;
        //public get AuxPatterns(): Collection<AuxPattern> {
        //    return this._auxPatterns;
        //} 

        protected _titleCtr: PanelTitleContainer;
        protected get TitleCtr(): PanelTitleContainer {
            return this._titleCtr;
        }
        protected set TitleCtr(value: PanelTitleContainer) {
            this.RemoveChild(this._titleCtr);
            this.AddChild(value);

            this._titleCtr = value;
        }

        protected _mainScaleY: YScaleBase;
        public get MainScaleY(): YScaleBase {
            return this._mainScaleY;
        }
        public set MainScaleY(value: YScaleBase) {
            this.RemoveChild(this._mainScaleY);
            this.AddChild(value);

            this._mainScaleY = value;
        }

        protected _secondScaleY: YScaleBase;
        public get SecondScaleY(): YScaleBase {
            return this._secondScaleY;
        }
        public set SecondScaleY(value: YScaleBase) {
            this.RemoveChild(this._secondScaleY);
            this.AddChild(value);
            this._secondScaleY = value;
        }

        public get TitleContainer(): PanelTitleContainer {
            return this._titleCtr;
        }
        constructor() {
            super();

            this._patterns = new Collection<PatternBase>([], this);
            //this._auxPatterns = new Collection<AuxPattern>(this);
        }

        public override IsHit(p: Point): boolean {
            if (this.Visible) {
                if (p.X > this.LocationA.X && p.X < this.LocationA.X + this.Width && p.Y > this.LocationA.Y && p.Y < this.LocationA.Y + this.Height - 10) {
                    return true;
                }
            }
            return false;
        }

        public override InitializeComponent(): void {
            if (Utils.isNull(this.TitleCtr)) {
                this.TitleCtr = new PanelTitleContainer();
            }
            this.TitleCtr.InitializeComponent();

            if (Utils.isNull(this.MainScaleY)) {
                this.MainScaleY = new RangeNumericScale();
            }
            this.MainScaleY.InitializeComponent();

            if (Utils.isNull(this.SecondScaleY) == false)
                this.MainScaleY.InitializeComponent();

            for (var i = 0; i < this.Patterns.length; i++) {
                this.Patterns.Get(i).InitializeComponent();
            }

            this.Inited = true;
        }

        public override DoLayout(): void {
            this.WorkAreaLocationA = new Point(this.LocationA.X, this.LocationA.Y + this.TitleHeight);
            this.WorkAreaWidth = this.Width - 1;
            this.WorkAreaHeight = this.Height - 2 - this.TitleHeight - this.PaddingBottom;

            this._titleCtr.Width = this.WorkAreaWidth - 1;
            this._titleCtr.Height = this.TitleHeight - 3;
            this._titleCtr.LocationA = new Point(this.XA(1), this.YA(3 - this.TitleHeight));
            this._titleCtr.DoLayout();

            this._mainScaleY.Width = this.ScaleYWidth - 1;
            this._mainScaleY.Height = this.WorkAreaHeight;
            this._mainScaleY.LocationA = new Point(this.XA(-this.ScaleYWidth), this.YA(0));
            this._mainScaleY.ScaleLineStart = this.XA(0);
            this._mainScaleY.ScaleLineEnd = this.XA(this.Width);
            this._mainScaleY.DoLayout();

            if (Utils.isNotNull(this._secondScaleY)) {
                this._secondScaleY.Width = this.ScaleYWidth - 1;
                this._secondScaleY.Height = this.WorkAreaHeight;
                this._secondScaleY.LocationA = new Point(this.XA(this.Width), this.YA(0));
                this._secondScaleY.ScaleLineStart = this.XA(0);
                this._secondScaleY.ScaleLineEnd = this.XA(this.Width);
                this._secondScaleY.DoLayout();
            }

            for (var i: number = 0; i < this.Patterns.length; i++) {
                this.Patterns.Get(i).Width = this.WorkAreaWidth;
                this.Patterns.Get(i).Height = this.WorkAreaHeight;
                this.Patterns.Get(i).LocationA = new Point(this.XA(0), this.YA(0));
                this.Patterns.Get(i).DoLayout();
            }

            //for (var i: number = 0; i < this._auxPatterns.length; i++) {
            //    this._auxPatterns[i].Width = this.WorkAreaWidth;
            //    this._auxPatterns[i].Height = this.WorkAreaHeight;
            //    this._auxPatterns[i].LocationA = new Point(this.XA(0), this.YA(0));
            //this.AuxPattern.Get(i).DoLayout();
            //}
        }

        public YA2Value(ay: number): number {
            return this._mainScaleY.YA2Value(ay);
        }

        public Value2YA(value: number): number {
            return this._mainScaleY.Value2YA(value, null);
        }

        public GetYRecordInfo(recordIndex: number): ScaleYInfo {
            if (this._patterns.length > 0) {
                var v: ScaleYInfo = this.Patterns.Get(0).GetYRecordInfo(recordIndex);
                return v;
            }
            else return null;
        }

        public GetPatternByPoint(pt: Point): PatternBase {
            for (var i = 0; i < this.Patterns.length; i++) {
                if (this.Patterns.Get(i).IsHit(pt))
                    return this.Patterns.Get(i);
            }
            return null;
        }

        public override ViewUpdating(): void {
            this.CalcValueRange();

            for (var i = 0; i < this.Children.length; i++) {
                this.Children[i].ViewUpdating();
            }
        }

        public ClearSelected(): void {
            if (this.Selected) this.Selected = false;

            for (var i = 0; i < this.Patterns.length; i++) {
                this.Patterns.Get(i).ClearSelected();
            }
            //this._auxPatterns.forEach(function (auxPattern) {
            //    auxPattern.Selected = false;
            //});
        }

        public ClearAuxLines(): void {
            //this._auxPatterns.Clear();
        }

        public LoadAuxLines(): void {
            //this._auxPatterns.Clear();
            //if (Chart.AuxLines != null) {
            //    Chart.AuxLines.forEach(function (auxlineStruct) {
            //        var pt: string = auxlineStruct.PanelTag;
            //        if (!string.IsNullOrEmpty(pt) && pt.TrimEnd() == this.Tag) {
            //            var alias: string = auxlineStruct.Id.ToString();
            //            if (!this._auxPatterns.ContainsKey(alias)) {
            //                var aux: AuxPatternBase = AuxLineFactory.GetAuxiliaryLine(auxlineStruct.AuxLinePaintType);
            //                aux.Alias = auxlineStruct.Id.ToString();
            //                var pts: PointD[] = new Array(auxlineStruct.PathPointCount);
            //                var lineName = auxlineStruct.Description.Trim();
            //                aux.Color = ThemePalette.Current.GetStyleByIndex(<number>auxlineStruct.StyleType);
            //                var loc: string = "";
            //                for (var i: number = 0; i < pts.length; i++) {
            //                    pts[i] = new PointD(auxlineStruct.Path[i * 2], auxlineStruct.Path[i * 2 + 1]);
            //                    loc += auxlineStruct.Path[i * 2].ToString().Substring(0, 8) + " ";
            //                }
            //                if (auxlineStruct.AuxLinePaintType.ToString().StartsWith("PaintTool_Point"))
            //                    loc = "";
            //                aux.OriginPath = pts;
            //                aux.Description = lineName + " " + loc;
            //                this._auxPatterns.Add(aux);
            //            }
            //        }
            //    });
            //}
        }

        public override OnPaint(g: IGraphics): void {

            if (this.Chart.Source.Rows.length > 0) {
                this._mainScaleY.OnPaint(g);
                if (Utils.isNotNull(this._secondScaleY)) {
                    this._secondScaleY.OnPaint(g);
                }
                for (var i: number = 0; i < this._patterns.length; i++) {
                    if (this.Patterns.Get(i).Visible)
                        this.Patterns.Get(i).OnPaint(g);
                }
                this._titleCtr.OnPaint(g);
            }

            if (this.Selected) {
                var l: Point = new Point(this.XA(-this.ScaleYWidth + 1), this.YA(-1 - this.TitleHeight));
                Drawer.DrawBoldLine(g, ThemePalette.Current.FrameColor, l, new Point(l.X, l.Y + this.Height), 2);
            }
        }
        private CalcValueRange(): void {
            if (this.Chart.Source.Rows.length > 0) {
                this.MaxValue = Number.MIN_VALUE;
                this.MinValue = Number.MAX_VALUE;
                for (var i: number = 0; i < this._patterns.length; i++) {
                    let pattern = this.Patterns.Get(i);
                    if (pattern.Visible && pattern.CoordinateBaseFirst) {
                        pattern.CalcValueRange();
                        if (Utils.isNotNull(pattern.MaxValue) && this.MaxValue < pattern.MaxValue)
                            this.MaxValue = pattern.MaxValue;
                        if (Utils.isNotNull(pattern.MinValue) && this.MinValue > pattern.MinValue)
                            this.MinValue = pattern.MinValue;
                    }
                }

                if (this.MaxValue == Number.MIN_VALUE) {
                    if (this.MinValue == Number.MAX_VALUE)
                        this.MaxValue = 1;
                    else this.MaxValue = this.MinValue + 1;
                }
                if (this.MinValue == Number.MAX_VALUE) {
                    if (this.MaxValue == Number.MIN_VALUE)
                        this.MinValue = 1;
                    else this.MinValue = this.MaxValue - 1;
                }
                if (this.MaxValue == this.MinValue) {
                    this.MaxValue += 0.1;
                    this.MinValue -= 0.1;
                }
            } else {
                this.MaxValue = 1;
                this.MinValue = 0;
            }
        }

        public override OnMouseEnter(e: MouseEventArgs): void {
            if (this.Chart.Source.Rows.length > 0) {
                if (this.TitleContainer.IsHit(new Point(e.X, e.Y)))
                    this.TitleContainer.OnMouseEnter(e);
                else if (this._mainScaleY.IsHit(new Point(e.X, e.Y))) {
                    this._mainScaleY.OnMouseEnter(e);
                } else if (Utils.isNotNull(this._secondScaleY) && this._secondScaleY.IsHit(new Point(e.X, e.Y))) {
                    this._secondScaleY.OnMouseEnter(e);
                } else {
                    for (var i = 0; i < this.Patterns.length; i++) {
                        if (e.CancelBubbling == 0 && this.Patterns.Get(i).IsHit(new Point(e.X, e.Y)))
                            this.Patterns.Get(i).OnMouseEnter(e);
                    }
                }
            }

            if (!Utils.isNull(this.MouseEnter))
                this.MouseEnter.call(this, e);
        }

        public override OnMouseDown(e: MouseEventArgs): void {
            if (this.Chart.Source.Rows.length > 0) {
                if (this.TitleContainer.IsHit(new Point(e.X, e.Y)))
                    this.TitleContainer.OnMouseDown(e);
                else if (this._mainScaleY.IsHit(new Point(e.X, e.Y))) {
                    this._mainScaleY.OnMouseDown(e);
                } else if (Utils.isNotNull(this._secondScaleY) && this._secondScaleY.IsHit(new Point(e.X, e.Y))) {
                    this._secondScaleY.OnMouseDown(e);
                } else {
                    for (var i = 0; i < this.Patterns.length; i++) {
                        if (e.CancelBubbling == 0 && this.Patterns.Get(i).IsHit(new Point(e.X, e.Y)))
                            this.Patterns.Get(i).OnMouseDown(e);
                    }
                }
            }

            if (!Utils.isNull(this.MouseDown))
                this.MouseDown.call(this, e);
        }

        public override OnMouseUp(e: MouseEventArgs): void {
            if (this.Chart.Source.Rows.length > 0) {
                if (this.TitleContainer.IsHit(new Point(e.X, e.Y)))
                    this.TitleContainer.OnMouseUp(e);
                else if (this._mainScaleY.IsHit(new Point(e.X, e.Y))) {
                    this._mainScaleY.OnMouseUp(e);
                } else if (Utils.isNotNull(this._secondScaleY) && this._secondScaleY.IsHit(new Point(e.X, e.Y))) {
                    this._secondScaleY.OnMouseUp(e);
                } else {
                    for (var i = 0; i < this.Patterns.length; i++) {
                        if (e.CancelBubbling == 0 && this.Patterns.Get(i).IsHit(new Point(e.X, e.Y)))
                            this.Patterns.Get(i).OnMouseUp(e);
                    }
                }
            }

            if (!Utils.isNull(this.MouseUp))
                this.MouseUp.call(this, e);
        }


        public override OnMouseDoubleClick(e: MouseEventArgs): void {
            if (this.Chart.Source.Rows.length > 0) {
                if (this.TitleContainer.IsHit(new Point(e.X, e.Y)))
                    this.TitleContainer.OnMouseDoubleClick(e);
                else if (this._mainScaleY.IsHit(new Point(e.X, e.Y))) {
                    this._mainScaleY.OnMouseDoubleClick(e);
                } else if (Utils.isNotNull(this._secondScaleY) && this._secondScaleY.IsHit(new Point(e.X, e.Y))) {
                    this._secondScaleY.OnMouseDoubleClick(e);
                } else {
                    for (var i = 0; i < this.Patterns.length; i++) {
                        if (e.CancelBubbling == 0 && this.Patterns.Get(i).IsHit(new Point(e.X, e.Y)))
                            this.Patterns.Get(i).OnMouseDoubleClick(e);
                    }
                }
            }

            if (!Utils.isNull(this.MouseDoubleClick))
                this.MouseDoubleClick.call(this, e);
        }

        public override OnMouseClick(e: MouseEventArgs): void {
            if (this.Chart.Source.Rows.length > 0) {
                if (this.TitleContainer.IsHit(new Point(e.X, e.Y)))
                    this.TitleContainer.OnMouseClick(e);
                else if (this._mainScaleY.IsHit(new Point(e.X, e.Y))) {
                    this._mainScaleY.OnMouseClick(e);
                } else if (Utils.isNotNull(this._secondScaleY) && this._secondScaleY.IsHit(new Point(e.X, e.Y))) {
                    this._secondScaleY.OnMouseClick(e);
                } else {
                    for (var i = 0; i < this.Patterns.length; i++) {
                        if (e.CancelBubbling == 0 && this.Patterns.Get(i).IsHit(new Point(e.X, e.Y)))
                            this.Patterns.Get(i).OnMouseClick(e);
                    }
                }
            }

            if (e.CancelBubbling == 0) {
                if (e.Button == MouseButtons.Left) {
                    if (this.Selectable) {
                        this.Selected = true;

                        var e2: PanelSelectChangedArgs = new PanelSelectChangedArgs();
                        e2.SelectedPanel = this;
                        if (!Utils.isNull(this.Chart.PanelSelectChanged)) this.Chart.PanelSelectChanged.call(this, e2);

                        this.Chart.Refresh();
                    }
                }
                else if (e.Button == MouseButtons.Right) {
                    if (e.X > this.WorkAreaLocationA.X && e.X < this.WorkAreaLocationA.X + this.WorkAreaWidth && e.Y > this.WorkAreaLocationA.Y && e.Y < this.WorkAreaLocationA.Y + this.WorkAreaHeight) {
                        this.Chart.OnPanelContextMenu(Object.assign(new PanelContextMenuArgs(), {
                            SelectedPanel: this,
                            X: e.X,
                            Y: e.Y
                        }));
                    }
                }

                if (!Utils.isNull(this.MouseClick))
                    this.MouseClick.call(this, e);
            }
        }
    }

}