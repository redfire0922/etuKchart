/// <reference path="VisualComponent.ts"/>

namespace zsaltec.KChart {
    export class XScaleBase extends VisualComponent {
        public PrimaryScales: PrimaryXScaleInfo[] = [];
        public DatetimeField: string = CompactSeries.DATETIME_FIELD;
        public StepInfos: ScaleXInfo[] = [];

        constructor(datetimeField: string) {
            super();

            this.DatetimeField = datetimeField;
        }

        public ComputeTempScale(): void { }
        public GetXRecordValue(recordIndex: number): ScaleXInfo { throw new Error('not implemented'); }
        public GetXFocusValue(): ScaleXInfo { throw new Error('not implemented'); }

        public override ViewUpdating(): void {
            this.ComputeTempScale();
        }
    }


    export class DateScale extends XScaleBase {
        private _minuteMode: boolean = false;
        constructor(datetimeFieldName: string) {
            super(datetimeFieldName);

        }

        public override ComputeTempScale(): void {

            if (this.Chart.ChartType == ChartType.Year || this.Chart.ChartType == ChartType.Quarter || this.Chart.ChartType == ChartType.Month || this.Chart.ChartType == ChartType.Week || this.Chart.ChartType == ChartType.Day)
                this._minuteMode = false;
            else
                this._minuteMode = true;

            this.StepInfos = [];
            var view: DataView = this.Chart.View;
            if (view.LeftRecordIndex > 0 && this.Chart.Source.Rows.length > 0) {
                var column: SeriesColumn = this.Chart.Source.Columns.Get(this.DatetimeField);
                if (this.Chart.ChartType == ChartType.Year) {
                    for (var i: number = view.LeftRecordIndex - 1; i >= view.RightRecordIndex; i--) {
                        var v: Date = <Date>column.GetValue(i);
                        var text: string = Utils.getYear(v) + "";
                        var tsi: ScaleXInfo = Object.assign(new ScaleXInfo(), {
                            DisplayValue: text,
                            PositionLeft: view.GetRLeft(i),
                            Value: v,
                            RecordIndex: view.LeftRecordIndex
                        });
                        this.StepInfos.push(tsi);
                    }
                    return
                }
                {
                    var year: string = Utils.getYear(<Date>column.GetValue(view.LeftRecordIndex - 1)) + "年";
                    var tsi: ScaleXInfo = Object.assign(new ScaleXInfo(), {
                        DisplayValue: year,
                        PositionLeft: 0,
                        Value: 0,
                        RecordIndex: view.LeftRecordIndex - 1
                    });
                    this.StepInfos.push(tsi);
                }
                var kds = <number>Math.ceil(40 / view.RecordWidth);
                if (kds <= 1) {
                    var month: number = -1;
                    for (var i: number = view.LeftRecordIndex - 1; i >= view.RightRecordIndex; i--) {
                        var text: string = "";
                        if (this.Chart.ChartType == ChartType.Quarter || this.Chart.ChartType == ChartType.Month) {
                            var m = Utils.getMonth(<Date>column.GetValue(i));
                            text = (m + '').padStart(2, '0');
                        }
                        else if (this.Chart.ChartType == ChartType.Week) {
                            var m = Utils.getMonth(<Date>column.GetValue(i));
                            if (month == -1)
                                month = m;
                            if (month != m) {
                                month = m;
                                text = (month + '').padStart(2, '0');
                            }
                            else continue;
                        }
                        else if (this.Chart.ChartType == ChartType.Day) {
                            var d = Utils.getDay(<Date>column.GetValue(i));
                            var m = Utils.getMonth(<Date>column.GetValue(i));

                            if (month != m) {
                                month = m;
                                text = (month + '').padStart(2, '0') + "-" + (d + '').padStart(2, '0');
                            }
                            else {
                                text = (d + '').padStart(2, '0');
                            }
                        }
                        else {
                            var d = Utils.getDay(<Date>column.GetValue(i));
                            text = (d + '');
                        }
                        var tsi: ScaleXInfo = Object.assign(new ScaleXInfo(), {
                            DisplayValue: text,
                            PositionLeft: view.GetRLeft(i),
                            Value: 0,
                            RecordIndex: view.LeftRecordIndex
                        });
                        this.StepInfos.push(tsi);
                    }
                }
                else {
                    var minHours;
                    for (var i: number = 0; i < 3 && kds * (i + 1) < this.Chart.Source.Rows.length - 1; i++) {
                        var r1 = (<Date>column.GetValue(view.RightRecordIndex + kds * i));
                        var r2 = (<Date>column.GetValue(view.RightRecordIndex + kds * (i + 1)));
                        var tmp = (r1.getTime() - r2.getTime()) / 1000 / 60 / 60;
                        if (tmp < minHours)
                            minHours = tmp;
                    }
                    var scale: number = -1;
                    for (var i: number = view.LeftRecordIndex - 1; i >= view.RightRecordIndex; i--) {
                        var v: Date = <Date>column.GetValue(i);
                        var text = "";
                        if (minHours / 24 > 60) {
                            var tmp = Utils.getYear(v);
                            if (scale == -1)
                                scale = tmp;
                            if (scale != tmp) {
                                scale = tmp;
                                text = scale.toString();
                            }
                            else continue;
                        }
                        else if (minHours / 24 > 25) {
                            var y = Utils.getYear(v);
                            var m = Utils.getMonth(v);
                            if (m == 1 || m == 4 || m == 7 || m == 10) {
                                if (scale == -1 || scale != tmp) {
                                    scale = tmp;
                                    text = (scale % 100) + '';
                                }
                                else continue;
                            }
                            else continue;
                        }
                        else if (minHours / 24 > 1) {
                            var m = Utils.getMonth(v);
                            if (scale == -1)
                                scale = m;
                            if (scale != m) {
                                scale = m;
                                text = (scale + '').padStart(2, '0');
                            }
                            else continue;
                        }
                        else if (minHours > 1) {
                            var d = Utils.getDay(v);
                            if (scale == -1)
                                scale = d;
                            if (scale != d) {
                                scale = d;
                                text = (scale + '').padStart(2, '0');
                            }
                            else continue;
                        }
                        var tsi: ScaleXInfo = Object.assign(new ScaleXInfo(), {
                            DisplayValue: text,
                            PositionLeft: view.GetRLeft(i),
                            Value: v,
                            RecordIndex: view.LeftRecordIndex
                        });
                        this.StepInfos.push(tsi);
                    }
                }
            }
        }
        public override GetXRecordValue(recordIndex: number): ScaleXInfo {
            var view: DataView = this.Chart.View;
            var column: SeriesColumn = this.Chart.Source.Columns.Get(this.DatetimeField);
            if (recordIndex < view.LeftRecordIndex && recordIndex >= view.RightRecordIndex) {
                var v: Date = <Date>column.GetValue(recordIndex);
                var strdate: string = this.FormatDate(v);
                var ts: ScaleXInfo = Object.assign(new ScaleXInfo(), {
                    DisplayValue: strdate,
                    RecordIndex: recordIndex,
                    Value: v,
                    PositionLeft: view.GetRLeft(recordIndex)
                });
                return ts;
            }
            else return null;
        }
        public override GetXFocusValue(): ScaleXInfo {
            var view: DataView = this.Chart.View;
            var recordIndex: number = view.GetRecordIndex(this.Chart.FocusInfo.FocusLocation.X - this.LocationA.X);
            if (recordIndex < view.LeftRecordIndex && recordIndex >= view.RightRecordIndex) {
                var column: SeriesColumn = this.Chart.Source.Columns.Get(this.DatetimeField);
                var v: Date = <Date>column.GetValue(recordIndex);
                if (Utils.isNull(v) == false) {
                    var strdate: string = this.FormatDate(v);
                    var ts: ScaleXInfo = Object.assign(new ScaleXInfo(), {
                        DisplayValue: strdate,
                        RecordIndex: recordIndex,
                        Value: v,
                        PositionLeft: this.Chart.FocusInfo.FocusLocation.X
                    });
                    return ts;
                }
            }
            return null;
        }
        private FormatDate(v: Date): string {
            if (this._minuteMode) {
                var hour: number = v.getHours();
                var minute: number = v.getMinutes();
                var strdate: string = Utils.format(v) + " " + (hour + '').padStart(2, '0') + ":" + (minute + '').padStart(2, '0');
                return strdate;
            }
            else {
                var dayofweek: string[] = ["一", "二", "三", "四", "五", "六", "日"];
                return Utils.format(v) + '/' + dayofweek[<number>Utils.getDayOfWeek(v)];
            }
        }
        public override OnPaint(g: IGraphics): void {
            var view: DataView = this.Chart.View;
            if (view.LeftRecordIndex > 0 && this.Chart.Source.Rows.length > 0) {
                var frameStyle = ThemePalette.Current.FrameColor;
                var ox: number = 0;
                for (var i: number = 0; i < this.StepInfos.length; i++) {
                    var left: number = this.StepInfos[i].PositionLeft;
                    if (left >= ox) {
                        Drawer.DrawLine(g, frameStyle, new Point(this.XA(left), this.YA(0)), new Point(this.XA(left), this.YA(3)));
                        if (left < this.Width - 15)
                            Drawer.DrawString(g, this.StepInfos[i].DisplayValue, frameStyle, 9, new Point(this.XA(left), this.YA(0)));
                        ox = left + 40;
                    }
                }
            }
        }

        public override   OnPaintBackgroundLayer(): void { }
        public override   OnPaintFloatingLayer(): void { }
    }
}