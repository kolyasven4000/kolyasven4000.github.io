<template>
<div class="component">
    <div class="demo-modal">
        <button v-for="i in 3"
                class="default-btn"
                @click="openModal(i)">Модальное окно {{i}}</button>
    </div>
    <modal @closeModal="closeModal"
           :showModal="modalId == 1"
           animName="fade"
           width="400"
           height="auto">
        <button class="modal__exit"
                slot='modal-header'
                @click="closeModal"></button>
        <p slot='modal-content'>Content 1</p>
        <p slot="modal-footer">Footer 1</p>
    </modal>
    <modal @closeModal="closeModal"
           :showModal="modalId == 2"
           animName="bounce"
           width="300"
           height="auto">
        <button class="modal__exit"
                slot='modal-header'
                @click="closeModal"></button>
        <p slot='modal-content'>Content 2</p>
        <p slot="modal-footer">Footer 2</p>
    </modal>
    <modal @closeModal="closeModal"
           :showModal="modalId == 3"
           animName="hinge"
           width="500"
           height="auto">
        <button class="modal__exit"
                slot='modal-header'
                @click="closeModal"></button>
        <p slot='modal-content'>Content 3</p>
        <p slot="modal-footer">Footer 3</p>
    </modal>
</div>

</template>

<script>
import modal from './default-modal.vue';
export default {
    name: 'modalPage',
    data() {
        return {
            modalId: null
        };
    },
    components: {
        modal
    },
    methods: {
        openModal(id) {
            this.modalId = id;
        },
        closeModal() {
            this.modalId = null;
        }
    }
}

</script>

<style lang="scss">
.demo-modal {
    display: flex;
    justify-content: space-around;
    width: 800px;
    .default-btn {}
}
</style>
