/// <reference path="VisualComponent.ts"/>

namespace zsaltec.KChart {


    export class YScaleBase extends VisualComponent {
        public LineHeight: number;
        public AlignMode: ScaleAlignMode = ScaleAlignMode.Left;
        public NumericSteps: NumericStepInfo[] = [];
        protected _multiple: number;
        protected _maxDisplayValue: number;
        protected _minDisplayValue: number;
        protected _stepValue: number;
        public ScaleLineStart: number;
        public ScaleLineEnd: number;

        public get Multiple(): number {
            return this._multiple;
        }
        public get MaxDisplayValue(): number {
            return this._maxDisplayValue;
        }
        public get MinDisplayValue(): number {
            return this._minDisplayValue;
        }

        public YA2Value(ay: number): number { throw new Error('not implemented'); }
        public Value2YA(value: number, patternAlias: string): number { throw new Error('not implemented'); }


        public override OnPaint(g: IGraphics): void {
            if (super.Chart.Source != null && super.Chart.Source.Rows.length > 0 && this.NumericSteps.length > 0) {
                var oy: number = 0;
                var frameStyle = ThemePalette.Current.FrameColor;
                for (var i: number = 0; i < this.NumericSteps.length; i++) {
                    var y: number = this.NumericSteps[i].Top;
                    Drawer.DrawDashLine(g, frameStyle, new Point(this.ScaleLineStart, this.YA(y)), new Point(this.ScaleLineEnd, this.YA(y)), [1, 2]);
                    Drawer.DrawLine(g, frameStyle, new Point(this.XA(this.WorkAreaWidth - 5), this.YA(y)), new Point(this.XA(this.WorkAreaWidth), this.YA(y)));
                    if (this._multiple == 1 || y < this.WorkAreaHeight - 16)
                        Drawer.DrawString(g, this.NumericSteps[i].DisplayValue, frameStyle, 9, new Point(this.XA(this.WorkAreaWidth - 9 - Drawer.CalTextWidth(g, 9, this.NumericSteps[i].DisplayValue)), this.YA(y - 6)));
                    if (i > 0) {
                        var sh: number = (oy - y);
                        if (sh > 10) {
                            var sy: number = <number>(sh / 2 + y);
                            Drawer.DrawLine(g, frameStyle, new Point(this.XA(this.WorkAreaWidth - 3), this.YA(sy)), new Point(this.XA(this.WorkAreaWidth), this.YA(sy)));
                        }
                        if (sh > 25) {
                            var sy: number = <number>(sh / 4 + y);
                            Drawer.DrawLine(g, frameStyle, new Point(this.XA(this.WorkAreaWidth - 1), this.YA(sy)), new Point(this.XA(this.WorkAreaWidth), this.YA(sy)));
                            sy = <number>(sh / 4 * 3 + y);
                            Drawer.DrawLine(g, frameStyle, new Point(this.XA(this.WorkAreaWidth - 1), this.YA(sy)), new Point(this.XA(this.WorkAreaWidth), this.YA(sy)));
                        }
                    }
                    oy = y;
                }
                if (this._multiple != 0 && this._multiple != 1) {
                    var txt: string = this._multiple + '';
                    var pwidth: number = (12 + txt.length * 7);
                    var p1 = new Point(this.XA(52 - pwidth), this.YA(this.WorkAreaHeight - 20));
                    var p2 = new Point(this.XA(52), this.YA(this.WorkAreaHeight + 1));
                    Drawer.DrawRectangle(g, frameStyle, new Rectangle(p1.X, p1.Y, p2.X - p1.X, p2.Y - p1.Y));
                    Drawer.DrawString(g, "x" + txt, frameStyle, 9, new Point(this.XA(55 - pwidth), this.YA(this.WorkAreaHeight - 16)));
                }
            }
        }

    }

    export class RangeNumericScale extends YScaleBase {

        private _fixedSteps: number[] = [0.01, 0.02, 0.05, 0.1, 0.25, 0.5, 1, 2, 2.5, 5, 10, 15, 20, 25, 50, 75, 100, 150, 200, 250, 500, 750, 1000, 1500, 2000, 5000, 10000, 15000, 25000, 40000];
        constructor() {
            super();

            this.LineHeight = 40;
        }
        public override ViewUpdating(): void {
            this.NumericSteps = [];
            var maxDisplayValue = (<ChartPanel>this.ParentVisualComponent).MaxValue;
            var minDisplayValue = (<ChartPanel>this.ParentVisualComponent).MinValue;
            if (maxDisplayValue - minDisplayValue > 0.000001) {
                var count: number = this.WorkAreaHeight / this.LineHeight;
                if (count > 0) {
                    var c: number = 0;
                    if (count > 1)
                        c = Math.abs((maxDisplayValue - minDisplayValue) / count);
                    else {
                        c = Math.abs((maxDisplayValue - minDisplayValue) / 2);
                    }
                    if (Math.abs(c / maxDisplayValue) > 1 / 4000) {
                        if (c >= 1) {
                            var t: number = c;
                            this._multiple = 0;
                            while (t > 10000) {
                                this._multiple++;
                                t = t / 10;
                            }
                            this._multiple = <number>Math.pow(10, this._multiple);
                        }
                        if (c < 1) {
                            var t: number = c;
                            this._multiple = 0;
                            while (t < 0.25) {
                                t = t * 10;
                                this._multiple++;
                            }
                            this._multiple = <number>Math.pow(0.1, this._multiple);
                            if (this._multiple == 0.1)
                                this._multiple = 1;
                        }
                        this._minDisplayValue = <number>(minDisplayValue / this._multiple);
                        this._maxDisplayValue = <number>(maxDisplayValue / this._multiple);
                        c = c / this._multiple;
                        if (c > 0.01 && c <= 10000) {
                            var n: number = this.GetFixedStep(c);
                            this._stepValue = this._fixedSteps[n];
                            var b: number = Math.floor(this._minDisplayValue / this._stepValue) * this._stepValue;
                            var f: number = Math.floor(this._maxDisplayValue / this._stepValue) * this._stepValue;
                            if (this._minDisplayValue >= 0)
                                b += this._stepValue;
                            if (this._maxDisplayValue > 0)
                                f += this._stepValue;
                            var count2: number = Math.floor((f - b) / this._stepValue);
                            if (count == 2 && count2 == 1 && n > 0) {
                                var step: number = this._fixedSteps[n - 1];
                                if (b + step < this._maxDisplayValue) {
                                    this._stepValue = step;
                                    count2++;
                                }
                                if (b - step > this._minDisplayValue) {
                                    count2++;
                                    b -= step;
                                    this._stepValue = step;
                                }
                            }
                            count = count2;
                            for (var i: number = 0; i < count; i++) {
                                var v: number = b + this._stepValue * i;
                                var nsi: NumericStepInfo = this.GenerNumSteps(v);
                                this.NumericSteps.push(nsi);
                            }
                            if (this.NumericSteps[0].Value - this._stepValue > this._minDisplayValue) {
                                var v: number = b - this._stepValue;
                                var nsi: NumericStepInfo = this.GenerNumSteps(v);
                                this.NumericSteps.splice(0, 0, nsi);
                            }
                            if (this.NumericSteps[this.NumericSteps.length - 1].Value + this._stepValue < this._maxDisplayValue) {
                                var v: number = this.NumericSteps[this.NumericSteps.length - 1].Value + this._stepValue;
                                var nsi: NumericStepInfo = this.GenerNumSteps(v);
                                this.NumericSteps.push(nsi);
                            }
                        }
                    }
                }
            }
        }
        public InitializeComponent(): void {

        }
        public YA2Value(ay: number): number {
            let maxValue: number = (<ChartPanel>this.ParentVisualComponent).MaxValue;
            let minValue: number = (<ChartPanel>this.ParentVisualComponent).MinValue;
            if (ay >= this.LocationA.Y && ay <= this.LocationA.Y + this.WorkAreaHeight) {
                var v: number = maxValue - (maxValue - minValue) * (<number>(ay - this.LocationA.Y) / <number>this.WorkAreaHeight);
                return v;
            }
            else return null;
        }

        public Value2YA(value: number): number {
            let minValue = (<ChartPanel>this.ParentVisualComponent).MinValue;
            let maxValue = (<ChartPanel>this.ParentVisualComponent).MaxValue;

            if (value < minValue)
                value = minValue;
            if (value > maxValue)
                value = maxValue;

            if (maxValue - minValue == 0) return 0.0;

            return this.YA(this.WorkAreaHeight * ((maxValue - value) / (maxValue - minValue)));
        }
        private GetFixedStep(d: number): number {
            for (var n: number = 0; n < this._fixedSteps.length; n++) {
                if (d <= this._fixedSteps[n]) {
                    if (d - this._fixedSteps[n - 1] <= this._fixedSteps[n] - d) {
                        n--;
                    }
                    return n;
                }
            }
            return 0;
        }
        private GenerNumSteps(v: number): NumericStepInfo {
            var h: number = this._maxDisplayValue - this._minDisplayValue;
            var y: number = <number>((1 - (v - this._minDisplayValue) / h) * this.WorkAreaHeight);
            var label: string = "";
            if (this._stepValue < 5 || (this._maxDisplayValue < 100 && this._minDisplayValue > -100))
                label = Utils.round(v) + "";
            else label = (<number>v) + "";
            return Object.assign(new NumericStepInfo(), {
                Value: v,
                DisplayValue: label,
                Top: y
            });
        }
    }

}