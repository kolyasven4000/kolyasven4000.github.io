<template>
	<div class="pdf-player-wrapper">
		<object>
			<embed ref="embed" class="pdf-frame" :src="context.src" width="700" height="500" />
		</object>

	</div>


</template>
<script>
	export default {
		name: 'pdf-player',
		props: {
        	context: {
	            type: Object,
	            default(){
	                return {
	                    src: 'static/materials/file.pdf',
	                    name: 'ПДФ'
	                }
	            }
        	}
        }
	}
	
</script>
<style lang="scss">
	.pdf {
		&-frame{
			width: 1024px;
		    height: 602px;
		    overflow: hidden;
		    padding: 0;
		    margin: 0;
		    border: 0;
		}

	}


</style>