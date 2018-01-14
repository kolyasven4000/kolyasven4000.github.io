<template>
  <div class="checkbox__template">
    <div class="question-container">
      <div class="ex-question-answers">
        <div class="choose"
             v-if="style == 'radio'">Выберите один из нескольких вариантов ответа:</div>
        <div class="choose"
             v-if="style != 'radio'">Выберите несколько вариантов ответа:</div>
        <template v-if="img">
          <div
              @click="showHideImg" 
              class="question-img"
               :style="{
                                        'background-image': 'url('+img+')'
                                    }"></div>
          <div v-if="fullImg" 
                @click="showHideImg"
                class="question-img-full"
               >
            <div class="full_container"
                :style="{
                  'background-image': 'url('+img+')'
            }"></div>
          </div>
        </template>
        <div :key="ind"
             v-for="answer,ind in answers"
             :class="['ex-question-answer', {
                                            'ex-question-answer--checkbox': style !== 'radio',
                                            'ex-question-answer--selected': selected.indexOf(ind) > -1, 
                                            'ex-question-answer--correct': magic && (answer.right == 'true' || answer.right == true)
                                          }]"
             @click="select(ind)" v-html="answer.text">
        </div>
      </div>
      <button class="default-btn"
              v-if="!answered"
              :disabled="!isSelected"
              @click.prevent="check">Ответить</button>
      <button class="default-btn"
              v-if="answered"
              @click.prevent="nextStep">Продолжить</button>
      <div class="ex-feedback-correct"
           v-if="isCorrected && answered">Верно</div>
      <div class="ex-feedback-incorrect"
           v-if="!isCorrected && answered">Неверно</div>
    </div>
  </div>
</template>

<script>
var _ = require('lodash');
export default {
  props: ['content', 'magic'],
  data: function () {
    return {
      answered: false,
      selected: [],
      fullImg: false
    }
  },
  created() {
  },
  computed: {
    answers: function () {
      return _.shuffle(this.content.answers);
    },
    img() {
      if (this.content.img) {
        return this.content.img;
      } else {
        return false;
      }
    },
    style() {
      return this.content.style || 'radio'
    },
    selectedAnswers: function () {
      var that = this;
      return this.answers.filter(function (el, i) {
        return that.selected.indexOf(i) > -1;
      })
    },
    isSelected: function () {
      return this.selectedAnswers.length > 0;
    },
    correctSelected: function () {
      return this.selectedAnswers.filter(function (el) {
        return (el.right == true || el.right == 'true');
      })
    },
    correctAnswers: function () {
      return this.answers.filter(function (el) {
        return (el.right == true || el.right == 'true');
      })
    },
    isCorrected: function () {
      return this.correctAnswers.length == this.correctSelected.length && this.correctAnswers.length == this.selectedAnswers.length;
    },

  },
  methods: {
    showHideImg(){
      this.fullImg = !this.fullImg;
    },
    check: function () {
      this.answered = true;
      this.$emit('check', this.isCorrected);
    },
    nextStep: function () {
      this.$emit('next', this.passed);
    },
    select: function (id) {
      if (!this.answered) {
        if (this.style == 'radio') {
          if (this.selected.indexOf(id) > -1) {
          } else {
            this.selected.length = 0;
            this.selected.push(id);
          }
        } else {
          if (this.selected.indexOf(id) > -1) {
            this.selected.splice(this.selected.indexOf(id), 1);
          } else {
            this.selected.push(id);
          }
        }
      }
    }
  }
}
</script>

<style lang="scss" scoped>
	.course__template {
		top: 70px;
		position: relative;
	}
  .question-img{
    height: 150px;
    width: 100%;
    background-position: left;
    background-repeat: no-repeat;
    background-size: contain;
    margin-bottom: 20px;
    cursor: pointer;
  }
  .question-img-full{
    position: absolute;
    top: 0;
    left: 0;
    height: 100%;
    width: 100%;
    background-color: rgba(81, 100, 107, 0.7);
    z-index: 999;
    cursor: pointer;

    .full_container {
      position: absolute;
      left: 50%;
      top:50%;
      transform: translate(-50%, -50%);
      width: 100%;
      height: 100%;
      background-position: center;
      background-repeat: no-repeat;
    }
  }

.choose {
  font: 18px;
  margin-bottom: 26px;
  color: #444649;
}
	
.p-exercise{
	padding-top: 80px;
	background-color: #fff;
	font-size: 17px;
}
.case-container{
  max-width: 1024px;
}
.case-content{
	padding: 20px 80px 20px 40px;
} 



.ex-question-answers{
	margin-bottom: 40px;
}
.ex-question-answer{
	text-align: left;
	padding: 0;
	margin: 20px 130px 20px 50px;
	line-height: 1.4;
	position: relative;
  font: 16px;
  color: #444649;
  cursor: pointer;

}
.ex-question-answer::before{
	display: block;
    content: '';
    width: 32px;
    height: 32px;
    position: absolute;
    left: -50px;
    top: calc(50%);
    transform: translateY(-50%);
    background-image: url('/static/img/test/oim-normal.png');
    background-repeat: no-repeat;
    background-position: center;
}

.ex-question-answer:hover::before {
  background-image: url('/static/img/test/oim-over.png');
}

.ex-question-answer--selected::before,
.ex-question-answer--selected:hover::before {
  background-image: url('/static/img/test/oim-selected.png');
}

.ex-question-answer--checkbox:before{
    background-image: url('/static/img/test/mim-normal.png');
}

.ex-question-answer--checkbox:hover::before {
  background-image: url('/static/img/test/mim-over.png');
}

.ex-question-answer--checkbox.ex-question-answer--selected {
    &:before,
    &:hover:before{
      background-image: url('/static/img/test/mim-selected.png');
    }
}
.ex-question-answer--correct{
	color: orange;
}

.ex-feedback-correct,
.ex-feedback-incorrect{
    font-size: 18px;
    display: inline-block;
    vertical-align: middle;
    margin-left: 30px;
}
.ex-feedback-correct{
	color: #63C994;
}
.ex-feedback-incorrect{
  color: #E09990;
}
.default-btn {
  position: initial;
  transform: none;
}
</style>