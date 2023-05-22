<template>
    <div class="intro-y flex flex-col sm:flex-row items-center mt-8 mb-5">
        <h2 class="text-lg font-medium mr-auto"></h2>

        <div class="w-full sm:w-auto flex mt-4 sm:mt-0">
            <!-- BEGIN: Search -->
            <div class="relative flex items-center pr-0 mt-0 mr-auto sm:mr-5 border-r-none sm:border-r border-slate-300/60 sm:pr-5 ">

                <div class="mr-auto mt-3 sm:mt-0">
                    <div class="w-56 text-slate-500">
                        <input type="text" class="form-control w-56 box pr-10" placeholder="Search..." v-model="search" />
                    </div>
                </div>
                <button class="btn btn-primary shadow-md ml-2" @click="getSamples" :disabled="searching">
                    {{searching ? 'Searching' : 'Search'}}
                </button>
            </div>

            <!-- END: Search -->

            <!-- BEGIN: New Button -->
            <button class="btn btn-primary shadow-md mr-2" @click="openNewSample">
                <PlusIcon class="w-4 h-4 ml-0.5 mr-1" />
                Add Sample
            </button>
            <!-- END: New Button -->

        </div>
    </div>

    <div class="intro-y box mb-5 p-5">
        
        <table class="table table-report -mt-2">
            <thead>
                <tr>
                    <th class="whitespace-nowrap">DEMOSTRATOR</th>
                    <th class="whitespace-nowrap">DATE</th>
                    <th class="whitespace-nowrap">LOCATION</th>
                    <th class="whitespace-nowrap">UNITS SOLD</th>
                    <th class="whitespace-nowrap">SAMPLES</th>
                    <th class="text-center whitespace-nowrap">ACTIONS</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="user in table_data" :key="user.id" class="intro-x">
                    <td class="w-40">
                        <span>{{ user.demostrator ? user.demostrator[0].user_nicename : 'Not found'}}</span>
                    </td>
                    <td class="w-40">
                        <a href="" class="font-medium whitespace-nowrap">{{ user.demo_date }}</a>
                    </td>
                    <td class="w-40 text-center">
                        <a href="" class="font-medium whitespace-nowrap">{{ user.demo_location[0].post_title }}</a>
                    </td>
                    <td class="w-40 text-center">
                        <a href="" class="font-medium whitespace-nowrap">{{ user.total_units_sold }}</a>
                    </td>
                    <td class="w-40 text-center">
                        <a href="" class="font-medium whitespace-nowrap">{{ user.cantidad_clientes }}</a>
                    </td>
                    <td class="table-report__action w-56">
                        <div class="flex justify-center items-center">
                            <a class="flex items-center mr-3" href="javascript:;" @click="openEditSample(user)">
                                <CheckSquareIcon class="w-4 h-4 mr-1" /> Edit
                            </a>
                            <a class="flex items-center text-danger" href="javascript:;" @click="showModalDelete(user)">
                                <Trash2Icon class="w-4 h-4 mr-1" /> Delete
                            </a>
                        </div>
                    </td>
                </tr>
            </tbody>
        </table>
        <Pagination :total="pagination.total" :limit="pagination.limit" :change="callbackChangePagination" />

    </div>

    <Modal size="modal-lg" backdrop="static" :show="show_modal_sample">
        <ModalHeader>
            <h2 class="mr-auto text-base font-medium">
                {{form_sample.id ? 'Update sample' : 'Add sample' }}
            </h2>
        </ModalHeader>
        <ModalBody>

            <div class="intro-y">

                <div class="grid grid-cols-12 gap-x-6 gap-y-4 mb-5">
                    <div class="col-span-12 lg:col-span-6 flex flex-col">
                        <label for="user_name" class="form-label ">Title *</label>
                        <input id="user_name" type="text" class="form-control w-full " v-model="form_sample.title" :class="{ 'invalid': form_sample_invalidate.title }"/>
                        <span class="text-xs mt-2 text-danger" v-show="form_sample_invalidate.title">Field is required</span>
                    </div>
                    <div class="col-span-12 lg:col-span-6">
                        <label for="user_last_name" class="form-label">Date *</label>
                        <VueDatePicker v-model="form_sample.date" :is-24="false" :min-date="new Date()" />
                        <span class="text-xs mt-2 text-danger" v-show="form_sample_invalidate.date">Field is required</span>
                    </div>
                    <div class="col-span-12 lg:col-span-6">
                        <label for="user_email" class="form-label">Location *</label>
                        <select 
							id="product_brand" 
							class="form-control w-full" 
                            v-model="form_sample.demo_location" 
							:class="{ 'invalid': form_sample_invalidate.demo_location }" 
						>
							<option v-for="location in locations_lists" :key="location.id" :value="location.id">{{location.location_title}}</option>
						</select>
                        <span class="text-xs mt-2 text-danger" v-show="form_sample_invalidate.demo_location">Field is required</span>
                    </div>
                    <div class="col-span-12 lg:col-span-6">
                        <label for="user_phone" class="form-label">User *</label>
                        <select 
							id="product_brand" 
							class="form-control w-full" 
                            v-model="form_sample.demostrator" 
							:class="{ 'invalid': form_sample_invalidate.demostrator }" 
						>
							<option v-for="user in users_lists" :key="user.id" :value="user.id">{{user.name}}</option>
						</select>
                        <span class="text-xs mt-2 text-danger" v-show="form_sample_invalidate.demostrator">Field is required</span>
                    </div>
                  

                </div>
            </div>
        </ModalBody>
        <ModalFooter>
            <button type="button" @click="closeModalNewUser" class="w-20 mr-1 btn btn-outline-secondary">
                Cancel
            </button>
            <button type="button" class="btn btn-primary" :disabled="is_creating" @click="validateFormSample">
                {{ form_sample.id ? 'Update sample' : 'Add sample' }}
                <LoadingIcon icon="oval" class="ml-1" color="white" v-show="is_creating" />
            </button>
        </ModalFooter>
    </Modal>

    <ModalDelete :modal="modalDelete" refKey="modal-delete-ref" :callback="sendDeleteSample" :deleting="deleting" />

    <SuccessNotification refKey="successNotification"/>
    <WarningNotification refKey="warningNotification" />
</template>


<script setup>

import { ref, onMounted, provide, computed, reactive, getCurrentInstance } from "vue";
import Swal from 'sweetalert2';
import axios from 'axios';
import endpoint from "../../utils/endpoint";
import dayjs from "dayjs";


/**
 * CONSTANS
 */

const locations_lists = ref([]);
const users_lists = ref([]);
const table_data = ref([]);

const sample_selected = ref(null);
const deleting = ref(false);

const pagination = reactive({
    total: 0,
    limit: 10,
    page: 1,
});

const search = ref("");
const searching = ref(false);

const password_confirm_error = ref(false);



//MODAL NEW PRODUCT
const show_modal_sample = ref(false);
const is_creating = ref(false);

const form_sample_DEFAULT = {
    id:null,
    title: '',
    date: null,
    demostrator: null,
    demo_location: null,
};

const form_sample = reactive(Object.assign({},form_sample_DEFAULT));

const form_sample_INVALIDATE_DEFAULT = {
    title: false,
    date: false,
    demostrator: false,
    demo_location: false,
};

const form_sample_invalidate = reactive(Object.assign({},form_sample_INVALIDATE_DEFAULT));

/**
 * {
    "title": "DEMO WINDIXIE 05-19-2023",
    "demostrator": 1,
    "demo_date": "2023-05-13",
    "demo_hours": "14:30:34",
    "demo_location": 164,
    "status": "publish"
}
*/


/**
 * END CONSTANS
 */


/**
 * METHODS
 */

function callbackChangePagination(page){
    pagination.page = page;

    getSamples();
}

function openNewSample() {
	
	Object.assign(form_sample,form_sample_DEFAULT);
    show_modal_sample.value = true;
	
}

function openEditSample(sample){

    form_sample.id = sample.id;
    form_sample.title = sample.title.rendered;
    form_sample.date = dayjs(sample.demo_date+' '+sample.demo_hours).format('ddd MMM D YYYY HH:mm:ss [GMT]Z (z)');
    form_sample.demostrator = sample.demostrator[0].id;
    form_sample.demo_location = sample.demo_location[0].id;
    show_modal_sample.value = true;

}

function closeModalNewUser() {

    show_modal_sample.value = false;
}

function validateFormSample() {

    let error = false;

    if (!form_sample.title || form_sample.title === '') {
        form_sample_invalidate.title = true;
        error = true;
    } else {
        form_sample_invalidate.title = false;
    }

    if (!form_sample.date || form_sample.date === '') {
        form_sample_invalidate.date = true;
        error = true;
    } else {
        form_sample_invalidate.date = false;
    }

    if (!form_sample.demostrator || form_sample.demostrator === '') {
        form_sample_invalidate.demostrator = true;
        error = true;
    } else {
        form_sample_invalidate.demostrator = false;
    }

    if (!form_sample.demo_location || form_sample.demo_location === '') {
        form_sample_invalidate.demo_location = true;
        error = true;
    } else {
        form_sample_invalidate.demo_location = false;
    }

    if (error) {
        return;
    }

    if(form_sample.id){
        sendUpdateSample();
    }else{
        sendCreateSimple();
    }
}

function showModalDelete(product) {

    sample_selected.value = product;
    modalDelete.value.show();
}

async function sendCreateSimple() {

    is_creating.value = true;

    let params = {
        title: form_sample.title,
        demostrator: form_sample.demostrator,
        demo_location: form_sample.demo_location,
        demo_date: dayjs(form_sample.date).format("YYYY-MM-DD"),
        demo_hours: dayjs(form_sample.date).format("HH:mm:ss"),
        status: "publish"
    };  

    const response = await endpoint.createSample(params);

    if(response.status === 201){
        
        is_creating.value = false;

        table_data.value.unshift(response.data);

        show_modal_sample.value = false;
        successNotification.value.showToast('Se realizó el registro correctamente','Correcto');
    }else{
        is_creating.value = false;
        console.error('Error en la solicitud');
        warningNotification.value.showToast(response.message,'¡Ocurrio un error!');
    }
}

async function sendUpdateSample() {

    is_creating.value = true;

    let params = {
        title: form_sample.title,
        demostrator: form_sample.demostrator,
        demo_location: form_sample.demo_location,
        demo_date: dayjs(form_sample.date).format("YYYY-MM-DD"),
        demo_hours: dayjs(form_sample.date).format("HH:mm:ss"),
        status: "publish"
    };  

    const response = await endpoint.updateSample(form_sample.id,params);

    if(response.status === 200){

        let index = table_data.value.findIndex(elm => elm.id == form_sample.id);
        
        table_data.value[index] = response.data;

        is_creating.value = false;

        show_modal_sample.value = false;

        successNotification.value.showToast('Se actualizó el registro correctamente','Correcto');
    }else{
        is_creating.value = false;

        warningNotification.value.showToast('Por favor conectarse con el administrador','¡Ocurrio un error!');
    }
}

async function sendDeleteSample() {

    try{
        deleting.value = true;

        const response = await endpoint.deleteSample(sample_selected.value.id);

        deleting.value = false;

        if(response.status === 200){

            let index = table_data.value.findIndex(elm => elm.id == sample_selected.value.id);

            table_data.value.splice(index,1);

            modalDelete.value.hide();

            successNotification.value.showToast('Se eliminó el registro correctamente','Correcto');

            sample_selected.value = null;
        }else{
            
            modalDelete.value.hide();

            warningNotification.value.showToast('Por favor conectarse con el administrador','¡Ocurrio un error!');
        }
    }catch(error){

        modalDelete.value.hide();
        warningNotification.value.showToast('Por favor conectarse con el administrador','¡Ocurrio un error!');

    }
    

}

async function getSamples() {

    searching.value = true;
    try {
        const response = await endpoint.getSamples(search.value,pagination.page,pagination.limit);
        if (response.status === 200) {

            table_data.value = response.data;

            pagination.total = response.data.length;
            searching.value = false;
        } else {
            console.error('Error en la solicitud');
            searching.value = false;
        }
    } catch (error) {
        console.error(error);
        warningNotification.value.showToast('Por favor conectarse con el administrador','¡Ocurrio un error!');
        searching.value = false;
    }

}

async function getLocations() {

    try {
        const response = await endpoint.getLocationSamples(search.value,pagination.page,pagination.limit);
        if (response.status === 200) {
            
            locations_lists.value = response.data.map(elm => {
                return {
                    id: elm.id,
                    location_title: elm.title.rendered
                }
            });

        } else {
            console.error('Error en la solicitud');
        }
    } catch (error) {
        console.error(error);
        warningNotification.value.showToast('Por favor conectarse con el administrador','¡Ocurrio un error!');
    }

}

async function getUsers() {

    try {
        const response = await endpoint.getUsersSample(search.value,pagination.page,pagination.limit);
        if (response.status === 200) {
            users_lists.value = response.data.map(elm => {
                return {
                    id: elm.id,
                    name: elm.name
                }
            });

        } else {
            console.error('Error en la solicitud');
        }
    } catch (error) {
        warningNotification.value.showToast('Por favor conectarse con el administrador','¡Ocurrio un error!');
    }
}

/**
 * END METHODS
 */

/**
 * BEGIN COMPUTED
 */

const modalDelete = ref();
provide("bind[modal-delete-ref]", (el) => {
  // Binding
  modalDelete.value = el;
});

const successNotification = ref();
provide("bind[successNotification]", (el) => {
  // Binding
  successNotification.value = el;
});

const warningNotification = ref();
provide("bind[warningNotification]", (el) => {
  // Binding
  warningNotification.value = el;
});


/**
 * END COMPUTED
 */

//Mounted
onMounted(() => {
    getSamples();
    getLocations();
    getUsers();
});

</script>