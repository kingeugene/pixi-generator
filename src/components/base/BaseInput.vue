<template>
    <div class="BaseInput">
        <label class="BaseInput__label" :for="id">{{ label }}</label>
        <input
            :value="value"
            :id="id"
            :type="type"
            class="BaseInput__input"
            @input="handleInput"
        />
        <div v-if="errorMess" class="errorMess">{{errorMess}}</div>
    </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';

let i = 0;

type TypeInput = string | number | boolean;

@Component
export default class BaseInput extends Vue {
    @Prop({type: [ String, Number, Boolean ], default: ""}) value!: TypeInput;
    @Prop({type: String, default: "text"}) type!: string;
    @Prop({type: String, default: ""}) label!: string;
    @Prop({type: Number, default: 0}) maxValue!: number;
    @Prop({type: Boolean, default: false}) isHex!: boolean;
    @Prop({
        type: Function,
        default: () => null,
    }) onChangeValidation!: (value: string) => void;

    errorMess = "";
    id = `BaseInputId-${i++}`;

    checkMaxValue(value: number): void {
        if (value > this.maxValue) {
            this.errorMess = "Max value is " + this.maxValue;
        } else {
            this.errorMess = "";
        }
    };

    checkHex(value: string): boolean {
        switch(value.length) {
            case 3: return /^[0-9A-F]{3}$/i.test(value);
            case 6: return /^[0-9A-F]{6}$/i.test(value);
            case 8: return /^[0-9A-F]{8}$/i.test(value);
            default: return false;
        }
    }

    handleInput(event: { target: { value: string; }; }): void {
        const input = event.target.value.trim();

        if (this.maxValue) {
            this.checkMaxValue(+input);
        }

        if (this.isHex) {
            if (!this.checkHex(input)) {
                this.errorMess = "invalid color";
                this.$emit("input", input);
                return;
            } else {
                this.errorMess = "";
            }
        }

        this.$emit("input", +input);
    }
}
</script>

<style lang="scss" scoped>
.BaseInput {
    margin: 20px;

    &__label {
        display: block;
        margin-bottom: 6px;
    }

    &__input {
        border: 1px solid #e3e3e3;
        outline: none;
        padding: 10px;
        box-shadow: none;
        font-size: 16px;
    }
}
</style>
