<template>
<div class="text-adder">
    <div class="text-adder__question"
         v-html="content.text"></div>
    <div class="text-adder__sub">{{content.textSub}}</div>
    <div class="text-adder__inner">
        <div class="text-adder__item-wrap"
             v-for="items,ind in collection">
            <div class="text-adder__item"
                 v-for="item,subInd in items">
                <div class="text-adder__text"
                     v-html="item.textPrev"
                     v-if="item.textPrev"></div>
                <div class="text-adder__interactive"
                     :class="{'active': item.selected}"
                     @click="setCurrentElem(ind, subInd)">{{item.selected}}
                    <div class="add-btn text-adder__add-btn"
                         v-if="!item.selected"></div>
                </div>
                <div class="text-adder__text"
                     v-html="item.textNext"
                     v-if="item.textNext"></div>
            </div>
        </div>
    </div>
    <div class="exercise__btns-wrap">
        <div class="default-btn test__btn"
             :class="{'default-btn--disabled' : !isAllSelected}"
             :disabled="!isAllSelected"
             @click="checkEx">Принять ответ</div>
    </div>
    <transition name="modal">
        <div class="text-adder__modal"
             v-if="modalShowed">
            <div class="text-adder__modal-body">
                <div class="close-btn close-btn--out"
                     @click="switchModal"></div>
                <div class="text-adder__btn default-btn"
                     @click="setAnswer(answer)"
                     v-for="answer, i in currentElem.answers"
                     :key="i">
                    <span>{{answer.text}}</span>
                </div>
            </div>
        </div>
    </transition>
    <transition name="modal">
        <div class="text-adder__modal "
             v-if="finalShowed">
            <div class="text-adder__modal-body"
                 :class="isCorrected ? 'good': 'bad'">
                <div class="text-adder__modal-title"
                     v-if="isCorrected">Вы правы</div>
                <div class="text-adder__modal-title"
                     v-else>Вы ошиблись</div>
                <div class="default-btn"
                     @click="$emit('goBack')"
                     v-if="isCorrected">Продолжить</div>
                <div class="default-btn"
                     @click="init"
                     v-else>Повторить</div>
            </div>
        </div>
    </transition>
</div>

</template>

<script>
export default {
    name: 'textAdder',
    data() {
        return {
            collection: [],
            modalShowed: false,
            finalShowed: false,
            currentElem: null,
            content: {
                text: 'В данном задании Вам нужно выбрать нужный цвет',
                textSub: 'Вы можете изменить свое решение — для этого снова нажмите на плашку с текстом.',
                feedback: {
                    bad: 'Вы неугадали с выбором цвета.',
                    good: 'Вы превосходно справились с выбором цвета.'
                },
                collection: [
                    [
                        {
                            textPrev: `
                <h3>Цвет 1:</h3>
                <p>Этот цвет символизирует опасность - </p>`,
                            textNext: ``,
                            answers: [
                                {
                                    text: 'Синий',
                                    right: false
                                },
                                {
                                    text: 'Зеленый',
                                    right: false
                                },
                                {
                                    text: 'Красный ',
                                    right: true
                                }
                            ]
                        }
                    ],
                    [
                        {
                            textPrev: `<h3>Цвет 2:</h3>
                <p>В системе CMYK в полиграфии</p>`,
                            textNext: `<p>получается при смешении жёлтого и сине-зелёного (циана).</p>`,
                            answers: [
                                {
                                    text: 'Синий',
                                    right: false
                                },
                                {
                                    text: 'Зеленый',
                                    right: true
                                },
                                {
                                    text: 'Красный ',
                                    right: false
                                }
                            ]
                        }
                    ]
                    ,
                    [
                        {
                            textPrev: `<h3>Цвет 3:</h3>
                <p>Спектральный</p>`,
                            textNext: `<p>ощущается человеком под действием электромагнитного излучения с длинами волн в диапазоне 440—485 нм</p>`,
                            answers: [
                                {
                                    text: 'Синий',
                                    right: true
                                },
                                {
                                    text: 'Зеленый',
                                    right: false
                                },
                                {
                                    text: 'Красный ',
                                    right: false
                                }
                            ]
                        }
                    ]
                ]
            }
        };
    },
    created() {
        this.init();
    },
    mounted() {},
    computed: {
        collapseCollection() {
            return this.collection.reduce((acc, item) => acc.concat(item), []);
        },
        isCorrected() {
            return this.collapseCollection.every(el => el.passed);
        },
        isAllSelected() {
            return this.collapseCollection.every(el => el.selected);
        }
    },
    methods: {
        checkEx() {
            this.finalShowed = true;
        },
        init() {
            this.finalShowed = false;
            this.collection = this.content.collection.map((el, ind) => el.map((subEl, subInd) => {
                const mergeObj = {
                    passed: false,
                    selected: ''
                };

                return Object.assign(mergeObj, subEl);
            })
            );
        },
        setCurrentElem(ind, subInd) {
            this.currentElem = this.collection[ind][subInd];
            this.switchModal();
        },
        switchModal() {
            this.$emit('switchCross');
            this.modalShowed = !this.modalShowed;
        },
        setAnswer(answer) {
            this.currentElem.passed = answer.right;
            this.currentElem.selected = answer.text;
            this.switchModal();

        }

    }
}

</script>

<style lang="scss">
.text-adder {
    h3,
    p {
        font-size: 16px;
        line-height: 22px;
        color: #444649;
        margin: 0;
    }
    h3 {
        font-weight: bold;
    }
    p {
        display: inline;
        font-weight: normal;
        vertical-align: middle;
    }
}
</style>

<style lang="scss" scoped="">
.text-adder {
    background: white;
    width: 100%;
    height: 100%;
    padding: 32px;
    &__inner {
        width: 825px;
        padding: 32px;
        border: 1px solid #D9DDDE;
    }
    &__item-wrap {
        margin-bottom: 25px;
    }
    &__item {
        display: inline;
    }
    &__text {
        display: inline;
    }
    &__question {
        display: block;
        position: relative;
        width: 875px;
        margin-bottom: 32px;
        font-size: 18px;
        line-height: 25px;
        font-weight: bold;
        color: #444649;
        &::before {
            content: '';
            position: absolute;
            left: -36px;
            top: 0;
            width: calc(100% + 80px);
            height: 100%; //background: url(../img/exercise/text-adder/quest-bg.png) no-repeat left;
            background-size: contain;
        }
    }
    &__sub {
        margin-bottom: 32px;
        font-size: 16px;
        line-height: 22px;
        font-weight: normal;
        color: #444649;
    }
    &__interactive {
        display: inline-block;
        position: relative;
        margin: 0 3px;
        padding: 0 5px;
        min-width: 60px;
        height: 20px;
        border: 1px solid #33B370;
        border-radius: 6px;
        vertical-align: middle;
        cursor: pointer;
        &.active {
            display: inline;
            line-height: 23px;
            min-width: auto;
        }
    }
    &__add-btn {
        position: absolute;
        right: -4px;
        top: -1px;
        width: 20px;
        height: 20px;
        &::before {
            width: 10px;
            height: 10px;
        }
    }
    &__btn {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 350px;
        margin: 0 auto;
        font-weight: bold;
        height: auto;
        min-height: 98px;
        line-height: 22px;
        &.active {
            box-shadow: 0px 0px 36px 6px rgba(2, 138, 143, 1);
        }
        &+& {
            margin-top: 32px;
        }
    }
    &__modal {
        position: fixed;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
        width: 100%;
        height: 100%;
        background-color: rgba(193, 199, 203, 0.7);
        z-index: 11;
        transition: opacity .3s ease;
    }
    &__modal-title {
        margin-bottom: 20px;
        font-size: 18px;
        font-weight: bold;
        .text-adder__modal-body.good & {
            color: #27a221;
        }
        .text-adder__modal-body.bad & {
            color: #f55656;
        }
    }
    &__modal-body {
        position: absolute;
        top: 59px;
        left: 50%;
        transform: translateX(-50%);
        height: auto;
        width: auto;
        padding: 32px;
        background-color: white;
        transition: transform .3s;
    }
    .exercise__btns-wrap {
        margin-top: 20px;
    }
}

.modal-enter {
    opacity: 0;
}

.modal-leave-active {
    opacity: 0;
}

.modal-enter .text-adder__modal-body {
    transform: scale(1.1) translateX(-50%);
}
</style>
