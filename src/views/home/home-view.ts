import { computed, nextTick, onMounted, reactive, ref } from 'vue'
import type { FormInstance, FormRules } from 'element-plus'
import _ from 'lodash'
import { ElInput, ElMessage, ElNotification, ElLoading } from 'element-plus'
import draggable from 'vuedraggable'
import ZhiPinApi from '@/views/home/zhi-pin.api'
import { setZhiPinToken, removeAllCookies } from '@/utils/cookies'
import { errorCallBack } from '@/utils/request'
import highlightingImg from '@/assets/highlighting.webp'

export default {
  components: {
    draggable,
  },
  setup() {
    const searchKeywordInputRef = ref<InstanceType<typeof ElInput>>()
    const positionKeywordInputRef = ref<InstanceType<typeof ElInput>>()
    const loginFormRef = ref<FormInstance>()
    const searchKeywordOnlyPanel = ref('search-keyword-only-panel')
    const positionKeywordOnlyPanel = ref('position-keyword-only-panel')

    let fullScreenLoading = null as any

    // 用于悬浮拖拽的位置
    const collapsePosition = reactive({
      top: 150,
      left: window.innerWidth - 450,
    })

    // 拖拽相关变量
    const isDragging = ref(false)
    const startPosition = ref({ x: 0, y: 0 })

    const loginObj = reactive({
      authorized: false,
      cookieString: null as string | null,
      phone: null as string | null,

      rules: reactive<FormRules>({
        cookieString: [{ required: true, message: '请输入认证信息', trigger: 'blur' }],
        phone: [{ required: true, message: '请输入手机号', trigger: 'blur' }],
      }),

      onLogin: (formRef: FormInstance) => {
        loginObj.authorized = false
        formRef.validate((valid: boolean, fields: any) => {
          if (valid) {
            setZhiPinToken(loginObj.cookieString as string)
            localStorage.setItem('zhipin-login-phone', loginObj.phone as string)
            login()
          } else {
            errorCallBack({
              success: false,
              code: 400,
              message: Object.entries(fields)
                .map((item: any) => item[1][0])
                .map((item: any) => item.message)
                .join(', '),
            })
          }
        })
      },
    })

    const filterObj = reactive({
      loading: false,

      positionSelected: '',
      positionList: [] as SelectorModel[],

      ageRange: [18, 46],
      majorList: [] as SelectorModel[],
      majorSelected: [0],
      livenessList: [] as SelectorModel[],
      livenessSelected: [0],
      genderList: [] as SelectorModel[],
      genderSelected: [0],
      recentNotViewList: [] as SelectorModel[],
      recentNotViewSelected: [0],
      exchangeResumeWithColleagueList: [] as SelectorModel[],
      exchangeResumeWithColleagueSelected: [0],
      schoolLevelList: [] as SelectorModel[],
      schoolLevelSelected: [0],
      switchJobFrequencyList: [] as SelectorModel[],
      switchJobFrequencySelected: [0],
      keyworkList: [] as SelectorModel[],
      keyworkSelected: [] as number[],
      experienceRequireList: [] as SelectorModel[],
      experienceRequireSelected: [0],
      educationalRequireList: [] as SelectorModel[],
      educationalRequireSelected: [0],
      salaryRequireList: [] as SelectorModel[],
      salaryRequireSelected: [0],
      intentionList: [] as SelectorModel[],
      intentionSelected: [0],

      displayFirstDegree: false,
      firstDegreeChecked: false,
      firstDegree: null as number | null,

      onChangePosition: (value: string) => {
        if (!value) {
          ElNotification({
            title: 'Error',
            message: '请先选择要筛选的岗位！',
            type: 'error',
            duration: 2000,
          })
          return
        }
        filterObj.loading = true
        filterObj.displayFirstDegree = false
        filterObj.firstDegreeChecked = false
        viewObj.jobhunterList = []

        const searchKeywords = localStorage.getItem('zhipin-search-keyword' + '-' + value)
        if (searchKeywords) {
          viewObj.searchKeyword.text = JSON.parse(searchKeywords)
        } else {
          viewObj.searchKeyword.text = []
        }

        const positionKeywords = localStorage.getItem('zhipin-position-keyword' + '-' + value)
        if (positionKeywords) {
          viewObj.positionKeyword.text = JSON.parse(positionKeywords)
        } else {
          viewObj.positionKeyword.text = []
        }

        ZhiPinApi.getFilterOptions(value)
          .then((res: FilterModel) => {
            filterObj.majorList = res.majorList || []
            filterObj.livenessList = res.livenessList || []
            filterObj.genderList = res.genderList || []
            filterObj.recentNotViewList = res.recentNotViewList || []
            filterObj.exchangeResumeWithColleagueList = res.exchangeResumeWithColleagueList || []
            filterObj.schoolLevelList = res.schoolLevelList || []
            filterObj.switchJobFrequencyList = res.switchJobFrequencyList || []
            filterObj.keyworkList = res.keyworkList || []
            filterObj.experienceRequireList = res.experienceRequireList || []
            filterObj.educationalRequireList = res.educationalRequireList || []
            filterObj.salaryRequireList = res.salaryRequireList || []
            filterObj.intentionList = res.intentionList || []
            filterObj.firstDegree = res.firstDegree

            filterObj.majorSelected = [0]
            filterObj.livenessSelected = [0]
            filterObj.genderSelected = [0]
            filterObj.recentNotViewSelected = [0]
            filterObj.exchangeResumeWithColleagueSelected = [0]
            filterObj.schoolLevelSelected = [0]
            filterObj.switchJobFrequencySelected = [0]
            filterObj.keyworkSelected = []
            filterObj.experienceRequireSelected = [0]
            filterObj.educationalRequireSelected = [0]
            filterObj.salaryRequireSelected = [0]
            filterObj.intentionSelected = [0]
          })
          .finally(() => {
            searchKeywordOnlyPanel.value = 'search-keyword-only-panel'
            positionKeywordOnlyPanel.value = 'position-keyword-only-panel'
            filterObj.loading = false
          })
      },

      ageRangeFormat: (value: number): string => value + '岁',

      onChangeMajor: (values: number[]) => {
        filterObj.majorSelected =
          values.length === 0 || values[values.length - 1] === 0 ? [0] : values.filter((i) => i !== 0)
      },

      onChangeLiveness: (values: number[]) => {
        filterObj.livenessSelected = values.length === 0 ? [0] : [values[values.length - 1]]
      },

      onChangeGender: (values: number[]) => {
        filterObj.genderSelected = values.length === 0 ? [0] : [values[values.length - 1]]
      },

      onChangeRecentNotView: (values: number[]) => {
        filterObj.recentNotViewSelected = values.length === 0 ? [0] : [values[values.length - 1]]
      },

      onChangeExchangeResumeWithColleague: (values: number[]) => {
        filterObj.exchangeResumeWithColleagueSelected = values.length === 0 ? [0] : [values[values.length - 1]]
      },

      onChangeSchoolLevel: (values: number[]) => {
        filterObj.schoolLevelSelected =
          values.length === 0 || values[values.length - 1] === 0 ? [0] : values.filter((i) => i !== 0)
        filterObj.displayFirstDegree = filterObj.schoolLevelSelected[0] !== 0
      },

      onChangeSwitchJobFrequency: (values: number[]) => {
        filterObj.switchJobFrequencySelected = values.length === 0 ? [0] : [values[values.length - 1]]
      },

      onChangeExperienceRequire: (values: number[]) => {
        filterObj.experienceRequireSelected =
          values.length === 0 || values[values.length - 1] === 0 ? [0] : values.filter((i) => i !== 0)
      },

      onChangeEducationalRequire: (values: number[]) => {
        filterObj.educationalRequireSelected =
          values.length === 0 || values[values.length - 1] === 0 ? [0] : values.filter((i) => i !== 0)
      },

      onChangeSalaryRequire: (values: number[]) => {
        filterObj.salaryRequireSelected = values.length === 0 ? [0] : [values[values.length - 1]]
      },

      onChangeIntention: (values: number[]) => {
        filterObj.intentionSelected =
          values.length === 0 || values[values.length - 1] === 0 ? [0] : values.filter((i) => i !== 0)
      },

      onQuery: () => {
        viewObj.jobhunterList.length = 0
        viewObj.pageNumber = 1
        loadData()
      },

      isAuthorizedAndPositionSelectedValid: (): boolean => loginObj.authorized && Boolean(filterObj.positionSelected),

      filterLoopCount: 0,
    })

    const viewObj = reactive({
      jobhunterList: [] as Jobhunter[],
      followList: [] as string[],
      pageNumber: 1,
      triggerChatUsed: 0,
      chatCount: 0,

      followListPage: 1,

      elementTagTypes: ['primary', 'success', 'info', 'warning', 'danger'],
      loading: false,
      searchKeyword: {
        text: [] as string[],
        inputValue: '',
        isAddFocus: false,
        inputRef: ref<InstanceType<typeof ElInput>>(),
        inputHandleEnter: () => {
          splitSearchKeywords()
        },
        inputHandleClose: () => {
          splitSearchKeywords()
          viewObj.searchKeyword.isAddFocus = false
        },
        handleClose: (keyword: string) => {
          viewObj.searchKeyword.text.splice(viewObj.searchKeyword.text.indexOf(keyword), 1)
        },
        showInput: () => {
          viewObj.searchKeyword.isAddFocus = true
          nextTick(() => {
            searchKeywordInputRef.value!.input!.focus()
          })
        },
        cleanKeyword: () => {
          viewObj.searchKeyword.text.length = 0
        },
        copyKeyword: () => {
          navigator.clipboard.writeText(viewObj.searchKeyword.text.join(' ')).catch((e) => errorCallBack(e))
        },
      },
      positionKeyword: {
        text: [] as string[],
        inputValue: '',
        isAddFocus: false,
        inputRef: ref<InstanceType<typeof ElInput>>(),
        inputHandleEnter: () => {
          splitPositionKeywords()
        },
        inputHandleClose: () => {
          splitPositionKeywords()
          viewObj.positionKeyword.isAddFocus = false
        },
        handleClose: (keyword: string) => {
          viewObj.positionKeyword.text.splice(viewObj.positionKeyword.text.indexOf(keyword), 1)
        },
        showInput: () => {
          viewObj.positionKeyword.isAddFocus = true
          nextTick(() => {
            positionKeywordInputRef.value!.input!.focus()
          })
        },
        cleanKeyword: () => {
          viewObj.positionKeyword.text.length = 0
        },
        copyKeyword: () => {
          navigator.clipboard.writeText(viewObj.positionKeyword.text.join(' ')).catch((e) => errorCallBack(e))
        },
      },

      onLoadMore: () => {
        if (viewObj.jobhunterList.length === 0) return
        if (viewObj.loading) return
        loadData()
      },

      replaceNewLinesWithBr: (text?: string) => {
        const content = text?.replace(/\n/g, '<br>')
        return viewObj.searchKeyword.text.length > 0 ? markHighlightText(content || '') : content
      },

      assembleTags: (labels: string[]): ElementTagModel[] => {
        return labels.map(
          (label, index) =>
            ({
              label: label,
              type: viewObj.elementTagTypes[index % viewObj.elementTagTypes.length],
            }) as ElementTagModel
        )
      },

      isMatchSearchKeyword: (content: string | null): boolean => {
        const keywords = viewObj.searchKeyword.text.map((keyword) => keyword.toLowerCase())
        return keywords.some((keyword) => content?.toLowerCase().includes(keyword))
      },

      onTriggerChat: async (chatPayload: ChatPayloadModel, item: Jobhunter) => {
        item.triggerClicked = true
        if (!filterObj.isAuthorizedAndPositionSelectedValid()) {
          ElNotification({
            title: 'Error',
            message: '请先选择要筛选的岗位！',
            type: 'error',
            duration: 2000,
          })
          item.triggerClicked = false
          return
        }
        if (viewObj.triggerChatUsed >= viewObj.chatCount) {
          await loadTriggerChatUsed()
          if (viewObj.triggerChatUsed >= viewObj.chatCount) {
            ElNotification({
              title: 'Warning',
              message: '沟通次数已用完！',
              type: 'warning',
              duration: 2000,
            })
            item.triggerClicked = false
            return
          }
        }
        ZhiPinApi.triggerChar(chatPayload)
          .then((res: string) => {
            if (res === 'Success') {
              chatPayload.triggeredChatFlag = true
              viewObj.triggerChatUsed++
              ElNotification({
                title: 'Success',
                message: '打招呼成功！',
                type: 'success',
                duration: 2000,
              })
            } else {
              errorCallBack(res)
            }
          })
          .finally(() => {
            item.triggerClicked = false
          })
      },

      onFollow: (followPayload: FollowPayloadModel, item: Jobhunter) => {
        item.triggerClicked = true
        ZhiPinApi.follow(followPayload)
          .then((res: string) => {
            if (res === 'Success') {
              if (followPayload.followed) {
                viewObj.followList.push(followPayload.encryptMarkId)
              } else {
                viewObj.followList.splice(viewObj.followList.indexOf(followPayload.encryptMarkId), 1)
              }
              followPayload.followed = !followPayload.followed
              ElNotification({
                title: 'Success',
                message: followPayload.followed ? '收藏成功！' : '取消收藏成功！',
                type: 'success',
                duration: 2000,
              })
            } else {
              errorCallBack(res)
            }
          })
          .finally(() => {
            item.triggerClicked = false
          })
      },
    })

    onMounted(() => {
      const expired = localStorage.getItem('zhipin-login-expired')
      if (expired) {
        ElMessage.error(expired)
      }
      removeAllCookies()
      loginObj.authorized = false
      loginObj.cookieString = null
      viewObj.jobhunterList = []
    })

    // 拖拽事件处理函数
    const onDragStart = (e: MouseEvent) => {
      isDragging.value = true
      startPosition.value = {
        x: e.clientX - collapsePosition.left,
        y: e.clientY - collapsePosition.top,
      }
      document.addEventListener('mousemove', onDragMove)
      document.addEventListener('mouseup', onDragEnd)
    }

    const onDragMove = (e: MouseEvent) => {
      if (!isDragging.value) return
      collapsePosition.left = e.clientX - startPosition.value.x
      collapsePosition.top = e.clientY - startPosition.value.y
    }

    const onDragEnd = () => {
      isDragging.value = false
      document.removeEventListener('mousemove', onDragMove)
      document.removeEventListener('mouseup', onDragEnd)
    }

    return {
      loginObj,
      filterObj,
      viewObj,
      searchKeywordInputRef,
      positionKeywordInputRef,
      loginFormRef,
      highlightingImg,
      searchKeywordOnlyPanel,
      positionKeywordOnlyPanel,
      collapsePosition,
      onDragStart,
    }

    function markHighlightText(content: string): string {
      const keywords = viewObj.searchKeyword.text.map((keyword) => keyword.toLowerCase())

      if (keywords.length === 0) {
        return content
      }

      // 转义所有特殊字符
      const escapedKeywords = keywords.map((keyword) => keyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'))
      const regex = new RegExp(`(${escapedKeywords.join('|')})`, 'gi')
      return content.replace(regex, (match) => `<span class="search-keyword-text">${match}</span>`)
    }

    async function loadData() {
      if (viewObj.triggerChatUsed >= viewObj.chatCount) {
        await loadTriggerChatUsed()
        if (viewObj.triggerChatUsed >= viewObj.chatCount) {
          ElNotification({
            title: 'Warning',
            message: '沟通次数已用完！',
            type: 'warning',
            duration: 2000,
          })
          return
        }
      }
      viewObj.loading = true
      localStorage.setItem(
        'zhipin-search-keyword' + '-' + filterObj.positionSelected,
        JSON.stringify(viewObj.searchKeyword.text || [])
      )
      localStorage.setItem(
        'zhipin-position-keyword' + '-' + filterObj.positionSelected,
        JSON.stringify(viewObj.positionKeyword.text || [])
      )
      ZhiPinApi.getJobhunterList(filterObj, viewObj.pageNumber)
        .then((res: Jobhunter[]) => {
          if (viewObj.positionKeyword.text.length > 0) {
            const positionKeywords = viewObj.positionKeyword.text.map((keyword) => keyword.toLowerCase())
            res = res.filter((item: Jobhunter) => {
              const positionDesc = item.expectJob?.positionDesc || ''
              return positionKeywords.some((keyword) => positionDesc.toLowerCase().includes(keyword))
            })
          }

          if (viewObj.searchKeyword.text.length > 0) {
            res = res.filter((item: Jobhunter) => viewObj.isMatchSearchKeyword(JSON.stringify(item)))
          }

          if (res.length === 0 && (viewObj.searchKeyword.text.length > 0 || viewObj.positionKeyword.text.length > 0)) {
            if (filterObj.filterLoopCount < 2) {
              filterObj.filterLoopCount++
              ElNotification({
                title: 'Warning',
                message: `没有符合条件的求职人，正在第${filterObj.filterLoopCount + 1}轮查找！`,
                type: 'warning',
                duration: 2000,
              })
              setTimeout(() => loadData(), (Math.floor(Math.random() * 4) + 3) * 1000)
              return
            } else {
              filterObj.filterLoopCount = 0
              ElNotification({
                title: 'Warning',
                message: '无法找到符合条件的求职人, 请调整关键字后重新查询！',
                type: 'warning',
              })
            }
          } else {
            filterObj.filterLoopCount = 0
          }

          res.map((item: Jobhunter) => {
            item.followPayload.followed = viewObj.followList.includes(item.jobhunterId)
            return item
          })

          viewObj.jobhunterList = uniqueByProperty([...viewObj.jobhunterList, ...res], 'jobhunterId')
        })
        .finally(() => {
          viewObj.pageNumber++
          if (filterObj.filterLoopCount === 0) {
            viewObj.loading = false
          }
        })
    }

    function uniqueByProperty(array: any[], key: string) {
      const seen = new Set()
      return array.filter((item) => {
        const k = item[key]
        return seen.has(k) ? false : seen.add(k)
      })
    }

    function login() {
      fullScreenLoading = ElLoading.service({
        lock: true,
        text: 'Loading',
        background: 'rgba(0, 0, 0, 0.7)',
      })
      ZhiPinApi.getPositionList()
        .then(async (res: SelectorModel[]) => {
          filterObj.positionList.length = 0
          filterObj.positionList = [...res]
          filterObj.positionSelected = (filterObj.positionList[0]?.value as string) || ''
          viewObj.jobhunterList.length = 0
          filterObj.onChangePosition(filterObj.positionSelected)
          loginObj.authorized = true
          localStorage.setItem('zhipin-login-timestamp', new Date().getTime().toString())
          await loadTriggerChatUsed()
          await getFollowList()

          ElMessage({
            message: '登陆成功',
            type: 'success',
          })
        })
        .finally(() => fullScreenLoading.close())
    }

    async function loadTriggerChatUsed() {
      return new Promise<void>((resolve) => {
        ZhiPinApi.getTriggerChatUsed().then((res: any) => {
          viewObj.triggerChatUsed = Number(res?.used?.match(/\d+/g)?.join('')) || 0
          viewObj.chatCount = parseInt(res?.usedCount.match(/共(\d+)个/)?.[1] || 0)
          setTimeout(() => resolve(), 1000)
        })
      })
    }

    function splitSearchKeywords() {
      if (_.trim(viewObj.searchKeyword.inputValue)) {
        viewObj.searchKeyword.text = Array.from(
          new Set(viewObj.searchKeyword.text.concat(viewObj.searchKeyword.inputValue.split(/[\s,，]+/).filter(Boolean)))
        )
      }
      viewObj.searchKeyword.inputValue = ''
    }

    function splitPositionKeywords() {
      if (_.trim(viewObj.positionKeyword.inputValue)) {
        viewObj.positionKeyword.text = Array.from(
          new Set(
            viewObj.positionKeyword.text.concat(viewObj.positionKeyword.inputValue.split(/[\s,，]+/).filter(Boolean))
          )
        )
      }
      viewObj.positionKeyword.inputValue = ''
    }

    async function getFollowList() {
      return new Promise<void>((resolve) => {
        ZhiPinApi.getFollowList(viewObj.followListPage).then((res: any) => {
          viewObj.followList = Array.from(new Set([...viewObj.followList, ...res?.jobhunterIds]))
          if (res.hasMore) {
            viewObj.followListPage++
            getFollowList().then(() => resolve())
          } else {
            resolve()
          }
        })
      })
    }
  },
}
