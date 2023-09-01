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
                <button class="btn btn-primary shadow-md ml-2" @click="getProducts" :disabled="searching">
                    {{searching ? 'Searching' : 'Search'}}
                </button>
            </div>

            <!-- END: Search -->

            <!-- BEGIN: New Button -->
            <button class="btn btn-primary shadow-md mr-2" @click="openNewProduct">
                <PlusIcon class="w-4 h-4 ml-0.5 mr-1" />
                Add Product
            </button>
            <!-- END: New Button -->

        </div>
    </div>

    <div class="intro-y box mb-5 p-5">
        
        <table class="table table-report -mt-2">
            <thead>
                <tr>
                    <th class="text-center whitespace-nowrap">PRODUCT NAME</th>
                    <th class="text-center whitespace-nowrap">BRAND</th>
                    <th class="text-center whitespace-nowrap">BARCODE</th>
                    <th class="text-center whitespace-nowrap">ACTIONS</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="product in table_data" :key="product.id" class="intro-x">
                    <td class="w-40">
                        <span  class="font-medium ">{{ product.product_name}}</span>
                    </td>
                    <td class="w-40">
                        <span  class="">{{ product.brand.name }}</span>
                    </td>
                    <td class="w-40 text-center">
                        <span  class="">{{ product.bar_code }}</span>
                    </td>
                    <td class="table-report__action w-56">
                        <div class="flex justify-center items-center">
                            <a class="flex items-center mr-3" href="javascript:;" @click="openEditProduct(product)">
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

    <Modal size="modal-md" backdrop="static" :show="show_modal_product">
        <ModalHeader>
            <h2 class="mr-auto text-base font-medium">
                {{form_product.id ? 'Update product' : 'Add product' }}
            </h2>
        </ModalHeader>
        <ModalBody>

            <div class="intro-y">

                <div class="grid grid-cols-12 gap-x-6 gap-y-4 mb-5">
                    <div class="col-span-12 flex flex-col">
                        <label for="product_name" class="form-label ">Product Name *</label>
                        <input id="product_name" type="text" class="form-control w-full " 
                            v-model="form_product.name" :class="{ 'invalid': form_product_invalidate.name }" />
                        <span class="text-xs mt-2 text-danger" v-show="form_product_invalidate.name">Field is
                            required</span>
                    </div>
                    <div class="col-span-12 ">
                        <label for="product_brand" class="form-label">Brand *</label>
                        <select 
							id="product_brand" 
							class="form-control w-full" 
                            v-model="form_product.brand" 
							:class="{ 'invalid': form_product_invalidate.brand }" 
						>
							<option v-for="brand in brand_list" :key="brand.id" :value="brand.id">{{brand.name}}</option>
						</select>

                        <span class="text-xs mt-2 text-danger" v-show="form_product_invalidate.brand">
							Field is required
						</span>
                    </div>
                    <div class="col-span-12 ">
                        <label for="product_barcode" class="form-label">Bar code *</label>
                        <input id="product_barcode" type="text" class="form-control w-full" 
                            v-model="form_product.barcode" :class="{ 'invalid': form_product_invalidate.barcode }" />
                        <span class="text-xs mt-2 text-danger" v-show="form_product_invalidate.barcode">Field is
                            required</span>
                    </div>

                </div>
            </div>
        </ModalBody>
        <ModalFooter>
            <button type="button" @click="closeModalNewProduct" class="w-20 mr-1 btn btn-outline-secondary">
                Cancel
            </button>
            <button type="button" class="btn btn-primary" :disabled="is_creating" @click="validateFormProduct">
                {{ form_product.id ? 'Update product' : 'Add Product' }}
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

const product_selected = ref(null);
const deleting = ref(false);

const pagination = reactive({
    total: 0,
    limit: 10,
    page: 1,
});

const search = ref("");
const searching = ref(false);



//MODAL NEW PRODUCT
const show_modal_product = ref(false);
const is_creating = ref(false);

const FORM_PRODUCT_DEFAULT = {
    id:null,
    name: '',
    brand: '',
    barcode: ''
};

const form_product = reactive(Object.assign({},FORM_PRODUCT_DEFAULT));

const FORM_PRODUCT_INVALIDATE_DEFAULT = {
    name: false,
    brand: false,
    barcode: false
};

const form_product_invalidate = reactive(Object.assign({},FORM_PRODUCT_INVALIDATE_DEFAULT));


/**
 * END CONSTANS
 */


/**
 * METHODS
 */

function callbackChangePagination(page){
    pagination.page = page;

    getProducts();
}


function openNewProduct() {
	
	Object.assign(form_product,FORM_PRODUCT_DEFAULT);
    show_modal_product.value = true;
	
}

function openEditProduct(product){

    form_product.id = product.id;
    form_product.name = product.product_name;
    form_product.brand = product.brand_id;
    form_product.barcode = product.bar_code;
    show_modal_product.value = true;

}

function closeModalNewProduct() {

    show_modal_product.value = false;
}

function validateFormProduct() {

    let error = false;

    if (!form_product.name || form_product.name === '') {
        form_product_invalidate.name = true;
        error = true;
    } else {
        form_product_invalidate.name = false;
    }

    if (!form_product.brand || form_product.brand === '') {
        form_product_invalidate.brand = true;
        error = true;
    } else {
        form_product_invalidate.brand = false;
    }

    if (!form_product.barcode || form_product.barcode === '') {
        form_product_invalidate.barcode = true;
        error = true;
    } else {
        form_product_invalidate.barcode = false;
    }

    if (error) {
        return;
    }

    if(form_product.id){
        sendUpdateProduct();
    }else{
        sendCreateProduct();
    }
}

function showModalDelete(product) {

    product_selected.value = product;
    modalDelete.value.show();
}

async function sendCreateProduct() {

    is_creating.value = true;

    let params = {
        title: form_product.name,
        brand: form_product.brand,
        product_barcode_number: form_product.barcode,
        status: "publish"
    };

    const response = await endpoint.createProduct(params);

    if(response.status === 201){
        table_data.value.unshift({
            id: response.data.id,
            product_name: response.data.title.rendered,
            bar_code: response.data.product_barcode_number, 
            brand_id: response.data.brand[0],
            brand: brand_list.value.filter(elm => response.data.brand[0] == elm.id)[0]
        });

        is_creating.value = false;

        show_modal_product.value = false;
        successNotification.value.showToast('Se realizó el registro correctamente','Correcto');
    }else{
        is_creating.value = false;
        console.error('Error en la solicitud');
        warningNotification.value.showToast('Por favor conectarse con el administrador','¡Ocurrio un error!');
    }
}

async function sendUpdateProduct() {

    is_creating.value = true;

    let params = {
        title: form_product.name,
        brand: form_product.brand,
        product_barcode_number: form_product.barcode,
        status: "publish"
    };

    const response = await endpoint.updateProduct(form_product.id,params);

    if(response.status === 200){

        let index = table_data.value.findIndex(elm => elm.id == form_product.id);
        
        table_data.value[index] = {
            id: response.data.id,
            product_name: response.data.title.rendered,
            bar_code: response.data.product_barcode_number, 
            brand_id: response.data.brand[0],
            brand: brand_list.value.filter(elm => response.data.brand[0] == elm.id)[0]
        };

        is_creating.value = false;

        show_modal_product.value = false;

        successNotification.value.showToast('Se actualizó el registro correctamente','Correcto');
    }else{
        is_creating.value = false;

        warningNotification.value.showToast('Por favor conectarse con el administrador','¡Ocurrio un error!');
    }
}

async function sendDeleteProduct() {

     
    try{
        deleting.value = true;

        const response = await endpoint.deleteProduct(product_selected.value.id);

        deleting.value = false;

        if(response.status === 200){

            let index = table_data.value.findIndex(elm => elm.id == product_selected.value.id);

            table_data.value.splice(index,1);

            modalDelete.value.hide();

            successNotification.value.showToast('Se eliminó el registro correctamente','Correcto');

            product_selected.value = null;
        }else{
            
            modalDelete.value.hide();

            warningNotification.value.showToast('Por favor conectarse con el administrador','¡Ocurrio un error!');
        }
    }catch(error){

        modalDelete.value.hide();
        warningNotification.value.showToast('Por favor conectarse con el administrador','¡Ocurrio un error!');

    }
    

}

async function getProducts() {

    searching.value = true;
    try {
        const response = await endpoint.geProducts(search.value,pagination.page,pagination.limit);
        if (response.status === 200) {
            table_data.value = response.data.map(elm => {
                return {
                    id: elm.id,
                    product_name: elm.title.rendered,
                    bar_code: elm.product_barcode_number, 
                    brand_id: elm._embedded["wp:term"][0][0].id,
                    brand: elm._embedded["wp:term"][0][0] 
                }
            });

            pagination.total = response.data[0].product_count;
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

async function getBrand() {
    
    try {
        let response = await endpoint.getBrands();

        if(response.status == 200){

            brand_list.value = response.data.map(elm => {
                return {
                    id: elm.id,
                    name: elm.name
                }
            });

        }else{
            console.error('Error en la solicitud');
        }

    } catch(error) { 

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
    getProducts();
    getBrand();
});

</script>