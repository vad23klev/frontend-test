

<template>
    <section class="comments">
        <div v-if="loading" class="comments__message">
            Загрузка комментариев...
        </div>

        <div v-else-if="error" class="comments__message comments__message--error">
            {{ error }}
        </div>

        <div v-else>
            <div class="comments__toolbar">
                <h2>Комментарии</h2>

                <div class="comments__sorting">
                    <label>
                        Сортировать по
                        <select v-model="sortBy">
                            <option value="id">ID</option>
                            <option value="date">Дате</option>
                        </select>
                    </label>

                    <label>
                        Порядок
                        <select v-model="sortOrder">
                            <option value="asc">По возрастанию</option>
                            <option value="desc">По убыванию</option>
                        </select>
                    </label>
                </div>
            </div>

            <p v-if="sortedComments.length === 0" class="comments__empty">
                Комментариев пока нет.
            </p>

            <div v-else class="comments__list">
                <article
                    v-for="comment in paginatedComments"
                    :key="comment.id"
                    class="comment"
                >
                    <div class="comment__header">
                        <h3 class="comment__author">{{ comment.name }}</h3>
                        <span class="comment__id">#{{ comment.id }}</span>
                    </div>

                    <p class="comment__text">{{ comment.text }}</p>

                    <div class="comment__footer">
                        <time class="comment__date">{{ comment.date }}</time>

                        <button
                            type="button"
                            class="comment__delete"
                            @click="deleteComment(comment.id)"
                        >
                            Удалить
                        </button>
                    </div>
                </article>
            </div>

            <nav v-if="pageCount > 1" class="pagination" aria-label="Страницы комментариев">
                <button
                    type="button"
                    class="pagination__button"
                    :disabled="currentPage === 1"
                    @click="currentPage--"
                >
                    Назад
                </button>

                <button
                    v-for="page in pageCount"
                    :key="page"
                    type="button"
                    class="pagination__button"
                    :class="{ 'pagination__button--active': currentPage === page }"
                    :aria-current="currentPage === page ? 'page' : null"
                    :disabled="currentPage === page"
                    @click="currentPage = page"
                >
                    {{ page }}
                </button>

                <button
                    type="button"
                    class="pagination__button"
                    :disabled="currentPage === pageCount"
                    @click="currentPage++"
                >
                    Далее
                </button>
            </nav>
        </div>
    </section>
</template>


<script>
import axios from 'axios'

export default {
    data() {
        return {
            sortBy: 'id',
            sortOrder: 'asc',
            currentPage: 1,
            pageSize: 3,
        }
    },

    computed: {
        comments() {
            return this.$store.getters.comments
        },

        loading() {
            return this.$store.getters.loading
        },

        error() {
            return this.$store.getters.error
        },

        sortedComments() {
            return [...this.comments].sort((a, b) => {
                let result

                if (this.sortBy === 'date') {
                    const dateA = new Date(a.date).getTime()
                    const dateB = new Date(b.date).getTime()

                    result = dateA - dateB
                } else {
                    result = Number(a.id) - Number(b.id)
                }

                return this.sortOrder === 'asc'
                    ? result
                    : -result
            })
        },

        pageCount() {
            return Math.ceil(this.sortedComments.length / this.pageSize)
        },

        paginatedComments() {
            const start = (this.currentPage - 1) * this.pageSize

            return this.sortedComments.slice(
                start,
                start + this.pageSize
            )
        }
    },

    methods: {
        async deleteComment(id) {
            const confirmed = window.confirm(
                'Удалить этот комментарий?'
            )

            if (!confirmed) {
                return
            }

            try {
                await axios.delete(`/api/comments/${id}`)
                this.$store.commit('REMOVE_COMMENT', id)
                if (this.currentPage > this.pageCount) {
                this.currentPage = Math.max(1, this.pageCount)
}
            } catch (error) {
                console.error('Ошибка удаления:', error)
                alert('Не удалось удалить комментарий')
            }
        }
    }
}
</script>
