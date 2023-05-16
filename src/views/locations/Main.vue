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
                <MapIcon class="w-4 h-4 ml-0.5 mr-1" />
                Add location
            </button>
            <!-- END: New Button -->

            
        </div>
    </div>

    <div class="intro-y box mb-5 p-5">
        <table class="table table-report -mt-2">
            <thead>
                <tr>
                    <!--<th class="whitespace-nowrap">LOGO</th>-->
                    <th class="whitespace-nowrap">NAME LOCATION</th>
                    <th class="text-center whitespace-nowrap">ADDRESS</th>
                    <th class="text-center whitespace-nowrap">CITY</th>
                    <th class="text-center whitespace-nowrap">ZIP CODE</th>
                    <th class="text-center whitespace-nowrap">ACTIONS</th>
                </tr>
            </thead>
            <tbody>
                <tr
                v-for="location in responseData" :key="location.id"
                    class="intro-x"
                >
                    <!--<td class="w-40">
                        <div class="flex">
                            <div class="w-10 h-10 image-fit zoom-in">
                            <Tippy
                                tag="img"
                                alt="Midone Tailwind HTML Admin Template"
                                class="rounded-full"
                                :src="location._embedded['wp:featuredmedia'].source_url ? location._embedded['wp:featuredmedia'].source_url : 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRiWEy9726CHhM7vykk5151B6qKEN_bB89EJYYdGUV1tA&s'"
                            />
                            </div>
                        </div>
                    </td>-->
                    <td class="w-40">
                        <a href="" class="font-medium whitespace-nowrap">{{ location.title.rendered }}</a>
                    </td>
                    <td class="text-center">{{ location.address}}</td>
                    <td class="text-center">{{ location.city}}</td>
                    <td class="text-center">{{ location.zip_code}}</td>
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

 const responseData = ref('');

onMounted(async () => {
  try {
    const response = await axios.get('https://brandemos.jgdigitalstudio.com/wp-json/wp/v2/location?_embed&_fields=id,title,address,city,zip_code,_embedded,_links');
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