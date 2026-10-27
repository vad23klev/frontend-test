
<template>
    <div>
        <h1>Комментарии</h1>

        <CommentForm />
        <CommentList />
    </div>
</template>

<script>
import CommentList from '../components/CommentList.vue'
import CommentForm from '../components/CommentForm.vue'

export default {
    components: {
        CommentList,
        CommentForm
    },

    mounted() {
        this.$store.dispatch('fetchComments')
            .then(() => {
                console.log(
                    'Комментарии загружены:',
                    this.$store.state.comments
                )
            })
    }
}
</script>
