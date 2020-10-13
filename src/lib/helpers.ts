export const figures: TypeFigures = ["circle", "rectangle", "triangle"];
export const commonSettings: TypeCommonSettings = ["lineStyle", "colorLineStyle", "beginFill"];
export const variablesStorage: TypeVariablesStorage = {
    listFigures: "listFigures",
    activeFigure: "activeFigure",
    settingsFigures: "settingsFigures",
};

export const defaultSettingsFigures: Hash<number> = {
    radius: 50,
    lineStyle: 1,
    colorLineStyle: 0xffd900,
    beginFill: 0xDE3249,
    width: 50,
    height: 50,
    lengthLine: 100,
};

export const defaultListPositionFigure: TypeDefaultListPositionFigure = {
    circle: [],
    rectangle: [],
    triangle: [],
};

export const validationSettings: Hash<Hash<number| boolean>> = {
    radius: {
        maxValue: 200,
    },
    lineStyle: {
        maxValue: 200,
    },
    colorLineStyle: {
        isHex: true
    },
    beginFill: {
        isHex: true
    },
    width: {
        maxValue: 200,
    },
    height: {
        maxValue: 200,
    },
    lengthLine: {
        maxValue: 200,
    },
};

export const filterSettingsFigures: TypeFilterSettingsFigures = {
    circle: ["radius"],
    rectangle: ["width", "height"],
    triangle: ["lengthLine"],
};

export function getRandomPosition(): { x: number, y: number } {
    return {
        x: Math.floor(Math.random() * window.innerWidth),
        y: Math.floor(Math.random() * window.innerHeight)
    };
}

export function randomInteger(max: number, min: number = 0): number {
    return (min + Math.random() * (max + 1 - min));
}

export function getRandomColor(): number {
    return Math.floor(Math.random() * 0xFFFFFF);
}
