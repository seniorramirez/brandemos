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
                <button class="btn btn-primary shadow-md ml-2" @click="getBrands" :disabled="searching">
                    {{searching ? 'Searching' : 'Search'}}
                </button>
            </div>

            <!-- END: Search -->

            <!-- BEGIN: New Button -->
            <button class="btn btn-primary shadow-md mr-2" @click="openNewBrand">
                <PlusIcon class="w-4 h-4 ml-0.5 mr-1" />
                Add Brand
            </button>
            <!-- END: New Button -->

        </div>
    </div>

    <div class="intro-y box mb-5 p-5">
        
        <table class="table table-report -mt-2">
            <thead>
                <tr>
                    <th class="whitespace-nowrap">BRAND NAME</th>
                    <th class="text-center whitespace-nowrap">ACTIONS</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="product in table_data" :key="product.id" class="intro-x">
                    <td >
                        <a href="" class="font-medium whitespace-nowrap">{{ product.name}}</a>
                    </td>
                    <td>
                        <div class="flex justify-center items-center">
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

    <Modal size="modal-md" backdrop="static" :show="show_modal_brand">
        <ModalHeader>
            <h2 class="mr-auto text-base font-medium">
                {{form_brand.id ? 'Update brand' : 'Add brand' }}
            </h2>
        </ModalHeader>
        <ModalBody>

            <div class="intro-y">

                <div class="grid grid-cols-12 gap-x-6 gap-y-4 mb-5">
                    <div class="col-span-12 flex flex-col">
                        <label for="product_name" class="form-label ">Brand Name *</label>
                        <input id="product_name" type="text" class="form-control w-full " 
                            v-model="form_brand.name" :class="{ 'invalid': form_brand_invalidate.name }" />
                        <span class="text-xs mt-2 text-danger" v-show="form_brand_invalidate.name">Field is
                            required</span>
                    </div>
                   
                </div>
            </div>
        </ModalBody>
        <ModalFooter>
            <button type="button" @click="closeModalNewProduct" class="w-20 mr-1 btn btn-outline-secondary">
                Cancel
            </button>
            <button type="button" class="btn btn-primary" :disabled="is_creating" @click="validateFormBrand">
                {{ form_brand.id ? 'Update brand' : 'Add Brand' }}
                <LoadingIcon icon="oval" class="ml-1" color="white" v-show="is_creating" />
            </button>
        </ModalFooter>
    </Modal>

    <ModalDelete :modal="modalDelete" refKey="modal-delete-ref" :callback="sendDeleteProduct" :deleting="deleting" />

    <SuccessNotification refKey="successNotification"/>
    <WarningNotification refKey="warningNotification" />
</template>


<script setup>

import { ref, onMounted, provide, computed, reactive, getCurrentInstance } from "vue";
import Swal from 'sweetalert2';
import axios from 'axios';
import endpoint from "../../utils/endpoint";


/**
 * CONSTANS
 */

const brand_list = ref([]);
const table_data = ref([]);

const product_brand = ref(null);
const deleting = ref(false);

const pagination = reactive({
    total: 0,
    limit: 15,
    page: 1,
});

const search = ref("");
const searching = ref(false);



//MODAL NEW PRODUCT
const show_modal_brand = ref(false);
const is_creating = ref(false);

const form_brand_DEFAULT = {
    id:null,
    name: '',
};

const form_brand = reactive(Object.assign({},form_brand_DEFAULT));

const form_brand_invalidate_DEFAULT = {
    name: false,
};

const form_brand_invalidate = reactive(Object.assign({},form_brand_invalidate_DEFAULT));


/**
 * END CONSTANS
 */


/**
 * METHODS
 */

function callbackChangePagination(page){
    pagination.page = page;

    getBrands();
}


function openNewBrand() {
	
	Object.assign(form_brand,form_brand_DEFAULT);
    show_modal_brand.value = true;
	
}

function openEditProduct(product){

    form_brand.id = product.id;
    form_brand.name = product.product_name;
    form_brand.brand = product.brand_id;
    form_brand.barcode = product.bar_code;
    show_modal_brand.value = true;

}

function closeModalNewProduct() {

    show_modal_brand.value = false;
}

function validateFormBrand() {

    let error = false;

    if (!form_brand.name || form_brand.name === '') {
        form_brand_invalidate.name = true;
        error = true;
    } else {
        form_brand_invalidate.name = false;
    }

    if (error) {
        return;
    }

    if(form_brand.id){
        sendUpdateBrand();
    }else{
        sendCreateBrand();
    }
}

function showModalDelete(product) {

    product_brand.value = product;
    modalDelete.value.show();
}

async function sendCreateBrand() {

    is_creating.value = true;

    let params = {
        name: form_brand.name
    };

    const response = await endpoint.createBrand(params);

    if(response.status === 201){
        table_data.value.unshift(response.data);

        is_creating.value = false;

        show_modal_brand.value = false;
        successNotification.value.showToast('Se realizó el registro correctamente','Correcto');
    }else{
        is_creating.value = false;
        console.error('Error en la solicitud');
        warningNotification.value.showToast('Por favor conectarse con el administrador','¡Ocurrio un error!');
    }
}

async function sendUpdateBrand() {

    is_creating.value = true;

    let params = {
        title: form_brand.name,
        brand: form_brand.brand,
        product_barcode_number: form_brand.barcode,
        status: "publish"
    };

    const response = await endpoint.updateProduct(form_brand.id,params);

    if(response.status === 200){

        let index = table_data.value.findIndex(elm => elm.id == form_brand.id);
        
        table_data.value[index] = {
            id: response.data.id,
            product_name: response.data.title.rendered,
            bar_code: response.data.product_barcode_number, 
            brand_id: response.data.brand[0],
            brand: brand_list.value.filter(elm => response.data.brand[0] == elm.id)[0]
        };

        is_creating.value = false;

        show_modal_brand.value = false;

        successNotification.value.showToast('Se actualizó el registro correctamente','Correcto');
    }else{
        is_creating.value = false;

        warningNotification.value.showToast('Por favor conectarse con el administrador','¡Ocurrio un error!');
    }
}

async function sendDeleteProduct() {

     
    try{
        deleting.value = true;

        const response = await endpoint.deleteBrand(product_brand.value.id);

        deleting.value = false;

        if(response.status === 200){

            let index = table_data.value.findIndex(elm => elm.id == product_brand.value.id);

            table_data.value.splice(index,1);

            modalDelete.value.hide();

            successNotification.value.showToast('Se eliminó el registro correctamente','Correcto');

            product_brand.value = null;
        }else{
            
            modalDelete.value.hide();

            warningNotification.value.showToast('Por favor conectarse con el administrador','¡Ocurrio un error!');
        }
    }catch(error){

        modalDelete.value.hide();
        warningNotification.value.showToast('Por favor conectarse con el administrador','¡Ocurrio un error!');

    }
    

}

async function getBrands() {

    searching.value = true;
    try {
        const response = await endpoint.getBrands(search.value,pagination.page,pagination.limit);
        if (response.status === 200) {
            table_data.value = response.data.map(elm => {
                return {
                    id: elm.id,
                    name: elm.name,
                }
            });

            pagination.total = parseInt(response.data[0].brand_count);
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
    getBrands();
});

</script>