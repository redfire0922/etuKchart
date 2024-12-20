
namespace zsaltec.KChart {
    declare var document: any;
    declare var window: any;

    export class DrawingCanvas {
        private _canvasId: string;
        private _kChartView: KChartView;
        private _configs: ChartConfig;

        public get KChartView(): KChartView {
            return this._kChartView;
        }

        constructor(containerId: string, configs: ChartConfig) {
            this._configs = configs ?? <ChartConfig>{};
            this._canvasId = this._configs.canvasId || 'drawingCanvas';

            this._kChartView = this.buildKChartView(containerId, this._configs);

            // 监听窗口大小变化
            window.addEventListener('resize', () => {
                console.log("----window resized----");
                var containerBox = document.getElementById(containerId);//"canvas_box" 
                let rect = containerBox.getBoundingClientRect();
                if (rect.width > 0 && rect.height > 0) {
                    let canvas = document.getElementById(this._canvasId);
                    canvas.style.width = rect.width;
                    canvas.style.height = rect.height;

                    this._kChartView.Width = canvas.width;
                    this._kChartView.Height = canvas.height;
                    this._kChartView.DoLayout();
                }
            });
        }


        private buildKChartView(containerId: string, configs: ChartConfig): any {
            var canvas = document.createElement("canvas");
            canvas.style.border = "image-rendering: pixelated;";
            canvas.tabIndex = 0;
            canvas.id = this._canvasId;

            var containerBox = document.getElementById(containerId);//"canvas_box" 
            let rect = containerBox.getBoundingClientRect();
            containerBox.appendChild(canvas);

            canvas.width = rect.width;
            canvas.height = rect.height;

            let Offscreen = canvas.transferControlToOffscreen();
            const g = Offscreen.getContext("2d", { willReadFrequently: true, alpha: false });
            var graphics: IGraphics = {
                DrawLine(color: string, pts: number[][], lineWidth: number, dash: number[]) {
                    if (typeof lineWidth == 'undefined')
                        lineWidth = 1;
                    if (typeof dash != 'undefined')
                        g.setLineDash(dash);

                    g.strokeStyle = color;
                    g.beginPath();
                    g.lineWidth = lineWidth;

                    g.moveTo(pts[0][0] + 0.5, pts[0][1] + 0.5);
                    for (var i = 1; i < pts.length; i++) {
                        g.lineTo(pts[i][0] + 0.5, pts[i][1] + 0.5);
                    }
                    g.stroke();

                    if (typeof dash != 'undefined')
                        g.setLineDash([]);

                },
                FillRectangle(color: string, x: number, y: number, width: number, height: number) {
                    g.fillStyle = color;
                    g.fillRect(x, y, width, height);
                },
                DrawRectangle(color: string, x: number, y: number, width: number, height: number) {
                    g.strokeStyle = color;
                    g.strokeRect(x + 0.5, y + 0.5, width, height);
                },
                DrawString(text: string, color: string, fontSize, x: number, y: number) {
                    g.fillStyle = color;
                    const adsize = fontSize * 1.4;
                    g.font = adsize + "px Microsoft YaHei";
                    g.fillText(text, x, y + adsize - 2);
                },
                CalTextWidth(text: string, fontSize: number) {
                    const adsize = fontSize * 1.4;
                    g.font = adsize + "px Microsoft YaHei";
                    return g.measureText(text).width;
                },
                RenderTo(width: number, height: number) {
                    return g.getImageData(0, 0, width, height);
                },
                DrawImage(imgData, width: number, height: number) {
                    g.putImageData(imgData, 0, 0, 0, 0, width, height);
                },
                Render() {
                    //g.commit();
                },
                ChangeCursor(cursor) {
                    var body = document.querySelector("body");
                    body.style.cursor = cursor;
                },
                DrawContinuousLine(color: string, pts: Point[]) { },
                FillEllipse(color: string, point: Point, v1: number, v2: number) { },
                DrawPoint(color: string, pt1: Point) { }
            };


            const kChartView = new zsaltec.KChart.KChartView(canvas.width, canvas.height, graphics, configs);
            kChartView.InitializeComponent();
            kChartView.DoLayout();

            setInterval(kChartView.OnTimmerTick, 100);

            let left = rect.left;
            let top = rect.top;
            canvas.addEventListener('mousedown', (e) => { kChartView.OnMouseDown(this, { Button: e.button, X: e.x - left, Y: e.y - top, CancelBubbling: 0 }); }, false);
            canvas.addEventListener('mouseup', (e) => { kChartView.OnMouseUp(this, { Button: e.button, X: e.x - left, Y: e.y - top, CancelBubbling: 0 }); }, false);
            canvas.addEventListener('mousemove', (e) => { kChartView.OnMouseMove(this, { Button: e.button, X: e.x - left, Y: e.y - top, CancelBubbling: 0 }); }, false);
            canvas.addEventListener('mouseout', (e) => { kChartView.OnMouseLeave(this, { Button: e.button, X: e.x - left, Y: e.y - top, CancelBubbling: 0 }); }, false);
            canvas.addEventListener('mouseenter', (e) => { kChartView.OnMouseEnter(this, { Button: e.button, X: e.x - left, Y: e.y - top, CancelBubbling: 0 }); }, false);
            canvas.addEventListener('click', (e) => { kChartView.OnMouseClick(this, { Button: e.button, X: e.x - left, Y: e.y - top, CancelBubbling: 0 }); }, false);
            canvas.addEventListener('dblclick', (e) => { kChartView.OnMouseDoubleClick(this, { Button: e.button, X: e.x, Y: e.y - top, CancelBubbling: 0 }); }, false);
            canvas.addEventListener('keydown', (e) => { kChartView.OnKeyDown(this, { KeyCode: e.keyCode, Alt: e.alt, Control: e.control, Modifiers: e.modifiers, Shift: e.shift, SuppressKeyPress: e.suppressKeyPress, CancelBubbling: 0 }); }, false);
            canvas.addEventListener('keyup', (e) => { kChartView.OnKeyUp(this, { KeyCode: e.keyCode, Alt: e.alt, Control: e.control, Modifiers: e.modifiers, Shift: e.shift, SuppressKeyPress: e.suppressKeyPress, CancelBubbling: 0 }); }, false);

            return kChartView;
        }
    }
}






