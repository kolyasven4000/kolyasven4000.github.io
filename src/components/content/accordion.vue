<template>
	<section class="accordion">

		 <div class="accordion__item" @click="setActive(i)" v-for=" i in 3">
                    <h3 class="accordion__title" >Какой то заголовок {{i}}</h3>
                    <transition name="accord">
                    <div class="accordion__content" v-if="currentItemId === i">Какой то текст, много текста</div>
                    </transition>
                </div>
	</section>
</template>
<script>
	export default {
		name: "accordion",
		data(){
			return{
				currentItemId: null,
			}
		},
		mounted() {

		},
		computed:{
		
		},
		methods:{
        	setActive(id){
        		
        		this.currentItemId = id === this.currentItemId ? null : id;
        	},

        },
	}
</script>
<style lang="scss">
	.accordion{
		 background-color: #fff;
        box-shadow: 0 0 10px 0;
        overflow: hidden;
        padding: 20px;
        box-sizing: border-box;
        max-width: 800px;
        min-width: 530px;
        margin: 0 auto;
        &.components__component{
            top: 250px;
            transform: translateX(-50%);
        }
        &__item{
            display: block;
            box-sizing: border-box;
            width: 100%;
            margin: 16px 0;
            border: 1px solid lightGray;
            overflow: hidden;
        }
        &__title{
            transition: .3s;
            display: block;
            box-sizing: border-box;
            width: 100%;
            margin: 0;
            padding: 16px;
            background-color: rgba(113, 110, 110, 0.2);
            color: #000000;
            font-size: 16px;
            cursor: pointer;
        }
        &__content{
            display: block;
            box-sizing: border-box;
            width: 100%;
            margin: 0;
            padding: 16px;
            background-color: white;
            color: #000000;
            font-size: 16px;
            transition: .3s;
        }
		&__item{
			&--active{
				& > h3{
					background-color: rgba(113, 110, 110, 0.6);
				}
			}
		}
	}
    .accord-enter-active {
       // transition: 1.3s;
    }
    .accord-enter, .accord-leave-active {
        height: 0;
        padding:0 10px;
    }
</style>