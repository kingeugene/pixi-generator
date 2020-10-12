type Hash<T = string> = { [key: string]: T };

type TypeVariablesStorage = {
    listFigures: string;
    activeFigure: string;
    settingsFigures: string;
}

type TypeFigures = ["circle", "rectangle", "triangle"];

type TypeSelectedValueFigure = "circle" | "rectangle" | "triangle";

type TypeCommonSettings = ["lineStyle", "colorLineStyle", "beginFill"];

type TypeFilterSettingsFigures = {
    circle: string[];
    rectangle: string[],
    triangle: string[],
}
