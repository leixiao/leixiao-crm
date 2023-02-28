<script setup lang="ts">
import { useUserSession } from '/@src/stores/userSession'
import { useApi } from '/@src/composable/useApi'
import { useNotyf } from '/@src/composable/useNotyf'
import type { VAvatarProps } from '/@src/components/base/avatar/VAvatar.vue'
import * as listData from '/@src/data/layouts/flex-list-v2'

const userSession = useUserSession()
const api = useApi()
const notyf = useNotyf()
const isLoading = ref(false)

const feesettings = reactive({data:[]})

const criteriaMarket = ref('')

// use computed property to filter marketID equals checkbox selection.
const feesettingsFormatted = computed(() => {
  return feesettings.data.filter((item) => {
      return (
        item.marketid.match(criteriaMarket.value)
      )
    })
})


const props = defineProps<{
  clientid?: string
}>()

const optionsFeeSettings = reactive({
  searchable: false,
  sortable: true,
  perPageSelect: false,
  perPage: 5,
  
})


try {
  const response = await api.post('/securities-service/crm/clientFeeSetting/' + props.clientid, {})
  feesettings.data = response.data

} catch (err: any) {
  console.log('err: ', JSON.stringify(err, null, 2))
  if(err.hasOwnProperty('response') && err.response.status > 299){
    notyf.dismissAll()
    notyf.error({
      message: err.response.data,
      duration: 5000,
    })
  }
  if(err.hasOwnProperty('response') && err.response.status == 403){
    router.push({
        name: '/auth/login',
    })
  }
} finally {
  isLoading.value = false
}
</script>

<template>
  <div class="main-container">
    <div class="filter-feesettings">
      <div class="filter-feesettings-block">
        <h3 class="filter-feesettings-title">市場</h3>
        <div class="filter-feesettings-options">
        
          <!-- I can see from here, the feesettingsFormatted is updated when checkbox is ticked -->
          Market: {{ feesettingsFormatted }}
          
          <!-- Five checkboxes to let user filter selected market id -->
          <VField class="is-flex" style="flex-direction: column">
            <VControl raw subcontrol>
              <VCheckbox v-model="criteriaMarket" true-value="HKEX" label="HKEX" color="primary" circle></VCheckbox>
            </VControl>
            <VControl raw subcontrol>
              <VCheckbox v-model="criteriaMarket" true-value="MAMK" label="MAMK" color="primary" circle></VCheckbox>
            </VControl>
            <VControl raw subcontrol>
              <VCheckbox v-model="criteriaMarket" true-value="SZMK" label="SZMK" color="primary" circle></VCheckbox>
            </VControl>
            <VControl raw subcontrol>
              <VCheckbox v-model="criteriaMarket" true-value="USEX" label="USEX" color="primary" circle></VCheckbox>
            </VControl>
            <VControl raw subcontrol>
              <VCheckbox v-model="criteriaMarket" true-value="OTH" label="OTH" color="primary" circle></VCheckbox>
            </VControl>
          </VField>
        </div>
      </div>
      
    </div>
    <div class="filtered">
      
      <VSimpleDatatables :options="optionsFeeSettings" >
        <thead>
          <tr>
            <th scope="col" data-sortable="true">Market ID</th>
            <th scope="col">Category</th>
            <th scope="col">Currency</th>
            <th scope="col">Operation</th>
            <th scope="col">Type</th>
            <th scope="col">Channel</th>
            <th scope="col">Min</th>
            <th scope="col">FixAmount</th>
            <th scope="col">Tier</th>
          </tr>
        </thead>
        <tbody>
        
          <!-- loop every feesettingsFormatted, but when feesettingsFormatted updated, the table is not updating responsively -->
          <tr v-for="(item, index) in feesettingsFormatted" :key="index">
            <td>
              <div class="has-text-centered">
                <span>{{ item['marketid'] }}</span>
              </div>
              
            </td>
            <td>
              <div class="has-text-centered">
                <span class="light-text ">{{ item['feecategoryid'] }}</span>
              </div>
            </td>
            <td>
              <div class="flex-media">
                <div class="meta">
                  <span class="price-hkd dark-inverted">{{ item['feecurrencyid'] }}</span>
                </div>
              </div>
            </td>
            <td>
              <div class="has-text-centered">
                <span class="light-text ">{{ item['chargeoperanddesc'] }}</span>
              </div>
            </td>
            <td>
              <div class="has-text-centered">
                <span class="light-text ">{{ item['chargetypedesc'] }}</span>
              </div>
            </td>
            <td>
              <div class="has-text-centered">
                <span class="light-text ">{{ item['channelname'] }}</span>
              </div>
            </td>
            <td>
              <div class="has-text-centered">
                <span class="light-text ">{{ item['minfeeamount'] }}</span>
              </div>
            </td>
            <td>
              <div class="has-text-centered">
                <span class="light-text ">{{ item['fixamount'] }}</span>
              </div>
            </td>
            <td>
              <div class="has-text-centered">
                <span class="light-text ">{{ item['tier'] }}</span>
              </div>
            </td>
          </tr>
        </tbody>
      </VSimpleDatatables>
    </div>
  </div>
</template>

