<script setup lang="ts">
import { useHead } from '@vueuse/head'
import { useViewWrapper } from '/@src/stores/viewWrapper'
import VueScrollTo from 'vue-scrollto'
import { useUserSession } from '/@src/stores/userSession'
import { useApi } from '/@src/composable/useApi'
import { useNotyf } from '/@src/composable/useNotyf'
import sleep from '/@src/utils/sleep'

const router = useRouter()
const route = useRoute()
const notyf = useNotyf()
const api = useApi()
const userSession = useUserSession()

const appuuid = (route.params?.appuuid as string) ?? ''

const viewWrapper = useViewWrapper()

const applicationJson = reactive({ data: {}})
const modalAttachmentOpen = ref(false)
const filename = ref('')

</script>

<template>
  <div class="page-content-inner">

    <VCardAdvanced style="margin-bottom:10px;">
      <template #header-left>
        <h2 class="title is-5 is-narrow">Attachments</h2>
      </template>
      <template #header-right>
        
      </template>
      <template #content>
        <template v-for="(attachment, attachmentIndex) in applicationJson.data.applicationAttachments" :key="attachmentIndex">
          <div class="content">
            <table>
              <thead>
                <tr>
                  <th>Filename</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>{{ attachment.filename }}</td>
                  <td>
                    <VButtons>
                      <VButton @click="filename=attachment.filename; modalAttachmentOpen = true" color="primary"  elevated> View Attachment </VButton>
                    </VButtons>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </template>
        
        <VModal
          :title="`Attachment: ${filename}`"
          size="big"
          actions="right"
          :open="modalAttachmentOpen"
          cancel-label="Close"
          @close="modalAttachmentOpen = false"
        >
          <template #content>
            <WorkflowApplicationAttachmentPopup :modalAttachmentOpen="modalAttachmentOpen" :appuuid="`${appuuid}`" :filename="`${filename}`"/>
          </template>
        </VModal>
        
      </template>
    </VCardAdvanced>
  </div>
</template>

<style lang="scss">

</style>



