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
                    <th class="whitespace-nowrap text-center">DEMOSTRATOR</th>
                    <th class="whitespace-nowrap text-center">DATE</th>
                    <th class="whitespace-nowrap text-center">LOCATION</th>
                    <th class="whitespace-nowrap text-center">UNITS SOLD</th>
                    <th class="whitespace-nowrap text-center">SAMPLES</th>
                    <th class="text-center whitespace-nowrap">ACTIONS</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="sample in table_data" :key="sample.id" class="intro-x">
                    <td class="w-40">
                        <span>{{ sample.demostrator ? sample.demostrator[0].user_nicename : 'Not found'}}</span>
                    </td>
                    <td class="w-40">
                        <span class="font-medium ">{{ sample.demo_date }}</span>
                    </td>
                    <td class="w-40 text-center">
                        <span class="">{{ sample.demo_location ? sample.demo_location[0].post_title : ''}}</span>
                    </td>
                    <td class="w-40 text-center">
                        <span class=" ">{{ sample.total_units_sold }}</span>
                    </td>
                    <td class="w-40 text-center">
                        <span class="">{{ sample.cantidad_clientes }}</span>
                    </td>
                    <td class="table-report__action w-56">
                        <div class="flex justify-center items-center">
                            <a class="flex items-center mr-3" href="javascript:;" @click="getDataPDF(sample)" v-if="sample.acf.consumer">
                                <DownloadIcon class="w-4 h-4 mr-1" /> PDF
                            </a>
                            <a class="flex items-center mr-3" href="javascript:;" @click="openEditSample(sample)">
                                <CheckSquareIcon class="w-4 h-4 mr-1" /> Edit
                            </a>
                            <a class="flex items-center text-danger" href="javascript:;" @click="showModalDelete(sample)">
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
                        <!--select 
							id="product_brand" 
							class="form-control w-full" 
                            v-model="form_sample.demo_location" 
							:class="{ 'invalid': form_sample_invalidate.demo_location }" 
						>
							<option v-for="location in locations_lists" :key="location.id" :value="location.id">{{location.location_title}}</option>
						</select-->
                        <v-select 

                            v-model="form_sample.demo_location" 
                            :reduce="(location) => location.id"
                            :options="locations_lists" 
                            label="location_title" 
                            class="form-control w-full" 
                            @search="getLocations"
                            ></v-select>
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
import html2pdf from 'html2pdf.js';
import _ from "lodash";

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

            pagination.total = parseInt(response.data[0].sample_count);
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

/*async function getLocations() {

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

}*/

const getLocations  =  _.debounce(function(search,loading){

			if(!search && loading){
				return;
			}
			if(loading){
				loading(true);
			}

			endpoint.getLocationSamples(search).then(res => {
                loading(false);
                if (res.status === 200) {
                
                    locations_lists.value = res.data.map(elm => {
                        return {
                            id: elm.id,
                            location_title: elm.title.rendered
                        }
                    });

                } else {
                    console.error('Error en la solicitud');
                }
            });
            
		},500);

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

function generateHtml (data,firma_base_64) {

    let table_product = "";

    for(let i in data.acf.products){
        let shop = data.acf.products[i];
        let product = shop.product[0]; 
        table_product += `<tr >
            <td class="not-border-left not-border-bot">${product.post_title}</td>
            <td class="not-border-left not-border-bot">${shop.star_inventory}</td>
            <td class="not-border-left not-border-bot">${shop.ending_inventory}</td>
            <td class="not-border-left not-border-bot">${shop.unitis_sold}</td>
            <td class="not-border-left not-border-bot">${shop.price}</td>
            <td class="not-border-left not-border-bot not-border-rigth">${shop.special_price}</td>
        </tr> `;
    }

    let hour_samples_arr = ['00','00','00'];

    if(data.best_hour){
        console.log(typeof data.best_hour);
        hour_samples_arr = data.best_hour.split(':'); 
    }

    return `
            <style type="text/css">

    .container{
        padding: 0.5em;
    }
    table
    {
        border: 1px solid;
        width: 100%;
        border-collapse: collapse;
        border-spacing:0;
        font-family: a
    }
    .not-border-top{
        border-top: 0px;
    }
    .not-border-bot{
        border-bottom: 0px;
    }

    .td-borders td{
        border: 0.1px solid;
    }

    
    td
    {
        padding:10px 5px;
    }

    .border-left
    {
        border-left: 1px solid black;
    }
    .border-top
    {
        border-top: 1px solid black;
    }

    .all-border{
        border: 1px solid black;
    }
    .all-border-rigth{
        border-left: 1px solid black;
        border-bottom: 1px solid black;
        border-top: 1px solid black;
    }

    .not-border{
        border: 0px !important;
    }
    .not-border-bot{
        border-bottom: 0px !important;
    }
    .not-border-left{
        border-left: 0px !important;
    }
    .not-border-rigth{
        border-right: 0px !important;
    }



    .titulo{
        font-size: 20pt;
        color: black;
        font-weight: bold;
    }

    .mt-5{
        margin-top: 5em;
    }
    
    .text-center{
        text-align: center
    }
</style>
<div class="container" >
    <table tyle="width:100%">
        <tr>
            <td style="width:30%">
                <img src="/src/assets/images/logohedvid.png" style="width:100%"/>
            </td>
            <td class="text-center border-left" style="width:40%">
                <h1 class="titulo">DEMO REFORMACE FORM</h1><br>
                <span class="mt-5">(Información del Demo)</span>
            </td>
            <td class="text-center border-left" style="width:30%">
                <span>B-F_002-18</span>
            </td>
        </tr>
        <tr>
            <td class="text-center border-top" colspan="3">
                <span> INFORMATION / INFORMACION </span>
            </td>
        </tr>
    </table>
    <table class="not-border-top not-border-bot not-border-td" style="width:100%">
        <tr >
            <td></td>
            <td></td>
        </tr>
        <tr >
            <td class="not-border" style="width:25%">
                <span>Demostrator Name: (nombre del demostrador)</span>
            </td>
            <td class="all-border-rigth" style="width:75%">
                <span>${data.demostrator[0].demostratorname} ${data.demostrator[0].demostratorlastname}</span>
            </td>
        </tr>
    </table>
    <table class="not-border-top not-border-bot not-border-td" style="width:100%">
        <tr >
            <td></td>
            <td></td>
            <td></td>
            <td></td>
        </tr>
        <tr>
            <td class="not-border" style="width:25%">
                <span>	Demo Date: (fecha del Demo)</span>
            </td>
            <td class="all-border" style="width:25%">
                <span>${data.demo_date}</span>
            </td>
            <td class="not-border" style="width:25%">
                <span>Demo Hours: (horas demo)</span>
            </td>
            <td class="all-border-rigth" style="width:25%">
                <span>${data.demo_hours}</span>
            </td>
        </tr>
    </table>
    <table class="not-border-top not-border-bot not-border-td" style="width:100%">
        <tr >
            <td></td>
            <td></td>
        </tr>
        <tr >
            <td class="not-border" style="width:25%">
                <span>Store Name: (nombre de la tienda)</span>
            </td>
            <td class="all-border-rigth" style="width:75%">
                <span>${data.demo_location[0] ? data.demo_location[0].post_title : '-'}</span>
            </td>
        </tr>
    </table>
    <table class="not-border-top not-border-td not-border-bot" style="width:100%">
        <tr >
            <td></td>
            <td></td>
        </tr>
        <tr >
            <td class="not-border" style="width:25%">
                <span>Adress: ( Dirección)</span>
            </td>
            <td class="all-border-rigth" style="width:75%">
                <span>${data.demo_location[0] ? data.demo_location[0].address : '-'}</span>
            </td>
        </tr>
        <tr >
            <td></td>
            <td></td>
        </tr>
    </table>
    <table class="not-border-top not-border-bot td-borders" style="width:100%">
        <tr >
            <td style="width:30%" class="not-border-left not-border-bot">
                <span>Product (producto)</span>
            </td>
            <td style="width:10%" class="not-border-left not-border-bot">
                <span>Start Inventory (inventario inicial)</span>
            </td>
            <td style="width:10%" class="not-border-left not-border-bot">
                <span>Ending Inventory (inventario FINAL)</span>
            </td>
            <td style="width:10%" class="not-border-left not-border-bot">
                <span>Units Sold (unid. Vendidas)</span>
            </td>
            <td style="width:15%" class="not-border-left not-border-bot">
                <span>Price (precio)</span>
            </td>
            <td style="width:15%" class="not-border-left not-border-rigth not-border-bot">
                <span>Special Price (precio especial)</span>
            </td>
        </tr>
        
        ${table_product}
        
        <tr >
            <td class="not-border-left not-border-bot" style="text-align:right">
                <span>Total</span>
            </td>
            
            <td class="not-border-left "><span>${data.total_start_inventory}</span></td>
            <td class="not-border-left "><span>${data.total_end_inventory}</span></td>
            <td class="not-border-left "><span>${data.total_units_sold}</span></td>
            <td class="not-border-bot not-border-left not-border-rigth"></td>
            <td class="not-border-bot not-border-left not-border-rigth"></td>
        </tr>
    </table>
    <table class="not-border-top not-border-bot not-border-td" style="width:100%">
        <tr >
            <td></td>
            <td></td>
            <td></td>
            <td></td>
        </tr>
        <tr >
            <td></td>
            <td></td>
            <td></td>
            <td></td>
        </tr>
        <tr>
            <td class="not-border" style="width:25%">
                <span># of Samples Give: (# de muestras entregadas)</span>
            </td>
            <td class="all-border" style="width:25%">
                <span>${data.sample_count}</span>
            </td>
            <td class="not-border" style="width:25%">
                <span># of People Sample (# de muestras entregadas a personas)</span>
            </td>
            <td class="all-border-rigth" style="width:25%">
                <span>${data.sample_count}</span>
            </td>
        </tr>
    </table>
    <table class="not-border-top not-border-bot not-border-td" style="width:100%">
        <tr >
            <td></td>
            <td></td>
            <td></td>
            <td></td>
        </tr>
        
        <tr>
            <td class="not-border" style="width:70%">
                <span>Hours of increased delivery or moments of people in the store: ( horas de mayor entrega o movimientos de personas en la tienda)</span>
            </td>
            <td class="all-border" style="width:10%">
                <span>${hour_samples_arr[0]}</span>
            </td>
            <td class="all-border not-border-left not-border-rigth" style="width:10%">
                <span>${hour_samples_arr[1]}</span>
            </td>
            <td class="all-border-rigth" style="width:10%">
                <span>${hour_samples_arr[2]}</span>
            </td>
        </tr>
    </table>
    <table class="not-border-top not-border-bot not-border-td" style="width:100%">
        <tr >
            <td></td>
            <td></td>
            <td></td>
            <td></td>
        </tr>
        
        <tr>
            <td class="" style="width:25%">
                <span>Receptivity (receptividad):	</span>
            </td>
            <td class="" style="width:25%">
                <span>${data.receptivity}</span>
            </td>
            <td class=" " style="width:25%">
               <span>Demo Location: (localizado)</span>
            </td>
            <td class="" style="width:25%">
                <span>${data.demo_location[0] ? data.demo_location[0].address : '-'}</span>
            </td>
        </tr>

        <tr >
            <td></td>
            <td></td>
            <td></td>
            <td></td>
        </tr>

        <tr>
            <td class="" style="width:25%">
                <span>Store Traffic (trafico en la tienda):</span>
            </td>
            <td class="" style="width:25%">
                <span>${data.store_traffic}</span>
            </td>
            <td class=" " style="width:25%">
               <span>Weather (tiempo):</span>
            </td>
            <td class="" style="width:25%">
                <span>${data.weather}</span>
            </td>
        </tr>

        <tr >
            <td></td>
            <td></td>
            <td></td>
            <td></td>
        </tr>

        <tr>
            <td class="" style="width:25%">
                <span>Store Support (soporte de la tienda):</span>
            </td>
            <td class="" style="width:25%">
                <span>${data.store_support}</span>
            </td>
            <td class=" " style="width:25%">
               <span>Display Appearance: (apariencia del exhibidor)	</span>
            </td>
            <td class="" style="width:25%">
                <span>${data.display_appearance}</span>
            </td>
        </tr>
    </table>
    <table class="not-border-top not-border-bot not-border-td" style="width:100%">
        <tr >
            <td></td>
            <td></td>
        </tr>
        
        <tr>
            <td class="" style="width:25%">
                <span>Did of Consumers Know the Brans? (los consumidores conocían la marca):</span>
            </td>
            <td >
                <span>Si ${data.cantidad_yes} (${parseInt(data.porcentaje_yes)}%) ,No ${data.cantidad_no} (${parseInt(data.porcentaje_no)}%)</span>
            </td>
        </tr>

        <tr >
            <td></td>
            <td></td>
        </tr>

        <tr>
            <td class="" style="width:25%">
                <span>They Liked the taste of consumers? (les gusto el sabor a los consumidores):</span>
            </td>
            <td >
                <span>Si ${data.cantidad_gusto_si} (${parseInt(data.porcentaje_gusto_si)}%), No ${data.cantidad_gusto_no} (${parseInt(data.porcentaje_gusto_no)}%)</span>
            </td>
        
        </tr>

        <tr >
            <td></td>
            <td></td>
        </tr>
        
        <tr>
            <td class="" style="width:25%">
                <span>Consumers Country Origin: (país de origen del consumidor)</span>
            </td>
            <td >
                <span>American ${data.cantidad_american} (${parseInt(data.porcentaje_american)}%), Hispanic ${data.cantidad_hispanic} (${parseInt(data.porcentaje_hispanic)}%), Afro ${data.cantidad_african_american} (${parseInt(data.porcentaje_african_american)}%), Otros ${data.cantidad_other} (${parseInt(data.porcentaje_other)}%)</span>
            </td>
        
        </tr>

        <tr >
            <td></td>
            <td></td>
        </tr>
        
        <tr>
            <td class="" style="width:25%">
                <span>Consumers (consumidor):	</span>
            </td>
            <td >
                <span>Childrens ${data.cantidad_childrens} (${parseInt(data.porcentaje_childrens)}%), Youngs ${data.cantidad_young} (${parseInt(data.porcentaje_young)}%), Adults ${data.cantidad_adult} (${parseInt(data.porcentaje_adult)}%), Elderly ${data.cantidad_elderly} (${parseInt(data.porcentaje_elderly)}%)</span>
            </td>
        </tr>
    </table>

    <table class="not-border-top not-border-bot not-border-td" style="width:100%">
        <tr >
            <td></td>
            <td></td>
        </tr>
        
        <tr>
            <td class="" style="width:50%">
                <span>Consumers Comments (comentarios del consumidor)</span>
            </td>
            <td class="all-border-rigth not-border-bot" style="width:50%">
                
            </td>
        
        </tr>
    </table>
    <table class="not-border-top not-border-bot not-border-td" style="width:100%">
        
        <tr>
            <td class="all-border-rigth">
                ${data.end_consumer_comments}
            </td>
        </tr>
    </table>

    <table class="not-border-top not-border-bot not-border-td" style="width:100%">
        <tr >
            <td></td>
            <td></td>
        </tr>
        
        <tr>
            <td class="" style="width:50%">
                <span>		Demostrator Comments (comentarios del demostrador)</span>
            </td>
            <td class="all-border-rigth not-border-bot" style="width:50%">
                
            </td>
        
        </tr>

    </table>
    <table class="not-border-top not-border-bot not-border-td" style="width:100%">
        
        <tr>
            <td class="all-border-rigth" >
                ${data.end_demostrator_comments}
            </td>
        </tr>
    </table>
    <table class="not-border-top not-border-bot not-border-td" style="width:100%">
        <tr >
            <td></td>
        </tr>
        <tr >
            <td></td>
        </tr>
    </table>

    <table class="not-border-top not-border-bot not-border-td" style="width:100%">
        
        <tr>
            <td style="width:100%" class="border-top text-center">
                <span>Store Information (información de l Stamp (sello)</span>
            </td>
        </tr>
        <tr>
            <td style="width:100%" class="border-top">
                <span>	Manager Name / Signature (nombre del gerente / firma):</span>
                <img src="${firma_base_64}" crossorigin="anonymous"/>
            </td>
        </tr>
    </table>
    <table class="not-border-top not-border-td" style="width:100%">
        
        <tr>
            <td style="width:100%" class="border-top">
                <span>Comments About Demo (comentarios sobre el demo):</span>
                <br/>
            </td>
        </tr>
     
    </table>
    
    

</div>

      `;
}

async function generatePdf (data){
	
    let firma_base_64 = await toDataUrl(data.manager_approve.guid);

    const htmlContent = generateHtml(data,firma_base_64);

    // Opciones de configuración para html2pdf
    const options = {
        margin: [0.2, 0.2, 0.2, 0.2],
        filename: `Sample-${data.id}.pdf`,
        image: { type: 'jpeg', quality: 0.20},
        html2canvas: {
            dpi: 192,
            scale:4,
            useCors: false,
        },
        pagebreak: { avoid: ['tr', 'td'] },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };

    // Generar y descargar el PDF
    html2pdf().set(options).from(htmlContent).save();

}

async function getDataPDF(record){

    try{

        let response = await endpoint.pdfSample(record.id);

        if (response.status === 200) {

            generatePdf(response.data);
        } else {
            warningNotification.value.showToast('Por favor conectarse con el administrador','¡Ocurrio un error!');
        }
    }catch(error){
        console.log(error);
        warningNotification.value.showToast('Por favor conectarse con el administrador','¡Ocurrio un error!');
    }
}

const toDataUrl = async function (url, callback) {

    return fetch(url)
        .then(resp => resp.blob())
        .then(blob =>  new Promise((resolve, _) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result);
            reader.readAsDataURL(blob);
        }));
    
};


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
    //getLocations();
    getUsers();
});

</script>