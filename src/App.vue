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
        <div class="option-btn">
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
        </div>

        <div id="pixi" />
    </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import * as PIXI from 'pixi.js';
import {
    commonSettings,
    defaultSettingsFigures,
    figures, filterSettingsFigures,
    getRandomColor,
    getRandomPosition,
    randomInteger,
    validationSettings, variablesStorage
} from "@/lib/helpers";

@Component({
    components: {
        BaseButton: () => import(/* webpackChunkName: "components" */ "@/components/base/BaseButton.vue"),
        BaseRadioBtn: () => import(/* webpackChunkName: "components" */ "@/components/base/BaseRadioBtn.vue"),
        BaseInput: () => import(/* webpackChunkName: "components" */ "@/components/base/BaseInput.vue"),
        Sidebar: () => import(/* webpackChunkName: "components" */ "@/components/Sidebar.vue"),
    },
    data() {
        return {
            validationSettings,
            figures,
        }
    }
})
export default class App extends Vue {
    app = new PIXI.Application({ resizeTo: window, backgroundColor: 0xE0E0E0 });
    container = new PIXI.Container();
    selectedValueFigure: TypeSelectedValueFigure = localStorage.getItem(variablesStorage.activeFigure) as TypeSelectedValueFigure || figures[0];
    settingsFigures: Hash<number> = JSON.parse(
        localStorage.getItem(variablesStorage.settingsFigures)
        || JSON.stringify(defaultSettingsFigures)
    );

    get downloadSettingsStr(): string {
        return  "data:text/json;charset=utf-8," + encodeURIComponent(localStorage.getItem(variablesStorage.listFigures));
    }

    get showSettingsFigures(): Hash<number> {
        const data: Hash<number> = {};

        commonSettings.forEach(item => {
            data[item] = this.settingsFigures[item]
        });

        filterSettingsFigures[this.selectedValueFigure].forEach(item => {
            data[item] = this.settingsFigures[item]
        });

        return data;
    }

    handlerActiveFigure(x: number, y: number, data?: Hash<number>): void {
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

    randomizeFigure(): void {
        const { x, y } = getRandomPosition();
        const data: Hash<number> = {
            radius: randomInteger(100),
            lineStyle: randomInteger(10),
            colorLineStyle: getRandomColor(),
            beginFill: getRandomColor(),
            width: randomInteger(200),
            height: randomInteger(200),
            lengthLine: randomInteger(200),
        };

        this.handlerActiveFigure(x, y, data);
    }

    changeFigure(value: TypeSelectedValueFigure): void {
        this.selectedValueFigure = value;
        localStorage.setItem(variablesStorage.activeFigure, this.selectedValueFigure);
    }

    changeInput(value: number, item: string): void {
        this.settingsFigures[item] = value;
        localStorage.setItem(variablesStorage.settingsFigures, JSON.stringify(this.settingsFigures));
    }

    clear(): void {
        this.container.removeChildren();
        localStorage.removeItem(variablesStorage.listFigures);
    }

    drawCircle(x: number, y: number, data: Hash<number> = this.showSettingsFigures, setStorage: boolean = true): void {
        const {
            lineStyle,
            colorLineStyle,
            beginFill,
            radius
        } = data;

        if (setStorage) {
            this.setLocalStorageData({ x, y, data }, "circle");
        }

        const graphics = new PIXI.Graphics();

        graphics.lineStyle(lineStyle, colorLineStyle);
        graphics.beginFill(beginFill);
        graphics.drawCircle(x, y, radius);
        graphics.endFill();

        graphics.interactive = true;
        graphics.on("mousedown", function() {
            graphics.destroy(true)
        });
        this.container.addChild(graphics);
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
            this.setLocalStorageData({ x, y, data },"rectangle");
        }

        const graphics = new PIXI.Graphics();

        graphics.lineStyle(lineStyle, colorLineStyle);
        graphics.beginFill(beginFill);
        graphics.drawRect(x, y, width, height);
        graphics.endFill();

        graphics.interactive = true;
        graphics.on("mousedown", function() {
            graphics.destroy(true)
        });

        this.container.addChild(graphics);
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
        const graphics = new PIXI.Graphics();

        graphics.beginFill(beginFill);
        graphics.lineStyle(lineStyle, colorLineStyle);
        graphics.moveTo(x, y - midLength);
        graphics.lineTo(x - midLength, y - midLength);
        graphics.lineTo(x, y + midLength);
        graphics.lineTo(x + midLength, y - midLength);
        graphics.closePath();
        graphics.endFill();

        graphics.interactive = true;
        graphics.on("mousedown", function() {
            graphics.destroy(true)
        });
        this.container.addChild(graphics);
    }

    setLocalStorageData(data: {x: number; y: number; data: Hash<number>}, property: string): void {
        const currentData = JSON.parse(localStorage.getItem(variablesStorage.listFigures) || "{}");

        if (!currentData[property]) {
            currentData[property] = [];
        }

        currentData[property].push(data);
        localStorage.setItem(variablesStorage.listFigures, JSON.stringify(currentData));
    }

    mounted() {
        const currentData = JSON.parse(localStorage.getItem(variablesStorage.listFigures) || "{}");

        const { circle, rectangle, triangle }: { circle: [] | null; rectangle: [] | null; triangle: [] | null } = currentData;

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

        const pixi: HTMLElement = document.getElementById("pixi");

        pixi.appendChild(this.app.view);

        this.container.interactive = true
        this.container.hitArea = this.app.screen;

        this.container.on("mousedown", (event) => {
            const { offsetX, offsetY } = event.data.originalEvent;
            this.handlerActiveFigure(offsetX, offsetY)
        })


        this.app.stage.addChild(this.container);
    }

    destroyed() {
        this.app.destroy(true);
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

    .option-btn {
        display: flex;
        position: absolute;
        left: 10px;
        top: 10px;
    }

    .download {
        background-color: #2bbbad;
        border: none;
        outline: none;
        cursor: pointer;
        color: #ffffff;
        padding: 15px 32px;
        margin: 0 10px;
        text-align: center;
        text-decoration: none;
        display: inline-block;
        font-size: 16px;
    }
}
</style>
