<template>
<section class="videoplayer">
    <div class="videoplayer__content">
        <!-- loader -->
        <div v-if="error || !ready"
             class="videoplayer__loader">Загрузка...</div>
        <!-- video -->
        <video :poster="poster"
               id="video-element"
               :src="videoSrc"
               width="100%"
               height="100%"
               @click="pauseInterf"></video>
        <!-- quality -->
        <div class="quality-panel"
             v-show="showQuality && interface">
            <span @click.stop="setQuality('hd')">HD</span>
            <span @click.stop="setQuality('sd')">SD</span>
            <span @click.stop="setQuality('lw')">LD</span>
        </div>
        <!-- close videoplayer -->
        <transition name="video-interface">
            <div v-show="!noback && interface"
                 class="videoplayer__close"
                 @click="goBack">
            </div>
        </transition>
        <!-- interface -->
        <transition name="video-interface">
            <div v-show="interface"
                 class="videoplayer__controls">
                <span class="current-time">{{currentTimeS}}</span>
                <span class="duration-time">{{durationS}}</span>
                <div class="time-bar-wrapper"
                     @click="seekVideo">
                    <div class="time-bar">
                        <div class="time-bar__current"
                             :style="progressStyle"></div>
                    </div>
                </div>
                <div class="buttons">
                    <div class="buttons--left">
                        <div class="btn btn-prev"
                             @click="rewindBack"></div>
                        <div v-if="paused"
                             class="btn btn-play"
                             @click="play"></div>
                        <div v-if="!paused"
                             class="btn btn-pause"
                             @click="pause"></div>
                        <div class="btn btn-next"
                             @click="rewindNext"></div>
                    </div>
                    <div class="buttons--right">
                        <div class="btn btn-zoom"
                             @click="fullscreen"></div>
                        <div class="btn btn-sound"
                             :class="{mute : muted}">
                            <div class="volume-bar-wrapper">
                                <div class="btn btn-volume"
                                     @click="switchMute"></div>
                                <div class="volume-bar"
                                     @click.stop="seekVolume">
                                    <div class="volume-bar__current"
                                         :style="volumeStyle"></div>
                                    <div class="volume-bar__all"></div>
                                </div>
                            </div>
                        </div>
                        <div v-show="quality"
                             @click.prevent.stop="showHideQuality"
                             class="btn btn-quality">
                            <span>{{qualityStr}}</span>
                        </div>
                    </div>
                </div>
                <div class="video-title">{{title}}</div>
            </div>
        </transition>
    </div>
</section>

</template>

<script>
export default {
    name: 'videoplayer',
    data() {
        return {
            $video: null,
            paused: true,
            ready: false,
            duration: 0,
            currentTime: 0,
            waited: false,
            error: false,
            error_code: '',
            loaded: false,
            interval: null,
            interfaceTimeout: null,
            muted: false,
            volume: 100,
            mouseDown: false,
            interface: true,
            qualityVideo: '',
            showQuality: false
        };
    },
    mounted() {
        var that = this;
        if (that.src === '') {
            that.error = true;
        }
        that.$video = this.$el.getElementsByTagName('video')[0];
        that.$video.onpause = function() {
            that.interfaceShow();
            that.$emit('paused');
        };
        that.$video.onloadedmetadata = function() {
            that.duration = that.$video.duration;
            that.error = false;
            that.ready = true;
            that.$video.muted = that.muted;
            if (that.autoplay) {
                that.$nextTick(
                    function() {
                        that.play();
                    });
            }
        };
        that.$video.onerror = function() {
            that.error = true;
        };
    },
    beforeDestroy() {
        this.pause();
        clearInterval(this.interval);
    },
    props: {
        src: {
            type: String,
            required: true,
            validator: function(value) {
                return (value !== null);
            },
            default: function() {
                return '';
            }
        },
        title: {
            type: String,
            validator: function(value) {
                return (value !== null);
            },
            default: function() {
                return 'Untitled';
            }
        },
        autoplay: {
            type: Boolean,
            validator: function(value) {
                return (value !== null);
            },
            default: function() {
                return false;
            }
        },
        poster: {
            type: String,
            validator: function(value) {
                return (value !== null);
            },
            default: function() {
                return '';
            }
        },
        noback: {
            type: Boolean,
            validator: function(value) {
                return (value !== null);
            },
            default: function() {
                return false;
            }
        },
        quality: {
            type: Boolean,

            validator: function(value) {
                return (value !== null);
            },
            default: function() {
                return false;
            }
        }
    },
    computed: {
        qualityStr() {
            switch (this.qualityVideo) {
                case 'sd':
                    return 'SD';
                    break;
                case 'lw':
                    return 'LD';
                    break;
                default:
                    return 'HD';
            }
        },
        videoSrc() {
            if (this.quality) {
                var quality_str = this.qualityVideo ? this.qualityVideo + '/' : 'hd/';
                return this.src.replace('video/hd/', 'video/' + quality_str);
            } else {
                return this.src;
            }
        },
        durationS() {
            return this.secondsToHms(this.duration);
        },
        currentTimeS() {
            return this.secondsToHms(this.currentTime);
        },
        progress() {
            return this.currentTime * 100 / this.duration || 0;
        },
        progressStyle() {
            return {
                width: this.progress + '%'
            };
        },
        volumeStyle() {
            var volume = this.volume;
            if (this.muted) {
                volume = 0;
            }
            return {
                width: volume * 100 + '%'
            };
        },
        is_iPad() {
            return navigator.userAgent.match(/iPad/i) !== null;
        }
    },
    methods: {
        showHideQuality() {
            this.showQuality = !this.showQuality;
        },
        setQuality(quality) {
            switch (quality) {
                case 'sd':
                    this.qualityVideo = 'sd';
                    break;
                case 'lw':
                    this.qualityVideo = 'lw';
                    break;
                default:
                    this.qualityVideo = '';
            }
            this.showQuality = false;
        },
        play() {
            var that = this;
            if (!this.error) {
                this.$video.play();
                this.paused = false;
                this.interfaceTimeout = setTimeout(function() {
                    that.interfaceHide();
                }, 1000);
                that.interval = setInterval(function() {
                    that.currentTime = that.$video.currentTime;
                }, 20);
                that.$video.onended = function() {
                    that.$video.onended = undefined;
                    that.pause();
                    that.setCurrentTime(0);
                    that.$emit('progress', 100);
                    that.$emit('ended');
                };
                that.$emit('played');
            }
        },
        fullscreen() {
            var element = this.$video;
            if (element.requestFullScreen) {
                element.requestFullScreen();
            } else if (element.mozRequestFullScreen) {
                element.mozRequestFullScreen();
            } else if (element.webkitRequestFullScreen) {
                element.webkitRequestFullScreen();
            }
        },
        interfaceHide() {
            this.interface = false;
        },
        interfaceShow() {
            this.interface = true;
        },
        pause() {
            var that = this;
            if (this.ready && !this.error) {
                this.$video.pause();
                this.paused = true;
                clearInterval(this.interval);
                clearTimeout(this.interfaceTimeout);
                that.interfaceShow();
            }
        },
        secondsToHms(d) {
            d = Number(d);
            var h = Math.floor(d / 3600);
            var m = Math.floor(d % 3600 / 60);
            var s = Math.floor(d % 3600 % 60);
            return ((h > 0 ? h + ':' + (m < 10 ? '0' : '') : '') + m + ':' + (s < 10 ? '0' : '') + s);
        },
        pauseInterf() {
            if (this.interface) {
                this.playPause();
            } else {
                this.interfaceShow();
            }
        },
        playPause() {
            if (this.paused) {
                this.play();
            } else {
                this.pause();
            }
        },
        switchMute() {
            if (this.ready) {
                this.muted = !this.muted;
                this.$video.muted = this.muted;
            }
        },
        rewindNext() {
            if (this.ready) {
                this.currentTime = this.$video.currentTime += 5;
            }
        },
        rewindBack() {
            if (this.ready) {
                this.currentTime = this.$video.currentTime -= 5;
            }
        },
        seekVideo(e) {
            var percent = parseInt(e.offsetX / e.target.offsetWidth * 100, 10);
            this.setCurrentTime(percent);
        },
        setCurrentTime(percent) {
            percent = percent || 0;
            if (this.ready) {
                this.currentTime = this.$video.currentTime = percent * this.$video.duration / 100;
            }
        },
        seekVolume(e) {
            var percent = parseFloat(e.offsetX / e.target.offsetWidth);
            this.setVolume(percent);
        },
        setVolume(percent) {
            percent = percent || 0;
            if (this.ready) {
                this.volume = this.$video.volume = percent;
                if (this.volume === 0) {
                    this.muted = this.$video.muted = true;
                }
            }
        },
        goBack() {
            this.$emit('goBack');
        }
    }

}

</script>

<style lang="scss">
@keyframes video-loading {
    50% {
        opacity: .1;
    }
}

.video-interface-enter-active,
.video-interface-leave-active {
    transition: .6s ease;
}

.video-interface-enter,
.video-interface-leave-active {
    opacity: 0;
}

.videoplayer {
    text-align: center; // transform: translate(-45px, -45px) scale(.9);
    background-color: #fff;
    box-shadow: 0 0 10px 0;
    overflow: hidden;
    padding: 20px;
    box-sizing: border-box;
    max-width: 800px;
    min-width: 530px;
    margin: 0 auto;
    &__loader {
        position: absolute;
        top: 50%;
        left: 50%;
        color: #fff;
        transform: translate(-50%, -50%);
        opacity: .4;
        font-weight: 200;
        font-size: 16px;
        animation: video-loading 2s infinite linear;
    }
    &__close {
        position: absolute;
        top: 15px;
        right: 15px;
        width: 30px;
        height: 30px;
        overflow: hidden;
        cursor: pointer;
        &:hover {
            &::before,
            &::after {
                background: #1ebcc5;
            }
        }
        &::before,
        &::after {
            content: '';
            position: absolute;
            height: 2px;
            width: 100%;
            top: 50%;
            left: 0;
            margin-top: -1px;
            background: #fff;
            border-radius: 80% 0;
        }
        &::before {
            transform: rotate(45deg);
        }
        &::after {
            transform: rotate(-45deg);
        }
    }
    &__error {
        position: absolute;
        top: 50%;
        left: 50%;
        color: red;
        transform: translate(-50%, -50%);
        opacity: .5;
        font-weight: 200;
        font-size: 16px;
    }
    &__content {
        // width: 996px;
        display: inline-block;
        position: relative;
    }
    &__controls {
        width: 100%;
        box-sizing: border-box;
        overflow: hidden;
        position: absolute;
        bottom: 0px;
        left: 0;
        padding: 13px;
        z-index: 33;
        &:after {
            content: "";
            width: 100%;
            height: 100%;
            position: absolute;
            top: 0;
            left: 0;
            background-image: -moz-linear-gradient( 90deg, rgb(31, 11, 21) 0%, rgba(24, 25, 31, 0) 100%);
            background-image: -webkit-linear-gradient( 90deg, rgb(31, 11, 21) 0%, rgba(24, 25, 31, 0) 100%);
            background-image: -ms-linear-gradient( 90deg, rgb(31, 11, 21) 0%, rgba(24, 25, 31, 0) 100%);
            opacity: 0.8;
            z-index: -1;
        }
        .current-time,
        .duration-time {
            font-weight: 200;
            font-size: 15px;
            color: #fff;
            padding: 0 2px;
        }
        .current-time {
            float: left;
        }
        .duration-time {
            float: right;
        }
        .time-bar-wrapper {
            width: 100%;
            height: 11px;
            display: inline-block;
            cursor: pointer;
            position: relative;
            top: -3px;
        }
        .btn-zoom {
            transform: translateY(-50%);
            width: 19px;
            height: 18px;
            right: 20px;
            background-image: url("~assets/img/videoplayer/btn-zoom.svg");
        }
        .btn-sound {
            transform: translateY(-50%);
            &.mute {
                .btn-volume {
                    background-image: url("~assets/img/videoplayer/btn-mute.svg");
                }
                .volume-bar__current {
                    width: 0%;
                }
            }
        }
        .btn-volume {
            transform: translateY(-50%);
            width: 25px;
            height: 22px;
            left: -35px;
            background-image: url("~assets/img/videoplayer/btn-volume.svg");
        }
        .volume-bar-wrapper {
            width: 65px;
            height: 11px;
            display: inline-block;
            cursor: pointer;
            position: relative;
            left: 28px;
        }
        .volume-bar {
            width: 56px;
            height: 10px;
            display: inline-block;
            position: absolute;
            cursor: pointer;
            top: 50%;
            left: 0;
            transform: translateY(-50%);
            background-color: transparent;
            &__all {
                width: 100%;
                height: 1px;
                background-color: #776e73;
                position: absolute;
                top: 4px;
            }
            &__current {
                background-color: #d55290;
                width: 0%;
                height: 1px;
                position: absolute;
                left: 0;
                max-width: 100%;
                top: 4px;
                z-index: 1;
                &:after {
                    content: "";
                    position: absolute;
                    color: #fff;
                    width: 1px;
                    height: 11px;
                    right: 0px;
                    top: -5px;
                    background-color: #fff;
                }
            }
        }
        .btn-play {
            transform: translateY(-50%);
            left: 67px;
            width: 16px;
            height: 17px;
            background-image: url("~assets/img/videoplayer/btn-play.svg");
        }
        .btn-prev,
        .btn-next {
            width: 25px;
            height: 15px;
        }
        .btn-prev {
            background-image: url("~assets/img/videoplayer/btn-next.svg");
            transform: rotate(-180deg);
            left: 20px;
            transform-origin: center 4px;
        }
        .btn-next {
            transform: translateY(-50%);
            left: 105px;
            background-image: url("~assets/img/videoplayer/btn-next.svg");
        }
        .btn-pause {
            transform: translateY(-50%);
            left: 67px;
            width: 16px;
            height: 18px;
            background-image: url("~assets/img/videoplayer/btn-pause.svg");
        }
        .btn {
            background-repeat: no-repeat;
            position: absolute;
            cursor: pointer;
            top: 50%;
        }
        .buttons {
            &--right {
                width: 150px;
                height: 25px;
                float: right;
                position: relative;
            }
            &--left {
                width: 150px;
                height: 25px;
                float: left;
                position: relative;
            }
        }
        .time-bar {
            width: 100%;
            height: 1px;
            background-color: #776e73;
            display: inline-block;
            position: absolute;
            cursor: pointer;
            top: 50%;
            left: 0;
            transform: translateY(-50%);
            &__current {
                background-color: #d55290;
                width: 0%;
                height: 1px;
                position: absolute;
                top: 0;
                left: 0;
                max-width: 100%;
                &:after {
                    content: "";
                    position: absolute;
                    color: #fff;
                    width: 1px;
                    height: 11px;
                    right: 0px;
                    top: -5px;
                    background-color: #fff;
                }
            }
        }
        .video-title {
            opacity: .5;
            font-weight: 200;
            font-size: 13px;
            color: #fff;
            display: inline-block;
            margin-top: 7px;
        }
    }
    .btn-quality {
        transform: translateY(-50%);
        position: absolute;
        right: 180px;
        color: #fff;
        font-weight: normal;
        font-weight: 300;
    }
    .quality-panel {
        position: absolute;
        bottom: 38px;
        width: 60px;
        color: rgba(50, 50, 50, .9);
        background-color: rgba(255, 255, 255, .7);
        right: 175px;
        z-index: 55;
        span {
            cursor: pointer;
            padding: 5px 20px;
            display: inline-block;
            text-align: center;
            &:active {
                background-color: rgba(255, 255, 255, .5);
            }
        }
    }
}
</style>
