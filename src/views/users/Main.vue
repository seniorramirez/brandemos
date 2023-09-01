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
                <button class="btn btn-primary shadow-md ml-2" @click="getUsers" :disabled="searching">
                    {{searching ? 'Searching' : 'Search'}}
                </button>
            </div>

            <!-- END: Search -->

            <!-- BEGIN: New Button -->
            <button class="btn btn-primary shadow-md mr-2" @click="openNewUser">
                <UserPlusIcon class="w-4 h-4 ml-0.5 mr-1" />
                Add User
            </button>
            <!-- END: New Button -->

        </div>
    </div>

    <div class="intro-y box mb-5 p-5">
        
        <table class="table table-report -mt-2">
            <thead>
                <tr>
                    <th class="whitespace-nowrap">USER NAME</th>
                    <th class="whitespace-nowrap">INFORMATION</th>
                    <th class="text-center whitespace-nowrap">PHONE</th>
                    <th class="text-center whitespace-nowrap">ACTIONS</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="user in table_data" :key="user.id" class="intro-x">
                    <td class="w-40">
                        <span href="" class="font-medium ">{{ user.user_name}}</span>
                    </td>
                    <td class="w-40">
                        <span href="" class="font-medium ">{{ user.name }} {{ user.last_name }}</span>
                    </td>
                    <td class="w-40 text-center">
                        <span href="" class="">{{ user.phone }}</span>
                    </td>
                    <td class="table-report__action w-56">
                        <div class="flex justify-center items-center">
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

    <Modal size="modal-md" backdrop="static" :show="show_modal_user">
        <ModalHeader>
            <h2 class="mr-auto text-base font-medium">
                {{form_user.id ? 'Update user' : 'Add user' }}
            </h2>
        </ModalHeader>
        <ModalBody>

            <div class="intro-y">

                <div class="grid grid-cols-12 gap-x-6 gap-y-4 mb-5">
                    <div class="col-span-12 lg:col-span-6 flex flex-col">
                        <label for="user_name" class="form-label ">Name *</label>
                        <input id="user_name" type="text" class="form-control w-full " v-model="form_user.name" :class="{ 'invalid': form_user_invalidate.name }" :disabled="form_user.id"/>
                        <span class="text-xs mt-2 text-danger" v-show="form_user_invalidate.name">Field is required</span>
                    </div>
                    <div class="col-span-12 lg:col-span-6">
                        <label for="user_last_name" class="form-label">Last name *</label>
                        <input id="user_last_name" type="text" class="form-control w-full " v-model="form_user.last_name" :class="{ 'invalid': form_user_invalidate.last_name }" :disabled="form_user.id"/>
                        <span class="text-xs mt-2 text-danger" v-show="form_user_invalidate.last_name">Field is required</span>
                    </div>
                    <div class="col-span-12 lg:col-span-6">
                        <label for="user_email" class="form-label">Email *</label>
                        <input id="user_email" type="text" class="form-control w-full" v-model="form_user.email" :class="{ 'invalid': form_user_invalidate.email }" :disabled="form_user.id"/>
                        <span class="text-xs mt-2 text-danger" v-show="form_user_invalidate.email">Field is required</span>
                    </div>
                    <div class="col-span-12 lg:col-span-6">
                        <label for="user_phone" class="form-label">phone *</label>
                        <input id="user_phone" type="text" class="form-control w-full" v-model="form_user.phone" :class="{ 'invalid': form_user_invalidate.phone }" />
                        <span class="text-xs mt-2 text-danger" v-show="form_user_invalidate.phone">Field is required</span>
                    </div>

                    <div class="col-span-12 lg:col-span-6" v-if="!form_user.id">
                        <label for="user_password" class="form-label">Password *</label>
                        <input id="user_password" type="password" class="form-control w-full" v-model="form_user.password" :class="{ 'invalid': form_user_invalidate.password }" />
                        <span class="text-xs mt-2 text-danger" v-show="form_user_invalidate.password">Field is required</span>
                    </div>

                    <div class="col-span-12 lg:col-span-6 flex flex-col" v-if="!form_user.id">
                        <label for="user_confirm_password" class="form-label">Confirm password *</label>
                        <input id="user_confirm_password" type="password" class="form-control w-full" v-model="form_user.confirm_password" :class="{ 'invalid': form_user_invalidate.confirm_password }" />
                        <span class="text-xs mt-2 text-danger" v-show="form_user_invalidate.confirm_password && !password_confirm_error">Field is required</span>
                        <span class="text-xs mt-2 text-danger" v-show="form_user_invalidate.confirm_password && password_confirm_error">Please make sure your passwords match</span>
                    </div>

                </div>
            </div>
        </ModalBody>
        <ModalFooter>
            <button type="button" @click="closeModalNewUser" class="w-20 mr-1 btn btn-outline-secondary">
                Cancel
            </button>
            <button type="button" class="btn btn-primary" :disabled="is_creating" @click="validateFormUser">
                {{ form_user.id ? 'Update user' : 'Add user' }}
                <LoadingIcon icon="oval" class="ml-1" color="white" v-show="is_creating" />
            </button>
        </ModalFooter>
    </Modal>

    <ModalDelete :modal="modalDelete" refKey="modal-delete-ref" :callback="sendDeleteUser" :deleting="deleting" />

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

const user_selected = ref(null);
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
const show_modal_user = ref(false);
const is_creating = ref(false);

const form_user_DEFAULT = {
    id:null,
    name: '',
    last_name: '',
    email: '',
    phone: '',
    password: '',
    confirm_password: ''
};

const form_user = reactive(Object.assign({},form_user_DEFAULT));

const form_user_INVALIDATE_DEFAULT = {
    name: false,
    last_name: false,
    email: false,
    phone: false,
    password: false,
    confirm_password: false
};

const form_user_invalidate = reactive(Object.assign({},form_user_INVALIDATE_DEFAULT));


/**
 * END CONSTANS
 */


/**
 * METHODS
 */

function callbackChangePagination(page){
    pagination.page = page;

    getUsers();
}

function openNewUser() {
	
	Object.assign(form_user,form_user_DEFAULT);
    show_modal_user.value = true;
	
}

function openEditUser(user){

    form_user.id = user.id;
    form_user.name = user.name;
    form_user.phone = user.phone;
    form_user.barcode = user.bar_code;
    show_modal_user.value = true;

}

function closeModalNewUser() {

    show_modal_user.value = false;
}

function validateFormUser() {

    let error = false;

    if (!form_user.name || form_user.name === '') {
        form_user_invalidate.name = true;
        error = true;
    } else {
        form_user_invalidate.name = false;
    }

    if (!form_user.last_name || form_user.last_name === '') {
        form_user_invalidate.last_name = true;
        error = true;
    } else {
        form_user_invalidate.last_name = false;
    }

    if (!form_user.email || form_user.email === '') {
        form_user_invalidate.email = true;
        error = true;
    } else {
        form_user_invalidate.email = false;
    }

    if (!form_user.phone || form_user.phone === '') {
        form_user_invalidate.phone = true;
        error = true;
    } else {
        form_user_invalidate.phone = false;
    }

    if (!form_user.password || form_user.password === '') {
        form_user_invalidate.password = true;
        error = true;
    } else {
        form_user_invalidate.password = false;
    }


    if (!form_user.confirm_password || form_user.confirm_password === '') {
        form_user_invalidate.confirm_password = true;
        error = true;
    } else {
        form_user_invalidate.confirm_password = false;
    }

    if((form_user.password && form_user.confirm_password) && (form_user.confirm_password === form_user.password)){
        password_confirm_error.value = false;
        form_user_invalidate.confirm_password = false;
    }else{
        error = true;
        password_confirm_error.value = true;
        form_user_invalidate.confirm_password = true;
    }

    if (error) {
        return;
    }

    if(form_user.id){
        sendUpdateUser();
    }else{
        sendCreateUser();
    }
}

function showModalDelete(product) {

    user_selected.value = product;
    modalDelete.value.show();
}

async function sendCreateUser() {

    is_creating.value = true;

    let user_name = form_user.name.charAt(0).toUpperCase() + form_user.last_name.toLowerCase();

    let params = {
        username : user_name,
        email : form_user.email,
        password : form_user.password,
        "role" : "editor"
    };

    const response = await endpoint.createUser(params);

    if(response.status === 200){
        
        let params_update = {
            name: `${form_user.name} ${form_user.last_name}`,
            first_name: form_user.name,
            last_name: form_user.last_name,
            phone: form_user.phone
        }

        const response_update = await endpoint.updateUser(response.data.id,params_update);

        if(response_update.status === 200){

            console.log(response_update);

            table_data.value.unshift({
                id: response.data.id,
                user_name: response.data.name,
                name: response.data.demostratorname, 
                last_name: response.data.demostratorlastname,
                phone: response.data.phone 
            });

        }else{
            console.error('Error en la solicitud');
            warningNotification.value.showToast('Por favor conectarse con el administrador','¡Ocurrio un error!');
        }

        is_creating.value = false;

        show_modal_user.value = false;
        successNotification.value.showToast('Se realizó el registro correctamente','Correcto');
    }else{
        is_creating.value = false;
        console.error('Error en la solicitud');
        warningNotification.value.showToast(response.message,'¡Ocurrio un error!');
    }
}

async function sendUpdateUser() {

    is_creating.value = true;

    let params = {
        title: form_user.name,
        brand: form_user.brand,
        product_barcode_number: form_user.barcode,
        status: "publish"
    };

    const response = await endpoint.updateProduct(form_user.id,params);

    if(response.status === 200){

        let index = table_data.value.findIndex(elm => elm.id == form_user.id);
        
        table_data.value[index] = {
            id: response.data.id,
            product_name: response.data.title.rendered,
            bar_code: response.data.product_barcode_number, 
            brand_id: response.data.brand[0],
            brand: brand_list.value.filter(elm => response.data.brand[0] == elm.id)[0]
        };

        is_creating.value = false;

        show_modal_user.value = false;

        successNotification.value.showToast('Se actualizó el registro correctamente','Correcto');
    }else{
        is_creating.value = false;

        warningNotification.value.showToast('Por favor conectarse con el administrador','¡Ocurrio un error!');
    }
}

async function sendDeleteUser() {

     
    try{
        deleting.value = true;

        const response = await endpoint.deleteUser(user_selected.value.id);

        deleting.value = false;

        if(response.status === 200){

            let index = table_data.value.findIndex(elm => elm.id == user_selected.value.id);

            table_data.value.splice(index,1);

            modalDelete.value.hide();

            successNotification.value.showToast('Se eliminó el registro correctamente','Correcto');

            user_selected.value = null;
        }else{
            
            modalDelete.value.hide();

            warningNotification.value.showToast('Por favor conectarse con el administrador','¡Ocurrio un error!');
        }
    }catch(error){

        modalDelete.value.hide();
        warningNotification.value.showToast('Por favor conectarse con el administrador','¡Ocurrio un error!');

    }
    

}

async function getUsers() {

    searching.value = true;
    try {
        const response = await endpoint.getUsers(search.value,pagination.page,pagination.limit);
        if (response.status === 200) {
            table_data.value = response.data.map(elm => {
                return {
                    id: elm.id,
                    user_name: elm.name,
                    name: elm.demostratorname, 
                    last_name: elm.demostratorlastname,
                    phone: elm.phone 
                }
            });

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
    getUsers();
});

</script>