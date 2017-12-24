<template>
	<section class="glossary">
		<div 
			v-if="search"
			class="glossary__search">
			<input type="search"
			       placeholder="Введите слово которое вы хотите найти"
			       maxlength="50"
			       v-model="message">
		</div>
		<div 
			v-if="alphabet"
			class="glossary__alphabet">
			<ul class="alphabet__list">
				<li v-for="item in letters" 
					:key="item.id" class="alphabet__item full" 
					:class="{'active': activeLetter == item}">
					<a  :data-target="'scroll-to-'+item" 
						:data-letter="item" 
						@click.prevent="scrollTo">{{item}}</a>
				</li>
			</ul>
		</div>
		<div class="glossary__content">
		
				<div class="glossary__list">
					<div 
						v-for="(item,index) in words" 
						class="glossary__item" 
						:key="item.id"
						:id="'scroll-to-'+item.name">
						<div 
							v-if="alphabet"
						    class="item__letter">{{item.name}}
						</div>
						<div class="item__content">
							<div class="content__inner">
								<div v-if="etp" 
									v-for="(content,ind) in item.content"
								     :key="content.id"
								     class="inner-content"
								     :class="{
								     	'active' : current == index +'' +ind
								     }">
									<div class="inner-content__title"
										:data-id="index +'' +ind"
									     v-html="content.title" @click="setActive"></div>
									<div v-show="current == index +'' +ind" class="inner-content__text"
									     v-html="content.text"></div>
								</div>
								<div v-if="!etp" 
									v-for="content in item.content"
								     :key="content.id"
								     class="inner-content">
									<div class="inner-content__title"
									     v-html="content.title"></div>
									<div class="inner-content__text"
									     v-html="content.text"></div>
								</div>
							</div>
						</div>
					</div>
				</div>
		</div>
	</section>
</template>
<script>
	export default {
        name: "glossary",
        data(){
        	return {
        		message : "",
        		activeLetter: '',
        		current: null,
        		show: false
            }
        },
        mounted(){
        	this.$nextTick(function(){
				this.show = true;
			})
			this.setActiveElem(this.current);
        },
        props: {
        	collection: {
        		type: [Array],
        		required: true,
                validator: function(value) {
                    return (value !== null)
                },
			    default: function () {
			       return []
			    }
        	},
        	search: {
        		type: [Boolean],
                validator: function(value) {
                    return (value !== null)
                },
			    default: function () {
			       return false
			    }
        	},
        	alphabet: {
        		type: [Boolean],
                validator: function(value) {
                    return (value !== null)
                },
			    default: function () {
			       return false
			    }
        	},
        	etp: {
        		type: [Boolean],
                validator: function(value) {
                    return (value !== null)
                },
			    default: function () {
			       return false
			    }
        	}
        },
        computed:{
        	glossaryCollection(){
				return this.collection
			},
			findWord() {
				var word = this.message,
					collection = this.glossaryCollection;

				return collection.filter(item => (item.title.toUpperCase().indexOf(word.toUpperCase()) > -1) || (item.text.toUpperCase().indexOf(word.toUpperCase()) > -1));

			},
			sortContent() {
				var words = this.findWord.sort(function (a, b) {
					if (a.title.replace("«", '') < b.title.replace("«", '')) return -1;
					if (a.title.replace("«", '') > b.title.replace("«", '')) return 1;
					return 0;
				})
				return [...this.findWord.filter(e => !/^\d/.test(e.title)), ...this.findWord.filter(e => /^\d/.test(e.title))]
			},
			letters() {
				return this.sortContent.map((e) => {
					if (e.title.charAt(0) == "«") {
						return e.title.charAt(1).toUpperCase()
					} else {
						return e.title.charAt(0).toUpperCase()
					}
				}).filter((v, i, a) => a.indexOf(v) === i);
			},
			words() {
				var that = this;
				return this.letters.map(function (l) {
					return {
						name: l,
						content: that.sortContent.filter((e) => {
							if (e.title.charAt(0) == "«") {
								return e.title.charAt(1).toUpperCase() == l;
							} else {
								return e.title.charAt(0).toUpperCase() == l
							}

						})
					}
				})
			},
        },
        methods: {
        	setActive(e){
                var id = e.target.getAttribute('data-id');
                this.setActiveElem(id);
            },
            setActiveElem(id){
                this.current = id || 0;
            },
        	clearLetter(){
				this.activeLetter = '';
			},
        }
    }
</script>
<style lang="scss" scoped>
	.alphabet{
    	&__list{
			margin: 0;
			padding: 0;
		}
		&__item{
			display: inline-block;
			a{
				padding: 10px;
				color: #000;
				cursor: pointer;
			}
			&.active{
				a{
					background-color: #c1659d;
					color: #fff;
				}
			}
		}
	}
	.glossary{
		background-color: #fff;
		box-shadow: 0 0 10px 0;
		overflow: hidden;
	    padding: 20px;
	    box-sizing: border-box;
	    width: 800px;
   		margin: 0 auto;
	    &__alphabet{
	    	padding-bottom: 20px;
	    }
	    &-scroll{
	    	width: 100%;
	    	height: 100%;
	    }
	    &__content{
		    width: 100%;
		    height: 400px;
		    overflow-y: scroll; 
	    }
	    &__search{
	    	width: 100%;
		    background-color: #fff;
		    padding-bottom: 20px;
		    cursor: pointer;
		    transition: .3s;
		    input{
		    	padding:0;
		    	outline: none;
			    width: calc(100% - 10px);
			    height: 100%;
			    color: #895642;
			    font-size: 24px;
			    line-height: 20px;
			    padding-left: 80px;
		    }
	    }
	    &__list{
    		text-align: left;
    		padding: 0 15px;
    	}
    	&__item{
    		width: 100%;
    		border-bottom: 1px solid #C4BEAE;
		    box-sizing: border-box;
		    position: relative;
		    padding: 15px 0;
		    &:first-child{
		    	padding-top: 0px
		    }
		    &:last-child{
		    	border-bottom: none;
		    	padding-bottom: 0px
		    }
		}
    	.item{
			&__letter{
				display: inline-block;
			    font-size: 60px;
			    color: #000;
			    width: 70px;
			    vertical-align: middle;
			}
			&__content{
				display: inline-block;
				width: calc(100% - 80px);
				vertical-align: middle;
			}
		}
		.inner-content{
			width: 100%;
			height: 100%;
			&:not(:last-child){
				margin-bottom: 15px;
			}
			&.active{
				.inner-content__text{
					color: #5bbb69;
					font-size: 18px;
				}
			}
			&__title{
				line-height: 24px;
				color: #793B22;
				padding-bottom: 12px;
				font-size: 24px;
				cursor: pointer;
			}
			&__text{
				line-height: 26px;
				color: #000;
				font-size: 16px;
			}
		}
	}	
</style>