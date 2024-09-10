/// <reference path = "Entity.ts" /> 
namespace zsaltec.KChart {

    export class EventArgs {
        constructor() {
        }
    }

    export class MouseEventArgs {
        constructor(button: number, x: number, y: number) {
            this.Button = button;
            this.X = x;
            this.Y = y;

        }
        public Button: number;
        public X: number;
        public Y: number;
        public CancelBubbling: number = 0;
    }

    export class KeyEventArgs {
        constructor(keyCode: number) {
            this.KeyCode = keyCode;
        }
        public Alt: boolean;
        public Control: boolean;
        public KeyCode: Keys;
        public Modifiers: number;
        public Shift: boolean;
        public SuppressKeyPress: boolean;
        public CancelBubbling: number = 0;
    }

    export class PanelSelectChangedArgs {
        public SelectedPanel: ChartPanel;
    }

    export class FocusedChangedArgs {
        public value: number;
        public SeriesRowIndex: number;
        public X: number;
        public Y: number;
    }

    export class CrosshairVisibleChangedArgs {
        public Visible: boolean;
    }

    export class PanelContextMenuArgs {
        public SelectedPanel: ChartPanel;
        public Location: Point;
    }

    export class PanelDbClickEventArgs extends MouseEventArgs {
        public PanelAlias: string;
        public FragmentAlias: string;

        constructor(e: MouseEventArgs) {
            super(e.Button, e.X, e.Y);

        }
    }

    export class PatternDbClickEventArgs extends PanelDbClickEventArgs {
        public RecordIndex: number;
        public SelectedDate: Date;

        constructor(e: MouseEventArgs) {
            super(e);

        }
    }

    export class PanelTitleDbClickEventArgs extends PanelDbClickEventArgs {
        constructor(e: MouseEventArgs, panelAlias: string, fragmentAlias: string) {
            super(e);
            this.PanelAlias = panelAlias;
            this.FragmentAlias = fragmentAlias;
        }
    }

    export class StatisticContextMenuArgs {
        public Location: Point;
        public RecordX2: number;
        public RecordX1: number;
    }

    export class AuxPaintFinishedArgs {
        public PathPoints: Point[];
        public Button: number;
        public Location: Point;
    }

    export type EventHandler = (sender: any, e: EventArgs) => void;
    export type MouseEventHandler = (sender: any, e: MouseEventArgs) => void;
    export type KeyEventHandler = (sender: any, e: KeyEventArgs) => void;
    export type PanelSelectChangedHandler = (sender: any, e: PanelSelectChangedArgs) => void;
    export type FocusedChangedHandler = (sender: any, e: FocusedChangedArgs) => void;
    export type CrosshairVisibleChangedHandler = (sender: any, e: CrosshairVisibleChangedArgs) => void;
    export type PanelContextMenuHandler = (sender: any, e: PanelContextMenuArgs) => void;
    export type PatternDbClickHandler = (sender: any, e: PatternDbClickEventArgs) => void;
    export type PanelTitleDbClickHandler = (sender: any, e: PanelTitleDbClickEventArgs) => void;
    export type StatisticContextMenuHandler = (sender: any, e: StatisticContextMenuArgs) => void;
    export type AuxPaintFinishedHandler = (sender: any, e: AuxPaintFinishedArgs) => void;
}