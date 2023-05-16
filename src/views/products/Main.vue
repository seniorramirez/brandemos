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
            <button  class="btn btn-primary shadow-md mr-2" >
                <i class="fad fa-plus-circle mr-2"></i>
                Nuevo producto
            </button>
            <!-- END: New Button -->

            
        </div>
    </div>

    <div class="intro-y box mb-5 p-5">
        <table class="table table-report -mt-2">
            <thead>
                <tr>
                    <th class="whitespace-nowrap">IMAGES</th>
                    <th class="whitespace-nowrap">PRODUCT NAME</th>
                    <th class="text-center whitespace-nowrap">STOCK</th>
                    <th class="text-center whitespace-nowrap">STATUS</th>
                    <th class="text-center whitespace-nowrap">ACTIONS</th>
                </tr>
            </thead>
            <tbody>
                <tr
                    v-for="(faker, fakerKey) in $_.take($f(), 9)"
                    :key="fakerKey"
                    class="intro-x"
                >
                    <td class="w-40">
                        <div class="flex">
                            <div class="w-10 h-10 image-fit zoom-in">
                            <Tippy
                                tag="img"
                                alt="Midone Tailwind HTML Admin Template"
                                class="rounded-full"
                                :src="faker.images[0]"
                                :content="`Uploaded at ${faker.dates[0]}`"
                            />
                            </div>
                            <div class="w-10 h-10 image-fit zoom-in -ml-5">
                            <Tippy
                                tag="img"
                                alt="Midone Tailwind HTML Admin Template"
                                class="rounded-full"
                                :src="faker.images[1]"
                                :content="`Uploaded at ${faker.dates[1]}`"
                            />
                            </div>
                            <div class="w-10 h-10 image-fit zoom-in -ml-5">
                            <Tippy
                                tag="img"
                                alt="Midone Tailwind HTML Admin Template"
                                class="rounded-full"
                                :src="faker.images[2]"
                                :content="`Uploaded at ${faker.dates[2]}`"
                            />
                            </div>
                        </div>
                    </td>
                    <td>
                        <a href="" class="font-medium whitespace-nowrap">{{
                            faker.products[0].name
                        }}</a>
                        <div class="text-slate-500 text-xs whitespace-nowrap mt-0.5">
                            {{ faker.products[0].category }}
                        </div>
                    </td>
                    <td class="text-center">{{ faker.stocks[0] }}</td>
                    <td class="w-40">
                        <div
                            class="flex items-center justify-center"
                            :class="{
                            'text-success': faker.trueFalse[0],
                            'text-danger': !faker.trueFalse[0],
                            }"
                        >
                            <CheckSquareIcon class="w-4 h-4 mr-2" />
                            {{ faker.trueFalse[0] ? "Active" : "Inactive" }}
                        </div>
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

</template>


<script setup>

import { ref,onMounted,provide,computed, reactive,getCurrentInstance } from "vue";
import Swal from 'sweetalert2';


/**
 * CONSTANS
 */




const visible_dropdown = ref([]);

// ACCOUNTS LISTS
const account_list_key = ref('account_lists');
const account_list_ref = ref(null);
const account_list_data = ref({});


/**
 * END CONSTANS
 */


/**
 * METHODS
 */



/**
 * END METHODS
 */

/**
 * BEGIN COMPUTED
 */



/**
 * END COMPUTED
 */

/**
 * BEGIN PROVIDE
 */

// ACCOUNTS LISTS
/*provide("bind[" + account_list_key.value + "]", (el) => {
    account_list_ref.value = el;
});*/


/**
 * END PROVIDE
 */


//Mounted
onMounted(() => {

});

</script>