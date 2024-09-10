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
            return date.getMonth();
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
}