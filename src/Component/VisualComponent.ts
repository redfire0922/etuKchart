namespace zsaltec.KChart {
    export class VisualComponent implements IChartElement {

        public MouseClick: MouseEventHandler;
        public MouseDoubleClick: MouseEventHandler;
        public MouseMove: MouseEventHandler;
        public MouseDown: MouseEventHandler;
        public MouseUp: MouseEventHandler;
        public MouseLeave: EventHandler;
        public MouseEnter: EventHandler;
        public KeyDown: KeyEventHandler;
        public KeyUp: KeyEventHandler;

        public ParentVisualComponent: IChartElement;
        public Width: number;
        public Height: number;
        public LocationA: Point;

        public WorkAreaWidth: number;
        public WorkAreaHeight: number;
        public WorkAreaLocationA: Point;

        public Visible: boolean;
        public Inited: boolean;

        protected Children: VisualComponent[];

        public Alias: string;

        constructor() {
            this.Visible = true;
            this.Inited = false;
            this.Alias = "el" + Utils.nextId();
        }

        public get Chart(): StockChartView {
            return this.ParentVisualComponent?.Chart;
        }

        public AddChild(child: VisualComponent): void {
            if (Utils.isNull(this.Children))
                this.Children = [];

            for (var i = 0; i < this.Children.length; i++) {
                if (this.Children[i].Alias == child.Alias)
                    throw new Error("重复添加子项");
            }
            this.Children.push(child);

            child.ParentVisualComponent = this;
            if (this.Inited) {
                child.InitializeComponent();
            }
        }
        public InsertChild(index: number, item: VisualComponent) {
            Utils.insert(this.Children, index, item);
        }

        public RemoveChild(child: VisualComponent): void {
            Utils.remove(this.Children, child);
        }

        public InitializeComponent(): void {
            if (this.Children)
                for (var i = 0; i < this.Children.length; i++) {
                    this.Children[i].InitializeComponent();
                }
            this.Inited = true;
        }
        public DoLayout(): void {
            this.WorkAreaLocationA = new Point(this.LocationA.X, this.LocationA.Y);
            this.WorkAreaHeight = this.Height;
            this.WorkAreaWidth = this.Width;

            if (this.Children)
                for (var i = 0; i < this.Children.length; i++) {
                    this.Children[i].LocationA = new Point(this.LocationA.X, this.LocationA.Y);
                    this.Children[i].Height = this.Height;
                    this.Children[i].Width = this.Width;
                    this.Children[i].DoLayout();
                }
        }
        public AfterDoLayout(): void {
            if (this.Children)
                for (var i = 0; i < this.Children.length; i++) {
                    this.Children[i].AfterDoLayout();
                }
        }
        public ViewUpdating(): void {
            if (this.Children)
                for (var i = 0; i < this.Children.length; i++) {
                    this.Children[i].ViewUpdating();
                }
        }

        //背景层
        public OnPaintBackgroundLayer(g: IGraphics): void {
            if (this.Children)
                for (var i = 0; i < this.Children.length; i++) {
                    this.Children[i].OnPaintBackgroundLayer(g);
                }
        }

        //中间层
        public OnPaint(g: IGraphics): void {
            if (this.Children)
                for (var i = 0; i < this.Children.length; i++) {
                    if (this.Children[i].Visible)
                        this.Children[i].OnPaint(g);
                }
        }

        //浮动层
        public OnPaintFloatingLayer(g: IGraphics): void {
            if (this.Children)
                for (var i = 0; i < this.Children.length; i++) {
                    this.Children[i].OnPaintFloatingLayer(g);
                }
        }

        public IsHit(p: Point): boolean { return false; }

        //相对X坐标转绝对X坐标
        protected XA(rx: number): number { return this.WorkAreaLocationA.X + rx; }
        //相对Y坐标转绝对Y坐标
        protected YA(ry: number): number { return this.WorkAreaLocationA.Y + ry; }

        public OnMouseClick(e: MouseEventArgs): void {
            if (this.Children)
                for (var i = 0; i < this.Children.length; i++) {
                    if (e.CancelBubbling == 0 && this.Children[i].IsHit(new Point(e.X, e.Y)))
                        this.Children[i].OnMouseClick(e);
                }

            if (e.CancelBubbling == 0)
                if (!Utils.isNull(this.MouseClick)) this.MouseClick.call(this, e);
        }

        public OnMouseMove(e: MouseEventArgs): void {
            if (this.Children)
                for (var i = 0; i < this.Children.length; i++) {
                    if (e.CancelBubbling == 0)
                        this.Children[i].OnMouseMove(e);
                }

            if (e.CancelBubbling == 0)
                if (!Utils.isNull(this.MouseMove)) this.MouseMove.call(this, e);
        }

        public OnMouseDoubleClick(e: MouseEventArgs): void {
            if (this.Children)
                for (var i = 0; i < this.Children.length; i++) {
                    if (e.CancelBubbling == 0 && this.Children[i].IsHit(new Point(e.X, e.Y)))
                        this.Children[i].OnMouseDoubleClick(e);
                }

            if (e.CancelBubbling == 0)
                if (!Utils.isNull(this.MouseDoubleClick)) this.MouseDoubleClick.call(this, e);
        }
        public OnMouseLeave(e: {}): void {
            if (this.Children)
                for (var i = 0; i < this.Children.length; i++) {
                    this.Children[i].OnMouseLeave(e);
                }

            if (!Utils.isNull(this.MouseLeave)) this.MouseLeave.call(this, e);
        }

        public OnMouseEnter(e: MouseEventArgs): void {
            if (this.Children)
                for (var i = 0; i < this.Children.length; i++) {
                    if (e.CancelBubbling == 0 && this.Children[i].IsHit(new Point(e.X, e.Y)))
                        this.Children[i].OnMouseEnter(e);
                }

            if (!Utils.isNull(this.MouseEnter)) this.MouseEnter.call(this, e);
        }

        public OnMouseDown(e: MouseEventArgs): void {
            if (this.Children)
                for (var i = 0; i < this.Children.length; i++) {
                    if (e.CancelBubbling == 0 && this.Children[i].IsHit(new Point(e.X, e.Y)))
                        this.Children[i].OnMouseDown(e);
                }

            if (e.CancelBubbling == 0)
                if (!Utils.isNull(this.MouseDown)) this.MouseDown.call(this, e);
        }
        public OnMouseUp(e: MouseEventArgs): void {
            if (this.Children)
                for (var i = 0; i < this.Children.length; i++) {
                    if (e.CancelBubbling == 0 && this.Children[i].IsHit(new Point(e.X, e.Y)))
                        this.Children[i].OnMouseUp(e);
                }

            if (e.CancelBubbling == 0)
                if (!Utils.isNull(this.MouseUp)) this.MouseUp.call(this, e);
        }
        public OnKeyDown(e: KeyEventArgs): void {
            if (this.Children)
                for (var i = 0; i < this.Children.length; i++) {
                    if (e.CancelBubbling == 0)
                        this.Children[i].OnKeyDown(e);
                }

            if (e.CancelBubbling == 0)
                if (!Utils.isNull(this.KeyDown)) this.KeyDown.call(this, e);
        }
        public OnKeyUp(e: KeyEventArgs): void {
            if (this.Children)
                for (var i = 0; i < this.Children.length; i++) {
                    if (e.CancelBubbling == 0)
                        this.Children[i].OnKeyUp(e);
                }

            if (e.CancelBubbling == 0)
                if (!Utils.isNull(this.KeyUp)) this.KeyUp.call(this, e);
        }
    }
}