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
                <button class="btn btn-primary shadow-md ml-2" @click="getLocations" :disabled="searching">
                    {{searching ? 'Searching' : 'Search'}}
                </button>
            </div>

            <!-- END: Search -->

            <!-- BEGIN: New Button -->
            <button class="btn btn-primary shadow-md mr-2" @click="openNewLocation">
                <MapIcon class="w-4 h-4 ml-0.5 mr-1" />
                Add Location
            </button>
            <!-- END: New Button -->

        </div>
    </div>

    <div class="intro-y box mb-5 p-5">
        
        <table class="table table-report -mt-2">
            <thead>
                <tr>
                    <th class="whitespace-nowrap">LOCATION NAME</th>
                    <th class="whitespace-nowrap">ADDRESS</th>
                    <th class="text-center whitespace-nowrap">CITY</th>
                    <th class="text-center whitespace-nowrap">ZIP</th>
                    <th class="text-center whitespace-nowrap">ACTIONS</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="product in table_data" :key="product.id" class="intro-x">
                    <td class="w-40">
                        <a href="" class="font-medium whitespace-nowrap">{{ product.location_title}}</a>
                    </td>
                    <td class="w-40">
                        <a href="" class="font-medium">{{ product.address }}</a>
                    </td>
                    <td class="w-40 text-center">
                        <a href="" class="font-medium whitespace-nowrap">{{ product.city }}</a>
                    </td>
                    <td class="w-40 text-center">
                        <a href="" class="font-medium whitespace-nowrap">{{ product.zip_code }}</a>
                    </td>
                    <td class="table-report__action w-56">
                        <div class="flex justify-center items-center">
                            <a class="flex items-center mr-3" href="javascript:;" @click="openEditLocation(product)">
                                <CheckSquareIcon class="w-4 h-4 mr-1" /> Edit
                            </a>
                            <a class="flex items-center text-danger" href="javascript:;" @click="showModalDelete(product)">
                                <Trash2Icon class="w-4 h-4 mr-1" /> Delete
                            </a>
                        </div>
                    </td>
                </tr>
            </tbody>
        </table>
        <Pagination :total="pagination.total" :limit="pagination.limit" :change="callbackChangePagination" />

    </div>

    <Modal size="modal-lg" backdrop="static" :show="show_modal_location">
        <ModalHeader>
            <h2 class="mr-auto text-base font-medium">
                {{form_location.id ? 'Update Location' : 'Add Location' }}
            </h2>
        </ModalHeader>
        <ModalBody>

            <div class="intro-y">

                <div class="grid grid-cols-12 gap-x-6 gap-y-4 mb-5">
                    <div class="col-span-12 flex flex-col">
                        <label for="location_title" class="form-label ">Location name *</label>
                        <input id="location_title" type="text" class="form-control w-full" v-model="form_location.title" :class="{ 'invalid': form_location_invalidate.title }" />
                        <span class="text-xs mt-2 text-danger" v-show="form_location_invalidate.title">
                            Field is required
                        </span>
                    </div>
                    <div class="col-span-12 ">
                        <label for="product_brand" class="form-label">City *</label>
                         <input id="location_title" type="text" class="form-control w-full" v-model="form_location.city" :class="{ 'invalid': form_location_invalidate.city }" />

                        <span class="text-xs mt-2 text-danger" v-show="form_location_invalidate.city">
							Field is required
						</span>
                    </div>
                    <div class="col-span-12 ">
                        <label for="product_brand" class="form-label">Zip code *</label>
                        <input id="location_title" type="text" class="form-control w-full" v-model="form_location.zip_code" :class="{ 'invalid': form_location_invalidate.zip_code }" />

                        <span class="text-xs mt-2 text-danger" v-show="form_location_invalidate.zip_code">
							Field is required
						</span>
                    </div>
                    
                    <div class="col-span-12 ">
                        <label for="product_brand" class="form-label">Address *</label>
                        <input id="location_title" type="text" class="form-control w-full" v-model="form_location.address" disabled :class="{ 'invalid': form_location_invalidate.address }" />

                        <span class="text-xs mt-2 text-danger" v-show="form_location_invalidate.address">
							Field is required
						</span>
                    </div>

                    <div class="col-span-12 ">
                        <LeafletMap class="h-[310px] mt-5 rounded-md bg-slate-200" :callbackSearch="callbackSearchGeo"/>
                    </div>
                    
                </div>
            </div>
        </ModalBody>
        <ModalFooter>
            <button type="button" @click="closeModalNewLocation" class="w-20 mr-1 btn btn-outline-secondary">
                Cancel
            </button>
            <button type="button" class="btn btn-primary" :disabled="is_creating" @click="validateFormLocation">
                {{ form_location.id ? 'Update location' : 'Add location' }}
                <LoadingIcon icon="oval" class="ml-1" color="white" v-show="is_creating" />
            </button>
        </ModalFooter>
    </Modal>

    <ModalDelete :modal="modalDelete" refKey="modal-delete-ref" :callback="sendDeleteLocation" :deleting="deleting" />

    <SuccessNotification refKey="successNotification"/>
    <WarningNotification refKey="warningNotification" />
</template>


<script setup>

import { ref, onMounted, provide, computed, reactive, getCurrentInstance } from "vue";
import Swal from 'sweetalert2';
import axios from 'axios';
import endpoint from "../../utils/endpoint";
import L from "leaflet";
import * as GeoSearch from 'leaflet-geosearch';


/**
 * CONSTANS
 */

const mapRef = ref();

const brand_list = ref([]);
const table_data = ref([]);

const location_selected = ref(null);
const deleting = ref(false);

const pagination = reactive({
    total: 0,
    limit: 15,
    page: 1,
});

const search = ref("");
const searching = ref(false);



//MODAL NEW PRODUCT
const show_modal_location = ref(false);
const is_creating = ref(false);

const form_location_DEFAULT = {
    id:null,
    title: "",
    address: "",
    city: "",
    zip_code: "",
    lat: "",
    long: ""
};

const form_location = reactive(Object.assign({},form_location_DEFAULT));

const form_location_INVALIDATE_DEFAULT = {
    title: false,
    address: false,
    city: false,
    zip_code: false,
};

const form_location_invalidate = reactive(Object.assign({},form_location_INVALIDATE_DEFAULT));


/**
 * END CONSTANS
 */


/**
 * METHODS
 */

function callbackChangePagination(page){
    pagination.page = page;

    getLocations();
}

function callbackSearchGeo(location){
    form_location.address = location.location.label;
    form_location.lat = location.location.y;
    form_location.long = location.location.x;
}

function openNewLocation() {
	
	Object.assign(form_location,form_location_DEFAULT);
    show_modal_location.value = true;
	
}

function openEditLocation(location){

    form_location.id = location.id;
    form_location.title = location.location_title;
    form_location.address = location.address;
    form_location.city = location.city;
    form_location.zip_code = location.zip_code;
    show_modal_location.value = true;
}

function closeModalNewLocation() {

    show_modal_location.value = false;
}

function validateFormLocation() {

    let error = false;

    if (!form_location.title || form_location.title === '') {
        form_location_invalidate.title = true;
        error = true;
    } else {
        form_location_invalidate.title = false;
    }

    if (!form_location.address || form_location.address === '') {
        form_location_invalidate.address = true;
        error = true;
    } else {
        form_location_invalidate.address = false;
    }

    if (!form_location.city || form_location.city === '') {
        form_location_invalidate.city = true;
        error = true;
    } else {
        form_location_invalidate.city = false;
    }

    if (!form_location.zip_code || form_location.zip_code === '') {
        form_location_invalidate.zip_code = true;
        error = true;
    } else {
        form_location_invalidate.zip_code = false;
    }

    if (error) {
        return;
    }

    if(form_location.id){
        sendUpdateLocation();
    }else{
        sendCreateLocation();
    }
}

function showModalDelete(location) {

    location_selected.value = location;
    modalDelete.value.show();
}

async function sendCreateLocation() {

    is_creating.value = true;

    let params = {
        title: form_location.title,
        address: form_location.address,
        city: form_location.city,
        zip_code: form_location.zip_code,
        lat: form_location.lat,
        long: form_location.long,
        status: "publish"
    };

    const response = await endpoint.createLocation(params);

    if(response.status === 201){
        table_data.value.unshift({
            id: response.data.id,
            location_title: response.data.title.rendered,
            address: response.data.address, 
            city: response.data.city,
            zip_code: response.data.zip_code
        });

        is_creating.value = false;

        show_modal_location.value = false;
        successNotification.value.showToast('Se realizó el registro correctamente','Correcto');
    }else{
        is_creating.value = false;
        console.error('Error en la solicitud');
        warningNotification.value.showToast('Por favor conectarse con el administrador','¡Ocurrio un error!');
    }
}

async function sendUpdateLocation() {

    is_creating.value = true;

    let params = {
        title: form_location.title,
        address: form_location.address,
        city: form_location.city,
        zip_code: form_location.zip_code,
        lat: form_location.lat,
        long: form_location.long,
        status: "publish"
    };

    const response = await endpoint.updateLocation(form_location.id,params);

    if(response.status === 200){

        let index = table_data.value.findIndex(elm => elm.id == form_location.id);
        
        table_data.value[index] = {
            id: response.data.id,
            location_title: response.data.title.rendered,
            address: response.data.address, 
            city: response.data.city,
            zip_code: response.data.zip_code
        };

        is_creating.value = false;

        show_modal_location.value = false;

        successNotification.value.showToast('Se actualizó el registro correctamente','Correcto');
    }else{
        is_creating.value = false;

        warningNotification.value.showToast('Por favor conectarse con el administrador','¡Ocurrio un error!');
    }
}

async function sendDeleteLocation() {

    try{
        deleting.value = true;

        const response = await endpoint.deleteLocation(location_selected.value.id);

        deleting.value = false;

        if(response.status === 200){

            let index = table_data.value.findIndex(elm => elm.id == location_selected.value.id);

            table_data.value.splice(index,1);

            modalDelete.value.hide();

            successNotification.value.showToast('Se eliminó el registro correctamente','Correcto');

            location_selected.value = null;
        }else{
            
            modalDelete.value.hide();

            warningNotification.value.showToast('Por favor conectarse con el administrador','¡Ocurrio un error!');
        }
    }catch(error){

        modalDelete.value.hide();
        warningNotification.value.showToast('Por favor conectarse con el administrador','¡Ocurrio un error!');

    }
    
}

async function getLocations() {

    searching.value = true;
    try {
        const response = await endpoint.getLocation(search.value,pagination.page,pagination.limit);
        if (response.status === 200) {
            
            table_data.value = response.data.map(elm => {
                return {
                    id: elm.id,
                    location_title: elm.title.rendered,
                    address: elm.address, 
                    city: elm.city,
                    zip_code: elm.zip_code
                }
            });

            pagination.total = parseInt(response.data[0].location_count);
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
    getLocations();


});

</script>