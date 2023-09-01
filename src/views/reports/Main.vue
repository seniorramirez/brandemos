<template>
    <div class="intro-y flex flex-col sm:flex-row items-center mt-8 mb-5">
        <h2 class="text-lg font-medium mr-auto"></h2>

        <div class="w-full sm:w-auto flex mt-4 sm:mt-0">
            
            <button class="btn btn-primary shadow-md mr-2" @click="() => openModal(1)">
                By Dates
            </button>
            <button class="btn btn-primary shadow-md mr-2" @click="() => openModal(2)">
                By Location
            </button>
            <button class="btn btn-primary shadow-md mr-2" @click="() => openModal(3)">
                By Product
            </button>

        </div>
    </div>

    <div class="intro-y box mb-5 p-5">
        
        <table class="table table-report -mt-2">
            <thead>
                <tr>
                    <th class="whitespace-nowrap text-center">PRODUCT</th>
                    <th class="whitespace-nowrap text-center">LOCATION</th>
                    <th class="whitespace-nowrap text-center">QUANTITY</th>
                    <th class="whitespace-nowrap text-center">DATE</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="data in table_data" :key="data.title" class="intro-x">
                    <td class="w-40">
                        <span class="font-medium ">{{ data.products_detailed ? data.products_detailed[0].product[0].post_title : ''}}</span>
                    </td>
                    <td class="w-40 text-center">
                        <span class="font-medium ">{{ data.location ? data.location.post_title : ''}}</span>
                    </td>
                    <td class="w-40 text-center">
                        <div class="flex flex-col">
                            <div class="flex">
                                <span class="font-medium ">Total Consumers</span>
                                <span class="ml-2">{{data.total_consumers}}</span>
                            </div>
                            <div class="flex">
                                <span class="font-medium ">Total Products</span>
                                <span class="ml-2">{{data.total_products}}</span>
                            </div>
                        </div>
                    </td>
                    <td class="w-40 text-center">
                        <span class="font-medium ">{{ data.date }}</span>
                    </td>
                </tr>
            </tbody>
        </table>

    </div>

    <Modal size="modal-md" backdrop="static" :show="show_modal">

        <ModalBody>

            <div class="intro-y">

                <div class="grid grid-cols-12 gap-x-6 gap-y-4 mb-5">
                    <div class="col-span-12 flex flex-col" v-show="report_selected == 1">
                        <label for="user_name" class="form-label ">Range dates</label>
                        <Litepicker v-model="daterange" :options="{
                                autoApply: false,
                                singleMode: false,
                                numberOfColumns: 2,
                                numberOfMonths: 2,
                                showWeekNumbers: true,
                                dropdowns: {
                                    minYear: 1990,
                                    maxYear: null,
                                    months: true,
                                    years: true,
                                },
                            }" 
                            class="block w-full" />
                    </div>
                    <div class="col-span-12 flex flex-col" v-show="report_selected == 2">
                        <label for="user_email" class="form-label">Location *</label>
                       
                        <v-select 

                            v-model="location_selected" 
                            :reduce="(location) => location.id"
                            :options="locations" 
                            label="location_title" 
                            class="form-control w-full" 
                            @search="getLocations"
                            ></v-select>
                        <span class="text-xs mt-2 text-danger" v-show="location_selected_validation">Field is required</span>                            
                    </div>
                    <div class="col-span-12 flex flex-col" v-show="report_selected == 3">
                        <label for="user_name" class="form-label ">Product *</label>
                        <v-select 

                            v-model="product_selected" 
                            :reduce="(product) => product.id"
                            :options="products" 
                            label="location_title" 
                            class="form-control w-full" 
                            @search="getProducts"
                            ></v-select>
                        <span class="text-xs mt-2 text-danger" v-show="product_selected_validation">Field is required</span>    
                    </div>

                    <div class="col-span-12 flex flex-col">
                        <label><input type="checkbox" class="form-check-input" id="cbox1" value="first_checkbox" v-model="check_download" />&nbsp; Download CSV</label>
                    </div>
                  
                </div>
            </div>
        </ModalBody>
        <ModalFooter>
            <button type="button" @click="closeModal" class="w-20 mr-1 btn btn-outline-secondary">
                Cancel
            </button>
            <button type="button" class="btn btn-primary" :disabled="is_creating" @click="filterReport">
                Filter
                <LoadingIcon icon="oval" class="ml-1" color="white" v-show="is_creating" />
            </button>
        </ModalFooter>
    </Modal>

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
const show_modal = ref(false);
const is_creating = ref(false);
const report_selected = ref(0);

const daterange = ref([]);
const locations = ref([]);
const location_selected = ref(null);
const location_selected_validation = ref(false);
const products = ref([]);
const product_selected = ref(null);
const product_selected_validation = ref(false);

const check_download = ref(false);

/**
 * END CONSTANS
 */


/**
 * METHODS
 */

function openModal(report) {
    
    report_selected.value = report;
    show_modal.value = true;
	
}

function closeModal() {

    show_modal.value = false;
}

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
        
            locations.value = res.data.map(elm => {
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


const getProducts  =  _.debounce(function(search,loading){

    if(!search && loading){
        return;
    }
    if(loading){
        loading(true);
    }

    endpoint.getProductReport(search).then(res => {
        loading(false);
        if (res.status === 200) {
        
            products.value = res.data.map(elm => {
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

function filterReport(){

    let date_initial = null;
    let date_end = null;

    let response = null;

    if(report_selected.value == 1){

        let dates = daterange.value.split('-');
        date_initial = dayjs(dates[0]).format("YYYY-MM-DD").toString();
        date_end = dayjs(dates[1]).format("YYYY-MM-DD").toString();
        
        response = endpoint.getReportDates(date_initial,date_end,check_download.value);
    }

    if(report_selected.value == 2){
        if(location_selected.value){
            response = endpoint.getReportLocation(location_selected.value,check_download.value);
        }else{
            location_selected_validation.value = true;
            warningNotification.value.showToast('Fields required','Warning!');
            return;
        }
    }

    
    if(report_selected.value == 3){
       if(product_selected.value){
            response = endpoint.getReportProduct(product_selected.value,check_download.value);
        }else{
            product_selected_validation.value = true;
            warningNotification.value.showToast('Fields required','Warning!');
            return;
        }
    }

    if(check_download.value){
        window.open(response, "_blank");
        closeModal();
        return;
    }

    is_creating.value = true;
    
    response.then(res => {
        
        is_creating.value = false;
        table_data.value = res.data.results;

        closeModal();
    });
    
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

});

</script>