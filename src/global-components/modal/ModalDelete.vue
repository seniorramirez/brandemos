<template>
    <Modal :refKey="props.refKey" @hidden="closeModal" >
        <ModalBody class="p-0">
            <div class="p-5 text-center">
                <XCircleIcon class="w-16 h-16 text-danger mx-auto mt-3" />
                <div class="text-3xl mt-5">
                    Are you sure?
                </div>
                <div class="text-slate-500 mt-2">
                    Do you really want to delete these records? <br />This process cannot be undone.
                </div>
            </div>
            <div class="px-5 pb-8 text-center">
                <button type="button" @click="closeModal" class="btn btn-outline-secondary w-24 mr-1">
                    Cancel
                </button>
                <button type="button" class="btn btn-danger w-24" @click="confirmDelete" :disabled="deleting">
                    {{ deleting ? 'Deleting' : 'Delete' }}
                </button>
            </div>
        </ModalBody>
    </Modal>
</template>

<script setup>

const props = defineProps({
    refKey: String,
    modal: {
        type: Object,
    },
    callback: {
        type: Function
    },
    deleting: {
        type: Boolean
    }

});

function confirmDelete(){

    if(props.callback){
        props.callback();
    }
}

function closeModal() {
    props.modal.hide();
}
</script>