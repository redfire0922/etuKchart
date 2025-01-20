namespace zsaltec.KChart {
    export type ChartConfig = {
        view: CandleDataView;
        canvasId: string,
        source: CompactSeries;
        chartType: ChartType;
        touchEnabled: boolean,
        frame: FrameConfig
    };

    export type FrameConfig = {
        panels: PanelConfig[];
        type: string
    };

    export type PanelConfig = {
        patterns: PatternConfig[];
        alias: string;
        type: string
    };

    export type PatternConfig = {
        seriesField: string;
        alias: string;
        type: string
    };

    export type EventArgs = {};

    export type MouseEventArgs = {
        Button: number;
        X: number;
        Y: number;
        CancelBubbling: number;
    };

    export type KeyEventArgs = {
        Alt: boolean;
        Control: boolean;
        KeyCode: Keys;
        Modifiers: number;
        Shift: boolean;
        SuppressKeyPress: boolean;
        CancelBubbling: number;
    };

    export type PanelSelectChangedArgs = {
        SelectedPanel: ChartPanel;
    };

    export type FocusedChangedArgs = {
        value: number;
        ChartDataRowIndex: number;
        X: number;
        Y: number;
    };

    export type CrosshairVisibleChangedArgs = {
        Visible: boolean;
    };

    export type PanelContextMenuArgs = {
        SelectedPanel: ChartPanel;
        Location: Point;
    };

    export type PanelDbClickEventArgs = {
        PanelAlias: string;
        FragmentAlias: string;
    } & MouseEventArgs;

    export type PatternDbClickEventArgs = {
        RecordIndex: number;
        SelectedDate: Date;
    } & PanelDbClickEventArgs;

    export type PanelTitleDbClickEventArgs = {

    } & PanelDbClickEventArgs;

    export type StatisticContextMenuArgs = {
        Location: Point;
        RecordX2: number;
        RecordX1: number;
    };

    export type AuxPaintFinishedArgs = {
        PathPoints: Point[];
        Button: number;
        Location: Point;
    };


    export type EventHandler = (sender: any, e: EventArgs) => void;
    export type MouseEventHandler = (sender: any, e: MouseEventArgs) => void;
    export type KeyEventHandler = (sender: any, e: KeyEventArgs) => void;
    export type PanelSelectChangedHandler = (sender: any, e: PanelSelectChangedArgs) => void;
    export type FocusedChangedHandler = (sender: any, e: FocusedChangedArgs) => void;
    export type CrosshairVisibleChangedHandler = (sender: any, e: CrosshairVisibleChangedArgs) => void;
    export type PanelContextMenuHandler = (sender: any, e: PanelContextMenuArgs) => void;
    export type PatternDbClickHandler = (sender: any, e: PatternDbClickEventArgs) => void;
    export type PanelTitleDbClickHandler = (sender: any, e: PanelTitleDbClickEventArgs) => void;
    export type StatisticContextMenuHandler = (sender: any, e: StatisticContextMenuArgs) => void;
    export type AuxPaintFinishedHandler = (sender: any, e: AuxPaintFinishedArgs) => void;

    export interface IChartElement {
        ParentVisualComponent: IChartElement;
        Chart: KChartView;
    }

    export interface IChartSeries {
        //MinValidIndex: number;
        LoadComplete: boolean;

        get RowCount(): number;
        GetRow(index: number | Date): ChartDataRow;
        AddNewRow(): ChartDataRow;
        InsertNewRow(index: number): ChartDataRow;
        RemoveRow(index: number): void;


        Clear(): void;
        Reset(): void;

        GetColumn(columnName: string | number): IChartSeriesColumn;
        AddColumn(column: string | IChartSeriesColumn): void;
    }

    export interface IChartSeriesColumn {
        series: IChartSeries;
        get ColumnName(): string;
        get length(): number;

        IndexOf(v: any): number;
        Clear(): void;
        SetValue(index: number, v: any): void;
        GetValue(index: number): any;
        RemoveAt(index: number): void;
        InsertAt(index: number, v: any): void;
    }

    export interface IGraphics {
        DrawLine(color: string, pts: number[][], lineWidth: number, dash: number[]): void;
        FillRectangle(color: string, x: number, y: number, width: number, height: number): void;
        DrawString(text: string, color: string, size: number, x: number, y: number): void;
        DrawRectangle(color: string, x: number, y: number, width: number, height: number): void;


        DrawContinuousLine(color: string, pts: Point[]): void;
        FillEllipse(color: string, point: Point, v1: number, v2: number): void;

        CalTextWidth(text: string, fontSize: number): number;
        DrawPoint(color: string, pt1: Point): void;

        ChangeCursor(cursor: string): void;

        DrawImage(any, width: number, height: number): void;
        RenderTo(width: number, height: number): any;
        Render(): void;
    }


    export class Point {
        private _x: number;
        private _y: number;
        public get X(): number {
            return this._x;
        }
        public get Y(): number {
            return this._y;
        }
        constructor(x: number, y: number) {
            this._x = Math.round(x ?? 0);
            this._y = Math.round(y ?? 0);
        }
    }

    export class Rectangle {
        private _size: Size;
        private _location: Point;

        public get Location(): Point {
            return this._location;
        }
        public get Size(): Size {
            return this._size;
        }

        public get X(): number {
            return this._location.X;
        }
        public get Y(): number {
            return this._location.Y;
        }
        public get Width(): number {
            return this.Size.Width;
        }
        public get Height(): number {
            return this.Size.Height;
        }
        constructor(x: number, y: number, width: number, height: number) {
            this._location = new Point(x, y);
            this._size = new Size(width, height);
        }
    }

    export class Size {
        private _width: number;
        private _height: number;
        constructor(width: number, height: number) {
            this._width = Math.round(width ?? 0);
            this._height = Math.round(height ?? 0);
        }
        public get Width(): number {
            return this._width;
        }
        public get Height(): number {
            return this._height;
        }
    }

    export class AreaInfo {
        public Width: number;
        public Height: number;
        public Top: number;
        public Left: number;
        public RowIndex: number;
        public ColumnIndex: number;
        public HeightPercent: number;
        public Visible: boolean;
        public PanelAlias: string;
        constructor() {
            this.Visible = true;
        }
    }

    export class TitleInfo {
        public Alias: string;
        public Value: number;
        public DisplayText: string;
        public DisplayLength: number;
        public Color: string;
        constructor(alias: string) {
            this.Alias = alias;
        }
    }


    export class NumericStepInfo {
        public Value: number;
        public DisplayValue: string;
        public Top: number;
    }

    export class FocusRecordInfo {
        private _chart: KChartView;
        private _focusRecordIndex: number;
        public FocusLocation: Point = new Point(0, 0);
        public FocusClosePrice: boolean;
        public OutWorkarea: boolean;

        public get RecordIndex(): number {
            return this._focusRecordIndex;
        }
        public set RecordIndex(value: number) {
            if (this._focusRecordIndex != value) {
                var e: FocusedChangedArgs = {
                    value: null,
                    ChartDataRowIndex: value,
                    X: this.FocusLocation.X,
                    Y: this.FocusLocation.Y
                };

                if (!Utils.isNull(this._chart.FocusedRecordChanged)) this._chart.FocusedRecordChanged.call(this, e);
                this._focusRecordIndex = value;
            }
        }

        constructor(chart: KChartView) {
            this._chart = chart;
        }
    }

    export class AuxlineStruct {
        public Id: string;
        public AuxLinePaintType: number;
        public StyleType: number;
        public PanelTag: string;
        public Description: string;
        public PathPointCount: number;
        public Path: number[];
    }


    export class PrimaryXScaleInfo {
        public Index: number;
        public ScaleValue: number;
    }

    export class ScaleXInfo {
        public Value: number;
        public DisplayValue: string;
        public RecordIndex: number;
        public PositionLeft: number;
        public Tag: number;
    }

    export class ScaleYInfo {
        public Value: number;
        public PanelAlias: string;
        public AY: number;
    }


    export enum MouseButtons {
        Left,
        Middle,
        Right,
        XButton1,
        XButton2,
        None
    }

    export enum ScaleAlignMode {
        Left,
        Left2,
        Top,
        Top2,
        Right,
        Right2,
        Down,
        Down2
    }

    export enum ToolTipType {
        CandleTip,
        LineTip,
        VolumnTip,
        NamedTip
    }

    export enum MouseAction {
        MouseDown,
        MouseMove,
        MouseUp
    }

    export enum AuxiliaryFunctional {
        Zoom,
        PaintLine,
        Statistic
    }

    export enum ChartType {
        OneMinute = 1,
        FiveMinute = 5,
        FifMinute = 15,
        ThirtyMinute = 30,
        SixtyMinute = 60,
        SixHour = 360,
        Day = 1001,
        Week = 1007,
        Month = 1030,
        Quarter = 1120,
        Year = 1365,
    }

    export enum AuxLinePaintType {
        Auxiliary_ZoomLine,
        PaintTool_LineSegment,
        PaintTool_StraightLine,
        PaintTool_RadialLine,
        PaintTool_Rectangle,
        PaintTool_Rectangle1,
        PaintTool_Rectangle2,
        PaintTool_Point0,
        PaintTool_Point1,
        PaintTool_Point2,
        PaintTool_Point3,
        PaintTool_Point4,
        PaintTool_Point5,
        PaintTool_Point6,
        PaintTool_ParallelLines,
        PaintTool_ThreeParallelLines,
        PaintTool_GoldenLines,
        PaintTool_GoldenLines2,
        PaintTool_PercentLines,
        PaintTool_StraightLine_MultiMonth,
        PaintTool_StraightLine_Parallel,
        PaintTool_StraightLine_Cover1,
        PaintTool_StraightLine_Cover2,
        PaintTool_StraightLine_Cover3,
        PaintTool_StraightLine_LackCover,
        PaintTool_StraightLine_Main,
        PaintTool_StraightLine_Zero1,
        PaintTool_StraightLine_Zero2,
        PaintTool_StraightLine_Zero3,
        PaintTool_StraightLine_Zero4,
        PaintTool_StraightLine_Zero5,
        PaintTool_StraightLine_Cross,
        PaintTool_StraightLine_Middle1,
        PaintTool_StraightLine_Middle2,
        Auxiliary_StatisticLine,
        PaintTool_StraightDottedLine
    }

    export enum TimeScaleMode {
        MarketATimeMode,

        MarketAGTimeMode,

        CandleMode
    }

    export enum Keys {
        Modifiers = -65536,
        None = 0,
        LButton = 1,
        RButton = 2,
        Cancel = 3,
        MButton = 4,
        XButton1 = 5,
        XButton2 = 6,
        Back = 8,
        Tab = 9,
        LineFeed = 10,
        Clear = 12,
        Return = 13,
        Enter = 13,
        ShiftKey = 16,
        ControlKey = 17,
        Menu = 18,
        Pause = 19,
        Capital = 20,
        CapsLock = 20,
        KanaMode = 21,
        HanguelMode = 21,
        HangulMode = 21,
        JunjaMode = 23,
        FinalMode = 24,
        HanjaMode = 25,
        KanjiMode = 25,
        Escape = 27,
        IMEConvert = 28,
        IMENonconvert = 29,
        IMEAccept = 30,
        IMEAceept = 30,
        IMEModeChange = 31,
        Space = 32,
        Prior = 33,
        PageUp = 33,
        Next = 34,
        PageDown = 34,
        End = 35,
        Home = 36,
        Left = 37,
        Up = 38,
        Right = 39,
        Down = 40,
        Select = 41,
        Print = 42,
        Execute = 43,
        Snapshot = 44,
        PrintScreen = 44,
        Insert = 45,
        Delete = 46,
        Help = 47,
        D0 = 48,
        D1 = 49,
        D2 = 50,
        D3 = 51,
        D4 = 52,
        D5 = 53,
        D6 = 54,
        D7 = 55,
        D8 = 56,
        D9 = 57,
        A = 65,
        B = 66,
        C = 67,
        D = 68,
        E = 69,
        F = 70,
        G = 71,
        H = 72,
        I = 73,
        J = 74,
        K = 75,
        L = 76,
        M = 77,
        N = 78,
        O = 79,
        P = 80,
        Q = 81,
        R = 82,
        S = 83,
        T = 84,
        U = 85,
        V = 86,
        W = 87,
        X = 88,
        Y = 89,
        Z = 90,
        LWin = 91,
        RWin = 92,
        Apps = 93,
        Sleep = 95,
        NumPad0 = 96,
        NumPad1 = 97,
        NumPad2 = 98,
        NumPad3 = 99,
        NumPad4 = 100,
        NumPad5 = 101,
        NumPad6 = 102,
        NumPad7 = 103,
        NumPad8 = 104,
        NumPad9 = 105,
        Multiply = 106,
        Add = 107,
        Separator = 108,
        Subtract = 109,
        Decimal = 110,
        Divide = 111,
        F1 = 112,
        F2 = 113,
        F3 = 114,
        F4 = 115,
        F5 = 116,
        F6 = 117,
        F7 = 118,
        F8 = 119,
        F9 = 120,
        F10 = 121,
        F11 = 122,
        F12 = 123,
        F13 = 124,
        F14 = 125,
        F15 = 126,
        F16 = 127,
        F17 = 128,
        F18 = 129,
        F19 = 130,
        F20 = 131,
        F21 = 132,
        F22 = 133,
        F23 = 134,
        F24 = 135,
        NumLock = 144,
        Scroll = 145,
        LShiftKey = 160,
        RShiftKey = 161,
        LControlKey = 162,
        RControlKey = 163,
        LMenu = 164,
        RMenu = 165,
        ProcessKey = 229,
        Packet = 231,
        Attn = 246,
        Crsel = 247,
        Exsel = 248,
        EraseEof = 249,
        Play = 250,
        Zoom = 251,
        NoName = 252,
        Pa1 = 253,
        OemClear = 254,
        KeyCode = 65535,
        Shift = 65536,
        Control = 131072,
        Alt = 262144,
    }
}