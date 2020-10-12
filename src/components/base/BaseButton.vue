<template>
    <button
        class="BaseButton"
        :type="type"
        @click="$emit('click')"
        :disabled="disabled"
    >
        <span class="BaseButton__content">
            <slot />
        </span>
    </button>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';

@Component
export default class BaseButton extends Vue {
    @Prop({type: String, default: "button"}) type!: string;
    @Prop({type: Boolean, default: false}) disabled!: boolean;
}
</script>

<style lang="scss" scoped>
.BaseButton {
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
</style>
