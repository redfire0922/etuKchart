namespace zsaltec.KChart {
    export class ComLib {
        public static readonly Panels: Map<string, () => ChartPanel> = new Map<string, () => ChartPanel>();
        public static readonly Frames: Map<string, () => AccordionFrame> = new Map<string, () => AccordionFrame>();
        public static readonly Patterns: Map<string, () => PatternBase> = new Map<string, () => PatternBase>();
        public static readonly XScales: Map<string, () => XScaleBase> = new Map<string, () => XScaleBase>();
        public static readonly YScales: Map<string, () => YScaleBase> = new Map<string, () => YScaleBase>();
    }

    ComLib.Panels.set("default", () => new ChartPanel());

    ComLib.Frames.set("default", () => new DateLineFrame());

    ComLib.Patterns.set("default", () => new LinePattern());
    ComLib.Patterns.set("candle", () => new zsaltec.KChart.CandlePattern());

    ComLib.YScales.set("default", () => new RangeNumericScale());

    ComLib.XScales.set("default", () => new DateScale());

}