import Vue from 'vue'
export const initContentSound = ({ commit, getters }, payload) => {
    payload = payload || {
        target : 'content',
        $el : null
    };
    console.log(payload.$el);
    const options = {
        target : 'content',
        $el : payload.$el || null
    }
    commit('INIT_SOUND', options);

}
export const playSound = ({ commit, getters,dispatch }, payload) => {
    console.log(payload, "IN ACTION")
    payload = payload || {
        target : 'content',
        src : '',
        callback : null,
        once : false
    };
    var options = {
        target : 'content',
        src: payload || '',
        callback : function () {
            dispatch('clearSound', 'content');
        },
        once : false,
        loop : false
    }
    commit('SET_SOUND', options);
    Vue.nextTick(function () {
        commit('PLAY_SOUND', 'content');
    });
}
export const pauseSound = ({ commit, getters }, payload) => {
    payload = payload || ''
    Vue.nextTick(function () {
        commit('PAUSE_SOUND', payload);
    });
}

