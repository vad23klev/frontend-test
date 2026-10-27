
<template>
    <form @submit.prevent="submitComment">
        <div>
            <label for="name">Имя</label>
            <input
                id="name"
                v-model.trim="name"
                type="text"
                required
                maxlength="255"
                placeholder="Ваше имя"
            >
        </div>

        <div>
            <label for="date">Дата</label>

            <DatePicker
                v-model="date"
                type="datetime"
                format="DD.MM.YYYY HH:mm"
                value-type="format"
                placeholder="Выберите дату и время"
                :editable="false"
            />
        </div>

        <div>
            <label for="text">Комментарий</label>
            <textarea
                id="text"
                v-model.trim="text"
                required
                placeholder="Напишите комментарий"
            ></textarea>
        </div>

        <button type="submit" :disabled="submitting">
            {{ submitting ? 'Отправка...' : 'Добавить комментарий' }}
        </button>

        <p v-if="error" role="alert">
            {{ error }}
        </p>
    </form>
</template>

<script>
import axios from 'axios'
import DatePicker from 'vue2-datepicker'
import { formatDateForApi } from '../utils/date'
import { getCurrentDateTime } from '../utils/date'
import 'vue2-datepicker/index.css'

export default {
    components: {
        DatePicker
    },

    data() {
        return {
            name: '',
            text: '',
            date: getCurrentDateTime(),
            submitting: false,
            error: null
        }
    },

    methods: {
        async submitComment() {
            if (!this.name || !this.text || !this.date || this.submitting) {
                return
            }

            this.submitting = true
            this.error = null

            try {
                const response = await axios.post('/api/comments/', {
                    name: this.name,
                    text: this.text,
                    date: formatDateForApi(this.date)
                })

                const comment = response.data

                if (!comment.id) {
                    throw new Error('API не вернул созданный комментарий')
                }

                this.$store.commit('ADD_COMMENT', comment)

                this.name = ''
                this.text = ''
                this.date = getCurrentDateTime()
            } catch (error) {
                console.error('Ошибка добавления комментария:', error)
                this.error = 'Не удалось добавить комментарий. Попробуйте ещё раз.'
            } finally {
                this.submitting = false
            }
        }
    }
}
</script>
