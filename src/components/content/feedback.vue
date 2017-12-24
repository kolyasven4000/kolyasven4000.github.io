<template>
	<section class="feedback">
		<p class="feedback__description">Поделитесь с нами своими впечатлениями и комментариями.</p>
		<div class="feedback__form">
				<div class="feedback__form-theme">
					<span>Тема:</span>
					<textarea name="theme" rows="1" placeholder="Введите тему" maxlength="50" v-model="theme"></textarea>
				</div>
				<div class="feedback__form-content">
					<textarea placeholder="Введите текст" v-model="message"></textarea>
				</div>
		</div>
		<div class="feedback__buttons">
			<button class="feedback__button feedback__button-cancel" @click="cancel">Отменить</button>
			<button class="feedback__button feedback__button-submit" @click="submit">Отправить</button>
		</div>
		<modal
			@closeModal = "modal = false"
			animName="fade"
			:showModal = "modal">
			<div slot='modal-content'>
				 <p class="feedback-modal__text">Спасибо!</p>
            	<p class="feedback-modal__text">Ваш отзыв поможет сделать курс лучше.</p>
			</div>
		</modal>
	</section>
</template>
<script>
	import modal from './default-modal.vue';
	export default {
		name: 'feedback',
		data(){
			return{
				theme: '',
				message: '',
				modal: false
			}
		},
		methods: {
        	cancel(){
        		this.theme = '';
				this.message = '';
        	},
        	submit(){
				this.theme = this.theme.replace(/^\s+|\s+$/g, '');
				this.message = this.message.replace(/^\s+|\s+$/g, '');
        		if(this.theme && this.message){
        			this.modal = true;
	        		this.cancel();
        		}
        	}
        },
        components:{
    		modal
    	},
	}
</script>
<style lang="scss">
	.feedback{
		background-color: #fff;
		box-shadow: 0 0 10px 0;
		overflow: hidden;
	    padding: 20px;
	    box-sizing: border-box;
	    max-width: 800px;
   		min-width: 530px;
   		margin: 0 auto;
		&__button{
			font-size: 15px;
			cursor: pointer;
			padding: 10px 20px;
			color: #000;
			&-submit{
				margin-left: 30px;
			}
		}
		&__form{
			width: 100%;
	    	border: 1px solid #000;
	    	margin: 25px 0;
	    	padding: 15px 20px;
	    	box-sizing: border-box;
	    	&-theme{
	    		width: 100%;
	    		border-bottom: 1px solid #000;
	    		padding-bottom: 10px;
	    		span{
	    			font-size: 18px;
				    color: #000;
				    display: inline-block;
				    vertical-align: top;
				    line-height: 1.25;
	    		}
	    		textarea{
	    			display: inline-block;
					vertical-align: top;
					line-height: 1.2;
					white-space: nowrap;
					padding: 0;
					resize: none;
					width: calc(100% - 60px);
					color: #000;
					font-size: 18px;
					border-style: none;
					outline: none;
					padding-left: 5px;
	    		}
	    	}
	    	&-content{
	    		textarea{
	    			border-style: none;
					resize: none;
					width: 100%;
					height: 210px;
					margin: 15px 0;
					display: inline-block;
					vertical-align: top;
					line-height: 1.2;
					color: #000;
					outline: none;
					font-size: 18px;
					box-sizing: border-box;
	    		}
	    	}
		}
	}
</style>