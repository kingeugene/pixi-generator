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
import { InteractionEvent } from "pixi.js";
import {
    commonSettings, defaultListPositionFigure,
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
    removeEl = false;
    selectedValueFigure: TypeSelectedValueFigure = localStorage.getItem(variablesStorage.activeFigure) as TypeSelectedValueFigure || figures[0];
    settingsFigures: Hash<number> = JSON.parse(
        localStorage.getItem(variablesStorage.settingsFigures)
        || JSON.stringify(defaultSettingsFigures)
    );
    listPositionFigure: TypeDefaultListPositionFigure = JSON.parse(
        localStorage.getItem(variablesStorage.listFigures)
        || JSON.stringify(defaultListPositionFigure));

    get downloadSettingsStr(): string {
        return  "data:text/json;charset=utf-8," + encodeURIComponent(localStorage.getItem(variablesStorage.listFigures) || "");
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

    setLocalStoragePositionEl(): void {
        localStorage.setItem(variablesStorage.listFigures, JSON.stringify(this.listPositionFigure));
    }

    clear(): void {
        this.container.removeChildren();
        localStorage.removeItem(variablesStorage.listFigures);
    }

    clearFigure(type: TypeSelectedValueFigure, x: number): void {
        const list = this.listPositionFigure[type];

        for (let index = 0; index < list.length; index++) {
            if (list[index].x === x) {
                list.splice(index, 1);
                this.setLocalStoragePositionEl();
                break;
            }
        }
    }

    setFigure(type: TypeSelectedValueFigure, position: {x: number, y: number, data: Hash<number>}): void {
        this.listPositionFigure[type].push(position)
        this.setLocalStoragePositionEl()
    }

    drawCircle(x: number, y: number, data: Hash<number> = this.showSettingsFigures, setStorage: boolean = true): void {
        const {
            lineStyle,
            colorLineStyle,
            beginFill,
            radius
        } = data;

        if (setStorage) {
            this.setFigure("circle", { x, y, data })
        }

        const graphics = new PIXI.Graphics();

        graphics.lineStyle(lineStyle, colorLineStyle);
        graphics.beginFill(beginFill);
        graphics.drawCircle(x, y, radius);
        graphics.endFill();

        graphics.interactive = true;
        graphics.on("mousedown", () => {
            this.removeEl = true;
            graphics.destroy()
            this.clearFigure("circle", x);
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
            this.setFigure("rectangle", { x, y, data })
        }

        const graphics = new PIXI.Graphics();

        graphics.lineStyle(lineStyle, colorLineStyle);
        graphics.beginFill(beginFill);
        graphics.drawRect(x, y, width, height);
        graphics.endFill();

        graphics.interactive = true;
        graphics.on("mousedown", () => {
            this.removeEl = true;
            graphics.destroy()
            this.clearFigure("rectangle", x);
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
            this.setFigure("triangle", { x, y, data })
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
        graphics.on("mousedown", () => {
            this.removeEl = true;
            graphics.destroy()
            this.clearFigure("triangle", x);
        });
        this.container.addChild(graphics);
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

        const pixi: HTMLElement | null = document.getElementById("pixi");

        if (pixi) {
            pixi.appendChild(this.app.view);
        }

        this.container.interactive = true
        this.container.hitArea = this.app.screen;

        this.container.on("mousedown", (event: InteractionEvent) => {
            if (!this.removeEl) {
                const { x, y } = event.data.global;
                this.handlerActiveFigure(x, y)
            } else {
                this.removeEl = false;
            }
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
