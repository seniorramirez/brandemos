<template>
  <div class="grid grid-cols-12 gap-6">
    <div class="col-span-12 2xl:col-span-9">
      <div class="grid grid-cols-12 gap-6">
        <!-- BEGIN: General Report -->
        <div class="col-span-12 mt-8">
          <div class="intro-y flex items-center h-10">
            <h2 class="text-lg font-medium truncate mr-5">General Report</h2>
            
          </div>
          <div class="grid grid-cols-12 gap-6 mt-5">
            <div class="col-span-12 sm:col-span-6 xl:col-span-3 intro-y">
              <div class="report-box zoom-in">
                <div class="box p-5">
                  <div class="flex">
                    <ShoppingCartIcon class="report-box__icon text-primary" />
                    
                  </div>
                  <div class="text-3xl font-medium leading-8 mt-6">{{ responseData.sample }}</div>
                  <div class="text-base text-slate-500 mt-1">All Demostrations</div>
                </div>
              </div>
            </div>
            <div class="col-span-12 sm:col-span-6 xl:col-span-3 intro-y">
              <div class="report-box zoom-in">
                <div class="box p-5">
                  <div class="flex">
                    <MapPinIcon class="report-box__icon text-pending" />
                    
                  </div>
                  <div class="text-3xl font-medium leading-8 mt-6">{{ responseData.locations }}</div>
                  <div class="text-base text-slate-500 mt-1">Total Locations</div>
                </div>
              </div>
            </div>
            <div class="col-span-12 sm:col-span-6 xl:col-span-3 intro-y">
              <div class="report-box zoom-in">
                <div class="box p-5">
                  <div class="flex">
                    <MonitorIcon class="report-box__icon text-warning" />
                    
                  </div>
                  <div class="text-3xl font-medium leading-8 mt-6">{{ responseData.products }}</div>
                  <div class="text-base text-slate-500 mt-1">
                    Total Products
                  </div>
                </div>
              </div>
            </div>
            <div class="col-span-12 sm:col-span-6 xl:col-span-3 intro-y">
              <div class="report-box zoom-in">
                <div class="box p-5">
                  <div class="flex">
                    <UsersIcon class="report-box__icon text-success" />
                    
                  </div>
                  <div class="text-3xl font-medium leading-8 mt-6">{{ responseData.editors }}</div>
                  <div class="text-base text-slate-500 mt-1">
                    Demostrators
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <!-- END: General Report -->
        <!-- BEGIN: Sales Report -->
       
        <!-- END: Sales Report -->
        <!-- BEGIN: Weekly Top Seller -->
        
        <!-- END: Weekly Top Seller -->
        <!-- BEGIN: Sales Report -->
        
        <!-- END: Sales Report -->
        <!-- BEGIN: Official Store -->
        <div class="col-span-12 xl:col-span-8 mt-6">
          <div class="intro-y block sm:flex items-center h-10">
            <h2 class="text-lg font-medium truncate mr-5">Locations</h2>
            <div class="sm:ml-auto mt-3 sm:mt-0 relative text-slate-500">
              <!--MapPinIcon
                class="w-4 h-4 z-10 absolute my-auto inset-y-0 ml-3 left-0"
              /
              <input
                type="text"
                class="form-control sm:w-56 box pl-10"
                placeholder="Filter by city"
              />-->
            </div>
          </div>
          <div class="intro-y box p-5 mt-12 sm:mt-5">
            <!--<div>
              250 Official stores in 21 countries, click the marker to see
              location details.
            </div>-->
            <LeafletMap class="h-[310px] mt-5 rounded-md bg-slate-200" :locations="locations_maps" v-if="show_map"/>
          </div>
        </div>
        <!-- END: Official Store -->
        <!-- BEGIN: Weekly Best Sellers -->
        <div class="col-span-12 xl:col-span-4 mt-6">
          <div class="intro-y flex items-center h-10">
            <h2 class="text-lg font-medium truncate mr-5">
              Best Demostrators
            </h2>
          </div>
          <div class="mt-5">
            <div
              v-for="user in responseData.top_users" :key="user.id"
              class="intro-y"
            >
              <div class="box px-4 py-4 mb-3 flex items-center zoom-in">
                <div
                  class="w-10 h-10 flex-none image-fit rounded-md overflow-hidden"
                >
                <TrendingUpIcon class="text-success" />
                  <!--<img
                    alt="Midone Tailwind HTML Admin Template"
                    :src="faker.photos[0]"
                  />-->
                </div>
                <div class="ml-4 mr-auto">
                  <div class="font-medium">
                    {{ user.display_name }}
                  </div>
                  <!--<div class="text-slate-500 text-xs mt-0.5">
                    {{ faker.dates[0] }}
                  </div>-->
                </div>
                <div
                  class="py-1 px-2 rounded-full text-xs bg-success text-white cursor-pointer font-medium"
                >
                {{ user.count }} Demos
                </div>
              </div>
            </div>
            <!--<a
              href=""
              class="intro-y w-full block text-center rounded-md py-4 border border-dotted border-slate-400 dark:border-darkmode-300 text-slate-500"
              >View More</a
            >-->
          </div>
        </div>
        <!-- END: Weekly Best Sellers -->
        <!-- BEGIN: General Report -->
        
        <!-- END: General Report -->
        <!-- BEGIN: Weekly Top Products -->
        <div class="col-span-12 mt-6">
          <div class="intro-y block sm:flex items-center h-10">
            <h2 class="text-lg font-medium truncate mr-5">
              Top Products
            </h2>
            
          </div>
          <div class="intro-y overflow-auto lg:overflow-visible mt-8 sm:mt-0">
            <table class="table table-report sm:mt-2">
              <thead>
                <tr>
                  <th class="text-center whitespace-nowrap">ID</th>
                  <th class="text-center whitespace-nowrap">PRODUCT NAME</th>
                  <th class="text-center whitespace-nowrap">TIMES USED</th>
                </tr>
              </thead>
              <tbody>
                <tr
                v-for="product in responseData.top_products" :key="product.id"
                  class="intro-x"
                >
                  <td class="w-40">
                    {{ product.id }}
                  </td>
                  <td>
                    <span href="" class="font-medium ">{{ product.title }}</span>
                  </td>
                  <td class="text-center">{{ product.count }}</td>
                
                </tr>
              </tbody>
            </table>
          </div>
          
        </div>
        <!-- END: Weekly Top Products -->
      </div>
    </div>
    <div class="col-span-12 2xl:col-span-3">
      <div class="2xl:border-l -mb-10 pb-10">
        <div class="2xl:pl-6 grid grid-cols-12 gap-x-6 2xl:gap-x-0 gap-y-6">
          <!-- BEGIN: Transactions -->
         
          <!-- END: Transactions -->
          <!-- BEGIN: Recent Activities -->
          
          <!-- END: Recent Activities -->
          <!-- BEGIN: Important Notes -->
          
          <!-- END: Important Notes -->
          <!-- BEGIN: Schedules -->
          <div
            class="col-span-12 md:col-span-6 xl:col-span-4 2xl:col-span-12 xl:col-start-1 xl:row-start-2 2xl:col-start-auto 2xl:row-start-auto mt-3"
          >
            <div class="intro-x flex items-center h-10">
              <h2 class="text-lg font-medium truncate mr-5">Demostrations</h2>
              
            </div>
            <div class="mt-5">
              <div class="intro-x box">
                <div class="p-5">
                  <VCalendar @dayclick="selectedDay" :attributes="calendar_attr" style="width:100% !important;" @update:pages="changeMonth"/>
                </div>
                <div class="border-t border-slate-200/60 p-2" v-for="sample in samples_month_lists" :key="sample.id">
                  <div class="flex items-center">
                    <div class="w-2 h-2 bg-danger rounded-full mr-3"></div>
                    <span class="truncate">{{sample.title.rendered}}</span>
					<span class="font-medium xl:ml-auto">{{ dayjs(sample.demo_date).format('DD')}}th</span>
                  </div>
                  
                </div>
              </div>
            </div>
          </div>
          <!-- END: Schedules -->
        </div>
      </div>
    </div>
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
                            @search="getLocationsSamples"
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
            <button type="button" @click="closeModalNewSample" class="w-20 mr-1 btn btn-outline-secondary">
                Cancel
            </button>
            <button type="button" class="btn btn-primary" :disabled="is_creating_sample" @click="validateFormSample">
                {{ form_sample.id ? 'Update sample' : 'Add sample' }}
                <LoadingIcon icon="oval" class="ml-1" color="white" v-show="is_creating_sample" />
            </button>
        </ModalFooter>
    </Modal>
  	

	<SuccessNotification refKey="successNotification"/>
    <WarningNotification refKey="warningNotification" />
</template>

<script setup>
import {onMounted, ref, provide, reactive } from "vue";
import ReportLineChart from "@/components/report-line-chart/Main.vue";
import ReportDonutChart from "@/components/report-donut-chart/Main.vue";
import ReportPieChart from "@/components/report-pie-chart/Main.vue";
import ReportMap from "@/components/report-map/Main.vue";
import ReportDonutChart1 from "@/components/report-donut-chart-1/Main.vue";
import SimpleLineChart1 from "@/components/simple-line-chart-1/Main.vue";
import axios from 'axios';
import endpoint from "../../utils/endpoint";
import dayjs from "dayjs";
import _ from "lodash";

const salesReportFilter = ref();
const importantNotesRef = ref();

const locations_lists = ref([]);
const users_lists = ref([]);
const locations_maps = ref([]);
const show_map = ref(false);
const samples_lists = ref([]);
const calendar_attr = ref([]);
const samples_month_lists = ref([]);


const show_modal_sample = ref(false);
const is_creating_sample = ref(false);

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

provide("bind[importantNotesRef]", (el) => {
  importantNotesRef.value = el;
});

const prevImportantNotes = () => {
  const el = importantNotesRef.value;
  el.tns.goTo("prev");
};

const nextImportantNotes = () => {
  const el = importantNotesRef.value;
  el.tns.goTo("next");
};

const responseData = ref('');


function selectedDay(event){

	let now = dayjs();
	let date_selected = dayjs(event.id);

	if(date_selected < now.subtract(1,'days')){
		return;
	}

	form_sample.date = dayjs(event.id+' '+date_selected.format("HH:mm:ss")).format('ddd MMM D YYYY HH:mm:ss [GMT]Z (z)');
   	show_modal_sample.value = true;
}

function changeMonth(event){
	
	samples_month_lists.value = samples_lists.value.filter(elm => dayjs(elm.demo_date).format('MM') == dayjs(event[0].id+'-01').format('MM'));
}

function closeModalNewSample() {

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
    }else{
        sendCreateSample();
    }
}

async function sendCreateSample() {

    is_creating_sample.value = true;

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
        
        is_creating_sample.value = false;

        calendar_attr.value.push({
			key: response.data.id,
			highlight: 'red',
			dates: dayjs(response.data.demo_date).toDate(),
		});

        show_modal_sample.value = false;
        successNotification.value.showToast('Se realizó el registro correctamente','Correcto');
    }else{
        is_creating_sample.value = false;
        console.error('Error en la solicitud');
        warningNotification.value.showToast(response.message,'¡Ocurrio un error!');
    }
}

async function getDashboardData(){
  try {
    const response = await endpoint.dashboardData();
    console.log(response);
    if (response.status === 200) {
      responseData.value = response.data;
    } else {
      console.error('Error en la solicitud');
    }
  } catch (error) {
    console.error(error);
  }
}

async function getLocations() {

    try {
        const response = await endpoint.getLocationSamples();
        if (response.status === 200) {

			let locations_with_lat = response.data.filter(elm => elm.lat);

			locations_lists.value = response.data.map(elm => {
				return {
					id: elm.id,
					location_title: elm.title.rendered
				}
			});
            
            locations_maps.value = locations_with_lat.map(elm => {
              return {
                id: elm.id,
                name: elm.title.rendered,
                latitude: elm.lat,
                longitude: elm.long
              }
            });

            show_map.value = true;

        } else {
            console.error('Error en la solicitud');
        }
    } catch (error) {
        console.error(error);
    }

}

async function getUsers() {

    try {
        const response = await endpoint.getUsersSample();
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
        console.error(error);
    }
}

async function getSamples() {

    try {
        const response = await endpoint.getSamplesDashboard();
        if (response.status === 200) {
            samples_lists.value = response.data.map(elm => {
                return {
                    id: elm.id,
                    date: elm.date,
					demo_date: elm.demo_date,
					title: elm.title
                }
            });

			calendar_attr.value = response.data.map(elm => {

				return {
					key: elm.id,
					highlight: 'red',
					dates: dayjs(elm.demo_date).toDate(),
				}
			});

			samples_month_lists.value = response.data.filter(elm => dayjs(elm.demo_date).format('MM') == dayjs().format('MM'));

        } else {
            console.error('Error en la solicitud');
        }
    } catch (error) {
        console.error(error);
    }
}

const getLocationsSamples =  _.debounce(function(search,loading){

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

onMounted(() => {
  getDashboardData();
  getLocations();
  getUsers();
  getSamples();
});

</script>
