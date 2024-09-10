namespace zsaltec.KChart {
    //这个类库提供了一个灵活的网页版框架，用于创建股票K线图。你可以根据需要自定义图表的布局、数据和样式。
    //股票图表的视图。它包含一个ICanvas用于绘制图形，以及一个IFrame用于管理图表的布局。它还提供了一些事件处理方法，如OnSizeChanged、OnKeyDown等。
    export class StockChartView implements IChartElement {
        public MouseClick: MouseEventHandler = null;
        public MouseDoubleClick: MouseEventHandler = null;
        public MouseMove: MouseEventHandler = null;
        public MouseDown: MouseEventHandler = null;
        public MouseUp: MouseEventHandler = null;
        public MouseLeave: EventHandler = null;
        public MouseEnter: EventHandler = null;
        public KeyDown: KeyEventHandler = null;
        public KeyUp: KeyEventHandler = null;

        public PanelSelectChanged: PanelSelectChangedHandler = null;
        public FocusedRecordChanged: FocusedChangedHandler = null;
        public CrosshairVisibleChanged: CrosshairVisibleChangedHandler = null;
        public PanelContextMenu: PanelContextMenuHandler = null;
        public StatisticContextMenu: StatisticContextMenuHandler = null;
        public PatternDbClick: PatternDbClickHandler = null;
        public PanelTitleDbClick: PanelTitleDbClickHandler = null;
        public AuxPaintFinished: AuxPaintFinishedHandler = null;

        public Width: number = null;
        public Height: number = null;
        public Graphics: IGraphics = null;
        public Source: CompactSeries = null;
        public FocusInfo: FocusRecordInfo = null;
        public ChartType: ChartType = ChartType.Day;
        public DataID: string = null;
        public ToolTip: StockToolTip = null;
        //public AuxLines: AuxlineStruct[]=null; 
        public PanInterval: number = 1;

        private _view: DataView;
        public get View(): DataView {
            return this._view;
        }
        public set View(value: DataView) {
            this._view = value;
            if (this._inited) {
                this._view.InitializeComponent();
            }
        }
        protected _frame: AccordionFrame;
        public get Frame(): AccordionFrame {
            return this._frame;
        }
        public set Frame(value: AccordionFrame) {
            this._frame = value;
            this._frame.ParentVisualComponent = this;
            if (this._inited) {
                this._frame.InitializeComponent();
            }
        }
        protected _auxTool: PaintLineTool;
        public get AuxTool(): PaintLineTool {
            return this._auxTool;
        }
        public set AuxTool(auxTool: PaintLineTool) {
            this._auxTool = auxTool;
            this._auxTool.ParentVisualComponent = this;
            if (this._inited) {
                this._auxTool.InitializeComponent();
            }
        }

        protected _showCrosshair: boolean = false;
        public get ShowCrosshair(): boolean {
            return this._showCrosshair;
        }

        public set ShowCrosshair(value: boolean) {
            if (this._showCrosshair != value) {
                this._showCrosshair = value;
                var e2: CrosshairVisibleChangedArgs = Object.assign(new CrosshairVisibleChangedArgs(), { Visible: value });
                this.OnCrosshairVisibleChanged(e2);
            }
        }

        public get SelectedPanel(): ChartPanel {
            return this.Frame.SelectedPanel;
        }
        public AddPanel(panel: ChartPanel) {
            this.Frame.Panels.Add(panel);
        }
        //public get AuxLines(): AuxlineStruct[] {
        //    return this._AuxLines;
        //}
        //public set AuxLines(value: AuxlineStruct[]) {
        //    this._AuxLines = value;
        //}

        public Options: object;

        protected _inited: boolean = false;
        protected _useCachedImage: number = 0;
        protected _bufferImage: any = null;
        protected _mouseDownLocation: Point;
        protected _cursorPosition: Point = new Point(0, 0);

        public constructor(canvasWidth: number, canvasHeight: number, graphics: IGraphics) {
            this.Width = canvasWidth;
            this.Height = canvasHeight;
            this.Graphics = graphics;
        }

        public InitializeComponent(): void {

            if (Utils.isNull(this.Source))
                this.Source = new CompactSeries(this);
            if (Utils.isNull(this.Frame))
                this.Frame = new DateLineFrame();
            if (Utils.isNull(this.View))
                this.View = new CandleDataView(this);
            if (Utils.isNull(this.ToolTip))
                this.ToolTip = new StockToolTip();
            if (Utils.isNull(this.FocusInfo))
                this.FocusInfo = new FocusRecordInfo(this);
            if (Utils.isNull(this.AuxTool)) {
                this.AuxTool = new PaintLineTool();
            }

            this.Frame.InitializeComponent();
            this.View.InitializeComponent();
            this.AuxTool.InitializeComponent();
            this.AuxTool.PaintFinished = this.AuxiliaryLineTool_PaintFinished;
            this._inited = true;
        }

        public Value2YA(panelIndex: number, v: any): number {
            return this.Frame.Value2YA(panelIndex, v);
        }

        public Index2XA(recordIndex: number): number {
            return this.Frame.Index2XA(recordIndex);
        }

        public XA2Index(ax: number): number {
            return this.Frame.XA2Index(ax);
        }

        public DoLayout(): void {
            if ((this.Width != 0) && (this.Height != 0)) {
                this.AuxTool.Width = this.Width;
                this.AuxTool.Height = this.Height;
                this.AuxTool.LocationA = new Point(0, 0);
                this.AuxTool.DoLayout();

                this.Frame.Width = this.Width;
                this.Frame.Height = this.Height;
                this.Frame.LocationA = new Point(0, 0);
                this.Frame.DoLayout();

                this.View.WorkAreaWidth = this.Frame.DataViewWidth;

                this.AuxTool.AfterDoLayout();
                this.Frame.AfterDoLayout();
            }
            this.Refresh();
        }

        public Zoomin(): void {
            if (this.View.LeftRecordIndex > this.View.RightRecordIndex) {
                var oi: number = this.FocusInfo.RecordIndex;
                if (oi >= 0 && this.ShowCrosshair)
                    this.View.ZoomOriginIndex = oi;
                else
                    this.View.ZoomOriginIndex = -1;
                this.View.Zoomin();
            }

            if (this.View.LeftRecordIndex > this.View.RightRecordIndex) {
                if (this.FocusInfo.FocusClosePrice && this.FocusInfo.RecordIndex >= 0 && this.FocusInfo.RecordIndex < this.View.LeftRecordIndex) {
                    this.FocusInfo.FocusLocation =
                        new Point(this.Index2XA(this.FocusInfo.RecordIndex), this.Frame.Panels.Get(0).GetYRecordInfo(this.FocusInfo.RecordIndex).AY);
                }
            }
            this.Refresh();
        }

        public Pan(n: number): void {
            this.View.ZoomOriginIndex = -1;

            this.View.Pan(n);

            this.Refresh();
        }

        public Zoomout(): void {
            if (this.View.LeftRecordIndex > this.View.RightRecordIndex) {
                var oi: number = this.FocusInfo.RecordIndex;
                if (oi >= 0 && this.ShowCrosshair)
                    this.View.ZoomOriginIndex = oi;
                else
                    this.View.ZoomOriginIndex = -1;
                this.View.Zoomout();
            }


            if (this.View.LeftRecordIndex > this.View.RightRecordIndex) {
                if (this.FocusInfo.FocusClosePrice && this.FocusInfo.RecordIndex >= 0 && this.FocusInfo.RecordIndex < this.View.LeftRecordIndex) {
                    this.FocusInfo.FocusLocation =
                        new Point(this.Index2XA(this.FocusInfo.RecordIndex), this.Frame.Panels.Get(0).GetYRecordInfo(this.FocusInfo.RecordIndex).AY);
                }
            }

            this.Refresh();
        }

        public ZoomTo(displayLevel: number): void {
            if (this.Source.Rows.length > 0) {
                var oi: number = this.FocusInfo.RecordIndex;
                if (oi >= 0)
                    this.View.ZoomOriginIndex = oi;
                this.View.ZoomTo(displayLevel);
            }
            this.Refresh();
        }

        public Zoom(left: number, right: number): void {
            this.View.ZoomOriginIndex = -1;

            if (left > 0) {
                if (right < 0)
                    right = 0;

                this.View.Zoom(left, right);
            }

            this.Refresh();
        }

        public Refresh(): void {
            this.ViewUpdating();

            this._useCachedImage = 0;
            this.OnPaint(this.Graphics);
        }

        public GotoDate(date: number, showCount: number): number {
            var TrdateB = this.Source.Columns.Get(CompactSeries.DATETIME_FIELD);
            var index = TrdateB.FindSortedValue(date);
            if (index == -1) {
                for (var i = 0; i < TrdateB.length; i++) {
                    if (date >= TrdateB.GetValue(i)) {
                        index = i;
                        break;
                    }
                }
            }
            var right = showCount / 2 - 1;
            var left = showCount / 2 + 1;
            if (index > right && index + left < TrdateB.length) {
                this.Zoom(index + left, index - right);
            }
            else if (index > 50) {
                if (index < TrdateB.length - 55)
                    this.Zoom(index + 40, index - 55);
                else if (index < TrdateB.length - 15)
                    this.Zoom(index + 10, index - 15);
            }
            return index;
        }

        public LoadData(dataID: string, dataName: string, type: ChartType, columNames: string[], dataTable: any[][], options: object): void {
            this.DataID = dataID;
            this.Options = options;

            if (this.ChartType != type) {
                this.ChartType = type;
                if (this.ChartType != ChartType.SecondReport) {
                    let frame = new DateLineFrame();
                    frame.XScale = new DateScale(CompactSeries.DATETIME_FIELD);
                    this.Frame = frame;

                    this.DoLayout();
                }
            }
            else {
                //for (var panel in this.Frame.Panels) {
                //    panel.ClearAuxLines();
                //}
            }
            this.Frame.Panels.Get(0).Text = dataName;

            this.Source = new CompactSeries(this);
            for (var i = 0; i < columNames.length; i++) {
                var name = columNames[i];
                this.Source.Columns.Add(name);
            }
            for (var r = 0; r < dataTable.length; r++) {
                var newRow = this.Source.CreateNewRow();
                for (var c = 0; c < dataTable[r].length; c++) {
                    var value = dataTable[r][c];
                    newRow.Set(c, value);
                }
            }

            //this._AuxLines = this.FileStore.LoadAuxLines(dataID);
            //for (var panel in this.Frame.Panels) {
            //    panel.LoadAuxLines();
            //}
        }

        public ClearAllSelected(): void {
            this.Frame.ClearSelected();
        }

        private ViewUpdating(): void {
            this.View.ViewUpdating();
            this.Frame.ViewUpdating();

            if (!Utils.isNull(this.FocusInfo.RecordIndex))
                this.OnFocusedRecordChanged(Object.assign(new FocusedChangedArgs(),
                    {
                        SeriesRowIndex: this.FocusInfo.RecordIndex,
                        X: this.FocusInfo.FocusLocation.X,
                        Y: this.FocusInfo.FocusLocation.Y
                    }));
        }

        public OnPaint(g: IGraphics): void {
            try {
                if (Utils.isNull(g) == false) {
                    if (this._useCachedImage == 0) {
                        Drawer.Clear(g, ThemePalette.Current.BackgroundColor, this.Width, this.Height);

                        this.Frame.OnPaintBackgroundLayer(g);
                        this.Frame.OnPaint(g);

                        //缓存绘制结果 
                        this._bufferImage = g.RenderTo(this.Width, this.Height);
                        this._useCachedImage = 1;
                    }
                    else if (this._useCachedImage == 1) {
                        g.DrawImage(this._bufferImage, this.Width, this.Height);
                    }

                    this.AuxTool.OnPaint(g);

                    this.Frame.OnPaintFloatingLayer(g);

                    if (this.ToolTip.Display)
                        this.ToolTip.ShowTip(g);
                    g.Render();
                }
            }
            catch (ex) {
                throw ex;
            }
        }

        public OnMouseDown(sender: any, e: MouseEventArgs): void {
            e.CancelBubbling = 0;
            this._mouseDownLocation = new Point(e.X, e.Y);

            this.Frame.OnMouseDown(e);
            if (e.CancelBubbling == 0)
                this.AuxTool.OnMouseDown(e);


        }

        public OnMouseUp(sender: any, e: MouseEventArgs): void {
            e.CancelBubbling = 0;

            this.Frame.OnMouseUp(e);
            if (e.CancelBubbling == 0)
                this.AuxTool.OnMouseUp(e);
        }

        public OnKeyUp(sender: any, e: KeyEventArgs): void {
            e.CancelBubbling = 0;

            this.PanInterval = 1;

            this.Frame.OnKeyUp(e);
            //this.AuxTool.OnKeyUp(e);
        }

        public OnMouseClick(sender: any, e: MouseEventArgs): void {
            e.CancelBubbling = 0;

            this.ClearAllSelected();

            if (Math.abs(this._mouseDownLocation.X - e.X) <= 3 && Math.abs(this._mouseDownLocation.Y - e.Y) <= 3) {
                this.FocusInfo.FocusLocation = new Point(e.X, e.Y);

                this.Frame.OnMouseClick(e);
                //this.AuxTool.OnMouseClick(e);

                if (e.CancelBubbling == 0)
                    if (!Utils.isNull(this.MouseClick)) this.MouseClick.call(this, e);
            }
        }

        public OnMouseDoubleClick(sender: any, e: MouseEventArgs): void {
            e.CancelBubbling = 0;

            this.ClearAllSelected();

            var tmp = this.ShowCrosshair;
            this.Frame.OnMouseDoubleClick(e);
            //首次显示十字线，触发数据更改
            if (this.ShowCrosshair && tmp != this.ShowCrosshair) {
                this.OnFocusedRecordChanged(Object.assign(new FocusedChangedArgs(),
                    {
                        SeriesRowIndex: this.FocusInfo.RecordIndex,
                        X: e.X,
                        Y: e.Y
                    }));
            }

            if (e.CancelBubbling == 0) {
                if (!Utils.isNull(this.MouseDoubleClick))
                    this.MouseDoubleClick.call(this, e);
            }
        }

        private _preCursorPosition: Point = new Point(0, 0);

        public OnMouseMove(sender: any, e: MouseEventArgs): void {
            e.CancelBubbling = 0;

            if (this._preCursorPosition.X != e.X || this._preCursorPosition.Y != e.Y) {
                this._preCursorPosition = new Point(e.X, e.Y);

                if (e.X == this._cursorPosition.X && e.Y == this._cursorPosition.Y) {
                    //当鼠标位于此坐标时,不触发mousemove
                }
                else if (this._cursorPosition.X != e.X || this._cursorPosition.Y != e.Y) {
                    this.Frame.OnMouseMove(e);
                    if (e.CancelBubbling == 0)
                        this.AuxTool.OnMouseMove(e);
                    if (e.CancelBubbling == 0) {
                        if (Math.abs(this._cursorPosition.X - e.X) > 3 || Math.abs(this._cursorPosition.Y - e.Y) > 3) {
                            this.View.ZoomOriginIndex = -1;

                            this._cursorPosition = new Point(e.X, e.Y);

                            this.FocusInfo.RecordIndex = this.XA2Index(e.X);
                            this.FocusInfo.FocusClosePrice = false;

                            this.OnFocusedRecordChanged(Object.assign(new FocusedChangedArgs(),
                                {
                                    SeriesRowIndex: this.FocusInfo.RecordIndex,
                                    X: e.X,
                                    Y: e.Y
                                }));
                        }

                        this.FocusInfo.FocusLocation = new Point(e.X, e.Y);
                    }
                    this.OnPaint(this.Graphics);
                }
                if (!Utils.isNull(this.MouseMove))
                    this.MouseMove.call(this, e);
            }
        }

        public OnMouseLeave(sender: any, e: MouseEventArgs): void {
            e.CancelBubbling = 0;

            this.FocusInfo.OutWorkarea = true;
            this._cursorPosition = new Point(0, 0);

            this.Frame.OnMouseLeave(e);
            if (e.CancelBubbling == 0)
                this.AuxTool.OnMouseLeave(e);

            this.OnPaint(this.Graphics);

            if (!Utils.isNull(this.MouseLeave)) this.MouseLeave.call(this, e);
        }

        public OnMouseEnter(sender: any, e: MouseEventArgs): void {
            e.CancelBubbling = 0;

            this.FocusInfo.OutWorkarea = false;

            this.Frame.OnMouseEnter(e);
            //this.AuxTool.OnMouseEnter(e);

            this.OnPaint(this.Graphics);

            if (!Utils.isNull(this.MouseEnter))
                this.MouseEnter.call(this, e);
        }

        public OnStatisticContextMenu(sender: any, e: StatisticContextMenuArgs): void {
            if (!Utils.isNull(this.StatisticContextMenu))
                this.StatisticContextMenu.call(this, e);
        }

        public OnKeyDown(sender: any, e: KeyEventArgs): void {
            console.log(e.KeyCode);

            e.CancelBubbling = 0;

            if (e.KeyCode == Keys.Delete) {
                this.DeleteSelectedAuxPattern();
            }
            else if (e.KeyCode == Keys.Down) {
                this.Zoomout();
            }
            else if (e.KeyCode == Keys.Escape) {
                this.ShowCrosshair = false;
            }
            else if (e.KeyCode == Keys.Left) {
                this.StockChartView_LeftClick(this, e);
            }
            else if (e.KeyCode == Keys.Right) {
                this.StockChartView_RightClick(this, e);
            }
            else if (e.KeyCode == Keys.Up) {
                this.Zoomin();
            }

            this.Frame.OnKeyDown(e);

            this.Refresh();

            if (!Utils.isNull(this.KeyDown))
                this.KeyDown.call(this, e);
        }

        public GetPanelByAlias(alias: string): PatternBase {
            return this.Frame.Panels.GetByAlias(alias);
        }

        public GetPatternByPoint(pt: Point): PatternBase {
            let panel = this.Frame.GetPanelByPoint(pt);
            if (Utils.isNotNull(panel)) {
                return panel.GetPatternByPoint(pt);
            }
            return null;
        }

        public RemovePatternByAlias(alias: string) {
            for (var i = 0; i < this.Frame.Panels.length; i++) {
                let panel = this.Frame.Panels.Get(i);
                for (var n = 0; n < panel.Patterns.length; n++) {
                    if (panel.Patterns.Get(n).Alias == alias) {
                        panel.Patterns.Remove(alias);
                        return;
                    }
                }
            }
        }


        public DeleteSelectedAuxPattern(): void {
            //for (var i = 0; i < this.Frame.Panels.length; i++) {

            //    var panel = this.Frame.Panels.Get(i);
            //    for (var i = panel.AuxPatterns.length - 1; i >= 0; i--) {
            //        var auxPattern = panel.AuxPatterns[i];
            //        if (auxPattern.Selected) {
            //            this.FileStore.RemoveAuxLine(this.DataID, auxPattern.Alias);
            //            panel.AuxPatterns.Remove(auxPattern);
            //            var a = this._AuxLines.Find((aux) => {
            //                if (aux.Id.ToString() == auxPattern.Alias)
            //                    return true;
            //                else
            //                    return false;
            //            });
            //            this._AuxLines.Remove(a);
            //        }
            //    }
            //}
        }

        //public DeleteAllAuxPattern(): void {
        //    this.FileStore.RemoveAllAuxLine(this.DataID);
        //    this._AuxLines.Clear();
        //    for (var panel in this.Frame.Panels) {
        //        panel.AuxPatterns.Clear();
        //    }
        //}

        private AuxiliaryLineTool_PaintFinished(e: AuxPaintFinishedArgs): void {
            let _this: StockChartView = this.Chart;
            switch (_this.AuxTool.AuxiliaryFunctional) {
                case AuxiliaryFunctional.Statistic:
                    //    if (e.PathPoints != null && e.PathPoints.length == 2) {
                    //        var x1 = Math.min(e.PathPoints[0].X, e.PathPoints[1].X);
                    //        var x2 = Math.max(e.PathPoints[0].X, e.PathPoints[1].X);
                    //        if (x2 - x1 > 10 + this.View.RecordWidth * 2) {
                    //            var e1 = __init(new StatisticContextMenuArgs(),
                    //                {
                    //                    Location = e.Location,
                    //                    RecordX1 =this.GetRecordIndex(x1),
                    //                    RecordX2 =this.GetRecordIndex(x2)
                    //                });
                    //            this.OnStatisticContextMenu(e1);
                    //        }
                    //    }
                    break;
                case AuxiliaryFunctional.Zoom:
                    if (e.PathPoints != null && e.PathPoints.length == 2) {
                        var x1 = Math.min(e.PathPoints[0].X, e.PathPoints[1].X);
                        var x2 = Math.max(e.PathPoints[0].X, e.PathPoints[1].X);
                        if (x2 - x1 > 10 + _this.View.RecordWidth * 2) {
                            _this.Zoom(_this.XA2Index(x1) + 1, _this.XA2Index(x2));
                        } else
                        _this.Refresh();
                    }
                    break;
                case AuxiliaryFunctional.PaintLine:
                //    this.Chart.AuxTool.Save();
                //    this._AuxLines = this.FileStore.LoadAuxLines(this.DataID);
                //    for (var panel in this.Frame.Panels) {
                //        panel.LoadAuxLines();
                //    }
                //    this.Refresh();
                //    if (this.AuxPaintFinished != null)
                //        this.AuxPaintFinished.call(sender, e);
                //    break;
            }
        }

        private StockChartView_RightClick(sender: any, e: KeyEventArgs): void {
            if (this.View.LeftRecordIndex > this.View.RightRecordIndex) {
                var recordIndex = 0;
                if (e.Shift) {
                    var a = 1 + (0.3 * Math.pow(this.PanInterval++, 1.1));
                    if (a > 40)
                        a = 40;
                    this.Pan(-a);
                    this.FocusInfo.RecordIndex = this.XA2Index(this.FocusInfo.FocusLocation.X);
                }
                else if (e.Control) {
                    this.Pan(this.View.RightRecordIndex - this.View.LeftRecordIndex);
                    this.FocusInfo.RecordIndex = this.XA2Index(this.FocusInfo.FocusLocation.X);
                }
                else {
                    this.ShowCrosshair = true;
                    this.FocusInfo.OutWorkarea = false;

                    if (!this.FocusInfo.FocusClosePrice || this.FocusInfo.RecordIndex > this.View.LeftRecordIndex - 1 || this.FocusInfo.RecordIndex < this.Source.MinValidIndex) {
                        recordIndex = this.XA2Index(this.FocusInfo.FocusLocation.X);
                        if (recordIndex > this.View.LeftRecordIndex - 1)
                            this.FocusInfo.RecordIndex = this.View.LeftRecordIndex - 1;
                        else if (recordIndex < this.Source.MinValidIndex)
                            this.FocusInfo.RecordIndex = this.Source.MinValidIndex;
                        else
                            this.FocusInfo.RecordIndex = recordIndex;
                    }

                    if (this.FocusInfo.RecordIndex > this.Source.MinValidIndex) {
                        this.FocusInfo.RecordIndex--;
                        if (this.FocusInfo.RecordIndex < this.View.RightRecordIndex)
                            this.Pan(-1);
                    }

                    this.FocusInfo.RecordIndex = this.View.Limit(this.FocusInfo.RecordIndex, -1);

                    this.FocusInfo.FocusLocation =
                        new Point(this.Index2XA(this.FocusInfo.RecordIndex), this.Frame.Panels.Get(0).GetYRecordInfo(this.FocusInfo.RecordIndex).AY);
                    this.FocusInfo.FocusClosePrice = true;

                }
            }
        }

        private StockChartView_LeftClick(sender: any, e: KeyEventArgs): void {
            if (this.View.LeftRecordIndex > this.View.RightRecordIndex) {
                var recordIndex = 0;
                if (e.Shift) {
                    var a = 1 + (0.3 * Math.pow(this.PanInterval++, 1.1));
                    if (a > 40)
                        a = 40;
                    this.Pan(a);
                    this.FocusInfo.RecordIndex = this.XA2Index(this.FocusInfo.FocusLocation.X);
                }
                else if (e.Control) {
                    this.Pan(this.View.LeftRecordIndex - this.View.RightRecordIndex);
                    this.FocusInfo.RecordIndex = this.XA2Index(this.FocusInfo.FocusLocation.X);
                }
                else {
                    this.ShowCrosshair = true;
                    this.FocusInfo.OutWorkarea = false;

                    if (!this.FocusInfo.FocusClosePrice || this.FocusInfo.RecordIndex > this.View.LeftRecordIndex - 1 || this.FocusInfo.RecordIndex < this.Source.MinValidIndex) {
                        recordIndex = this.XA2Index(this.FocusInfo.FocusLocation.X);
                        if (recordIndex > this.View.LeftRecordIndex - 1)
                            this.FocusInfo.RecordIndex = this.View.LeftRecordIndex - 1;
                        else if (recordIndex < this.Source.MinValidIndex)
                            this.FocusInfo.RecordIndex = this.Source.MinValidIndex;
                        else
                            this.FocusInfo.RecordIndex = recordIndex;
                    }

                    if (this.FocusInfo.RecordIndex < this.View.RecordCount - 1) {
                        this.FocusInfo.RecordIndex++;
                        if (this.FocusInfo.RecordIndex >= this.View.LeftRecordIndex)
                            this.Pan(1);
                    }
                    this.FocusInfo.RecordIndex = this.View.Limit(this.FocusInfo.RecordIndex, 1);
                    var yinfo = this.Frame.Panels.Get(0).GetYRecordInfo(this.FocusInfo.RecordIndex);
                    if (yinfo != null) {
                        this.FocusInfo.FocusLocation =
                            new Point(this.Index2XA(this.FocusInfo.RecordIndex), this.Frame.Panels.Get(0).GetYRecordInfo(this.FocusInfo.RecordIndex).AY);
                        this.FocusInfo.FocusClosePrice = true;
                    }
                }
            }
        }

        public OnPanelContextMenu(e: PanelContextMenuArgs): void {
            if (!Utils.isNull(this.PanelContextMenu)) this.PanelContextMenu.call(this, e);
        }
        public OnPanelSelectChanged(e: PanelSelectChangedArgs): void {
            if (!Utils.isNull(this.PanelSelectChanged)) this.PanelSelectChanged.call(this, e);
        }
        public OnCrosshairVisibleChanged(e: CrosshairVisibleChangedArgs): void {
            if (!Utils.isNull(this.CrosshairVisibleChanged)) this.CrosshairVisibleChanged.call(this, e);
        }
        public OnPatternDbClick(e: PatternDbClickEventArgs): void {
            if (!Utils.isNull(this.PatternDbClick)) this.PatternDbClick.call(this, e);
        }
        public OnPanelTitleDbClick(e: PanelTitleDbClickEventArgs): void {
            if (!Utils.isNull(this.PanelTitleDbClick)) this.PanelTitleDbClick.call(this, e);
        }
        public OnFocusedRecordChanged(e: FocusedChangedArgs): void {
            if (this.ShowCrosshair) {
                if (this.FocusedRecordChanged != null) {
                    var info: ScaleYInfo = null;
                    if (this.FocusInfo.FocusClosePrice) {
                        info = this.Frame.Panels.Get(0).GetYRecordInfo(e.SeriesRowIndex);
                    }
                    else {
                        info = this.Frame.GetFocusYValue();
                    }
                    if (info != null) {
                        e.value = info.Value;
                    }
                    this.FocusedRecordChanged.call(this, e);
                }
            }
        }
        private tipTimeout: number = 0;
        protected _lastCursor: Point = new Point(0, 0);
        public OnTimmerTick(): void {

            if (this._cursorPosition == this._lastCursor) {
                this.tipTimeout++;
                if (this.tipTimeout > 10) {
                    if (this.Source.Rows.length > this.View.LeftRecordIndex) {
                        let pb = this.GetPatternByPoint(this._cursorPosition);
                        if (pb != null) {
                            pb.BuildTip(this._cursorPosition);
                            this.ToolTip.Display = true;
                            this.OnPaint(this.Graphics);
                        }
                        else {
                            //AuxPatternBase apb = this.GetAuxPatternByPoint(this._cursorPosition);
                            //if (apb != null) {
                            //    apb.ShowTip(this._cursorPosition);
                            //    this.Paint();
                            //}
                        }
                    }
                }
            } else {
                this._lastCursor = this._cursorPosition;
                this.tipTimeout = 0;
                if (Utils.isNotNull(this.ToolTip))
                    this.ToolTip.Display = false;
            }
        }
        public get Chart(): StockChartView {
            return this;
        }
        public ParentVisualComponent: IChartElement;
    }

}