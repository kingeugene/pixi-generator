type Hash<T = string> = { [key: string]: T };

type TypeVariablesStorage = {
    listFigures: string;
    activeFigure: string;
    settingsFigures: string;
}

type TypeFigures = ["circle", "rectangle", "triangle"];

type TypeSelectedValueFigure = "circle" | "rectangle" | "triangle";

type TypeCommonSettings = ["lineStyle", "colorLineStyle", "beginFill"];

type TypeDefaultListPositionFigure = {
    circle: { x: number, y: number, data: Hash<number> }[];
    rectangle: { x: number, y: number, data: Hash<number> }[];
    triangle: { x: number, y: number, data: Hash<number> }[];
}

type TypeFilterSettingsFigures = {
    circle: string[];
    rectangle: string[],
    triangle: string[],
}
