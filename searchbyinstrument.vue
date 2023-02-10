<script setup lang="ts">
import { useHead } from '@vueuse/head'
import { useViewWrapper } from '/@src/stores/viewWrapper'
import { useUserSession } from '/@src/stores/userSession'
import { useApi } from '/@src/composable/useApi'

import { useNotyf } from '/@src/composable/useNotyf'
import type { RouteLocationOptions } from 'vue-router/auto'
import { Field, useForm } from 'vee-validate'
import { onceImageErrored } from '/@src/utils/via-placeholder'


const isLoadingSearch = ref(false)
const clientsData = ref<any>([])

const clientsDataFormatted = computed(() => {

  return clientsData.value
})

const dateFrom = ref(null)
const dateTo = ref(null)
const isLastPage = ref(false)

const currentPage = ref(1)


const router = useRouter()
const route = useRoute()


const userSession = useUserSession()
const api = useApi()
const notyf = useNotyf()
const viewWrapper = useViewWrapper()

const optionsClient = {
  searchable: true,
  sortable: true,
  perPageSelect: false,
  perPage: 8,
}




viewWrapper.setPageTitle("search client by instrument")


const { handleSubmit } = useForm({
  initialValues: {
    instrumentid: '',
    marketid: '',
  },
  //validationSchema: schema,
})

const onSubmit = handleSubmit(async (values) => {
  
  // can get instrumentid only, cannot get marketid from the multiselect.
  console.log("values: ", values)
  
  if(isLoadingSearch.value) return
  
  isLoadingSearch.value = true
  
  try {
    let url = ''
    if(values.marketid == ''){
      url = `/securities-service/crm/clientPortfolioByInstrument/${values.instrumentid}`
    }else{
      url = `/securities-service/crm/clientPortfolioByInstrument/${values.instrumentid}/${values.marketid}`
    }
    
    const response = await api.get(url)

    clientsData.value = response.data


  } catch (err: any) {
    console.log('err: ', JSON.stringify(err, null, 2))
    if(err.response.status > 299){
      notyf.dismissAll()
      notyf.error({
        message: err.response.data,
        duration: 5000,
      })
    }
    if(err.response.status == 403){
      router.push({
          name: '/auth/login',
      })
    }
  } finally {
    isLoadingSearch.value = false
  }
})

const onSearch = handleSubmit(async (values) => {
  currentPage.value = 1

  isLoadingSearch.value = true
  notyf.success(`Loading`)
  onSubmit()

})

useHead({
  title: 'Search Client - ESCRM',
})
</script>

<template>
  <div class="page-content-inner">
    <div class="main-container">
      <div class="columns">
        <div class="column is-3">
          <div class="search-type">
            
            <form @submit.prevent="onSearch">
              <div class="alert">
                <div class="alert-title">Search Clients</div>
                <div class="alert-subtitle">Input instrument to search clients <br/></div>
                
                <!-- the instrumentid is successfully submitted -->
                <VField id="instrumentid">
                  <VControl icon="feather:hash">
                    <VInput type="text" placeholder="Instrument ID" />
                  </VControl>
                </VField>
                
                <!-- when submit, the marketid is not submitted -->
                <VField id="marketid">
                  <VControl icon="feather:book-open">
                    <Multiselect name="marketid"
                      v-model="['default']"
                      placeholder="Select Market ID"
                      label="marketid"
                      :max-height="145"
                      :options="['abc','edf','ghl']"
                    >
                        
                    </Multiselect>
                  </VControl>
                </VField>
                
                
                <!-- and is there an example of how an datepicker pass value inside a form ? -->
                
                <!--<VDatePicker v-model="dateFrom" color="green" trim-weeks>
                  <template #default="{ inputValue, inputEvents }">
                    <VField id="acopendatefrom">
                      
                      <VControl icon="feather:calendar">
                        <VInput
                          type="text"
                          placeholder="A/C Open Date From"
                          :value="inputValue"
                          v-on="inputEvents"
                        />
                      </VControl>
                    </VField>
                  </template>
                </VDatePicker>
                <VDatePicker v-model="dateTo" color="green" trim-weeks>
                  <template #default="{ inputValue, inputEvents }">
                    <VField id="acopendateto">
                      
                      <VControl icon="feather:calendar">
                        <VInput
                          type="text"
                          placeholder="A/C Open Date To"
                          :value="inputValue"
                          v-on="inputEvents"
                        />
                      </VControl>
                    </VField>
                  </template>
                </VDatePicker>-->


                
                <!--<VDatePicker v-model="dateAcOpenTo" color="green" trim-weeks>
                  <template #default="{ acOpenDateToValue, inputEvents2 }">
                    <VField id="acopendateto">
                      <VControl icon="feather:calendar">
                        <VInput type="text" placeholder="A/C Open Date To" :value="acOpenDateToValue" v-on="inputEvents2" />
                      </VControl>
                    </VField>
                  </template>
                </VDatePicker>-->
                  
                <VButton :loading="isLoadingSearch" type="submit" color="primary" fullwidth>Search</VButton>
                
              </div>
            </form>
          </div>
        </div>
        
        <div class="column is-9">
        <!--Results-->
          <div class="searched-jobs">

            <div class="page-content-inner">
              <!--List-->
              <div class="list-view list-view-v3">
                
                

                
                <div class="list-view-inner">

                  <VLoader size="large" style="height:600px;" :active="isLoadingSearch">
                    
                    <VAccordion :items="data" />
                    <VAccordion :items="data" />-->
                    <div v-if="isLoadingSearch==false">
                  
                      <VSimpleDatatables :options="optionsClient" >
                        <thead>
                          <tr>
                            
                            
                            <th scope="col">name</th>
                            
                            <th scope="col" data-sortable="false">qty</th>
                            <th scope="col" data-sortable="false">cost</th>
                            <th scope="col" data-sortable="false">P/L</th>
                            <th scope="col" data-sortable="false">margin value</th>
                            <th scope="col" data-sortable="false">Details</th>
                            
                            
                          </tr>
                        </thead>
                        <tbody>
                          <tr v-for="item in clientsData" :key="item.id">
                            <td>
                              <div class="flex-media">
                                <div class="meta">
                                  <span class="light-text">{{ item.subaccountname }}</span>
                                  <span class="light-text">{{ item.subaccountid }}</span>
                                  
                                </div>
                              </div>
                            </td>
                            <td>
                              <div class="has-text-centered">
                                <!--<span>{{ value.Normal }}</span>-->
                                <span>{{ item.ledgerqty }}</span>
                              </div>
                            </td>
                            <td>
                              <div class="has-text-centered">
                                <span>{{ item.costpershare }}</span>
                              </div>
                            </td>
                            <td>
                              <div class="has-text-centered">
                                <span>{{ item.floatingplhkd }}</span>
                              </div>
                            </td>
                            <td>
                              <div class="has-text-centered">
                                <span>{{ item.marginvaluehkd }}</span>
                              </div>
                            </td>
                            <td>
                              <VButton color="primary" :to="`/client/detail/${item.subaccountid}`" outlined raised> Details </VButton>
                            </td>
                            
                          </tr>
                        </tbody>
                      </VSimpleDatatables>

                    </div>
                  </VLoader>
                </div>

              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  </div>
  
</template>

