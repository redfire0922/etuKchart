namespace zsaltec.KChart {

    export class ThemePalette {
        private static _themePalette: ThemePalette;

        public BackgroundColor: string;
        public FrameColor: string;
        public HighlightBackgroundColor: string;
        public FontColor: string;
        public HightlightColor: string;
        public UpCandleColor: string;
        public DownCandleColor: string;
        public AuxColor : string;

        public MajorYScaleLine: string;
        public BackgroundScaleLine: string;
        public BackgroundBoldScaleLine: string;
        public ArrowLine: string;
        public Tip_candleTitleBackgroundColor: string;
        public Tip_candleBodyBackgroundColor: string;
        public Tip_candleOutline: string;

        public IndicatorLine1: string;
        public IndicatorLine2: string;
        public IndicatorLine3: string;
        public IndicatorLine4: string;
        public IndicatorLine5: string;
        public IndicatorLine6: string;
        public IndicatorLine7: string;
        public IndicatorLine8: string;
        public IndicatorLine9: string;
        public IndicatorLine10: string;
        public IndicatorLine11: string;
        public IndicatorLine12: string;
        public IndicatorLine13: string;
        public IndicatorLine14: string;
        public IndicatorLine15: string;
        public IndicatorLine16: string;
        public IndicatorLine17: string;
        public IndicatorLine18: string;
        public IndicatorLine19: string;
        public IndicatorLine20: string;
        public OtherLine: string;
        public Color1: string;
        public Color2: string;
        public Color3: string;
        public Color7: string;
        public Color8: string;
        public Color4: string;
        public Color5: string;
        public Color6: string;
        public Color9: string;
        public Color10: string;
        public Font10Color1: string;
        public Font9Color2: string;
        public Font9Color3: string;
        public Font9Color4: string;
        public Font9Color5: string;
        public Font9Color7: string;
        public Font8Color8: string;
        public Font10bColor9: string;
        public Font10bColor10: string;
        public Font10bColor11: string;
        public Font10bColor14: string;
        public Font10bColor15: string;
        public Font17bColor16: string;
        public Font17bColor17: string;
        public Font17bColor18: string;
        public Font9Color19: string;
        public Font9Color20: string;
        public Font8Color21: string;
        public Font8Color22: string;
        public Font8Color23: string;
        public Font10Color13: string;
        public Font10bColor12: string;

        public static get Current(): ThemePalette {
            if (ThemePalette._themePalette == null)
                ThemePalette._themePalette = new ThemePalette();
            return ThemePalette._themePalette;
        }
        constructor() {
            this.BackgroundColor = "#000000";
            this.FrameColor = "#B00000";
            this.HighlightBackgroundColor = "#000080";
            this.FontColor = "#C0C0C0";
            this.HightlightColor = "#FFFFFF";
            this.UpCandleColor = "#FF3232";
            this.DownCandleColor = "#54FFFF";
            this.AuxColor = "#C0C0C0";

            this.Tip_candleTitleBackgroundColor = "#BDBD17";
            this.Tip_candleBodyBackgroundColor = "#FFFFFF";
            this.Tip_candleOutline = "#e7c610";
            this.MajorYScaleLine = "#FFFFFF";
            this.BackgroundBoldScaleLine = "B00000";

            this.IndicatorLine1 = "#FFFFFF";
            this.IndicatorLine2 = "#FFFF00";
            this.IndicatorLine3 = "#FF00FF";
            this.IndicatorLine4 = "#00FF00";
            this.IndicatorLine5 = "#00FFFF";
            this.IndicatorLine6 = "#0000FF";
            this.IndicatorLine7 = "#FF0000";
            this.IndicatorLine8 = "#A0522D";
            this.IndicatorLine9 = "#7FFF00";
            this.IndicatorLine10 = "#483D8B";
            this.IndicatorLine11 = "#800040";
            this.IndicatorLine12 = "#4b0080";
            this.IndicatorLine13 = "#2F4F4F";
            this.IndicatorLine14 = "#580000";
            this.IndicatorLine15 = "#808000";
            this.IndicatorLine16 = "#da70d6";
            this.IndicatorLine17 = "#5e86c1";
            this.IndicatorLine18 = "#008080";
            this.IndicatorLine19 = "#E9967A";
            this.IndicatorLine20 = "#ff8c69";
            this.OtherLine = "#00FFFF";

            this.Color1 = "#000000";
            this.Color2 = "#FF3232";
            this.Color3 = "#54FFFF";
            this.Color4 = "#B00000";
            this.Color5 = "#A0A0A0";
            this.Color6 = "#C0C0C0";
            this.Color7 = "#FF3232";
            this.Color8 = "#54FFFF";
            this.Color9 = "#FFFFFF";
            this.Color10 = "#C0C000";

            this.ArrowLine = "#C0C0C0";
            this.Font10Color1 = "#C0C0C0";
            this.Font9Color2 = "#FF3232";
            this.Font9Color3 = "#00FF00";
            this.Font9Color4 = "#FFFFFF";
            this.Font9Color5 = "#C0C000";
            this.Font9Color7 = "#D2D2D2";
            this.Font8Color8 = "#FFFF00";
            this.Font10bColor9 = "#A0A0A0";
            this.Font10bColor10 = "#FF5252";
            this.Font10bColor11 = "#50FF50";
            this.Font10bColor12 = "#C0C000";
            this.Font10Color13 = "#C0C000";
            this.Font10bColor14 = "#D2D2D2";
            this.Font10bColor15 = "#00FFFF";
            this.Font17bColor16 = "#FF5252";
            this.Font17bColor17 = "#50FF50";
            this.Font17bColor18 = "#D2D2D2";
            this.Font9Color19 = "#FF5252";
            this.Font9Color20 = "#50FF50";
            this.Font8Color21 = "#A0A0A0";
            this.Font8Color22 = "#00FFFF";
            this.Font8Color23 = "#000000";
        }

        public GetStyleByIndex(index: number): string {
            switch (index) {
                case 0:
                    return this.IndicatorLine1;
                case 1:
                    return this.IndicatorLine2;
                case 2:
                    return this.IndicatorLine3;
                case 3:
                    return this.IndicatorLine4;
                case 4:
                    return this.IndicatorLine5;
                case 5:
                    return this.IndicatorLine6;
                case 6:
                    return this.IndicatorLine7;
                case 7:
                    return this.IndicatorLine8;
                case 8:
                    return this.IndicatorLine9;
                case 9:
                    return this.IndicatorLine10;
                case 10:
                    return this.IndicatorLine11;
                case 11:
                    return this.IndicatorLine12;
                case 12:
                    return this.IndicatorLine13;
                case 13:
                    return this.IndicatorLine14;
                case 14:
                    return this.IndicatorLine15;
                case 15:
                    return this.IndicatorLine16;
                case 16:
                    return this.IndicatorLine20;
                case 17:
                    return this.IndicatorLine17;
                case 18:
                    return this.IndicatorLine18;
                case 19:
                    return this.IndicatorLine19;
                case 20:
                    return this.IndicatorLine20;
              
                default:
                    return this.IndicatorLine1;
            }
        }
    }
}