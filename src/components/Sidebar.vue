<template>
    <div class="Sidebar">
        <input class="Sidebar__open" id="top-box" type="checkbox" hidden />
        <label class="Sidebar__btn" for="top-box" />
        <div class="Sidebar__panel">
            <div class="Sidebar__message">
                <slot />
            </div>
        </div>
    </div>
</template>


<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';

@Component
export default class Sidebar extends Vue {}
</script>

<style lang="scss" scoped>
.Sidebar {
    $root: &;

    &__open {
        &:checked {
            & ~ #{$root}__panel {
                top: 0
            }

            & + #{$root}__btn {
                top: 400px;
                background: #dd6149;

                &:after {
                    transform: rotate(-135deg);
                }
            }
        }
    }

    &__btn {
        display: block;
        position: absolute;
        right: 50px;
        top: 0;
        cursor: pointer;
        background: #2bbbad;
        width: 50px;
        border-radius: 0 0 5px 5px;
        padding: 8px 5px;
        color: #ffffff;
        text-align: center;
        transition: all 400ms cubic-bezier(0.17,0.04,0.03,0.94);
        box-shadow: 0 2px 5px 0 rgba(0,0,0,0.16),0 2px 10px 0 rgba(0,0,0,0.12);
        z-index: 9;

        &:hover {
            box-shadow: 0 5px 11px 0 rgba(0,0,0,0.18),0 4px 15px 0 rgba(0,0,0,0.15)
        }

        &:after {
            content: "";
            display: inline-block;
            border: solid #000000;
            border-width: 0 3px 3px 0;
            padding: 3px;
            transform: rotate(45deg);
        }
    }

    &__panel {
        background: #39464e;
        position: absolute;
        top: -400px;
        left: 0;
        width: 100%;
        height: 400px;
        padding: 0;
        box-shadow: 0 2px 5px 0 rgba(0,0,0,0.16),0 2px 10px 0 rgba(0,0,0,0.12);
        transition: top 400ms cubic-bezier(0.17,0.04,0.03,0.94);
        overflow-y: auto;
        z-index: 9;
    }

    &__message {
        color: #fff;
        font-weight: 300;
        position: relative;
        padding: 3em 2em;
        margin: 0 auto;
        max-width: 980px
    }
}
</style>
