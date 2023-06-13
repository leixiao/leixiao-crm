<script setup lang="ts">
import { useUserSession } from '/@src/stores/userSession'
import { useApi } from '/@src/composable/useApi'
import { useNotyf } from '/@src/composable/useNotyf'
import { useThemeColors } from '/@src/composable/useThemeColors'

const router = useRouter()
const userSession = useUserSession()
const notyf = useNotyf()
const api = useApi()

const props = defineProps<{
  modalAttachmentOpen?: boolean
  appuuid?: string
  filename?: string
}>()

const attachmentFileJson = reactive({data: {}})

if(props.modalAttachmentOpen === true){
  try{
    const response = await api.get(`/workflow-service/application/attachment/${props.appuuid}/${props.filename}`)
    attachmentFileJson.data = response.data

  } catch (err: unknown) {
    console.log('err: ', JSON.stringify(err, null, 2))
    if(err.hasOwnProperty('response') && err.response.status > 299){
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

  }
}

</script>

<template>
  <div>
    {{ props.appuuid }}
    <br/>
    {{ props.filename }}
    <br/>
    {{ props.modalAttachmentOpen }}
  </div>
  <div>
    <!-- this data is not loaded when modal popup, but I expected to load -->
    {{ attachmentFileJson.data }}
    <!-- and I don't know how to present a file on html page -->
  
  </div>

</template>

<style lang="scss">
@import '/@src/scss/abstracts/all';

</style>
