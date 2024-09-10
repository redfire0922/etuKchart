namespace zsaltec.KChart {
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
        private _chart: StockChartView;
        private _focusRecordIndex: number;
        public FocusLocation: Point = new Point(0, 0);
        public FocusClosePrice: boolean;
        public OutWorkarea: boolean;

        public get RecordIndex(): number {
            return this._focusRecordIndex;
        }
        public set RecordIndex(value: number) {
            if (this._focusRecordIndex != value) {
                var e = new FocusedChangedArgs();
                e.SeriesRowIndex = value;
                e.X = this.FocusLocation.X;
                e.Y = this.FocusLocation.Y;

                if (!Utils.isNull(this._chart.FocusedRecordChanged)) this._chart.FocusedRecordChanged.call(this, e);
                this._focusRecordIndex = value;
            }
        }

        constructor(chart: StockChartView) {
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

    export class Collection<T extends VisualComponent> {
        private _list: T[];
        private _parent: VisualComponent;

        constructor(list: T[], parent: VisualComponent) {
            this._list = list;
            this._parent = parent;
        }

        public Get(index: number): T {
            return this._list[index];
        }

        public get length(): number {
            return this._list.length;
        }

        public Add(item: T) {
            this._list.push(item);

            this._parent.AddChild(item);
        }

        public GetByAlias(alias: string): any {
            for (var i = 0; i < this._list.length; i++) {
                if (this._list[i].Alias == alias)
                    return this._list[i];
            }
            return null;
        }

        public Clear(): void {
            for (var i = 0; i < this._list.length; i++) {
                this._parent.RemoveChild(this._list[i]);
            }
            this._list = [];
        }
        public Remove(p: T | string): void {
            let obj = p;
            if ((p instanceof VisualComponent) == false)
                obj = this.GetByAlias(<string>p);

            this._parent.RemoveChild(<VisualComponent>obj);
            Utils.remove(this._list, obj);
        }

        public Insert(index: number, item: T): void {
            item.ParentVisualComponent = this._parent;
            Utils.insert(this._list, index, item);
            this._parent.InsertChild(index, item);
            if (this._parent.Inited)
                item.InitializeComponent();
        }

        public ContainsKey(alias: string): boolean {
            return Utils.isNull(this.GetByAlias(alias)) == false;
        }
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
}