export const INIT_SOUND = (state, message) => {
    if( state[message.target] ){
        state[message.target].$el = message.$el;
        state[message.target].$el.onended = function(){
            if(state[message.target].callback !== null && typeof state[message.target].callback == "function"){
                state[message.target].callback();
                if(state[message.target].once){
                    state[message.target].callback = null;
                }
            }
        }
    }
}
export const SET_SOUND = (state, message) => {
    console.log(message)
    if( state[message.target] ){
        state[message.target].src = message.src;
        state[message.target].callback = message.callback;
        state[message.target].once = message.once;
        state[message.target].loop = message.loop;
    }
}
export const PLAY_SOUND = (state, message) => {
    console.log(state, state[message], message)
    if( state[message] && state[message].$el && state[message].src && !state.mute){
        state[message].$el.play();
    }
}

export const PAUSE_SOUND = (state, message) => {
    console.log('pause' + message)
    if( state[message] && state[message].$el && state[message].src && !state.mute){
        state[message].$el.pause();
        console.log('pause' + message)
    }
}