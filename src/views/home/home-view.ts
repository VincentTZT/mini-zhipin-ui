import { computed, nextTick, onMounted, reactive, ref } from 'vue'
import type { FormInstance, FormRules } from 'element-plus'
import _ from 'lodash'
import { ElInput, ElMessage, ElNotification } from 'element-plus'
import ZhipinApi from '@/api/zhi-pin-api'
import { setZhiPinToken, removeAllCookies } from '@/utils/cookies'

import staticData from './static-data'

export default {
  setup() {
    const keywordInputRef = ref<InstanceType<typeof ElInput>>()
    const loginFormRef = ref<FormInstance>()

    const loginObj = reactive({
      authorized: false,
      cookieString: null as string | null,
      phone: null as string | null,

      rules: reactive<FormRules>({
        cookieString: [{ required: true, message: '请输入认证信息', trigger: 'blur' }],
        phone: [{ required: true, message: '请输入手机号', trigger: 'blur' }]
      }),

      onLogin: async (formRef: FormInstance) => {
        loginObj.authorized = false
        await formRef.validate((valid: boolean, fields: any) => {
          if (valid) {
            setZhiPinToken(loginObj.cookieString as string)
            localStorage.setItem('zhipin-phone', loginObj.phone as string)
            login()
          } else {
            errorCallBack({
              success: false,
              code: 400,
              message: Object.entries(fields)
                .map((item: any) => item[1][0])
                .map((item: any) => item.message)
                .join(', ')
            })
          }
        })
      }
    })

    const viewObj = reactive({
      positionSelected: '',
      positionList: [] as SelectorModel[],
      jobhunterArray: [] as Jobhunter[],

      ageRange: [18, 45],
      livenessList: staticData.livenessList as SelectorModel[],
      livenessSelected: [0],
      genderList: staticData.genderList as SelectorModel[],
      genderSelected: [0],
      recentNotViewList: staticData.recentNotViewList as SelectorModel[],
      recentNotViewSelected: [0],
      exchangeResumeWithColleagueList: staticData.exchangeResumeWithColleagueList as SelectorModel[],
      exchangeResumeWithColleagueSelected: [0],
      schoolLevelList: staticData.schoolLevelList as SelectorModel[],
      schoolLevelSelected: [0],
      switchJobFrequencyList: staticData.switchJobFrequencyList as SelectorModel[],
      switchJobFrequencySelected: [0],
      keyworkList: [] as SelectorModel[],
      keyworkSelected: [0],
      experienceRequireList: staticData.experienceRequireList as SelectorModel[],
      experienceRequireSelected: [0],
      educationalRequireList: staticData.educationalRequireList as SelectorModel[],
      educationalRequireSelected: [0],
      salaryRequireList: staticData.salaryRequireList as SelectorModel[],
      salaryRequireSelected: [0],
      intentionList: staticData.intentionList as SelectorModel[],
      intentionSelected: [0],
      firstSchoolLevel: false,

      elementTagTypes: ['primary', 'success', 'info', 'warning', 'danger'],
      loading: false,
      searchKeyword: {
        text: [] as string[],
        inputValue: '',
        isAddFocus: false,
        inputRef: ref<InstanceType<typeof ElInput>>(),
        inputHandleEnter: () => {
          if (_.trim(viewObj.searchKeyword.inputValue)) {
            viewObj.searchKeyword.text = Array.from(
              new Set(viewObj.searchKeyword.text.concat(viewObj.searchKeyword.inputValue.split(/\s+/).filter(Boolean)))
            )
          }

          viewObj.searchKeyword.inputValue = ''
        },
        inputHandleClose: () => {
          if (_.trim(viewObj.searchKeyword.inputValue)) {
            viewObj.searchKeyword.text = Array.from(
              new Set(viewObj.searchKeyword.text.concat(viewObj.searchKeyword.inputValue.split(/\s+/).filter(Boolean)))
            )
          }

          viewObj.searchKeyword.isAddFocus = false
          viewObj.searchKeyword.inputValue = ''
        },
        handleClose: (keyword: string) => {
          viewObj.searchKeyword.text.splice(viewObj.searchKeyword.text.indexOf(keyword), 1)
        },
        showInput: () => {
          viewObj.searchKeyword.isAddFocus = true
          nextTick(() => {
            keywordInputRef.value!.input!.focus()
          })
        },
        cleanKeyword: () => {
          viewObj.searchKeyword.text.length = 0
        },
        copyKeyword: () => {
          navigator.clipboard.writeText(viewObj.searchKeyword.text.join(' ')).catch((e) => errorCallBack(e))
        }
      },
      pageNumber: 1,
      triggerChatUsed: 0,

      onQuery: () => {
        viewObj.jobhunterArray.length = 0
        viewObj.pageNumber = 1
        viewObj.loading = true
        loadData()
      },

      onLoadMore: () => {
        if (viewObj.loading) return
        viewObj.loading = true
        loadData()
      },

      ageRangeFormat: (value: number): string => value + '岁',

      replaceNewLinesWithBr: (text: string) => {
        const content = text.replace(/\n/g, '<br>')
        return viewObj.searchKeyword.text.length > 0 ? markHighlightText(content) : content
      },

      assembleTags: (labels: String[]): ElementTagModel[] => {
        return labels.map(
          (label, index) =>
            ({
              label: label,
              type: viewObj.elementTagTypes[index % viewObj.elementTagTypes.length]
            }) as ElementTagModel
        )
      },

      onChangeLiveness: (values: number[]) => {
        viewObj.livenessSelected = values.length === 0 ? [0] : [values[values.length - 1]]
      },

      onChangeGender: (values: number[]) => {
        viewObj.genderSelected = values.length === 0 ? [0] : [values[values.length - 1]]
      },

      onChangeRecentNotView: (values: number[]) => {
        viewObj.recentNotViewSelected = values.length === 0 ? [0] : [values[values.length - 1]]
      },

      onChangeExchangeResumeWithColleague: (values: number[]) => {
        viewObj.exchangeResumeWithColleagueSelected = values.length === 0 ? [0] : [values[values.length - 1]]
      },

      onChangeSwitchJobFrequency: (values: number[]) => {
        viewObj.switchJobFrequencySelected = values.length === 0 ? [0] : [values[values.length - 1]]
      },

      onChangeSchoolLevel: (values: number[]) => {
        viewObj.schoolLevelSelected =
          values.length === 0 || values[values.length - 1] === 0 ? [0] : values.filter((i) => i !== 0)
      },

      onChangeExperienceRequire: (values: number[]) => {
        viewObj.experienceRequireSelected =
          values.length === 0 || values[values.length - 1] === 0 ? [0] : values.filter((i) => i !== 0)
      },

      onChangeEducationalRequire: (values: number[]) => {
        viewObj.educationalRequireSelected =
          values.length === 0 || values[values.length - 1] === 0 ? [0] : values.filter((i) => i !== 0)
      },

      onChangeSalaryRequire: (values: number[]) => {
        viewObj.salaryRequireSelected =
          values.length === 0 || values[values.length - 1] === 0 ? [0] : values.filter((i) => i !== 0)
      },

      onChangeIntention: (values: number[]) => {
        viewObj.intentionSelected =
          values.length === 0 || values[values.length - 1] === 0 ? [0] : values.filter((i) => i !== 0)
      },

      isMatchsearchKeyword: (content: string): boolean => {
        const keywords = viewObj.searchKeyword.text.map((keyword) => keyword.toLowerCase())
        return keywords.some((keyword) => content.includes(keyword))
      },

      onTriggerChat: (index: number) => {
        if (!viewObj.positionSelected) {
          ElNotification({
            title: 'Error',
            message: '请先选择要筛选的岗位！',
            type: 'error',
            duration: 2000
          })
          return
        }
        // ZhipinApi.triggerChar(viewObj.jobhunterArray[index], viewObj.positionSelected).then(
        //   (res: ResultModel<String>) => {
        //     if (res.success && res.body != null) {
        //       viewObj.jobhunterArray[index].triggerChatFlag = true
        //       loadTriggerChatUsed()
        //       ElNotification({
        //         title: 'Success',
        //         message: '打招呼成功！',
        //         type: 'success',
        //         duration: 2000
        //       })
        //     } else {
        //       errorCallBack(res)
        //     }
        //   }
        // )
      },

      isAuthorizedAndPositionSelectedValid: (): boolean => loginObj.authorized && Boolean(viewObj.positionSelected)
    })

    onMounted(() => {
      removeAllCookies()
      loginObj.authorized = false
      loginObj.cookieString = ''
      viewObj.jobhunterArray = []
    })

    const scrollDisabled = computed<boolean>(() => viewObj.jobhunterArray.length === 0)

    return {
      loginObj,
      viewObj,
      onMounted,
      scrollDisabled,
      keywordInputRef,
      loginFormRef
    }

    function errorCallBack(res: ResultModel<any>) {
      console.log('err' + res) // for debug
      ElNotification({
        title: 'Error',
        message: (res.body ? JSON.stringify(res.body) : res.message) || res.message,
        type: 'error',
        duration: 2000
      })
    }

    function markHighlightText(content: string): string {
      const keywords = viewObj.searchKeyword.text.map((keyword) => keyword.toLowerCase())
      const regex = new RegExp(`(${keywords.join('|')})`, 'gi')
      return content.replace(regex, (match) => `<span class="highlight">${match}</span>`)
    }

    function loadData() {
      // MiniZhipinApi.getJobhunterList(viewObj)
      //   .then((res: ResultModel<Jobhunter[]>) => {
      //     if (res.success && res.body != null) {
      //       viewObj.jobhunterArray = uniqueByProperty([...viewObj.jobhunterArray, ...(res.body as [])], 'jobhunterId')
      //       viewObj.pageNumber = res.body[0].pageNumber
      //       viewObj.loading = false
      //     } else {
      //       errorCallBack(res)
      //     }
      //   })
      //   .finally(() => {
      //     viewObj.loading = false
      //   })
    }

    function uniqueByProperty(array: any[], key: string) {
      const seen = new Set()
      return array.filter((item) => {
        const k = item[key]
        return seen.has(k) ? false : seen.add(k)
      })
    }

    function login() {
      ZhipinApi.getPositionList().then((res: any) => {
        viewObj.positionList.length = 0
        if (res.success && res.body != null) {
          loginObj.authorized = true
          viewObj.positionList = [...res.body]
          viewObj.positionSelected = viewObj.positionList[0].value as string
          viewObj.jobhunterArray.length = 0
          loadTriggerChatUsed()
          ElMessage({
            message: '登陆成功',
            type: 'success'
          })
        } else {
          errorCallBack(res)
        }
      })
    }

    function loadTriggerChatUsed() {
      //   MiniZhipinApi.getTriggerChatUsed().then((res: ResultModel<String>) => {
      //     viewObj.triggerChatUsed = 0
      //     if (res.success && res.body != null) {
      //       viewObj.triggerChatUsed = Number(res.body.match(/\d+/g)?.join('')) || 0
      //     } else {
      //       errorCallBack(res)
      //     }
      //   })
    }
  }
}
