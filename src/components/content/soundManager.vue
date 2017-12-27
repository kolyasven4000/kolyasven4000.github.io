<template>
<div class="sound-manager">
    <audio class="sound-manager__element--content "
           id="js-audio"
           :src="content.src"
           type="audio/mpeg"
           ref="content"
           preload
           autobuffer></audio>
    <button class="default-btn"
            @click="playPause">{{btnName}}</button>
    <canvas id="visualizer"></canvas>
</div>

</template>

<script>
import { mapGetters, mapActions } from 'vuex';

export default {
    name: 'soundManager',
    data() {
        return {
            paused: true,
            src: 'static/materials/1.mp3',
            canvas: null,
            canvasContext: null,
            audioContext: null,
            audio: null,
            source: null,
            analyser: null,
            bufferLength: null,
            frequencyData: []
        };
    },
    created() {
        window.addEventListener('resize', function() {
            this.canvas.width = window.innerWidth;
            this.canvas.height = window.innerHeight / 2;
        });
    },
    mounted() {
        // this.visualizer();
        this.setupCanvas();
        this.initContentSound({
            $el: this.$refs.content
        });
    },
    computed: {
        content() {
            return this.SoundManager.content;
        },
        btnName() {
            return this.paused ? 'PLAY' : 'PAUSE';
        },
        ...mapGetters([
                    'SoundManager'
        ])
    },
    methods: {
        playPause() {
            if (this.paused) {
                this.play();
            } else {
                this.pause();
            }
        },
        pause() {
            this.pauseSound('content');
            this.paused = true;
        },
        play() {
            this.paused = false;
            this.playSound(this.src);
            this.visualizer();
        },
        setupCanvas() {
            this.canvas = document.getElementById('visualizer');
            this.canvasContext = this.canvas.getContext('2d');

            this.canvas.width = window.innerWidth;
            this.canvas.height = window.innerHeight / 2;

            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
            this.audio = document.getElementById('js-audio');

            this.source = this.audioContext.createMediaElementSource(this.audio);
            this.analyser = this.audioContext.createAnalyser();

            this.source.connect(this.analyser);
            this.analyser.connect(this.audioContext.destination);

            this.bufferLength = this.analyser.frequencyBinCount;
            this.frequencyData = new Uint8Array(this.bufferLength);

        },

        visualizer() {
            this.canvasContext.clearRect(0, 0, this.canvas.width, this.canvas.height);
            this.analyser.getByteFrequencyData(this.frequencyData);

            var frequencyWidth = (this.canvas.width / this.bufferLength * 4),
                frequencyHeight = 0,
                x = 0;

            for (var increment = 0; increment < this.bufferLength; increment++) {
                frequencyHeight = this.frequencyData[increment] * (this.canvas.height * 0.002);

                this.canvasContext.fillStyle = 'rgba(0,0,255,0.5)';
                this.canvasContext.fillRect(x, this.canvas.height - frequencyHeight, frequencyWidth, frequencyHeight);
                x += frequencyWidth + 2;
            }
            if(!this.paused) {
              requestAnimationFrame(this.visualizer);
            }
            
        },

        ...mapActions([
                    'initContentSound',
                    'playSound',
                    'pauseSound'
        ])
    }
}

</script>

<style lang="scss">
.sound-manager {
    width: 100%;
    height: 100%;
    background-color: white;
}

#visualizer {
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0;
    opacity: 0.8;
}

.default-btn {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    z-index: 999;
}
</style>
