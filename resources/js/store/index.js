
import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'

Vue.use(Vuex)

export default new Vuex.Store({
    state: {
        comments: [],
        loading: false,
        error: null
    },

    mutations: {
        SET_COMMENTS(state, comments) {
            state.comments = comments
        },

        ADD_COMMENT(state, comment) {
            state.comments.push(comment)
        },

        REMOVE_COMMENT(state, id) {
            state.comments = state.comments.filter(
        comment => comment.id !== id
        )
        },

        SET_LOADING(state, loading) {
            state.loading = loading
        },

        SET_ERROR(state, error) {
            state.error = error
        }
    },

    actions: {
        async fetchComments({ commit }) {
            commit('SET_LOADING', true)
            commit('SET_ERROR', null)

            try {
                const response = await axios.get('/api/comments/')
                commit('SET_COMMENTS', response.data)
            } catch (error) {
                commit('SET_ERROR', 'Не удалось загрузить комментарии')
                console.error('Ошибка загрузки комментариев:', error)
            } finally {
                commit('SET_LOADING', false)
            }
        }
    },

    getters: {
        comments: state => state.comments,
        loading: state => state.loading,
        error: state => state.error
    }
})
