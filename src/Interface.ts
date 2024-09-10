namespace zsaltec.KChart {
    export interface IChartElement {
        ParentVisualComponent: IChartElement;
        Chart: StockChartView;
    }

    export interface IGraphics {
        DrawLine(color: string, pts: number[][], lineWidth: number, dash: number[]): void;
        FillRectangle(color: string, x: number, y: number, width: number, height: number): void;
        DrawString(text: string, color: string, size: number, x: number, y: number): void;
        DrawRectangle(color: string, x: number, y: number, width: number, height: number): void;


        DrawContinuousLine(color: string, pts: Point[]): void;
        FillEllipse(color: string, point: Point, v1: number, v2: number): void;

        CalTextWidth(text: string, fontSize: number): number;
        DrawPoint(color: string, pt1: Point): void;

        ChangeCursor(cursor: string): void;

        DrawImage(any, width: number, height: number): void;
        RenderTo(width: number, height: number): any;
        Render(): void;
    }


}