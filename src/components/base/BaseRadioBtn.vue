<template>
    <div class="BaseRadioBtn">
        <input
            :value="label"
            :id="id"
            v-model="radioButtonValue"
            class="BaseRadioBtn__input"
            type="radio"
            hidden
        />
        <label class="BaseRadioBtn__label" :for="id">{{ label }}</label>
    </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';

let i = 0;

@Component
export default class BaseRadioBtn extends Vue {
    @Prop({type: [ String, Number, Boolean ], default: ""}) value!: string;
    @Prop({type: String, default: "button"}) type!: string;
    @Prop({type: String, default: ""}) label!: string;

    id = `BaseRadioBtnId-${i++}`;

    get radioButtonValue(): string {
        return this.value;
    }

    set radioButtonValue(value: string) {
        this.$emit("change", value);
    }
}
</script>

<style lang="scss" scoped>
.BaseRadioBtn {
    $root: &;

    &__label {
        display: inline-block;
        width: 100px;
        padding: 10px 20px;
        margin: 10px;
        background: white;
        box-shadow: 3px 3px 8px rgba(0, 0, 0, 0.3);
        color: #000000;
        font-size: 20px;
        text-transform: capitalize;
        text-align: center;
        cursor: pointer;
        border-radius: 20px;
        transition: background .5s, color .5s;
    }

    &__input {
        &:checked + #{$root}__label {
            background: #117711;
            color: #ffffff;
        }
    }
}
</style>
