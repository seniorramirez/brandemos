<template>

	<div class="intro-y flex flex-col sm:flex-row items-center mt-8 mb-5">
        <h2 class="text-lg font-medium mr-auto"></h2>
        
        <div class="w-full sm:w-auto flex mt-4 sm:mt-0">
            <!-- BEGIN: Search -->
            <div class="relative flex items-center mr-auto mt-3 sm:mt-0 mr-5 pr-5">
                
                <div class="relative mr-auto mt-3 sm:mt-0">
                    <div class="w-56 relative text-slate-500">
                        <input
                            type="text"
                            class="form-control w-56 box pr-10"
                            placeholder="Search..."
                        />
                        <SearchIcon class="w-4 h-4 absolute my-auto inset-y-0 mr-3 right-0" />
                    </div>
                </div>
            </div>

            <!-- END: Search -->

            <!-- BEGIN: New Button -->
            <button  class="btn btn-primary shadow-md mr-2" @click="openNewProduct">
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
                    <th class="whitespace-nowrap">PRODUCT NAME</th>
                    <th class="whitespace-nowrap">BRAND</th>
                    <th class="text-center whitespace-nowrap">BARCODE</th>
                    <th class="text-center whitespace-nowrap">ACTIONS</th>
                </tr>
            </thead>
            <tbody>
                <tr
                v-for="product in responseData" :key="product.id"
                    class="intro-x"
                >
                    <td class="w-40">
                        <a href="" class="font-medium whitespace-nowrap">{{ product.title.rendered }}</a>
                    </td>
                    <td class="w-40">
                        <a href="" class="font-medium whitespace-nowrap">{{ product._embedded["wp:term"][0][0].name}}</a>
                    </td>
                    <td class="w-40 text-center">
                        <a href="" class="font-medium whitespace-nowrap">{{ product.product_barcode_number }}</a>
                    </td>
                    <td class="table-report__action w-56">
                        <div class="flex justify-center items-center">
                            <a class="flex items-center mr-3" href="javascript:;">
                            <CheckSquareIcon class="w-4 h-4 mr-1" /> Edit
                            </a>
                            <a
                            class="flex items-center text-danger"
                            href="javascript:;"
                            @click="deleteConfirmationModal = true"
                            >
                            <Trash2Icon class="w-4 h-4 mr-1" /> Delete
                            </a>
                        </div>
                    </td>
                </tr>
            </tbody>
        </table>
    </div>

    <Modal size="modal-md" backdrop="static" :show="show_modal_new_product">
        <ModalHeader>
            <h2 class="mr-auto text-base font-medium">Add Product</h2>
        </ModalHeader>
        <ModalBody >

            <div class="intro-y">

                <div class="grid grid-cols-12 gap-x-6 gap-y-4 mb-5">
                    <div class="col-span-12 flex flex-col">
                        <label for="product_name" class="form-label ">Product Name *</label>
                        <input
                            id="product_name"
                            type="text"
                            class="form-control w-full "
                            placeholder="Input text"
                            v-model="form_new_product.name"
                            :class="{'invalid' : form_new_product_invalidate.name}"
                        />
                        <span class="text-xs mt-2 text-danger" v-show="form_new_product_invalidate.name">Field is required</span>
                    </div>
                    <div class="col-span-12 ">
                        <label for="product_brand" class="form-label">BRAND *</label>
                        <input
                            id="product_brand"
                            type="text"
                            class="form-control w-full"
                            placeholder="Input text"
                            v-model="form_new_product.brand"
                            :class="{'invalid' : form_new_product_invalidate.brand}"
                        />
                        <span class="text-xs mt-2 text-danger" v-show="form_new_product_invalidate.brand">Field is required</span>
                    </div>
                    <div class="col-span-12 ">
                        <label for="product_barcode" class="form-label">BARCODE *</label>
                        <input
                            id="product_barcode"
                            type="text"
                            class="form-control w-full"
                            placeholder="Input text"
                            v-model="form_new_product.barcode"
                            :class="{'invalid' : form_new_product_invalidate.barcode}"
                        />
                        <span class="text-xs mt-2 text-danger" v-show="form_new_product_invalidate.barcode">Field is required</span>
                    </div>
                
                </div>
            </div>
        </ModalBody>
        <ModalFooter>
            <button type="button" @click="closeModalNewProduct" class="w-20 mr-1 btn btn-outline-secondary">
                Cancelar
            </button>
            <button type="button" class="btn btn-primary" :disabled="is_creating" @click="validateFormNewProduct">
                Add Product
                <LoadingIcon icon="oval" class="ml-1" color="white" v-show="is_creating"/>
            </button>
        </ModalFooter>
    </Modal>
</template>


<script setup>

import { ref,onMounted,provide,computed, reactive,getCurrentInstance } from "vue";
import Swal from 'sweetalert2';
import axios from 'axios';
import endpoint from "../../utils/endpoint";


/**
 * CONSTANS
 */
const responseData = ref([]);

//MODAL NEW PRODUCT
const show_modal_new_product = ref(false);
const is_creating_new_product = ref(false);
const form_new_product = reactive({
    name: '',
    brand: '',
    barcode: ''
});
const form_new_product_invalidate = reactive({
    name: false,
    brand: false,
    barcode: false
});

/**
 * END CONSTANS
 */


/**
 * METHODS
 */

function openNewProduct(){
    show_modal_new_product.value = true;
}

function closeModalNewProduct(){

    show_modal_new_product.value = false;
}

function validateFormNewProduct(){

    let error = false;

    if(!form_new_product.name || form_new_product.name === ''){
        form_new_product_invalidate.name = true;
        error = true;
    }else{
        form_new_product_invalidate.name = false;
    }

    if(!form_new_product.brand || form_new_product.brand === ''){
        form_new_product_invalidate.brand = true;
        error = true;
    }else{
        form_new_product_invalidate.brand = false;
    }

    if(!form_new_product.barcode || form_new_product.barcode === ''){
        form_new_product_invalidate.barcode = true;
        error = true;
    }else{
        form_new_product_invalidate.barcode = false;
    }

    if(!error){
        sendCreateProduct();
    }

}

async function sendCreateProduct(){

    //is_creating_new_product.value = true;

    const response = await endpoint.createProduct(form_new_product);
    
    console.log(response);

}


/**
 * END METHODS
 */

/**
 * BEGIN COMPUTED
 */



/**
 * END COMPUTED
 */

//Mounted
onMounted(async () => {
  try {
    const response =  await endpoint.geProducts();
    if (response.status === 200) {
      responseData.value = response.data;
    } else {
      console.error('Error en la solicitud');
    }
  } catch (error) {
    console.error(error);
  }
});

</script>