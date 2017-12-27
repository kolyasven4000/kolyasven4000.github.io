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
    <!-- <transition name="modal">
        <div class="course-modal"
             v-if="modalShowed">
            <div class="course-modal__body">
                <div class="close-btn close-btn--out"
                     @click="switchModal"></div>
                <div class="text-adder__btn default-btn"
                     :class="{'active': answer.right}"
                     @click="setAnswer(answer)"
                     v-for="answer, i in currentElem.answers"
                     :key="i">
                    <span>{{answer.text}}</span>
                </div>
            </div>
        </div>
    </transition> -->
    <modal
            animName="fade"
            v-if="modalShowed"
            @closeModal = "switchModal"
            :showModal = "modalShowed"
            width="580"
            height="200">
             <div class="close-btn close-btn--out"
                     @click="switchModal"></div>
            <p slot='modal-header' class="notes-modal__title">Вы действительно хотите удалить вопрос:</p>
            <p slot='modal-content' class="notes-modal__text" :class="{'active': answer.right && magic}"
                     @click="setAnswer(answer)"
                     v-for="answer, i in currentElem.answers"
                     :key="i">{{answer.text}}</p>

        </modal>
</div>

</template>

<script>
import modal from './default-modal.vue';
export default {
    components:{
            modal
        },
    data() {
        return {
            collection: [],
            modalShowed: false,
            currentElem: null,
            content: {
                text: 'Клиент позвонил в контактный центр и попросил скорректировать паспортные данные на актуальные. Заполните пропуски в тексте так, чтобы ответ получился гармоничным и соответствовал простому и&nbsp;эффективному стилю. Для этого нажимайте на пустую область и выбирайте варианты.',
                textSub: 'Вы можете изменить свое решение — для этого снова нажмите на плашку с текстом.',
                feedback: {
                    bad: 'Для разработки ростого и эффективного стиля письменных коммуникаций были выбраны другие ориентиры.',
                    good: 'На основании этих пожеланий клиентов и был разработан простой и эффективный стиль письменных коммуникаций.'
                },
                collection: [
                    [
                        {
                            textPrev: `<p>Уважаемый Иван Иванович, Ваше обращение рассмотрено.</p><br>
                <h3>Данные обращения:</h3>
                <p>Обращение № 170000-2017-607700 от 15.04.2017</p><br>
                <p>Клиент: Иванов Иван Иванович </p><br>
                <p>Исполнитель: Степанов Степан, </p>`,
                            textNext: ``,
                            answers: [
                                {
                                    text: 'специалист отдела по работе с обращениями физических лиц',
                                    right: false
                                },
                                {
                                    text: 'специалист ООФЛ по БК № 1 УОФЛ по БК',
                                    right: false
                                },
                                {
                                    text: 'специалист ПАО Сбербанк ',
                                    right: true
                                }
                            ]
                        }
                    ],
                    [
                        {
                            textPrev: `<h3>Причина обращения:</h3>
                <p>Вы обратились в</p>`,
                            textNext: `<p>с просьбой скорректировать Ваши персональные данные в базе банка.</p>`,
                            answers: [
                                {
                                    text: 'ЕРКЦ ПАО Сбербанк ',
                                    right: false
                                },
                                {
                                    text: 'Контактный Центр Сбербанка',
                                    right: false
                                },
                                {
                                    text: 'контактный центр банка',
                                    right: true
                                }
                            ]
                        }
                    ]
                    ,
                    [
                        {
                            textPrev: `<h3>Проверка банка:</h3>
                <p>В программном обеспечении банка</p>`,
                            textNext: `<p>некорректные персональные данные — серия и номер</p>`,
                            answers: [
                                {
                                    text: 'к сожалению, были найдены',
                                    right: false
                                },
                                {
                                    text: 'произведены необходимые мероприятия для обнаружения расхождений, в результате которых выявлены',
                                    right: false
                                },
                                {
                                    text: 'обнаружены',
                                    right: true
                                }
                            ]
                        },
                        {
                            textPrev: ``,
                            textNext: `.`,
                            answers: [
                                {
                                    text: 'документа, удостоверяющего личность',
                                    right: false
                                },
                                {
                                    text: 'ДУЛ',
                                    right: false
                                },
                                {
                                    text: 'паспорта',
                                    right: true
                                }
                            ]

                        }
                    ]
                ]
            }
        }
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
            this.$emit('endStep', this.isCorrected);
        },
        init() {
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
        font-family: 'ProximaNova';
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
        font-weight: 500;
        color: #444649;
        &::before {
            content: '';
            position: absolute;
            left: -36px;
            top: 0;
            width: calc(100% + 80px);
            height: 100%;
            //background: url(../img/exercise/text-adder/quest-bg.png) no-repeat left;
            background-size: contain;
        }
    }
    &__sub {
        margin-bottom: 32px;
        font-family: 'ProximaNova';
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
            line-height: 22px;
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
    .exercise__btns-wrap {
        margin-top: 20px;
    }
    .course-modal__body {
        width: 610px;
    }
}
</style>
