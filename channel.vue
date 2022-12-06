<script setup lang="ts">
import { useHead } from '@vueuse/head'
import { useViewWrapper } from '/@src/stores/viewWrapper'
import { useUserSession } from '/@src/stores/userSession'
import { useApi } from '/@src/composable/useApi'

import * as chartOptions from '/@src/data/statistic/channel/chartOptions'
import ApexChart from 'vue3-apexcharts'


import { useNotyf } from '/@src/composable/useNotyf'
import { Field, useForm } from 'vee-validate'
import { onceImageErrored } from '/@src/utils/via-placeholder'

const isLoaderActive = ref(true)
const dateFrom = ref(null)
const dateTo = ref(null)


const router = useRouter()
const route = useRoute()


const userSession = useUserSession()
const api = useApi()
const notyf = useNotyf()
const viewWrapper = useViewWrapper()
viewWrapper.setPageTitle("統計 - 渠道表現")

let today = new Date().toISOString().slice(0, 10)

let channel = reactive({arrayData:[
  
]})



if (userSession.isLoggedIn){
  const token = userSession.token

  //alert(token)
  const headers = {
    'Content-Type': 'application/json',
    'X-Requested-With': 'XMLHttpRequest',
    'Authorization': `Bearer ${token}`,
  }
  //api.headers.common['Authorization'] = 'Bearer ${userSession.user.token}'

  try {

    await api
    .get('/securities-service/stat/channelUsageStat/' + today,{headers: headers})
      .then(function (response) {
        if (response.status === 200) {

          
          for (var dateKey in response.data){
            chartOptions.optionsLogin.xaxis.categories.push(dateKey.substring(0, 11))
            chartOptions.optionsOrder.xaxis.categories.push(dateKey.substring(0, 11))
            chartOptions.optionsTransaction.xaxis.categories.push(dateKey.substring(0, 11))
            chartOptions.optionsTradevolumn.xaxis.categories.push(dateKey.substring(0, 11))
            //alert(JSON.stringify(response.data[dateKey]))
            //temp[dateKey]= {}
            for (var channelKey in response.data[dateKey]){
              if(channelKey == 'DZ_APP'){
                chartOptions.optionsLogin.series[0].data.push(response.data[dateKey][channelKey]['countClient'])
                chartOptions.optionsOrder.series[0].data.push(response.data[dateKey][channelKey]['countOrder'])
                chartOptions.optionsTransaction.series[0].data.push(response.data[dateKey][channelKey]['countContract'])
                chartOptions.optionsTradevolumn.series[0].data.push(response.data[dateKey][channelKey]['turnoverHkd'])
              }else if(channelKey == 'TSCI_APP'){
                chartOptions.optionsLogin.series[1].data.push(response.data[dateKey][channelKey]['countClient'])
                chartOptions.optionsOrder.series[1].data.push(response.data[dateKey][channelKey]['countOrder'])
                chartOptions.optionsTransaction.series[1].data.push(response.data[dateKey][channelKey]['countContract'])
                chartOptions.optionsTradevolumn.series[1].data.push(response.data[dateKey][channelKey]['turnoverHkd'])
              }else if(channelKey == 'TSCI_PC'){
                chartOptions.optionsLogin.series[2].data.push(response.data[dateKey][channelKey]['countClient'])
                chartOptions.optionsOrder.series[2].data.push(response.data[dateKey][channelKey]['countOrder'])
                chartOptions.optionsTransaction.series[2].data.push(response.data[dateKey][channelKey]['countContract'])
                chartOptions.optionsTradevolumn.series[2].data.push(response.data[dateKey][channelKey]['turnoverHkd'])
              }else if(channelKey == 'INT'){
                chartOptions.optionsLogin.series[3].data.push(response.data[dateKey][channelKey]['countClient'])
                chartOptions.optionsOrder.series[3].data.push(response.data[dateKey][channelKey]['countOrder'])
                chartOptions.optionsTransaction.series[3].data.push(response.data[dateKey][channelKey]['countContract'])
                chartOptions.optionsTradevolumn.series[3].data.push(response.data[dateKey][channelKey]['turnoverHkd'])
              }

            }
          }
          isLoaderActive.value = false

        } else if(response.status === 403){
        
        } else {
          alert('401: ' + JSON.stringify(response, null, 2))
          notyf.error({
            //message: Object.values<string>(err.response.data.errors).flat()[0],
            message: 'wrong username or password',
            duration: 5000,
          })
        } 
        
      })

  } catch (err: any) {
   
  } finally {
    
  }
}else{
  router.push({
    name: '/auth/login',
  })
}

const { handleSubmit } = useForm({
  initialValues: {
    clientid: '',
    firstname: '',
    mobile: '',
    email: '',
    idnumber: '',
    acopendatefrom: '',
    acopendateto: '',
    pitype: '',
  },
  //validationSchema: schema,
})


useHead({
  title: 'Channel - Statistic - CRM',
})
</script>

<template>
  
  <div class="page-content-inner">
    
    <div class="apex-dashboard">
      <div class="columns is-multiline">
        <div class="column is-6">
          <VLoader card="regular" size="small" :active="isLoaderActive" translucent>
            <div class="s-card">
              <ApexChart
                id="apex-chart-login"
                :height="chartOptions.optionsLogin.chart.height"
                :type="chartOptions.optionsLogin.chart.type"
                :series="chartOptions.optionsLogin.series"
                :options="chartOptions.optionsLogin"
              >
              </ApexChart>
            </div>
          </VLoader>
        </div>
        <div class="column is-6">
          <VLoader card="regular" size="small" :active="isLoaderActive" translucent>
            <div class="s-card">
              <ApexChart
                id="apex-chart-order"
                :height="chartOptions.optionsOrder.chart.height"
                :type="chartOptions.optionsOrder.chart.type"
                :series="chartOptions.optionsOrder.series"
                :options="chartOptions.optionsOrder"
              >
              </ApexChart>
            </div>
          </VLoader>
        </div>
        <div class="column is-6">
          <VLoader card="regular" size="small" :active="isLoaderActive" translucent>
            <div class="s-card">
              <ApexChart
                id="apex-chart-transaction"
                :height="chartOptions.optionsTransaction.chart.height"
                :type="chartOptions.optionsTransaction.chart.type"
                :series="chartOptions.optionsTransaction.series"
                :options="chartOptions.optionsTransaction"
              >
              </ApexChart>
            </div>
          </VLoader>
        </div>
        <div class="column is-6">
          <VLoader card="regular" size="small" :active="isLoaderActive" translucent>
            <div class="s-card">
              <ApexChart
                id="apex-chart-tradevolumn"
                :height="chartOptions.optionsTradevolumn.chart.height"
                :type="chartOptions.optionsTradevolumn.chart.type"
                :series="chartOptions.optionsTradevolumn.series"
                :options="chartOptions.optionsTradevolumn"
              >
              </ApexChart>
            </div>
          </VLoader>
        </div>
      </div>
    </div>
  </div>
  
</template>

<style lang="scss">
@import '/@src/scss/abstracts/all';


/* Left Search bar */
:root {
  --header-bg-color: #fff;
  --search-border-color: #efefef;
  --subtitle-color: #83838e;
  --button-color: var(--white);
  --input-color: var(--subtitle-color);
}

.is-dark {
  --header-bg-color: var(--dark-sidebar-light-2);
  --search-border-color: var(--dark-sidebar-light-8);
  --input-color: var(--white);
}

.jobs-dashboard {
  display: flex;
  flex-direction: column;
  margin: 0 auto;
  overflow: hidden;

  .jobs-dashboard-wrapper {
    width: 100%;
    display: flex;
    flex-direction: column;
    flex-grow: 1;
    scroll-behavior: smooth;
    overflow: auto;
  }

  .search-menu {
    height: 56px;
    white-space: nowrap;
    display: flex;
    flex-shrink: 0;
    align-items: center;
    background-color: var(--header-bg-color);
    border-radius: 8px;
    width: 100%;
    padding-left: 0.75rem;

    > div:not(:last-of-type) {
      border-right: 1px solid var(--search-border-color);
    }

    .search-bar {
      height: 55px;
      width: 100%;
      position: relative;
      display: flex;
      align-items: center;
      padding-right: 1.5rem;

      .field {
        width: 100%;
      }

      .multiselect-tags {
        padding-left: 2.5rem;
      }
    }

    .search-location,
    .search-job,
    .search-salary {
      display: flex;
      align-items: center;
      width: 50%;
      font-size: 14px;
      font-weight: 500;
      padding: 0 25px;
      height: 100%;
      font-family: var(--font);

      input {
        width: 100%;
        height: 100%;
        display: block;
        font-family: var(--font);
        color: var(--input-color);
        background-color: transparent;
        border: none;
      }

      svg {
        margin-right: 0.5rem;
        width: 18px;
        color: var(--primary);
        flex-shrink: 0;
      }
    }

    .search-button {
      background-color: var(--primary);
      min-width: 120px;
      height: 55px;
      border: none;
      font-weight: 500;
      font-family: var(--font);
      padding: 0 1rem;
      border-radius: 0 0.75rem 0.75rem 0;
      color: var(--button-color);
      cursor: pointer;
      margin-left: auto;
    }
  }

  .main-container {
    display: flex;
    flex-grow: 1;
    padding-top: 2rem;

    .search-type {
      width: 270px;
      display: flex;
      flex-direction: column;
      height: 100%;
      flex-shrink: 0;
    }

    .alert {
      background-color: var(--widget-grey);
      padding: 1.75rem;
      border-radius: 8px;

      .alert-title {
        font-size: 1rem;
        font-family: var(--font-alt);
        font-weight: 600;
        color: var(--dark-text);
        margin-bottom: 0.75rem;
      }

      .alert-subtitle {
        font-size: 13px;
        font-family: var(--font);
        color: var(--subtitle-color);
        margin-bottom: 1.5rem;
      }

      input {
        border-radius: 6px;
      }
    }

    .job-time {
      padding-top: 1.75rem;

      .job-wrapper {
        padding-top: 1.75rem;
      }

      .job-time-title {
        font-size: 0.95rem;
        font-family: var(--font-alt);
        font-weight: 600;
        color: var(--dark-text);
      }

      .type-container {
        display: flex;
        align-items: center;
        color: var(--subtitle-color);
        font-size: 13px;

        label {
          margin-left: 2px;
          display: flex;
          align-items: center;
          cursor: pointer;
        }

        + .type-container {
          margin-top: 10px;
        }

        .job-number {
          margin-left: auto;
          display: flex;
          justify-content: center;
          align-items: center;
          height: 25px;
          min-width: 25px;
          background-color: var(--white);
          color: var(--subtitle-color);
          font-size: 0.8rem;
          font-family: var(--font);
          font-weight: 500;
          padding: 0 0.25rem;
          border-radius: 50rem;
        }
      }
    }

    .searched-jobs {
      display: flex;
      flex-direction: column;
      flex-grow: 1;
      padding-left: 2.5rem;
    }

    .searched-bar {
      display: flex;
      align-items: center;
      justify-content: space-between;

      .searched-count {
        font-family: var(--font-alt);
        font-size: 1.25rem;
        font-weight: 600;
        color: var(--dark-text);
      }
    }

    .job-cards {
      padding-top: 20px;
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      grid-column-gap: 1.5rem;
      grid-row-gap: 1.5rem;

      @media screen and (max-width: 1212px) {
        grid-template-columns: repeat(2, 1fr);
      }
      @media screen and (max-width: 930px) {
        grid-template-columns: repeat(1, 1fr);
      }
    }

    .job-card {
      @include vuero-l-card;

      cursor: pointer;
      transition: 0.2s;

      &:hover,
      &:focus {
        transform: translateY(-5px);
      }

      .job-card-header {
        display: flex;
        align-items: flex-start;
      }

      .job-card-logo {
        width: 80px;
        height: 80px;
      }

      .job-card-title {
        font-family: var(--font-alt);
        font-weight: 600;
        color: var(--dark-text);
        margin-bottom: 0.75rem;
      }

      .job-card-subtitle {
        color: var(--subtitle-color);
        font-family: var(--font);
        font-size: 0.95rem;
        line-height: 1.6em;
        margin-bottom: 1rem;
      }

      .job-card-buttons {
        margin-top: 1rem;

        .buttons {
          justify-content: space-between;

          .v-button {
            width: 48%;
          }
        }
      }
    }
  }
}

.is-dark {
  .jobs-dashboard {
    .job-card {
      @include vuero-card--dark;
    }

    .main-container {
      .alert {
        @include vuero-card--dark;
      }

      .job-time {
        .job-number {
          background: var(--dark-sidebar-light-2);
        }
      }
    }
  }
}

@media screen and (max-width: 620px) {
  .job-cards {
    grid-template-columns: repeat(1, 1fr);
  }
}

@media screen and (max-width: 730px) {
  .job-cards {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media screen and (max-width: 767px) {
  .jobs-dashboard {
    .search-menu {
      flex-direction: column;
      height: auto;
      padding: 1rem;

      > div:not(:last-of-type) {
        border-right: none;
      }

      .search-bar {
        padding: 0;
      }

      .search-location,
      .search-job,
      .search-salary {
        width: 100%;
        height: 44px;
        padding: 0;
      }

      .search-button {
        width: 100%;
        border-radius: 0.75rem;
      }
    }

    .main-container {
      .search-type {
        display: none;
      }

      .searched-jobs {
        padding-left: 0;
      }
    }
  }
}



/* right side datatable*/
.list-view-v3 {
  .list-view-item {
    @include vuero-r-card;

    margin-bottom: 16px;
    padding: 16px;

    .list-view-item-inner {
      display: flex;
      align-items: center;

      > img {
        width: 100%;
        max-width: 60px;
        min-width: 60px;
        max-height: 60px;
        min-height: 60px;
        border-radius: var(--radius-rounded);
        border: 1px solid var(--fade-grey);
      }

      .meta-left {
        margin-left: 16px;

        h3 {
          font-family: var(--font-alt);
          color: var(--dark-text);
          font-weight: 500;
          font-size: 1.1rem;
          line-height: 1;
        }

        > span:not(.tag) {
          font-size: 0.9rem;
          color: var(--light-text);

          svg {
            position: relative;
            top: 1px;
            height: 12px;
            width: 12px;
          }

          .icon-separator {
            position: relative;
            top: -3px;
            font-size: 5px;
            color: var(--light-text);
            padding: 0 8px;
          }

          .iconify {
            margin-right: 0.25rem;
          }
        }
      }

      .meta-right {
        margin-left: auto;
        display: flex;
        align-items: center;
        justify-content: flex-end;

        .buttons {
          margin-bottom: 0;
          margin-right: 10px;
        }
      }
    }
  }
}

.is-dark {
  .list-view-v2 {
    .list-view-item {
      @include vuero-card--dark;

      .list-view-item-inner {
        .meta-left {
          h3 {
            color: var(--dark-dark-text) !important;

            .rating {
              i:not(.active) {
                color: var(--dark-sidebar-dark-2);
              }
            }
          }

          > span {
            color: var(--primary);
          }

          .icon-list {
            > span {
              span {
                color: var(--dark-dark-text);
              }
            }
          }
        }

        .meta-right {
          .buttons {
            .button {
              &:first-child {
                background: var(--dark-sidebar-light-2);
                border-color: var(--dark-sidebar-light-8);
                color: var(--dark-dark-text);
              }
            }
          }
        }
      }
    }
  }
}

@media only screen and (max-width: 767px) {
  .list-view-v2 {
    .list-view-item {
      padding: 20px;

      .list-view-item-inner {
        flex-direction: column;

        > img {
          width: 100%;
          max-width: 100%;
          min-height: 160px;
          max-height: 160px;
          margin-bottom: 1rem;
        }

        .meta-left {
          margin-left: 0;

          > span {
            margin-bottom: 16px;
          }

          .icon-list {
            flex-wrap: wrap;

            > span {
              flex-direction: column;
              text-align: center;
              margin: 10px;
              width: calc(33.3% - 20px);

              i {
                margin: 0;
              }
            }
          }
        }

        .meta-right {
          margin: 16px 0 0;

          .buttons {
            margin: 0;
            width: 100%;
            display: flex;
            justify-content: space-between;

            .button {
              width: 48%;
            }
          }
        }
      }
    }
  }
}

@media only screen and (min-width: 768px) and (max-width: 1024px) and (orientation: portrait) {
  .list-view-v2 {
    .list-view-inner {
      display: flex;
      flex-wrap: wrap;

      .list-view-item {
        padding: 20px;
        margin: 10px;
        width: calc(50% - 20px);

        .list-view-item-inner {
          flex-direction: column;
          height: 100%;
          min-height: 450px;

          > img {
            width: 100%;
            max-width: 100%;
            min-height: 160px;
            max-height: 160px;
            margin-bottom: 1rem;
          }

          .meta-left {
            margin-left: 0;

            > span {
              margin-bottom: 16px;
            }

            .icon-list {
              flex-wrap: wrap;

              > span {
                flex-direction: column;
                text-align: center;
                margin: 10px;
                width: calc(33.3% - 20px);

                i {
                  margin: 0;
                }
              }
            }
          }

          .meta-right {
            margin: auto 0 0;
            display: flex;
            flex-direction: column;
            justify-content: flex-end;

            .buttons {
              margin: 16px 0 0;
              width: 100%;
              display: flex;
              justify-content: space-between;

              .button {
                width: 48%;
              }
            }
          }
        }
      }
    }
  }
}
</style>