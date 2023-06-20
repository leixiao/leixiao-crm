<script setup lang="ts">
import { useHead } from '@vueuse/head'
import { useViewWrapper } from '/@src/stores/viewWrapper'
import VueScrollTo from 'vue-scrollto'
import { useUserSession } from '/@src/stores/userSession'
import { useApi } from '/@src/composable/useApi'
import { useNotyf } from '/@src/composable/useNotyf'
import sleep from '/@src/utils/sleep'
import { Field, Form, useForm } from 'vee-validate'
import * as yup from 'yup'
import { z as zod } from 'zod'

import { popovers } from '/@src/data/users/userPopovers'
import { group } from 'console'
//import { workflowMaster } from '/@src/data/workflow/workflowMaster'

const router = useRouter()
const route = useRoute()
const notyf = useNotyf()
const api = useApi()
const userSession = useUserSession()

const { scrollTo } = VueScrollTo

console.log('enter')
const wfuuid = (route.params?.wfuuid as string) ?? ''
console.log('workflow key = ', wfuuid)

const viewWrapper = useViewWrapper()

const workflowJson = reactive({ data: {}})


const onSubmit = async (values) => {
  
  let transitParams = {
    applicationAnswerGroups: workflowJson.data.workflowTransitions[0].workflowQuestionGroups.map(group => {
      return { 
        answerGroupNo: 0,
        applicationAnswers: group.workflowQuestions.map((question) => {
        
          return {
            answer: question.answer,
            questionNo: question.questionNo,
            rowNo: 1
          }
        }),
        questionGroupNo: group.questionGroupNo
      }
      
    }),
    comment: 'submit',
    transitionNo: 1
  }
  

  console.log("submit data prepared: ", transitParams)
  
}

function addQuestionGroup(transitionNo, questionGroupNo){
  let maxQuestionGroupNo = 0
  let currentQuestionGroup = {}
  workflowJson.data.workflowTransitions.forEach(transition => {
    if(transition.transitionNo == transitionNo){
      //console.log("enter transitionNo = ", transition.transitionNo)
      transition.workflowQuestionGroups.forEach(questionGroup => {
        if(maxQuestionGroupNo < questionGroup.questionGroupNo){
          maxQuestionGroupNo = questionGroup.questionGroupNo
        }
        if(questionGroup.questionGroupNo == questionGroupNo){
          currentQuestionGroup = { ...questionGroup }
          
        }
      })

      transition.workflowQuestionGroups.push(JSON.parse(JSON.stringify(currentQuestionGroup)))
    }
  })
 
  
}

const schemaHa = yup.object().shape({
    TextBox: yup.string()
        .required('Field is required'),
    firstName: yup.string()
        .required('Field is required'),
    DropDownList: yup.string()
        .required('Field is required'),
    dob: yup.string()
        .required('Date of Birth is required')
        .matches(/^\d{4}-(0[1-9]|1[012])-(0[1-9]|[12][0-9]|3[01])$/, 'Date of Birth must be a valid date in the format YYYY-MM-DD'),
    email: yup.string()
        .required('Email is required')
        .email('Email is invalid'),
    password: yup.string()
        .min(6, 'Password must be at least 6 characters')
        .required('Password is required'),
    confirmPassword: yup.string()
        .oneOf([yup.ref('password'), null], 'Passwords must match')
        .required('Confirm Password is required'),
    acceptTerms: yup.string()
        .required('Accept Ts & Cs is required')
});

function onSubmitHa(values) {
    // display form values on success
    alert('SUCCESS!! :-)\n\n' + JSON.stringify(values, null, 4));
}

</script>

<template>
  <div class="page-content-inner">
    
           
        
    <Form class="form-layout is-stacked" @submit="onSubmit" :validation-schema="schemaHa" v-slot="{ errors }">
      <div class="form-outer">
        <div :class="[isStuck && 'is-stuck']" class="form-header stuck-header">
          <div class="form-header-inner">
            <div class="left">
              <h3>Input answer</h3>
            </div>
            <div class="right">
              <div class="buttons">
                <VButton
                  icon="lnir lnir-arrow-left rem-100"
                  to="/workflow/application/list/uncompleted"
                  light
                  dark-outlined
                >
                  Cancel
                </VButton>
                <VButton type="submit" color="primary" raised > Submit </VButton>
              </div>
            </div>
          </div>
        </div>
        
        <div class="form-body">
          <div v-for="(workflowQuestionGroup, groupIndex) in workflowJson.data.workflowTransitions[0].workflowQuestionGroups" :key="groupIndex">
            <div class="form-section">
              <div class="form-section-header">
                <div class="left">
                  <h3>{{ workflowQuestionGroup.name }}</h3>
                </div>
              </div>
                
              <div class="form-section-inner is-horizontal">
                
                <!-- A button to allow user to add one question group -->
                <button type="button" class="input-button" @click="addQuestionGroup(1, workflowQuestionGroup.questionGroupNo)">
                  <i aria-hidden="true" class="iconify" data-icon="feather:plus"></i>
                  <span>Add one question group</span>
                </button>
                  
                <div class="columns is-multiline">
                  <template v-for="(workflowQuestion, index) in workflowQuestionGroup.workflowQuestions" :key="index">
                    <div v-if="workflowQuestion.inputType=='TextBox'" class="column is-6">
                      <VField>
                        <VLabel>{{ workflowQuestion.name }}</VLabel>
                        <VControl icon="feather:edit-2" fullwidth>
                          <VInput v-model="workflowQuestion.answer" type="text" :placeholder="workflowQuestion.answer" style="width:100%;"/>
                          <p v-if="field?.errorMessage" class="help is-danger">
                            {{ field.errorMessage }}
                          </p>
                        </VControl>
                      </VField>
                    </div>
                    <div v-else-if="workflowQuestion.inputType=='DropDownList'" class="column is-6">
                      <VField v-slot="{ id }">
                        <VLabel>{{ workflowQuestion.name }}</VLabel>
                        <VControl fullwidth>
                          <!--<Multiselect
                            v-model="workflowQuestion.answer"
                            :attrs="{ id }"
                            placeholder="Pick an option"
                            :options="workflowQuestion.workflowQuestionAnswers.map(obj => obj.description).sort((a,b) => a.answerNo - b.answerNo)"
                          />-->
                          <VSelect v-model="workflowQuestion.answer">
                            <template v-for="(answerOption, answerOptionIndex) in workflowQuestion.workflowQuestionAnswers" :key="answerOptionIndex">
                              <VOption :value="answerOption.answerKey">{{ answerOption.description }}</VOption>
                            
                            </template>
                          
                          </VSelect>
                        </VControl>
                      </VField>
                    </div>
                    <div v-else-if="workflowQuestion.inputType=='DateTimePicker'" class="column is-6">
                      <VDatePicker 
                        v-model="workflowQuestion.answer" 
                        color="green" 
                        mode="date" 
                        :model-config="{
                          type: 'string',
                          mask: 'YYYY-MM-DD',
                        }"
                        :masks="{ L: 'YYYY-MM-DD' }"
                      >
                        <template #default="{ inputValue, inputEvents }">
                          <VField :label="workflowQuestion.name">
                            
                            <VControl icon="feather:calendar">
                              <VInput
                                type="text"
                                :placeholder="workflowQuestion.name"
                                :value="inputValue"
                                v-on="inputEvents"
                              />
                            </VControl>
                          </VField>
                        </template>
                      </VDatePicker>
                    </div>
                    
                  </template>
                </div>                
              </div>
            </div>
          </div>
        </div>
      </div>
    </Form>
  </div>
</template>

<style lang="scss">
@import '/@src/scss/abstracts/all';
@import '/@src/scss/components/forms-outer';



</style>
