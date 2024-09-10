namespace zsaltec.KChart {
    export class Drawer {

        constructor() {

        }

        public static Clear(g: IGraphics, color: string, width: number, height: number) {
            g.FillRectangle(color, 0, 0, width, height);
        }

        public static DrawLine(g: IGraphics, color: string, spt: Point, ept: Point): void {
            g.DrawLine(color, [[spt.X, spt.Y], [ept.X, ept.Y]], 1, undefined);
        }
        public static DrawDashLine(g: IGraphics, color: string, spt: Point, ept: Point, dash: number[]): void {
            g.DrawLine(color, [[spt.X, spt.Y], [ept.X, ept.Y]], 1, dash);
        }
        public static DrawBoldLine(g: IGraphics, color: string, spt: Point, ept: Point, lineWidth: number): void {
            g.DrawLine(color, [[spt.X, spt.Y], [ept.X, ept.Y]], lineWidth, undefined);
        }
        public static FillRectangle(g: IGraphics, color: string, rec: Rectangle): void { 
            g.FillRectangle(color, rec.X, rec.Y, rec.Width, rec.Height);
        }
        public static DrawRectangle(g: IGraphics, color: string, rec: Rectangle): void {
            g.DrawRectangle(color, rec.X, rec.Y, rec.Width, rec.Height);
        }
        public static ChangeCursor(g: IGraphics, cursor: string) {
            g.ChangeCursor(cursor);
        }

        public static DrawString(g: IGraphics, text: string, color: string, size: number, p: Point): void {
            g.DrawString(text, color, size, p.X, p.Y);
        }

        public static DrawSacleXValue(g: IGraphics, p: Point, heigh: number, align: number, text: string): void {
            var frameStyle = ThemePalette.Current.FrameColor;
            var width: number = (Drawer.CalTextWidth(g, 8, text) + 8) * align;
            this.DrawLine(g, frameStyle, p, new Point(p.X, p.Y + heigh));
            this.DrawLine(g, frameStyle, new Point(p.X + width, p.Y), new Point(p.X + width, p.Y + heigh));
            var t: number = 0;
            if (width < 0) {
                t = width;
                width = -width;
            }
            this.FillRectangle(g, ThemePalette.Current.HighlightBackgroundColor, new Rectangle(p.X + t + 1, p.Y, width - 1, heigh));
            this.DrawString(g, text, ThemePalette.Current.FontColor, 8, new Point(p.X + t + 3, p.Y + 3));
        }

        public static DrawSacleYValue(g: IGraphics, p: Point, width: number, text: string): void {
            var color = ThemePalette.Current.FrameColor;
            this.DrawLine(g, color, p, new Point(p.X + width, p.Y));
            this.DrawLine(g, color, new Point(p.X, p.Y - 16), new Point(p.X + width, p.Y - 16));
            var hbstyle = ThemePalette.Current.HighlightBackgroundColor;
            this.FillRectangle(g, hbstyle, new Rectangle(p.X, p.Y - 15, width, 15));
            var highlightStyle = ThemePalette.Current.FontColor;
            this.DrawString(g, text, highlightStyle, 8, new Point(p.X + (width - Drawer.CalTextWidth(g, 8, text)) / 2 - 3, p.Y - 12));
        }

        public static FillBigBall(g: IGraphics, color: string, pts: Point[]): void {
            if (pts.length > 0) {
                var recs: Rectangle[] = [];
                pts.forEach(function (p) {
                    this.FillRectangle(color, new Rectangle(p.X, p.Y + 2, 5, 1));
                    this.FillRectangle(color, new Rectangle(p.X + 2, p.Y, 1, 5));
                    this.FillRectangle(color, new Rectangle(p.X + 1, p.Y + 1, 3, 3));
                });
            }
        }

        public static DrawHollowUpCandlePattern(g: IGraphics, high: Point, openY: number, closeY: number, lowY: number, sideWidth: number): void {
            if (Math.round(high.Y) != Math.round(lowY)) {
                this.DrawLine(g, ThemePalette.Current.UpCandleColor, high, new Point(high.X, lowY));
            }

            if (Math.round(openY) == Math.round(closeY)) {
                this.DrawLine(g, ThemePalette.Current.UpCandleColor, new Point(high.X - sideWidth, closeY), new Point(high.X + sideWidth, closeY));
            }
            else {
                this.DrawRectangle(g, ThemePalette.Current.UpCandleColor, new Rectangle(high.X - sideWidth, closeY, sideWidth + sideWidth, openY - closeY));
                if (openY - closeY == 2 || sideWidth == 1) {
                    this.DrawLine(g, ThemePalette.Current.BackgroundColor, new Point(high.X - sideWidth + 1, closeY + 1), new Point(high.X + sideWidth - 1, openY - 1));
                }
                else if (openY - closeY > 2) {
                    this.FillRectangle(g, ThemePalette.Current.BackgroundColor, new Rectangle(high.X - sideWidth + 1, closeY + 1, sideWidth + sideWidth - 1, openY - closeY - 1));
                }
            }
        }

        public static DrawSolidDownCandlePattern(g: IGraphics, high: Point, openY: number, closeY: number, lowY: number, sideWidth: number): void {
            if (Math.round(high.Y) != Math.round(lowY)) {
                this.DrawLine(g, ThemePalette.Current.DownCandleColor, high, new Point(high.X, lowY));
            }

            if (Math.round(openY) == Math.round(closeY)) {
                this.DrawLine(g, ThemePalette.Current.DownCandleColor, new Point(high.X - sideWidth, closeY), new Point(high.X + sideWidth, closeY));
            }
            else {
                this.FillRectangle(g, ThemePalette.Current.DownCandleColor, new Rectangle(high.X - sideWidth, openY, sideWidth + sideWidth + 1, closeY - openY + 1));
            }
        }

        public static DrawHorizontalCandlePattern(g: IGraphics, high: Point, openY: number, lowY: number, width: number): void {
            if (Math.round(high.Y) != Math.round(lowY)) {
                this.DrawLine(g, ThemePalette.Current.HightlightColor, high, new Point(high.X, lowY));
            }
            this.DrawLine(g, ThemePalette.Current.HightlightColor, new Point(high.X - width, openY), new Point(high.X + width, openY));
        }

        public static DrawCandleArrowMark(g: IGraphics, p: Point, text: string, offsetTop: number, turn: boolean): void {
            var lp: number = 14;
            var tl: number = 0;
            if (turn) {
                lp = -lp;
                tl = -40;
            }
            if (offsetTop >= 0)
                this.DrawLine(g, ThemePalette.Current.ArrowLine, p, new Point(p.X + lp, p.Y + offsetTop));
            else
                this.DrawLine(g, ThemePalette.Current.ArrowLine, p, new Point(p.X + lp, p.Y + offsetTop));

            if (offsetTop > 0)
                this.DrawString(g, text, ThemePalette.Current.Font10Color1, 10, new Point(p.X + lp + tl, p.Y));
            else
                this.DrawString(g, text, ThemePalette.Current.Font10Color1, 10, new Point(p.X + lp + tl, p.Y + offsetTop - 6));
        }

        public static DrawContinuousLine(g: IGraphics, color: string, pts: Point[]): void {
            let arrays = [];
            for (var i = 0; i < pts.length; i++) {
                arrays.push([pts[i].X, pts[i].Y]);
            }
            g.DrawLine(color, arrays, 1, undefined);
        }

        public static CalTextWidth(g: IGraphics, fontSize: number, text: string): number {
            let v = g.CalTextWidth(text, fontSize);
            return v;
        }
















        public static DrawPoint(g: IGraphics, color: string, pt1: Point): void {
            g.DrawPoint(color, pt1);
        }


        public static FillSmallBall(g: IGraphics, color: string, pts: Point[]): void {
            if (pts.length > 0) {
                pts.forEach(function (p) {
                    g.FillEllipse(color, new Point(p.X - 3, p.Y - 3), 2, 2);
                });
            }
        }
        public static DrawCandleTip(g: IGraphics, TipPosition: Point, groupName: string, data: string[]): void {
            this.FillRectangle(g, ThemePalette.Current.Tip_candleTitleBackgroundColor, new Rectangle(TipPosition.X + 1, TipPosition.Y + 1, 82, 17));
            this.FillRectangle(g, ThemePalette.Current.Tip_candleBodyBackgroundColor, new Rectangle(TipPosition.X + 1, TipPosition.Y + 18, 82, 111));
            this.DrawRectangle(g, ThemePalette.Current.Tip_candleOutline, new Rectangle(TipPosition.X, TipPosition.Y, 83, 17));
            this.DrawRectangle(g, ThemePalette.Current.Tip_candleOutline, new Rectangle(TipPosition.X, TipPosition.Y + 17, 83, 111));
            this.DrawString(g, groupName, ThemePalette.Current.Font8Color23, 8, new Point(TipPosition.X + 8, TipPosition.Y + 2));
            this.DrawString(g, "开:  " + data[0], ThemePalette.Current.Font8Color23, 8, new Point(TipPosition.X + 1, TipPosition.Y + 20));
            this.DrawString(g, "高:  " + data[1], ThemePalette.Current.Font8Color23, 8, new Point(TipPosition.X + 1, TipPosition.Y + 38));
            this.DrawString(g, "低:  " + data[2], ThemePalette.Current.Font8Color23, 8, new Point(TipPosition.X + 1, TipPosition.Y + 56));
            this.DrawString(g, "收:  " + data[3], ThemePalette.Current.Font8Color23, 8, new Point(TipPosition.X + 1, TipPosition.Y + 74));
            this.DrawString(g, "量:  " + data[4], ThemePalette.Current.Font8Color23, 8, new Point(TipPosition.X + 1, TipPosition.Y + 92));
            this.DrawString(g, "额:  " + data[5], ThemePalette.Current.Font8Color23, 8, new Point(TipPosition.X + 1, TipPosition.Y + 110));
        }
        public static DrawLineTip(g: IGraphics, _location: Point, group: string, title: string, value: string): void {
            var str: string = group + (Utils.IsNullOrEmpty(title) ? "" : Utils.TrimEnd(title, ':')) + ":  " + value;
            var width: number = Drawer.CalTextWidth(g, 8, str);
            this.FillRectangle(g, ThemePalette.Current.Tip_candleBodyBackgroundColor, new Rectangle(_location.X + 1, _location.Y + 1, width + 6, 17));
            this.DrawRectangle(g, ThemePalette.Current.Tip_candleOutline, new Rectangle(_location.X, _location.Y, width + 7, 17));
            this.DrawString(g, str, ThemePalette.Current.Font8Color23, 8, new Point(_location.X + 2, _location.Y + 2));
        }
    
        public static DrawPanelBlockText(TipPosition: Point, data: string[]): void {

        }
        public static DrawHollowUpVolumePattern(g: IGraphics, high: Point, lowY: number, sideWidth: number): void {
            var upStyle = ThemePalette.Current.Color2;
            var bblStyle = ThemePalette.Current.Color1;
            var bbStyle = ThemePalette.Current.BackgroundColor;
            if (lowY - high.Y < 1) {
                this.DrawLine(g, upStyle, new Point(high.X - sideWidth, high.Y), new Point(high.X + sideWidth, high.Y));
            }
            else {
                this.DrawRectangle(g, upStyle, new Rectangle(high.X - sideWidth, high.Y, sideWidth + sideWidth, lowY - high.Y));
                if (lowY - high.Y == 2 || sideWidth == 1) {
                    this.DrawLine(g, bblStyle, new Point(high.X - sideWidth + 1, high.Y + 1), new Point(high.X + sideWidth - 1, lowY - 1));
                }
                else if (lowY - high.Y > 2) {
                    this.FillRectangle(g, bbStyle, new Rectangle(high.X - sideWidth + 1, high.Y + 1, sideWidth + sideWidth - 1, lowY - high.Y - 1));
                }
            }
        }
        public static DrawSolidDownVolumePattern(g: IGraphics, high: Point, lowY: number, sideWidth: number): void {
            var downStyle = ThemePalette.Current.Color3;
            var dcStyle = ThemePalette.Current.Color8;
            if (lowY - high.Y < 1) {
                this.DrawLine(g, downStyle, new Point(high.X - sideWidth, high.Y), new Point(high.X + sideWidth, high.Y));
            }
            else {
                this.FillRectangle(g, dcStyle, new Rectangle(high.X - sideWidth, high.Y, sideWidth + sideWidth, lowY - high.Y + 1));
            }
        }
        public static DrawAmericaUpCandlePattern(g: IGraphics, high: Point, openY: number, closeY: number, lowY: number, sideWidth: number): void {
            if (openY == closeY) {
                this.DrawLine(g, ThemePalette.Current.Color2, new Point(high.X - sideWidth, closeY), new Point(high.X + sideWidth, closeY));
                if (high.Y != lowY) {
                    this.DrawLine(g, ThemePalette.Current.Color2, high, new Point(high.X, lowY));
                }
            }
            else {
                this.DrawLine(g, ThemePalette.Current.Color2, new Point(high.X - sideWidth, openY), new Point(high.X, openY));
                this.DrawLine(g, ThemePalette.Current.Color2, new Point(high.X, closeY), new Point(high.X + sideWidth, closeY));
                this.DrawLine(g, ThemePalette.Current.Color2, high, new Point(high.X, lowY));
            }
        }
        public static DrawAmericaDownCandlePattern(g: IGraphics, high: Point, openY: number, closeY: number, lowY: number, sideWidth: number): void {
            if (openY == closeY) {
                this.DrawLine(g, ThemePalette.Current.Color3, new Point(high.X - sideWidth, closeY), new Point(high.X + sideWidth, closeY));
                if (high.Y != lowY) {
                    this.DrawLine(g, ThemePalette.Current.Color3, high, new Point(high.X, lowY));
                }
            }
            else {
                this.DrawLine(g, ThemePalette.Current.Color3, new Point(high.X - sideWidth, openY), new Point(high.X, openY));
                this.DrawLine(g, ThemePalette.Current.Color3, new Point(high.X, closeY), new Point(high.X + sideWidth, closeY));
                this.DrawLine(g, ThemePalette.Current.Color3, high, new Point(high.X, lowY));
            }
        }

    }
}