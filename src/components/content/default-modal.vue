<template>
<section class="modal">
    <transition :name="animName">
        <section class="modal__window"
                 :style="styleObj"
                 v-show="showModal">
            <div class="modal__header">
                <slot name='modal-header'></slot>
            </div>
            <div class="modal__content">
                <slot name='modal-content'></slot>
            </div>
            <div class="modal__footer">
                <slot name='modal-footer'></slot>
            </div>
        </section>
    </transition>
    <transition name="fade">
        <div class="modal__background"
             v-show="showModal"
             @click="closeModal"></div>
    </transition>
</section>

</template>

<script>
export default {
    name: 'modal',
    methods: {
        closeModal() {
            this.$emit('closeModal');
        }
    },
    computed: {
        styleObj() {
            return {
                'width': this.width + 'px',
                'height': this.height + 'px'
            };
        }
    },
    props: {
        animName: {
            type: [
                String
            ],
            default: function() {
                return 'fade';
            }
        },
        showModal: {
            type: [
                Boolean
            ],
            default: function() {
                return false;
            }
        },
        width: {
            type: String,
            validator: function(value) {
                return (value !== null);
            },
            default: function() {
                return '';
            }
        },
        height: {
            type: String,
            validator: function(value) {
                return (value !== null);
            },
            default: function() {
                return '';
            }
        }
    }
}

</script>

<style lang="scss">
.fade-enter-active {
    transition: opacity .5s
}

.fade-leave-active {
    transition: opacity 1s
}

.fade-enter,
.fade-leave-active {
    opacity: 0
}

.bounce-enter-active {
    animation: bounce-in .5s;
}

.bounce-leave-active {
    animation: bounce-out .5s;
}

.hinge-enter-active {
    animation: bounce-in .5s;
}

.hinge-leave-active {
    animation: hinge-out 1s;
}

.modal {
    &__header,
    &__content,
    &__footer {
        margin-bottom: 30px;
        overflow: hidden;
    }
    &__content {
        word-wrap: break-word;
        max-height: 50%;
    }
    &__window {
        position: absolute;
        top: 50%;
        left: 50%;
        z-index: 1;
        box-shadow: 0 0 10px 0;
        transform: translate(-50%, -50%);
        text-align: center;
        background-color: #fff;
        padding: 20px;
        box-sizing: border-box;
        @keyframes hinge-out {
            0% {
                transform: translate(-50%, -50%) rotate(0);
                transform-origin: top left;
                animation-timing-function: ease-in-out;
            }
            20%,
            60% {
                transform: translate(-50%, -50%) rotate(80deg);
                transform-origin: top left;
                animation-timing-function: ease-in-out;
            }
            40% {
                transform: translate(-50%, -50%) rotate(60deg);
                transform-origin: top left;
                animation-timing-function: ease-in-out;
            }
            80% {
                transform: translate(-50%, -50%) rotate(60deg) translateY(0);
                opacity: 1;
                transform-origin: top left;
                animation-timing-function: ease-in-out;
            }
            100% {
                transform: translate(-50%, -50%) translateY(700px);
                opacity: 0;
            }
        }
        @keyframes bounce-in {
            0% {
                transform: translate(-50%, -50%) scale(0);
            }
            50% {
                transform: translate(-50%, -50%) scale(1.5);
            }
            100% {
                transform: translate(-50%, -50%) scale(1);
            }
        }
        @keyframes bounce-out {
            0% {
                transform: translate(-50%, -50%) scale(1);
            }
            50% {
                transform: translate(-50%, -50%) scale(1.5);
            }
            100% {
                transform: translate(-50%, -50%) scale(0);
            }
        }
    }
    &__background {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(81, 100, 107, 0.7);
        z-index: 0;
    }
    &__exit {
        outline: none;
        border: none;
        background: none;
        position: absolute;
        top: 15px;
        right: 15px;
        width: 30px;
        height: 30px;
        overflow: hidden;
        cursor: pointer;
        &:hover {
            &::before,
            &::after {
                background: #1ebcc5;
            }
        }
        &::before,
        &::after {
            content: '';
            position: absolute;
            height: 2px;
            width: 100%;
            top: 50%;
            left: 0;
            margin-top: -1px;
            background: #000;
            border-radius: 80% 0;
        }
        &::before {
            transform: rotate(45deg);
        }
        &::after {
            transform: rotate(-45deg);
        }
    }
}
</style>
