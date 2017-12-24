<template>
	<section class="slider">
			<div class="slider__inner">
            	<div class="slider__wrapper" :style="{'transform': 'translateX(' + sliderDiff +'px)'}" ref="slider">
            	
	        			<div class="slider__item"  v-for="slide in colLen" >
		                    <ul>
		                       <li>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Amet, sequi nobis. Facere iste quis maxime tenetur repudiandae. Eos, saepe, culpa. Nihil amet ad, sint voluptas corporis consequatur odit vitae! Inventore ullam fugit ipsum qui temporibus accusantium nihil repudiandae quo, voluptatem dolores ab, dolorum quia doloremque quasi magnam, dolore maiores impedit.</li>
		                       <li>Aliquid harum nobis dolore non odit id cumque voluptatem itaque optio molestiae esse blanditiis eos, consectetur vero tenetur ut maiores alias corporis nemo nesciunt omnis molestias reprehenderit doloribus repellat. Voluptate hic dignissimos, nam error, ipsa commodi molestias ad accusantium perferendis, similique ut consequuntur dolores obcaecati distinctio ipsam! Ipsum, asperiores, tenetur.</li>
		                     
		                    </ul>
	               		</div>
            	</div>
			</div>
		<div class="slider__navigation">
			<span 
				class="slider__navigation-point" 
				v-for="(e, i) in colLen" 
				@click="setSlide(i)" 
				:class="{
					'slider__navigation-point--active': i === current
				}">
			</span>
		</div>
		<button 
			class="slider__button slider__button--prev"
			@click="goPrev"
			:class="{
				'slider__button--disabled': current === 0
			}">&lt;
		</button>
		<button 
			class="slider__button slider__button--next" 
			@click="goNext"
			:class="{
				'slider__button--disabled': current === colLen-1
			}">&gt;
		</button>
	</section>
</template>
<script>
	export default {
		name: "slider",
		data(){
			return{
				colLen: 3,
				current: 0,
				sliderWidth: 0
			}
		},
		mounted(){
			this.sliderWidth = this.$refs.slider.clientWidth;
		},
		computed: {
			sliderDiff() {
				return - this.sliderWidth * this.current
			}
		},
		methods: {
			setSlide(id){
              if(id < this.colLen && id >= 0){
                 this.current = id;
                 this.setActiveElem(this.current);
                }
            },
			goNext(){
              if(this.current+1 < this.colLen){
                 this.current++;
                 this.setActiveElem(this.current);
                }
            },
            goPrev(){
              if(this.current - 1 >= 0){
                 this.current--;
                 this.setActiveElem(this.current);
                } 

            },
            setActiveElem(id){
               
            },
		}
	}
</script>
<style lang="scss">
	.slider{
		background-color: #fff;
		box-shadow: 0 0 10px 0;
		overflow: hidden;
	    padding: 20px;
	    box-sizing: border-box;
	    max-width: 800px;
   		min-width: 530px;
   		margin: 0 auto;
   		position: relative;
   		li{
   			list-style-position: inside;
   		}
   		&-scroll{
   			width: 100%;
    		height: 100%;
   		}
   		&__inner{
			width: calc(100% - 100px);
			margin-left: auto;
    		margin-right: auto;
   			height: 350px;
   			overflow: hidden;
   		}
   		&__wrapper{
   			white-space: nowrap;
   			transition: .3s;
   		}
   		&__button{
			border: none;
		    font-size: 36px;
		    background-color: #fff;
		    cursor: pointer;
		    outline: none;
		    &--disabled{
		    	opacity: .3;
		    	cursor: auto;
		    }
			&--prev{
				position: absolute;
				top: 50%;
				transform: translateY(-50%);
				left: 20px;
			}
			&--next{
				position: absolute;
				top: 50%;
				transform: translateY(-50%);
				right: 20px;
			}
   		}
   		&__navigation{
			text-align: center;
			margin-top: 15px;
   			&-point{
			    width: 15px;
			    height: 15px;
			    background-color: #716e6e;
			    opacity: .3;
			    border-radius: 50%;
			    border: 1px solid #000;
			    margin-right: 20px;
			    display: inline-block;
			    box-sizing: border-box;
			    cursor: pointer;
			    vertical-align: bottom;	
			    &--active{
			    	opacity: 1;
			    }
   			}
   		}
   		&__item{
			display: inline-block;
   			ul {
   				white-space: normal;
   			}
   		}
	}
</style>