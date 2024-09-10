/// <reference path="VisualComponent.ts"/>

namespace zsaltec.KChart {
    export class PanelTitleContainer extends VisualComponent {
        private _titles: TitleInfo[];
        constructor() {
            super();

            this._titles = [];
        }

        public override OnPaintFloatingLayer(g: IGraphics): void {
            var panel: ChartPanel = <ChartPanel>this.ParentVisualComponent;
            if (this.Chart.ShowCrosshair) {
                this.BuildTitles();
            }
            var ol: number = Drawer.CalTextWidth(g, 9, panel.Text) + 10;
            for (var i: number = 0; i < this._titles.length; i++) {
                if (Utils.isNull(this._titles[i].DisplayLength) || this._titles[i].DisplayLength <= 0)
                    this._titles[i].DisplayLength = Drawer.CalTextWidth(g, 9, this._titles[i].DisplayText) + 10;

                var len: number = this._titles[i].DisplayLength; 
                if (ol + len > this.Width)
                    break;
                var style = this._titles[i].Color; console.log(JSON.stringify(new Point(this.XA(ol), this.YA(0))));
                Drawer.DrawString(g, this._titles[i].DisplayText, style, 9, new Point(this.XA(ol), this.YA(0)));
                ol += len;
            }
        }
        public override  ViewUpdating(): void {
            this.BuildTitles();
        }
        private BuildTitles(): void {
            this._titles = [];
            var view: DataView = this.Chart.View;
            if (Utils.isNull(this.Chart.FocusInfo.RecordIndex))
                return;

            var recordIndex: number = view.GetRecordIndex(this.Chart.FocusInfo.FocusLocation.X - this.LocationA.X + 1);
            if (recordIndex < 0 || recordIndex >= view.LeftRecordIndex)
                return;
            var panel: ChartPanel = <ChartPanel>this.ParentVisualComponent;
            for (var i = 0; i < panel.Patterns.length; i++) {
                var pattern = panel.Patterns.Get(i);
                if (pattern.Visible) {
                    let tis = pattern.GetTitleAndValues(recordIndex);
                    if (Utils.isNotNull(tis)) {
                        for (var n = 0; n < tis.length; n++) {
                            this._titles.push(tis[n]);
                        }
                    }
                }
            }
        }

        public override  OnPaint(g: IGraphics): void {
            var x: number = this.XA(0);
            var y: number = this.YA(0);
            var text: string = (<ChartPanel>this.ParentVisualComponent).Text;
            var style = ThemePalette.Current.FontColor;
            Drawer.DrawString(g, text, style, 9, new Point(x, y));
        }


        public override OnMouseDoubleClick(e: MouseEventArgs): void {
            //super.OnMouseDoubleClick(e);


            //if (this.LocationA.X < e.X && this.LocationA.X + 100 > e.X && this.LocationA.Y < e.Y && this.LocationA.Y + this.Height > e.Y) {
            //    e.CancelBubbling = 1;
            //    var panel = <ChartPanel>this.ParentVisualComponent;
            //    panel.Patterns.forEach(function (pattern) {
            //        if (pattern instanceof this.FormulaPattern) {
            //            this.Chart.OnPanelTitleDbClick(new PanelTitleDbClickEventArgs(e, panel.Alias, pattern.Alias));
            //        }
            //    });
            //}

        }
    }
}