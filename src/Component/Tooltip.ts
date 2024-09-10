namespace zsaltec.KChart {
    export class StockToolTip {
        private _display: boolean;
        private _location: Point;
        private _type: number;
        private _groupName: string;
        private _title: string;
        private _items: string[];
        public get GroupName(): string {
            return this._groupName;
        }
        public set GroupName(value: string) {
            this._groupName = value;
        }
        public get Title(): string {
            return this._title;
        }
        public set Title(value: string) {
            this._title = value;
        }
        public get Type(): number {
            return this._type;
        }
        public set Type(value: number) {
            this._type = value;
        }
        public get Display(): boolean {
            return this._display;
        }
        public set Display(value: boolean) {
            this._display = value;
        }
        public get Location(): Point {
            return this._location;
        }
        public set Location(value: Point) {
            this._location = value;
        }
        public get Items(): string[] {
            return this._items;
        }
        public set Items(value: string[]) {
            this._items = value;
        }
        constructor() {
            this._items = [];
        }
        public ShowTip(g: IGraphics): void {
            if (this._display) {
                switch (this._type) {
                    case ToolTipType.CandleTip:
                        Drawer.DrawCandleTip(g, this._location, this._groupName, this.Items);
                        break;
                    case ToolTipType.LineTip:
                        Drawer.DrawLineTip(g, this._location, this._groupName, this._title, this.Items[0]);
                        break;
                    case ToolTipType.VolumnTip:
                        Drawer.DrawLineTip(g, this._location, this._groupName, this._title, this.Items[0]);
                        break;
                    case ToolTipType.NamedTip:
                        Drawer.DrawLineTip(g, this._location, this._groupName, this._title, "");
                        break;
                    default:
                        break;
                }
            }
            this._display = false;
        }
        public InitializeComponent(): void {

        }

    }
}