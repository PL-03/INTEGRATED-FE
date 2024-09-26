<script setup>
const props = defineProps({
    show: {
        type: Boolean,
        required: true,
    },
});

const emit = defineEmits(['confirm', 'close']);

const confirm = () => {
    emit('confirm');
};

const close = () => {
    emit('close');
};
</script>

<template>
    <div v-if="show" class="modal fixed inset-0 z-50  flex items-center justify-center" @click="close">
        <div  class="itbkk-modal-alert bg-white rounded-lg  shadow-2xl p-4 w-1/3">
            <h3 class="text-xl mb-4 text-start pl-2">Change Board Visibility</h3>
            <p class="itbkk-message mb-6 text-gray-700 text-start p-2">
                In public, anyone can view the board, task list, and task detail of tasks in the board.
                Do you want to change the visibility to public?
            </p>
            <div class="flex justify-end space-x-2">
                <button class="itbkk-button-confirm bg-green-500 text-white py-2 px-4 rounded"
                    @click="confirm">Confirm</button>
                <button class="itbkk-button-cancel bg-red-500 text-white py-2 px-4 rounded"
                    @click="close">Cancel</button>
            </div>
        </div>
    </div>
</template>

<style scoped>
.modal {
    /* display: flex;
    align-items: center;
    justify-content: center;
    position: fixed;
    inset: 0;
    z-index: 9999;
    background-color: rgba(0, 0, 0, 0.5); */
    backdrop-filter: blur(2px);
}

.itbkk-modal-alert {
    background-color: #ffffff;
    padding: 20px;
    max-height: 80vh;
    overflow-y: auto;
}
</style>
