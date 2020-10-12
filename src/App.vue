<template>
    <div id="app">
        <Sidebar>
            <div class="BaseRadioBtn__wrap">
                <BaseRadioBtn
                    v-for="(item, index) in figures"
                    :key="index"
                    :label="item"
                    :value="selectedValueFigure"
                    @change="changeFigure"
                />
            </div>
            <div class="BaseInput__wrap">
                <BaseInput
                    v-for="item in Object.keys(showSettingsFigures)"
                    :key="item"
                    :label="item"
                    :value="settingsFigures[item]"
                    :maxValue="validationSettings[item].maxValue"
                    :isHex="validationSettings[item].isHex"
                    @input="changeInput($event, item)"
                />
            </div>
        </Sidebar>
        <BaseButton class="reset" @click="clear">
            Reset
        </BaseButton>
        <BaseButton class="randomize" @click="randomizeFigure">
            Random
        </BaseButton>
        <a
            :href="downloadSettingsStr"
            download="settings.json"
            class="download"
        >Export</a>
        <div id="pixi" @click="handleClick" />
    </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import * as PIXI from 'pixi.js';

@Component({
    components: {
        BaseButton: () => import(/* webpackChunkName: "components" */ "@/components/base/BaseButton.vue"),
        BaseRadioBtn: () => import(/* webpackChunkName: "components" */ "@/components/base/BaseRadioBtn.vue"),
        BaseInput: () => import(/* webpackChunkName: "components" */ "@/components/base/BaseInput.vue"),
        Sidebar: () => import(/* webpackChunkName: "components" */ "@/components/Sidebar.vue"),
    },
})
export default class App extends Vue {
    app = new PIXI.Application({ resizeTo: window, backgroundColor: 0xE0E0E0 });
    graphics = new PIXI.Graphics();

    variablesStorage: TypeVariablesStorage = {
        listFigures: "listFigures",
        activeFigure: "activeFigure",
        settingsFigures: "settingsFigures",
    };
    figures: TypeFigures = ["circle", "rectangle", "triangle"];
    selectedValueFigure: TypeSelectedValueFigure = localStorage.getItem(this.variablesStorage.activeFigure) as TypeSelectedValueFigure
        || this.figures[0];
    defaultSettingsFigures: Hash<number> = {
        radius: 50,
        lineStyle: 1,
        colorLineStyle: 0xffd900,
        beginFill: 0xDE3249,
        width: 50,
        height: 50,
        lengthLine: 100,
    };
    settingsFigures: Hash<number> = JSON.parse(
        localStorage.getItem(this.variablesStorage.settingsFigures)
        || JSON.stringify(this.defaultSettingsFigures));

    commonSettings: TypeCommonSettings = ["lineStyle", "colorLineStyle", "beginFill"];
    filterSettingsFigures: TypeFilterSettingsFigures = {
        circle: ["radius"],
        rectangle: ["width", "height"],
        triangle: ["lengthLine"],
    };

    validationSettings = {
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

    get downloadSettingsStr(): string {
        return  "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(this.defaultSettingsFigures))
    }

    get showSettingsFigures(): Hash<number> {
        const data: Hash<number>  = {};

        this.commonSettings.forEach(item => {
            data[item] = this.settingsFigures[item]
        });

        this.filterSettingsFigures[this.selectedValueFigure].forEach(item => {
            data[item] = this.settingsFigures[item]
        });

        return data;
    }

    handleClick(event: MouseEvent): void {
        const { clientX, clientY } = event;

        switch (this.selectedValueFigure) {
            case "circle":
                this.drawCircle(clientX, clientY);
                break;
            case "rectangle":
                this.drawRectangle(clientX, clientY);
                break;
            case "triangle":
                this.drawTriangle(clientX, clientY);
                break;
            default:
                this.drawCircle(clientX, clientY);
        }
    }

    getRandomPosition(): { x: number, y: number } {
        const x = window.innerWidth;
        const y = window.innerHeight;

        return {
            x: Math.floor(Math.random() * x),
            y: Math.floor(Math.random() * y)
        };
    }

    randomInteger(max: number, min: number = 0): number {
        const rand = min + Math.random() * (max + 1 - min);

        return Math.floor(rand);
    }

    getRandomColor(): number {
        const letters = "0123456789ABCDEF";
        let color = "";

        for (var i = 0; i < 6; i++) {
            color += letters[Math.floor(Math.random() * 10)];
        }

        return +color;
    }

    randomizeFigure(): void {
        const {x, y} = this.getRandomPosition();
        const data: Hash<number> = {
            radius: this.randomInteger(100),
            lineStyle: this.randomInteger(20),
            colorLineStyle: this.getRandomColor(),
            beginFill: this.getRandomColor(),
            width: this.randomInteger(200),
            height: this.randomInteger(200),
            lengthLine: this.randomInteger(200),
        };

        switch (this.selectedValueFigure) {
            case "circle":
                this.drawCircle(x, y, data);
                break;
            case "rectangle":
                this.drawRectangle(x, y, data);
                break;
            case "triangle":
                this.drawTriangle(x, y, data);
                break;
            default:
                this.drawCircle(x, y, data);
        }
    }

    changeFigure(value: TypeSelectedValueFigure): void {
        this.selectedValueFigure = value;

        localStorage.setItem(this.variablesStorage.activeFigure, this.selectedValueFigure);
    }

    changeInput(value: number, item: string): void {
        this.settingsFigures[item] = value;

        localStorage.setItem(this.variablesStorage.settingsFigures, JSON.stringify(this.settingsFigures));
    }

    clear(): void {
        this.graphics.clear();
        localStorage.removeItem(this.variablesStorage.listFigures);
    }

    drawCircle(x: number, y: number, data: Hash<number> = this.showSettingsFigures, setStorage: boolean = true): void {
        const {
            lineStyle,
            colorLineStyle,
            beginFill,
            radius
        } = data;

        if (setStorage) {
            this.setLocalStorageData({x, y, data}, "circle");
        }

        this.graphics.lineStyle(lineStyle, colorLineStyle);
        this.graphics.beginFill(beginFill);
        this.graphics.drawCircle(x, y, radius);
        this.graphics.endFill();

        this.app.stage.addChild(this.graphics);
    }

    drawRectangle(x: number, y: number, data: Hash<number> = this.showSettingsFigures, setStorage: boolean = true): void {
        const {
            lineStyle,
            colorLineStyle,
            beginFill,
            width,
            height,
        } = data;

        if (setStorage) {
            this.setLocalStorageData({x, y, data},"rectangle");
        }

        this.graphics.lineStyle(lineStyle, colorLineStyle);
        this.graphics.beginFill(beginFill);
        this.graphics.drawRect(x, y, width, height);
        this.graphics.endFill();

        this.app.stage.addChild(this.graphics);
    }

    drawTriangle(x: number, y: number, data: Hash<number> = this.showSettingsFigures, setStorage: boolean = true): void {
        const {
            lineStyle,
            colorLineStyle,
            beginFill,
            lengthLine,
        } = data;

        if (setStorage) {
            this.setLocalStorageData({x, y, data},"triangle");
        }

        const midLength = lengthLine / 2;

        this.graphics.beginFill(beginFill);
        this.graphics.lineStyle(lineStyle, colorLineStyle);
        this.graphics.moveTo(x, y - midLength);
        this.graphics.lineTo(x - midLength, y - midLength);
        this.graphics.lineTo(x, y + midLength);
        this.graphics.lineTo(x + midLength, y - midLength);
        this.graphics.closePath();
        this.graphics.endFill();

        this.app.stage.addChild(this.graphics);
    }

    setLocalStorageData(data: {x: number; y: number; data: Hash<number>}, property: string): void {
        const currentData = JSON.parse(localStorage.getItem(this.variablesStorage.listFigures) || "{}");

        if (!currentData[property]) {
            currentData[property] = [];
        }

        currentData[property].push(data);

        localStorage.setItem(this.variablesStorage.listFigures, JSON.stringify(currentData));
    }

    mounted() {
        const currentData = JSON.parse(localStorage.getItem(this.variablesStorage.listFigures) || "{}");

        const { circle, rectangle, triangle }: {circle: [] | null; rectangle: [] | null; triangle: [] | null} = currentData;

        if (circle) {
            circle.forEach(item => {
                const {x, y, data} = item;
                this.drawCircle(x, y, data, false)
            });
        }

        if (rectangle) {
            rectangle.forEach(item => {
                const {x, y, data} = item;
                this.drawRectangle(x, y, data, false)
            });
        }

        if (triangle) {
            triangle.forEach(item => {
                const {x, y, data} = item;
                this.drawTriangle(x, y, data, false)
            });
        }

        document.getElementById("pixi")!.appendChild(this.app.view);
    }
}
</script>

<style lang="scss">
@import "./style/index";

#app {
    .BaseRadioBtn {
        &__wrap {
            display: flex;
            justify-content: space-around;
            flex-wrap: wrap;
        }
    }

    .BaseInput {
        &__wrap {
            display: flex;
            justify-content: space-around;
            flex-wrap: wrap;
            margin: 40px 0;
        }
    }

    .reset {
        position: absolute;
        left: 10px;
        top: 10px;
    }

    .randomize {
        position: absolute;
        left: 130px;
        top: 10px;
    }

    .download {
        position: absolute;
        left: 280px;
        top: 10px;
        background-color: #2bbbad;
        border: none;
        outline: none;
        cursor: pointer;
        color: #ffffff;
        padding: 15px 32px;
        text-align: center;
        text-decoration: none;
        display: inline-block;
        font-size: 16px;
    }
}
</style>
