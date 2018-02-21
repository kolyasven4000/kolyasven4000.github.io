<template>
<div class="components">
    <div class="close-btn"
         @click="closeComponent"
         v-if="curComponent && !crossHidden"></div>
    <transition-group name="flip-list"
                      tag="div"
                      class="components__wrapper">
        <div class="components__preview"
             @click="renderComponent(component)"
             v-for="(component, index) in content"
             :key="component">{{component}}</div>
    </transition-group>
    <transition name="entry">
        <div class="components__content"
             v-if="curComponent">
            <div class="components__layout"
                 @click="closeComponent"></div>
            <component class="components__component"
                       :is="curComponent"
                       @switchCross="switchCross"
                       @goBack="closeComponent"></component>
        </div>
    </transition>
</div>

</template>

<script>
import videoWrapper from './content/videoWrapper.vue';
import glossaryPage from './content/glossaryPage.vue';
import notesPage from './content/notesPage.vue';
import pdfPlayer from './content/pdfPlayer.vue';
import feedback from './content/feedback.vue';
import accordion from './content/accordion.vue';
import slider from './content/slider.vue';
import modalPage from './content/modalPage.vue';
import soundManager from './content/soundManager.vue';
import test from './content/test.vue';
import textAdder from './content/textAdder.vue';
let componentsList = {
    videoWrapper,
    glossaryPage,
    notesPage,
    pdfPlayer,
    feedback,
    accordion,
    slider,
    modalPage,
    soundManager,
    test,
    textAdder
};
export default {
    name: 'custom-components',
    components: componentsList,

    data() {
        return {
            content: null,
            curComponent: null,
            crossHidden: false
        };
    },
    created() {

        this.content = Object.keys(componentsList);
    },
    mounted() {
        this.content = _.shuffle(this.content);

    },
    computed: {

    },

    methods: {

        renderComponent(e) {
            this.curComponent = e;
            if (!this.crossHidden) {
                this.crossHidden = false;
            }
        },
        closeComponent() {
            this.curComponent = null;
        },
        switchCross() {
            this.crossHidden = !this.crossHidden;
        }
    }

}

</script>

<style scoped="" lang="scss">
.components {
    height: 100vh;
    background: linear-gradient(to bottom right, blue, pink);
    &__wrapper {
        display: flex;
        height: inherit;
        flex-wrap: wrap;
        justify-content: space-around;
        align-items: center;
        max-width: 968px;
        margin: 0 auto;
    }
    &__preview {
        display: inline-block;
        height: 200px;
        width: 200px;
        background-color: rgba(0, 0, 0, .4);
        cursor: pointer;
        font-size: 25px;
        line-height: 200px;
        font-weight: bold;
        color: white;
        text-align: center;
        letter-spacing: .3px;
    }
    &__content {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        overflow: hidden;
        transition: .3s;
    }
    &__layout {
        position: absolute;
        top: 0;
        left: 0;
        width: inherit;
        height: inherit;
        background-color: rgba(0, 0, 0, .7);
    }
    &__component {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
    }
}

.entry-enter-active,
.entry-leave-active {
    //transition: opacity .5s
}

.entry-enter,
.entry-leave-active {
    opacity: 0;
}

.flip-list-move {
    transition: transform 1s;
}
</style>

<style lang="scss">
.default-btn {
    display: inline-block;
    background: #33B370;
    cursor: pointer;
    transition: .3s;
    height: 48px;
    padding: 0 33px;
    border-radius: 10px;
    font-size: 18px;
    line-height: 48px;
    font-weight: bold;
    color: #fff;
    text-align: center;
    vertical-align: top;
    outline: none;
    border: none;
    vertical-align: middle;
    &+& {
        margin-left: 10px;
    }
    &:hover,
    &:active {
        background: #F6AC32;
    }
    &--disabled {
        filter: grayscale(100%);
        pointer-events: none;
    }
    &--reverse {
        border: 1px solid #33B370;
        background: #fff;
        color: #33B370;
        &:hover,
        &:active {
            background: transparent;
            border: 1px solid #F6AC32;
            color: #F6AC32;
        }
    }
}

.add-btn {
    position: relative;
    width: 38px;
    height: 38px;
    display: inline-block;
    background-color: #33B370;
    border-radius: 50%;
    transition: .3s;
    vertical-align: top;
    cursor: pointer;
    z-index: 10;
    &:hover,
    &:active {
        background-color: #F6AC32;
    }
    &::before {
        content: '';
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
        width: 15px;
        height: 15px;
        background: url(~img/buttons/plus.svg) center no-repeat;
        background-size: cover;
    }
}

.close-btn {
    display: inline-block;
    position: absolute;
    top: 50px;
    right: 50px;
    width: 38px;
    height: 38px;
    background-color: #33B370;
    border-radius: 50%;
    background-size: cover;
    margin-left: 10px;
    vertical-align: top;
    transition: .3s;
    cursor: pointer;
    z-index: 10; //если кнопка должна выезжать за края модалки etc
    &--out {
        right: -12px;
        top: -12px;
    }
    &::before {
        content: '';
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
        width: 12px;
        height: 12px;
        background: url('~img/buttons/close.png') center no-repeat;
        background-size: contain;
    }
    &:hover,
    &:active {
        background-color: #F6AC32;
    }
    &--case {
        position: fixed;
        top: 97px;
        right: calc(50% - 512px + 32px);
    }
}
</style>
