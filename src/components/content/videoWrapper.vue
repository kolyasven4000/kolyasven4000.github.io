<template>
	<div class="component">
            <videoplayer 
                autoplay
                src="/static/cap.mp4"
                @ended="ended" 
                @goBack="goBack">
             </videoplayer>
        </div>
	</div>
</template>

<script>
    import videoplayer from './videoPlayer.vue';
    export default {
        name: "videoPage",
        components:{
            videoplayer
        },
        methods:{
            ended() {
                console.log('ended')
            },
            goBack(){
                this.$emit('goBack')
            },
        }
    }
</script>

<style lang="sass" scoped>
	
</style>