<template>
	<section class="notes">
		<div class="notes__form">
			<form action="#" method="GET" class="ajax-submit">
					<input class="note-input" type="text" placeholder="Введите вопрос" v-model="message" @keyup.enter="submitNote">
				<div class="note-submit" @click="submitNote">Добавить</div>
				<div class="note-clear" @click="clearNote">Очистить</div>
			</form>
		</div>
		<div class="notes__list">
			<div class="notes__item" v-for='(note,index) in sortNotes' :data-id="index">
				<div class="note__wrapper" :data-id="index">
					<button class="note__btn-edit note__btn--ed" @click="editNote(note)">Исправить</button>
					<button class="note__btn-del note__btn--ed" @click="delNote(note)">Удалить</button>
					<div class="note__screen">
						<img :src="note.image" >
					</div>
					<div class="note__data">
						<span class="note__date">{{note.date}}</span>
						<h1 class="note__title">{{note.title}}</h1>
						<div v-if="!note.edit" class="note__quest" ref="'note__'+index"
						:class="{
							'note__quest--few-text' : !note.more
						}">{{note.quest}}</div>	
						<textarea v-if="note.edit" class="note__quest-edit" v-model="note.quest">{{note.quest}}</textarea>
						<button v-show="!note.more && !note.edit && note.quest.length > 195" class="note__btn-more note__btn--ms" @click="moreQuest(note)">подробнее</button>
						<button v-show="note.more && !note.edit" class="note__btn-more note__btn--ms" @click="moreQuest(note)">скрыть</button>
						<button v-show="note.edit" class="note__btn-save note__btn--ms" @click="saveQuest(note)">Готово</button>
					</div>
				</div>
			</div>
		</div>
		<modal
			animName="fade"
			@closeModal = "modal = false"
			:showModal = "modal"
			width="580"
			height="200">
			<p slot='modal-header' class="notes-modal__title">Вы действительно хотите удалить вопрос:</p>
            <p slot='modal-content' class="notes-modal__text">{{currentNote}}</p>
            <div slot="modal-footer" class="notes-modal_buttons">
            	<button class="notes-modal__button notes-modal__cancel" @click="cancelDelete">Отмена</button>
				<button class="notes-modal__button notes-modal__delete" @click="deleteSubmit">Удалить</button>
            </div>
		</modal>
	</section>
</template>
<script>
	import modal from './default-modal.vue';
	export default {
    	name: "notes",
    	data(){
    		return{
    			message: '',
    			more_text: null,
    			modal: false,
    			for_delete: null,
    			edit_text: null,
    			save_text: null,
    		}
    	},
    	components:{
    		modal
    	},
    	methods:{
    		clearNote(){
    			this.message = '';
    		},
    		moreQuest(note){
    			console.log(note);
    			this.more_text = note;
    			if(this.more_text && this.more_text.$note && this.notes.indexOf(this.more_text.$note) > -1){
    				this.notes[this.notes.indexOf(this.more_text.$note)].more = !this.notes[this.notes.indexOf(this.more_text.$note)].more;
    			}
    		},
    		getDateString(date){
    			var today = date,
	    			dd = today.getDate(),
	    			mm = today.getMonth() + 1,
	    			yyyy = today.getFullYear();
	    		if (dd < 10) {
	        		dd = '0' + dd
				}
			    if (mm < 10) {
			        mm = '0' + mm
			    }
			    today = dd + '.' + mm + '.' + yyyy;
			    return today;
    		},
    		submitNote(){
    			this.message = this.message.replace(/\s+/g, ' ');
    			if (this.message != "" && this.message != " " && this.message != null && this.message != undefined) {
    				this.$emit('addNote',{
    					date: new Date(),
	    				title: '',
	    				image: '',
	    				quest: this.message,
	    				edit: false,
    					more: false

    				})
	    			this.message = '';
	    		}
    		},
    		saveQuest(note){
    			this.save_text = note;
    			this.$emit('saveNote', this.save_text);
    			this.save_text = null;
    			this.edit_text = null;
    		},
    		editNote(note){
    			this.edit_text = note;
    			this.$emit('editNote', this.edit_text);
    			if(!this.edit_text.$note.edit){
					this.edit_text = null;
    			}
    		},
    		cancelDelete(){
    			this.modal = false;
    			this.for_delete = null;
    		},
    		delNote(note){
    			this.modal = true;
    			this.for_delete = note;
    		},
    		deleteSubmit(){
    			this.$emit('deleteNote', this.for_delete);
    			this.for_delete = null;
    			this.edit_text = null;
    			this.modal = false;
    		},
    		dateSort(a, b){
    			if (a.date < b.date) {
			        return 1;
			    }
			    if (a.date > b.date) {
			        return -1;
			    }
			    return 0;
    		}
    	},
    	props:{
    		notes:{
    			type: [Array],
    			default: function(){
    				return []
    			}
    		}
    	},
    	computed:{

    		currentNote(){
    			if(this.modal){
    				return '«'+ this.for_delete.quest+ '…»?'
    			}
    		},
    		sortNotes(){
    			return this.notes.sort(this.dateSort).map(e => {return {
    				date: this.getDateString(e.date),
    				title: e.title,
    				quest: e.quest,
    				image: e.image,
    				edit: e.edit,
    				more: e.more,
    				$note: e
    			}})
    		}
    	}
    }
</script>
<style lang="scss">
	.notes {
		background-color: #fff;
		box-shadow: 0 0 10px 0;
		overflow: hidden;
	    padding: 20px;
	    box-sizing: border-box;
	    width: 500px;
   		margin: 0 auto;
		&__form {
    		position: relative;
    		.note-input {
				width: 100%;
			    padding: 10px;
			    box-sizing: border-box;
			    font-size: 14px;
			    resize: none;
			    outline: none;
			    display: block;
			    margin-bottom: 10px; 
    		}
    		.note-submit {
				display: inline-block;
			    cursor: pointer;
			    line-height: 30px;
			    text-align: center;
    		}
    		.note-clear {
				display: inline-block;
				margin-left: 10px;
			    cursor: pointer;
			    line-height: 30px;
			    text-align: center;
    		}
		}
		&__item{
			margin-top: 30px;
			position: relative;
			.note{
				&__wrapper{
					font-size: 0;
					padding: 30px 0;
					&:before{
						content:"";
						width: 100%;
						height: 1px;
    					background-color: #bbc1c6;
						position: absolute;
						top: 0;
						left: 0;

					}
				}
				&__btn-edit{
				   right: 75px;
				}
				&__btn-del{
				    right: 0;
				}
				&__screen{
					display: inline-block;
					vertical-align: top;
					max-width: 130px;
					height: 150px;
					box-sizing: border-box;
					overflow: hidden;
					& > img{
						width: 100%;
					}
				}
				&__data{
					font-size: 17px;
					display: inline-block;
				    margin-left: 25px;
				    color: #4b5259;
				    max-width: 680px;
				    vertical-align: top;
				    width: calc(100% - 255px);
				}
				&__date{
					font-size: 17px;
				}
				&__title{
					margin-top: 13px;
				    font-size: 17px;
				    line-height: 21px;
				    color: #4b5259;
				}
				&__quest{
					font-size: 17px;
				    margin-top: 13px;
				    color: black;
				    height: auto;
				    overflow: hidden;
				    word-wrap: break-word;
				    text-overflow: ellipsis;
				    width: 100%;
				    line-height: 21px;
				    &-edit{
					    font-size: 17px;
					    color: #000;
					    width: 100%;
					    resize: none;
					    padding: 9px 15px;
					    outline: none;
					    box-sizing: border-box;
					    &:focus{
					    	border: 1px solid #80be35;
					    }
				    }
				    &--few-text{
				    	max-height: 65px;
				    }
				}
				&__btn{
					&--ed{
						width: auto;
	    				height: 22px;
					    cursor: pointer;
					    position: absolute;
					    top: 30px;
					    outline: none;
					}
					&--ms{
						font-size: 15px;
					    cursor: pointer;
					    padding: 10px 20px;
					    color: #000;
					    margin-top: 20px;
					}
				}
			}
		}
	}
</style>