/// <reference path="VisualComponent.ts"/>

namespace zsaltec.KChart {

    export class PaintLineTool extends VisualComponent {
    //    private _defaultTemplate: AuxPathTemplate;
    //    private _pathPointIndex: number;
    //    private _path: Point[];
    //    private _template: AuxPathTemplate;
    //    private _lastPoint: Point;
    //    private _paintType: number;
    //    private _auxiliaryFunctional: AuxiliaryFunctional;
    //    private _canvasPanel: ChartPanel;
    //    public get PaintType(): number {
    //        return this._paintType;
    //    }
    //    public set PaintType(value: number) {
    //        switch (value) {
    //            case AuxLinePaintType.Auxiliary_ZoomLine:
    //                this._template = this._defaultTemplate;
    //                this.Reset();
    //                break;
    //            //case AuxLinePaintType.Auxiliary_StatisticLine:
    //            //    var srl: StatisticLine = new StatisticLine();
    //            //    srl.ParentVisualComponent = this;
    //            //    this._template = srl.GetGraphicTemplate();
    //            //    this.Reset();
    //            //    break;
    //            //default:
    //            //    var arl: AuxPatternBase = AuxLineFactory.GetAuxiliaryLine(value);
    //            //    this._template = arl.GetGraphicTemplate();
    //            //    this.Reset();
    //            //    break;
    //        }
    //        this._paintType = value;
    //    }
    //    public get CanvasPanel(): ChartPanel {
    //        return this._canvasPanel;
    //    }
    //    public set CanvasPanel(value: ChartPanel) {
    //        this._canvasPanel = value;
    //    }
    //    public get AuxiliaryFunctional(): AuxiliaryFunctional {
    //        return this._auxiliaryFunctional;
    //    }
    //    public set AuxiliaryFunctional(value: AuxiliaryFunctional) {
    //        switch (value) {
    //            case AuxiliaryFunctional.Zoom:
    //                this.PaintType = AuxLinePaintType.Auxiliary_ZoomLine;
    //                break;
    //            //case this.AuxiliaryFunctional.PaintLine:
    //            //    this.PaintType = AuxLinePaintType.PaintTool_StraightLine;
    //            //    break;
    //            //case Tool.AuxiliaryFunctional.Statistic:
    //            //    this.PaintType = AuxLinePaintType.Auxiliary_StatisticLine;
    //            //    break;
    //        }
    //        this._auxiliaryFunctional = value;
    //    }
    //    constructor(parent: IChartElement) {
    //        super(parent);

    //        this._pathPointIndex = -1;
    //        this._path = [];
    //        var arl: RectangleLine = new RectangleLine(parent);
    //        arl.Color = ThemePalette.Current.Color6;
    //        this._defaultTemplate = arl.GetGraphicTemplate();
    //        this.AuxiliaryFunctional = AuxiliaryFunctional.Zoom;
    //    }
    //    public Reset(): void {
    //        this._pathPointIndex = -1;
    //        this._path = [];
    //        this._canvasPanel = null;
    //    }
    //    public OnMouseDown(e: MouseEventArgs): void {
    //        super.OnMouseDown(e);
    //        if (this._template != null) {
    //            if (e.Button == MouseButtons.Left && this.AuxiliaryFunctional == AuxiliaryFunctional.Statistic)
    //                this.AuxiliaryFunctional = AuxiliaryFunctional.Zoom;
    //            else if (e.Button == MouseButtons.Right && this.AuxiliaryFunctional == AuxiliaryFunctional.Zoom)
    //                this.AuxiliaryFunctional = AuxiliaryFunctional.Statistic;
    //            if ((this._auxiliaryFunctional == this.Tool.AuxiliaryFunctional.PaintLine && e.Button == MouseButtons.Left) || (this._auxiliaryFunctional == this.Tool.AuxiliaryFunctional.Zoom && e.Button == MouseButtons.Left) || (this._auxiliaryFunctional == this. Tool.AuxiliaryFunctional.Statistic && e.Button == MouseButtons.Right)) {
    //                if (this._pathPointIndex < 0) {
    //                    this._canvasPanel = this.Chart.Frame.GetPanelByPoint(e.Location);
    //                    if (this._canvasPanel == null) {
    //                        this.Reset();
    //                        return
    //                    }
    //                }
    //                this._pathPointIndex++;
    //                if (this._pathPointIndex > this._template.PathPointCount - 1) {
    //                    this.Reset();
    //                    return
    //                }
    //                var apinfo: AuxPointInfo = this._template.GetPathPoint(this._pathPointIndex);
    //                if (apinfo.MouseAction == MouseAction.MouseDown) {
    //                    if (apinfo.RecordPosition) {
    //                        if (!apinfo.AllowRepeatPoint) {
    //                            if (this._path.length > 0 && this._path[this._path.length - 1].X == e.X && this._path[this._path.length - 1].Y == e.Y) {
    //                                this.Reset();
    //                                return
    //                            }
    //                        }
    //                        this._path.push(new Point(e.X, e.Y));
    //                    }
    //                    if (this._pathPointIndex >= this._template.PathPointCount - 1) {
    //                        if (this.PaintFinished != null)
    //                            this.PaintFinished.Invoke(this, Object.assign(new AuxPaintFinishedArgs(), {
    //                                PathPoints: this._path,
    //                                Button: e.Button,
    //                                Location: e.Location
    //                            }));
    //                        this.Reset();
    //                    }
    //                }
    //                else {
    //                    this.Reset();
    //                }
    //            }
    //        }
    //    }
    //    public OnMouseMove(e: MouseEventArgs): void {
    //        super.OnMouseMove(e);
    //        if (this.Chart.Frame.SlideMode) {
    //            this.Reset();
    //            return
    //        }
    //        if (this._template != null) {
    //            if (this._pathPointIndex >= 0) {
    //                var apinfo: AuxPointInfo = this._template.GetPathPoint(this._pathPointIndex);
    //                if (apinfo.MouseAction != MouseAction.MouseMove) {
    //                    this._pathPointIndex++;
    //                    if (this._pathPointIndex >= this._template.PathPointCount - 1) {
    //                        this.Reset();
    //                        return
    //                    }
    //                    var panel: ChartPanel = this.Chart.Frame.GetPanelByPoint(new Point(e.X, e.Y));
    //                    if (panel != null) {
    //                        var cp: Point = panel.InnterLocationA;
    //                        var rec: Rectangle = new Rectangle(cp.X + 1, cp.Y + 1, panel.WorkAreaWidth - 2, panel.WorkAreaHeight - 2);
    //                        apinfo = this._template.GetPathPoint(this._pathPointIndex);
    //                    }
    //                    else {
    //                        this.Reset();
    //                        return
    //                    }
    //                }
    //                if (apinfo.MouseAction == MouseAction.MouseMove) {
    //                    if (apinfo.RecordPosition) {
    //                        if (this._path.length == this._pathPointIndex) {
    //                            this._path.push(new Point(e.X, e.Y));
    //                        }
    //                        else if (this._path.length == this._pathPointIndex + 1) {
    //                            this._path[this._pathPointIndex] = new Point(e.X, e.Y);
    //                        }
    //                    }
    //                    this._lastPoint = new Point(e.X, e.Y);
    //                }
    //                else {
    //                    this.Reset();
    //                }
    //            }
    //        }
    //    }
    //    public OnMouseUp(e: MouseEventArgs): void {
    //        super.OnMouseUp(e);
    //        if (this._template != null) {
    //            if ((this._auxiliaryFunctional == this.Tool.AuxiliaryFunctional.PaintLine && e.Button == MouseButtons.Left) || (this._auxiliaryFunctional == Tool.AuxiliaryFunctional.Zoom && e.Button == MouseButtons.Left) || (this._auxiliaryFunctional == Tool.AuxiliaryFunctional.Statistic && e.Button == MouseButtons.Right)) {
    //                this._pathPointIndex++;
    //                if (this._pathPointIndex > this._template.PathPointCount - 1) {
    //                    this.Reset();
    //                    return
    //                }
    //                var apinfo: AuxPointInfo = this._template.GetPathPoint(this._pathPointIndex);
    //                if (apinfo.MouseAction == MouseAction.MouseUp) {
    //                    if (apinfo.RecordPosition) {
    //                        this._path.push(new Point(e.X, e.Y));
    //                    }
    //                    if (this._pathPointIndex >= this._template.PathPointCount - 1) {
    //                        if (this.PaintFinished != null) {
    //                            e.CancelBubbling = 1;
    //                            this.PaintFinished.Invoke(this, Object.assign(new AuxPaintFinishedArgs(), {
    //                                PathPoints: this._path,
    //                                Location: e.Location
    //                            }));
    //                        }
    //                        this.Reset();
    //                    }
    //                }
    //                else {
    //                    this.Reset();
    //                }
    //            }
    //        }
    //    }
    //    public Save(): void {
    //        if (!Utils.IsNullOrEmpty(this.Chart.DataID)) {
    //            var pis: number[] = new Array(20);
    //            var ok: boolean = true;
    //            var chart = this._canvasPanel.Chart;
    //            for (var i: number = 0; i < this._path.length; i++) {
    //                var point = this._path[i];
    //                var x: number = chart.GetRecordIndex(point.X);
    //                if (x < 0 && i != 0) {
    //                    pis[i * 2] = chart.Source.Columns.Get(CompactSeries.DATETIME_FIELD].GetValue(0);
    //                    var x0: number = chart.GetRecordIndex(this._path[0].X);
    //                    var yp: number = (0 - x) / <number>(x0 - x) * (this._path[0].Y - point.Y) + point.Y;
    //                    var y: number = this._canvasPanel.GetScaleYValue(<number>yp);
    //                    if (y != null)
    //                        pis[i * 2 + 1] = <number>y;
    //                    else {
    //                        ok = false;
    //                        break;
    //                    }
    //                }
    //                else {
    //                    if (x < chart.Source.Rows.length && x >= 0) {
    //                        var tmp: number = chart.Source.Columns.Get(CompactSeries.DATETIME_FIELD].GetValue(x);
    //                        pis[i * 2] = tmp;
    //                    }
    //                    else {
    //                        ok = false;
    //                        break;
    //                    }
    //                    var y: number = this._canvasPanel.GetScaleYValue(point.Y);
    //                    if (y != null)
    //                        pis[i * 2 + 1] = <number>(y);
    //                    else {
    //                        ok = false;
    //                        break;
    //                    }
    //                }
    //            }
    //            if (ok) {
    //                var astr: AuxlineStruct = Object.assign(new AuxlineStruct(), {
    //                    Id:(new Date())+"" ,
    //                    AuxLinePaintType: this.PaintType,
    //                    PanelTag: this._canvasPanel.Tag.PadRight(32, ' '),
    //                    PathPointCount: this._path.length,
    //                    Path: pis
    //                });
    //                FileStore.SaveAuxLine(Chart.DataID, astr);
    //            }
    //        }
    //    }
    //    public override OnPaint(g: IGraphics): void {
    //        if (this._pathPointIndex >= 0) {
    //            var al: AuxPatternBase = this._template.GetPathPoint(this._pathPointIndex).AuxLineDrawer;
    //            if (al != null) {
    //                al.Width = this._canvasPanel.WorkAreaWidth;
    //                al.Height = this._canvasPanel.WorkAreaHeight;
    //                al.LocationA = this._canvasPanel.InnterLocationA;
    //                al.DoLayout();
    //                var tmp: Point[] = new Array(this._path.length + 1);
    //                this._path.CopyTo(tmp);
    //                tmp[tmp.length - 1] = this._lastPoint;
    //                al.CalcCriticalPath(tmp);
    //                al.OnPaint(g);
    //            }
    //        }
    //    }
    //    public override InitializeComponent(): void {

    //    }
    //    public override DoLayout(): void {

    //    }
    //    public override  ViewUpdating(): void {

    //    }
    //}

    //export class AuxPathTemplate {
    //    private _paths: AuxPointInfo[];
    //    public get PathPointCount(): number {
    //        return this._paths.length;
    //    }
    //    constructor() {
    //        this._paths = [];
    //    }
    //    public GetPathPoint(pathIndex: number): AuxPointInfo {
    //        return this._paths[pathIndex];
    //    }
    //    public AddPathPoint(auxPointInfo: AuxPointInfo): void {
    //        this._paths.push(auxPointInfo);
    //    }
    //}

    //export class AuxPointInfo {
    //    private _allowRepeatPoint: boolean = false;
    //    public RecordPosition: boolean;
    //    public MouseAction: MouseAction;
    //    public AuxLineDrawer: AuxPatternBase;
    //    public get AllowRepeatPoint(): boolean {
    //        return this._allowRepeatPoint;
    //    }
    //    public set AllowRepeatPoint(value: boolean) {
    //        this._allowRepeatPoint = value;
    //    }
    //}


    //export class AuxPatternBase extends VisualComponent {
    //    private _parentPanel: ChartPanel;
    //    private _selectable: boolean = true;
    //    private _tipEnabled: boolean = true;
    //    private _color: string;

    //    public override DoLayout(): void {
    //        this.InnterLocationA = new Point(super.LocationA.X, super.LocationA.Y);
    //        this.WorkAreaWidth = super.Width;
    //        this.WorkAreaHeight = super.Height;
    //    }

    //    public CalcCriticalPath(paths: Point[]): void { throw new Error('not implemented'); }

    //    protected GetCrossValue(p1: Point, p2: Point, left: number, right: number, top: number, bottom: number): Point[] {
    //        return null;
    //    }
    //    public GetGraphicTemplate(): AuxPathTemplate { throw new Error('not implemented'); }

    //    protected GetPointMirrorSlopeStraightLineLocation(p1: Point, p2: Point, p3: Point): Point[] {
    //        var p4: Point;
    //        var x: number;
    //        var p: Point[];
    //        var ps: Point[] = [];
    //        if (p1.X == p2.X) {
    //            x = (p1.X * 2) - p3.X;
    //            if ((x > this._left) && (x < this._right)) {
    //                p4 = new Point(<number>x, p3.Y);
    //                p = this.GetPointSlopeStraightLineLocation(p1, p2, p4);
    //                ps.push(...p);
    //            }
    //        }
    //        else {
    //            var y: number;
    //            if (p1.Y == p2.Y) {
    //                y = (p1.Y * 2) - p3.Y;
    //                if ((y > this._top) && (y < this._bottom)) {
    //                    p4 = new Point(p3.X, <number>y);
    //                    p = this.GetPointSlopeStraightLineLocation(p1, p2, p4);
    //                    ps.push(...p);
    //                }
    //            }
    //            else {
    //                var k: number = (<number>(p1.Y - p2.Y)) / (<number>(p1.X - p2.X));
    //                var k1: number = -1.0 / k;
    //                var yd: number = p2.Y - p1.Y;
    //                var xd: number = p2.X - p1.X;
    //                x = (((((-xd * k1) * p3.X) + (p3.Y * xd)) - (p1.Y * xd)) + (p1.X * yd)) / (yd - (xd * k1));
    //                y = (((x - p1.X) * yd) / xd) + p1.Y;
    //                var x4: number = (x * 2.0) - p3.X;
    //                var y4: number = (y * 2.0) - p3.Y;
    //                p4 = new Point(<number>x4, <number>y4);
    //                p = this.GetPointSlopeStraightLineLocation(p1, p2, p4);
    //                ps.push(...p);
    //            }
    //        }
    //        return ps;
    //    }

    //    protected GetPointSlopeStraightLineLocation(p1: Point, p2: Point, p3: Point): Point[] {
    //        var minX: number = this._left;
    //        var maxX: number = this._right;
    //        var minY: number = this._top;
    //        var maxY: number = this._bottom;
    //        var Xd: number = p2.X - p1.X;
    //        var Yd: number = p2.Y - p1.Y;
    //        var ps: Point[] = [];
    //        if (Xd == 0.0) {
    //            if ((p3.X <= maxX) && (p3.X >= minX)) {
    //                ps.push(new Point(p3.X, <number>maxY));
    //                ps.push(new Point(p3.X, <number>minY));
    //            }
    //        }
    //        else if (Yd == 0.0) {
    //            if ((p3.Y <= maxY) && (p3.Y >= minY)) {
    //                ps.push(new Point(<number>minX, p3.Y));
    //                ps.push(new Point(<number>maxX, p3.Y));
    //            }
    //        }
    //        else {
    //            var k: number = Yd / Xd;
    //            var y: number = ((minX - p3.X) * k) + p3.Y;
    //            var skip: boolean = false;
    //            if ((y <= maxY) && (y >= minY)) {
    //                ps.push(new Point(<number>minX, <number>y));
    //                if (ps.length >= 2) {
    //                    skip = true;
    //                }
    //            }
    //            if (!skip) {
    //                y = ((maxX - p3.X) * k) + p3.Y;
    //                if ((y <= maxY) && (y >= minY)) {
    //                    ps.push(new Point(<number>maxX, <number>y));
    //                    if (ps.length >= 2) {
    //                        skip = true;
    //                    }
    //                } if (!skip) {
    //                    var x: number = ((minY - p3.Y) / k) + p3.X;
    //                    if ((x <= maxX) && (x >= minX)) {
    //                        ps.push(new Point(<number>x, <number>minY));
    //                        if (ps.length >= 2) {
    //                            skip = true;
    //                        }
    //                    } if (!skip) {
    //                        x = ((maxY - p3.Y) / k) + p3.X;
    //                        if ((x <= maxX) && (x >= minX)) {
    //                            ps.push(new Point(<number>x, <number>maxY));
    //                            if (ps.length >= 2) {

    //                            }
    //                        }
    //                    }
    //                }
    //            }
    //        }
    //        return ps;
    //    }
    //    protected GetTwoPointStraightLineLocation(p1: Point, p2: Point): Point[] {
    //        var minX: number = this._left;
    //        var maxX: number = this._right;
    //        var minY: number = this._top;
    //        var maxY: number = this._bottom;
    //        var Xd: number = p2.X - p1.X;
    //        var Yd: number = p2.Y - p1.Y;
    //        var ps: Point[] = [];
    //        if (Xd == 0) {
    //            if (p2.X <= maxX && p2.X >= minX) {
    //                ps.push(new Point(<number>p2.X, <number>maxY));
    //                ps.push(new Point(<number>p2.X, <number>minY));
    //            }
    //        }
    //        else if (Yd == 0) {
    //            if (p2.Y <= maxY && p2.Y >= minY) {
    //                ps.push(new Point(<number>minX, <number>p2.Y));
    //                ps.push(new Point(<number>maxX, <number>p2.Y));
    //            }
    //        }
    //        else {
    //            var skip = false;
    //            var y: number = (minX - p1.X) * Yd / Xd + p1.Y;
    //            if (y <= maxY && y >= minY) {
    //                ps.push(new Point(<number>minX, <number>y));
    //                if (ps.length >= 2) {
    //                    skip = true;
    //                }
    //            }
    //            if (!skip) {
    //                y = (maxX - p1.X) * Yd / Xd + p1.Y;
    //                if (y <= maxY && y >= minY) {
    //                    ps.push(new Point(<number>maxX, <number>y));
    //                    if (ps.length >= 2) {
    //                        skip = true;
    //                    }
    //                } if (!skip) {
    //                    var x: number = (minY - p1.Y) * Xd / Yd + p1.X;
    //                    if (x <= maxX && x >= minX) {
    //                        ps.push(new Point(<number>x, <number>minY));
    //                        if (ps.length >= 2) {
    //                            skip = true;
    //                        }
    //                    } if (!skip) {
    //                        x = (maxY - p1.Y) * Xd / Yd + p1.X;
    //                        if (x <= maxX && x >= minX) {
    //                            ps.push(new Point(<number>x, <number>maxY));
    //                            if (ps.length >= 2) {
    //                                skip = true;
    //                            }
    //                        }
    //                    }
    //                }
    //            }
    //        }
    //        end:
    //        return ps;
    //    }
    //    public InitializeComponent(): void {

    //    }
    //    public OnMouseClick(e: MouseEventArgs): void {
    //        super.OnMouseClick(e);
    //        if ((e.Button == MouseButtons.Left)) {
    //            this.Selected = true;
    //            e.CancelBubbling = 1;
    //        }
    //    }
    //    public OnPaintFloatingLayer(g: IGraphics): void {
    //        if (this.Selectable && this.Selected) {
    //            this.ShowSelectedStyle(g);
    //        }
    //    }
    //    protected ShowSelectedStyle(g: IGraphics): void {
    //        if (this.CriticalPath != null) {
    //            this.CriticalPath.forEach(function (point) {
    //                var p: Point = new Point(point.X - 3, point.Y - 3);
    //                Drawer.FillRectangle(g, ThemePalette.Current.SelectedBlock, new Rectangle(p.X, p.Y, 6, 6));
    //            });
    //        }
    //    }
    //    public ShowTip(point: Point): void {
    //        if (this.TipEnabled) {
    //            var p: Point = new Point(point.X, point.Y + 20);
    //            if ((point.X + 0x54) > super.AX(super.WorkAreaWidth)) {
    //                p.X -= 0x54;
    //            }
    //            this.Chart.ToolTip.Location = p;
    //            this.Chart.ToolTip.Type = ToolTipType.NamedTip;
    //            this.Chart.ToolTip.Items.Clear();
    //            this.Chart.ToolTip.GroupName = "";
    //            this.Chart.ToolTip.Title = this.Description; 
    //        }
    //    }
    //    protected TestInLine(p: Point, p1: Point, p2: Point): boolean {
    //        var xd: number = p2.X - p1.X;
    //        var yd: number = p2.Y - p1.Y;
    //        if (xd == 0.0) {
    //            return ((p.X == p1.X) && ((p.Y > super.LocationA.Y) && (p.Y < (super.LocationA.Y + super.WorkAreaHeight))));
    //        }
    //        if (yd == 0.0) {
    //            return ((p.Y < (p1.Y + 4.0)) && (p.Y > (p1.Y - 4.0)) && ((p.X > super.LocationA.X) && (p.X < (super.LocationA.X + super.WorkAreaWidth))));
    //        }
    //        var y: number = (((<number>(p.X - p1.X)) / xd) * yd) + p1.Y;
    //        return ((p.Y < (y + 4.0)) && (p.Y > (y - 4.0)));
    //    }
    //    public ViewUpdating(): void {
    //        this.CriticalPath = null;
    //        if ((this.OriginPath.length > 0) && (this._parentPanel.Chart.Source.Rows.length > 0)) {
    //            var paths: Point[] = new Array(this.OriginPath.length);
    //            var chart: StockChartView = this.Chart;
    //            var dv: DataView = chart.DataView;
    //            var column: SeriesColumn = chart.Source.Columns.Get(StockChartView.DatetimeField];
    //            var minutemode: boolean = false;
    //            if (column.GetValue(0).ToString().Length >= 12)
    //                minutemode = true;
    //            for (var i: number = 0; i < this.OriginPath.length; i++) {
    //                var trdate: number = this.OriginPath[i].X;
    //                var x: number = -1;
    //                if (minutemode) {
    //                    x = column.FindSortedValue(trdate);
    //                }
    //                else {
    //                    x = column.FindSortedValue(<number>(trdate / 10000.0));
    //                }
    //                if (x < 0) {
    //                    return
    //                }
    //                paths[i] = new Point(super.AX(dv.GetRLeft(x)), this._parentPanel.Value2YA(this.OriginPath[i].Y));
    //            }
    //            this.CalcCriticalPath(paths);
    //        }
    //    }
    //    public get Color(): string {
    //        return this._color;
    //    }
    //    public set Color(value: string) {
    //        this._color = value;
    //    }
    //    protected get _bottom(): number {
    //        return (super.InnterLocationA.Y + super.WorkAreaHeight);
    //    }
    //    protected get _left(): number {
    //        return super.InnterLocationA.X;
    //    }
    //    protected get _right(): number {
    //        return (super.InnterLocationA.X + super.WorkAreaWidth);
    //    }
    //    protected get _top(): number {
    //        return super.InnterLocationA.Y;
    //    }
    //    public Alias: string;
    //    public CriticalPath: Point[];
    //    public Description: string;
    //    public OriginPath: Point[];
    //    public get Panel(): ChartPanel {
    //        return this._parentPanel;
    //    }
    //    public set Panel(value: ChartPanel) {
    //        this._parentPanel = value;
    //    }
    //    public get Selectable(): boolean {
    //        return this._selectable;
    //    }
    //    public set Selectable(value: boolean) {
    //        this._selectable = value;
    //    }
    //    public Selected: boolean;
    //    public get TipEnabled(): boolean {
    //        return this._tipEnabled;
    //    }
    //    public set TipEnabled(value: boolean) {
    //        this._tipEnabled = value;
    //    }
    //}

    //export class RectangleLine extends AuxPatternBase {
    //    public IsHit(p: Point): boolean {
    //        return false;
    //    }
    //    protected ShowSelectedStyle(g: IGraphics): void {

    //    }
    //    public GetGraphicTemplate(): AuxPathTemplate {
    //        var tpl: AuxPathTemplate = new AuxPathTemplate();

    //        var ap1 = new AuxPointInfo();
    //        ap1.MouseAction = MouseAction.MouseDown;
    //        ap1.RecordPosition = true;
    //        tpl.AddPathPoint(ap1);

    //        var ap2 = new AuxPointInfo();
    //        ap2.MouseAction = MouseAction.MouseMove;
    //        ap2.RecordPosition = false;
    //        ap2.AuxLineDrawer = this;
    //        tpl.AddPathPoint(ap2);

    //        var ap3 = new AuxPointInfo();
    //        ap3.MouseAction = MouseAction.MouseUp;
    //        ap3.RecordPosition = true;
    //        return tpl;
    //    }
    //    public CalcCriticalPath(paths: Point[]): void {
    //        this.  CriticalPath = paths;
    //    }
    //    public OnPaint(g: IGraphics): void {
    //        if (this.CriticalPath != null && this.CriticalPath.length > 1) {
    //            var p1: Point = this.CriticalPath[0];
    //            var p2: Point = this.CriticalPath[this.CriticalPath.length - 1];
    //            var x1: number = Math.min(p1.X, p2.X);
    //            var y1: number = Math.min(p1.Y, p2.Y);
    //            var width: number = Math.abs(p1.X - p2.X);
    //            var heigh: number = Math.abs(p1.Y - p2.Y);
    //            Drawer.DrawRectangle(g, this.Color, new Rectangle(x1, y1, width, heigh));
    //        }
    //    }
    }
}