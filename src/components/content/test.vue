<template id="case-template" type="text/template7">
  <div class="case-container">
    <p class="slide__title">Итоговое тестирование</p>
    <div class="case-intro" v-if="!testStarted">
      <div class="case-intro__text">
      Это — контрольная проверка знаний.<br>
      <br>
      Вас ждут вопросы, на которые Вам предстоит ответить правильно.</div>
      <div class="case-intro__alert">Задание считается пройденным успешно, если Вы справились с ним<br>не менее чем на 80 %. У Вас неограниченное количество попыток.</div>
      <div class="default-btn" @click="toggleTest">Приступить</div>
    </div>
    <div class="case-content" v-if="testStarted">
      <!-- <div class="close-btn" @click="toggleTest"></div> -->
      <div class="test-counter">{{step+1}}&nbsp;/&nbsp;{{collection.length}}</div>
      <p class="case-quest">{{currentElem.elem.text}}</p>
      <compontent @check="innerComponentCheck"
                  @next="nextStep"
                  ref="components"
                  :content="currentElem.elem"
                  :magic="magic"
                  :key="step"
                  :is="currentElem.elem.type"></compontent>
    </div>
  
   <div class="ex-modal feedback"
         v-if="completed">
      <div class="ex-modal-overlay">
        <div class="ex-modal-window">
          <div class="ex-modal-title"
               :class="{
                                  'good': passed,
                                  'bad': !passed
                              }">
            <span v-if="passed">Поздравляем!</span>
            <span v-if="!passed">
                                          К сожалению, Вы не справились!</span>
          </div>
          <div class="ex-modal-recommend">
            <span v-if="passed">Вы успешно прошли упражнение!</span>
            <span v-if="!passed">
                                            Вами были допущены ошибки при прохождении упражнения. Изучите повторно темы, затрагиваемые в упражнении, и проверьте свои знания еще раз.
                                          </span>
          </div>
          <div class="ex-modal-result">
            Ваш результат <span>{{progress}}</span>% из 100%
          </div>
          <div class="ex-modal-progress-bar">
            <div class="ex-modal-progress-current"
                 :class="{
                                            'good': passed,
                                            'bad': !passed
                                          }"
                 :style="{
                                            width: progress + '%'
                                          }"></div>
          </div>
          <template v-if="!passed">
            <button class=" default-btn btn-restart"
                    @click="restart">Пройти заново</button>
            <button class=" default-btn btn-return"
                    @click="goBack">Вернуться</button>
          </template>
          <button v-if="passed"
                  class=" default-btn btn-continue"
                  @click="goBack">Продолжить</button>
        </div>
      </div>
    </div>
  
  </div>
</template>


<script>	
import ex_test from "./exTest.vue"
export default {
  name: "test",
  created: function () {
    this.start();
  },
  mounted: function () {

  },
  components: {
    'ex-test': ex_test,
  },
  data: function () {
    return {
      step: 0,
      feedback: null,
      collection: [],
      final: false,
      correctCount: 0,
      answered: false,
      testStarted: false,
      content: [{
            text: "Что из перечисленного относится к основным правилам письменной коммуникации?",
            type: 'ex-test',
            style: 'radio',
            answers: [
                { right: true, text: "Официально-деловой стиль" },
                { right: false, text: "Профессиональные термины" },
                { right: false, text: "Эмоциональная составляющая" },
                { right: false, text: "Свободная структура" },
            ]
        }, {
            text: "В каком случае, отвечая на обращение клиента, нужно извиниться?",
            type: 'ex-test',
            style: 'radio',
            answers: [
                { right: true, text: "Проблема возникла по вине банка или сотрудника" },
                { right: false, text: "Клиент высказывает свое недовольство" },
                { right: false, text: "Ответ на обращение поступает с задержкой" },
                { right: false, text: "Клиент обращается повторно по одному и тому же вопросу" },
            ]
        }]
    }
  },
  props: {
    context: {
      type: Object,
      default() {
        return {
          items: []
        }
      }
    },
    elemId: {
      type: String,
            default() {
                return "";
            }
    },
    magic: {
      type: Boolean,
      default() {
        return false;
      }
    }
  },
  computed: {
    passedPerc() {
      return this.context.pass_perc || 80;
    },
    completed() {
      return this.collection.every(e => e.passed != null);
    },
    passed() {
      return this.progress >= this.passedPerc;
    },
    progress: function () {
      var passedSteps = this.collection.filter(function (el) {
        return el.passed;
      })
      if (this.collection.length) {
        return Math.round(100 * passedSteps.length / this.collection.length);
      } else {
        return 0;
      }
    },
    currentElem: function () {
      if (this.collection && Array.isArray(this.collection) && this.collection.length && this.collection[this.step] && this.collection[this.step].elem) {
        return this.collection[this.step];
      } else {
        return null;
      }
    },
  },
  methods: {
    goBack() {
        this.$emit('goBack')
    },
    toggleTest() {
      this.testStarted = !this.testStarted;
    },
    nextStep() {
      this.answered = false;
      if (this.step + 1 < this.collection.length) {
        this.setStep(this.step + 1);
      }
    },
    setStep(step) {
      if (step >= 0 && step < this.collection.length) {
        this.step = step;
      }
    },
    innerComponentCheck(status) {
      if (status) {
        this.currentElem.passed = true;
      } else {
        this.currentElem.passed = false;
      }
      this.answered = true;
      if (this.step == this.collection.length - 1) {
        this.checkProgress();
      }
    },
    checkProgress(){

    },
    start() {
      this.step = 0;
      this.answered = false;
      this.collection = this.content.map((e) => {
        return {
          elem: e,
          passed: null
        }
      })
    },
    restart() {
      this.start();
    },
  }
}
</script>

<style lang="scss" scoped>
.ex-modal {
    &.feedback {
      min-height: 100px;
      z-index: 999;
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      height: 100%;
    }
    &-overlay {
      background: rgba(193, 199, 203, 0.7);
      width: 100%;
      height: 100%;
      position: relative;
    }
    &-window {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      width: 689px;
      background: #fff;
      padding: 50px;
      box-shadow: 0 17px 21px 0 rgba(114,117,123,0.37);
    }
    &-title {
      font: 25px;
      margin-bottom: 25px;
      &.bad {
        color: #D34B3A;
      }
      &.good {
        color: #27a221;
      }
    }
    &-recommend {
      font: 18px;
      font-weight: normal;
      margin-bottom: 25px;
      color: #444649;
    }
    &-icon {
      position: absolute;
      top: 50px;
      right: 50px;
      width: 174px;
      height: 174px;

      &.bad {
        background: url('/static/img/test/icon_bad.png') center no-repeat;
        background-size: cover;
      }

      &.good {
        background: url('/static/img/test/icon_good.png') center no-repeat;
        background-size: cover;
      }
    }
  }

.case-container{
  height: 100%;
  width: 100%;
  background: #fff;
  padding: 20px;
}

.case-intro {
  font-size: 18px;
  color: #444649;
  
  &__text {
    
    strong {
      font-weight: bold;
    }
  }

  &__alert {
    margin-top: 40px;
    font-weight: 100;
    font-style: italic;
    //color: #33B370;
    margin-bottom: 65px;
  }

  &__btn_start {
    width: 209px;
    height: 47px;
    border-radius: 10px;
    background-color: #33B370;
    color: white;
    font-size: 18px;
    font-weight: 500;
    text-align: center;
    line-height: 47px;
    cursor: pointer;

    &:hover {
      background-color: #F6AC32;
    }
  }
}


  .case-content{
  padding: 20px 80px 20px 40px;
  max-width: 1000px;
  font-size: 17px;
  line-height: 21px;
  .close-btn {
    top: 32px;
    right: 32px;
  }
} 

.case-quest{
  display: inline-block;
	margin-bottom: 15px;
  font: 18px;
  font-weight: bold;
  color: #444649;
  background: url('/static/img/test/splash.png') left no-repeat;
  background-size: 100% 100%;
  max-width: 696px;

  strong {
    font-size: 24px;
    display: block;
    margin-bottom: 16px;
  }

  .sum-test {
    color: #79848f;
  }
  .number {
    font-weight: 300;
  }
}

.ex-button{
	background-color: #40a800;
	padding: 10px 40px;
	color: #fff;
    text-align: center;
    font-size: 17px;
    outline: none;
    border-width: 0;
    position: absolute;
    left: 40px;
    bottom: 40px;
}
.ex-button:active{
 	border-color: #ff8f15;
}
.ex-button[disabled]{
    background-color: #d0d0d0;
}
.ex-question-answers{
	margin-bottom: 15px;
}
.ex-question-answer{
	//border: 2px solid #b7c2cf;
	text-align: left;
	padding: 6px 20px;
	margin-left: 50px;
	margin-bottom: 10px;
	line-height: 1.4;
	position: relative;
}
.ex-question-answer::before{
	display: block;
    content: '';
    width: 32px;
    height: 32px;
    //border: 2px solid #40a800;
    position: absolute;
    left: -50px;
    top: calc(50%);
    transform: translateY(-50%);
    background-image: url('/static/img/test/oim-normal.png');

}
.ex-question-answer:active::before{
 	border-color: #ff8f15;
}
.ex-question-answer--selected:active::before{
	background-image: url('/static/img/test/oim-normal.png');
  background-repeat: no-repeat;
    background-position: center;
}
.ex-question-answer--selected::before{
    background-image: url('/static/img/test/oim-selected.png');
    background-repeat: no-repeat;
    background-position: center;
}
.ex-question-answer--correct{
	background-color: rgba(64,168,0, .5);
}

 .questphoto-container .ex-question-answers{
 	width: 55%;
 	float: left;
 }

 .questphoto-container .ex-question-answer{
 	background-color: #aaf07f;
 	margin-left: 0;
 	border: none;
 }
 .questphoto-container .ex-question-answer:active,
 .questphoto-container .ex-question-answer--selected,
 .questphoto-container .ex-question-answer--correct.ex-question-answer--selected{
 	background-color: #ffac53;
 }

 .questphoto-container .ex-question-answer::before{
 	display: none;
 }
 .questphoto-container .ex-question-answer--correct{
	border: 2px solid green;
	background-color: #49b76b;
	color: #fff;
}

 .ex-question-pic{
 	width: 300px;
 	height: 357px;
 	background-color: #aaf07f;
 	float: right;
  	box-shadow: 0px 20px 30px 0px rgba(71, 63, 51, 0.44);
 }


 .br-clear{
 	clear: both;
 	height: 0;
 }


 .exercice__shoelace {
  width: 100%;
}

.exercice__lists {
  width: 660px;
}

.exercice__lists--query {
  font-size: 22px;
  font-weight: 300;
  color: black;
  margin-bottom: 25px;
}

.exercice__shoelace .exercice__lists--query {
  margin-bottom: 15px;
}

.test--card--lists {
  padding: 25px 40px;
}

.exercice__rows {
  position: relative;
  height: 450px;
}

.exercice__shoelace--hint,
.exercice__lists--hint {
  position: absolute;
  left: 449px;
  top: 97px;
  padding: 20px;
  border-radius: 15px;
  background-color: #565c63;
  box-shadow: 0px 10px 20px 0px rgba(51, 64, 71, 0.36);
  width: 304px;
  z-index: 15;
  font-size: 16px;
  color: #ffc19c;
  font-weight: 300;
  font-style: italic;
}
.exercice__shoelace--hint:after,
.exercice__lists--hint:after {
  content: "";
  width: 30px;
  height: 30px;
  transform: rotate(45deg) translate(-50%, -50%);
  position: absolute;
  right: 45%;
  top: 8px;
  background-color: #565c63;
  z-index: 14;
}

.exercice__row {
  border-bottom: 1px solid rgba(0, 0, 0, 0.2);
  position: relative;
  background-color: #fff;
}

.exercice__cell {
  width: 49%;
  padding: 15px 20px;
  display: inline-block;
  position: relative;
  height: auto;
  background-color: #fff;
}

.exercice__variants {
  width: 51%;
  right: 0;
  top: 100%;
  position: absolute;
  z-index: 0;
  border-top: 2px solid #85d454;
  box-shadow: none;
  height: 2px;
  margin-top: -2px;
  overflow: hidden;
  transition: .3s;
}
.exercice__variants.exercice__variants--open {
  border-top: 2px solid #ff8f16;
  height: auto;
  box-shadow: 0px 10px 20px 0px rgba(101, 60, 11, 0.31);
  z-index: 10;
}

.exercice__variant {
  width: 100%;
  background-color: #fff;
  padding: 15px 20px;
  text-align: center;
  border-bottom: 1px solid rgba(255, 143, 22, 0.8);
  cursor: pointer;
}
.exercice__variant:active, .exercice__variant:hover {
  background-color: #ffac53;
}

.exercice__variant--selected {
  text-align: center;
}



.exercice__variants--icon {
  position: absolute;
  right: 0px;
  top: 20px;
  width: 18px;
  height: 14px;
  background-color: #fff;
}

.exercice__variants--icon span {
  width: 18px;
  height: 2px;
  background-color: #85d454;
  display: block;
  margin-bottom: 2px;
  margin-top: 2px;
}

.exercice__variants--icon.open span {
  background-color: #ff8f16;
}
-feedback-correct,
.ex-feedback-incorrect{
	position: absolute;
    left: 250px;
    bottom: 50px;
    font-size: 20px;
}
.ex-feedback-correct{
	color: #40a800;
}
.ex-feedback-incorrect{
	color: #ff644b;
}
.test-counter {
  position: absolute;
  top:104px;
  right: 0;
  width: 100px;
  height: 32px;
  border: 1px solid #33B370;
  border-radius: 4px;
  text-align: center;
  line-height: 32px;
  font-size: 18px;
  font-weight: bold;
  color: #33B370;
}
.ex-modal-result {
  margin-bottom: 10px;
}
</style>