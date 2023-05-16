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
                <tr
                    v-for="sample in responseData" :key="sample.id"
                        class="intro-x"
                    >
                    <td>{{ sample.demostrator }}</td>
                    <td>{{ sample.demo_date }}</td>
                    <td>{{ sample.demo_location[0].post_title }}</td>
                    <td>{{ sample.total_units_sold }}</td>
                    <td>{{ sample.cantidad_clientes}}</td>
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
import axios from 'axios';


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
const responseData = ref('');

onMounted(async () => {
  try {
    const response = await axios.get('https://brandemos.jgdigitalstudio.com/wp-json/wp/v2/sample/?_embed&_fields=id,date,title,demostrator,demo_date,demo_hours,number_of_samples_given,number_of_people_sample,receptivity,demo_location,store_traffic,weather,store_support,display_appearance,manager_approve,comments_about_demo,acf,total_start_inventory,total_end_inventory,total_units_sold,cantidad_clientes,porcentaje_yes,porcentaje_no,porcentaje_gusto_si,porcentaje_gusto_no,porcentaje_hispanic,porcentaje_american,porcentaje_african_american,porcentaje_other,porcentaje_childrens,porcentaje_young,porcentaje_adult,porcentaje_elderly');
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