namespace zsaltec.KChart {
    export class Utils {
        public static identifier: number = 100;
        public static nextId(): number {
            return this.identifier++;
        }

        public static format(dt: Date): string {
            return Utils.getYear(dt) + '/' + (Utils.getMonth(dt) + '').padStart(2, '0') + '/' + (Utils.getDay(dt) + '').padStart(2, '0');
        }
        public static getMonth(date: Date): number {
            return date.getMonth() + 1;
        }
        public static getYear(date: Date): number {
            return date.getFullYear();
        }
        public static getDay(date: Date): number {
            return date.getDate();
        }
        public static getDayOfWeek(date: Date): number {
            return date.getDay();
        }

        public static removeAt(list: any[], index: number) {
            if (index >= 0 && index < list.length)
                list.splice(index, 1);
        }

        public static TrimEnd(str: string, trimstr: string) {

        }

        public static remove(list: any[], item: any) {
            if (!this.isNull(item) && !this.isNull(list)) {
                const index = list.indexOf(item);
                if (index > -1) {
                    list.splice(index, 1);
                }
            }
        }
        public static insert(list: any[], index: number, item: any) {
            list.splice(index, 0, item);
        }

        public static IsNullOrEmpty(str: string): boolean {
            return this.isNull(str) || str.length <= 0;
        }

        public static IsNullOrBlank(str: string): boolean {
            return this.IsNullOrEmpty(str) || /^\s*$/g.test(str);
        }

        public static isNull(obj: any): boolean {
            if (typeof obj == 'undefined' || obj === null)
                return true;
            return false;
        }

        public static isNotNull(obj: any): boolean {
            return !this.isNull(obj);
        }

        public static round(origin: number): string {
            return origin.toFixed(2);
        }
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
}