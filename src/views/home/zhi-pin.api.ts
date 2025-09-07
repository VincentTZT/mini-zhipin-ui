import { dayjs } from 'element-plus'
import { requestZhipin } from '@/utils/request'

export default class ZhiPinApi {
  static getPositionList = (): Promise<SelectorModel[]> => {
    return requestZhipin({
      data: {
        method: 'GET',
        targetUrl: '/wapi/zpjob/job/recJobList',
      },
    }).then((res: ResultModelZhipin<any>) => {
      return res?.zpData?.onlineJobList?.map((item: any) => ({
        label: item.jobName + '_' + item.locationName + '（' + item.salaryDesc + '）',
        value: item.encryptId,
      })) as SelectorModel[]
    }) as Promise<SelectorModel[]>
  }

  static getTriggerChatUsed = (): Promise<string | null> => {
    return requestZhipin({
      data: {
        method: 'GET',
        targetUrl: '/wapi/zpblock/privilege/my/detail?from=',
      },
    }).then((res: ResultModelZhipin<any>) => {
      return res?.zpData?.currentPrivilegeUsed?.privileges
        ?.filter((item: any) => item.name === '今日沟通权益消耗')?.[0]
        ?.used?.toString()
    }) as Promise<string | null>
  }

  static getFilterOptions = (encryptId: string): Promise<FilterModel> => {
    return requestZhipin({
      data: {
        method: 'GET',
        targetUrl: '/wapi/zpblock/recommend/filters',
        params: {
          jobId: encryptId,
          source: 1,
        },
      },
    }).then((res: ResultModelZhipin<any>) => {
      return {
        majorList: extractFilterOptions(res?.zpData.vipFilter.filters, '专业').filter((item: any) => item.value !== -1),
        livenessList: extractFilterOptions(res?.zpData.vipFilter.filters, '活跃度'),
        genderList: extractFilterOptions(res?.zpData.vipFilter.filters, '性别'),
        recentNotViewList: extractFilterOptions(res?.zpData.vipFilter.filters, '近期没有看过'),
        exchangeResumeWithColleagueList: extractFilterOptions(res?.zpData.vipFilter.filters, '是否与同事交换简历'),
        schoolLevelList: extractFilterOptions(res?.zpData.vipFilter.filters, '院校'),
        switchJobFrequencyList: extractFilterOptions(res?.zpData.vipFilter.filters, '跳槽频率'),
        keyworkList: extractFilterOptions(res?.zpData.vipFilter.filters, '牛人关键词'),
        experienceRequireList: extractFilterOptions(res?.zpData.normalFilter.filters, '经验要求'),
        educationalRequireList: extractFilterOptions(res?.zpData.normalFilter.filters, '学历要求'),
        salaryRequireList: extractFilterOptions(res?.zpData.normalFilter.filters, '薪资待遇'),
        intentionList: extractFilterOptions(res?.zpData.normalFilter.filters, '求职意向'),
        firstDegree: res?.zpData.vipFilter.filters.filter((item: any) => item.name === '院校')?.[0].firstDegreeOption
          .code,
      } as FilterModel
    }) as Promise<FilterModel>
  }

  static getJobhunterList = (filterObj: any, pageNumber: number): Promise<Jobhunter[]> => {
    return requestZhipin({
      data: {
        method: 'GET',
        targetUrl: '/wapi/zpjob/rec/geek/list',
        params: buildFilterParams(filterObj, pageNumber),
      },
    }).then((res: ResultModelZhipin<any>) => {
      return res?.zpData?.geekList?.map((item: any) => ({
        jobhunterId: item.encryptGeekId,
        jobhunterName: item.geekCard.geekName,
        livenessDesc: item.activeTimeDesc,
        ageDesc: item.geekCard.ageDesc,
        gender: item.geekCard.geekGender,
        workExperience: item.geekCard.geekWorkYear,
        degreeDesc: item.geekCard.geekDegree,
        intentionDesc: item.geekCard.applyStatusDesc,
        expectJob: {
          cityDesc: item.geekCard.expectLocationName,
          positionDesc: item.geekCard.expectPositionName,
          salaryDesc: item.geekCard.salary,
        } as ExpectJob,
        degreeSchool: {
          startDate: safeFormat(item.geekCard.geekEdu.startDate),
          endDate: safeFormat(item.geekCard.geekEdu.endDate),
          schoolName: item.geekCard.geekEdu.school,
          degreeName: item.geekCard.geekEdu.major,
        } as DegreeSchool,
        workExperienceList: item.geekCard.geekWorks.map((work: any) => ({
          company: work.company,
          positionDesc: work.positionName,
          startDate: safeFormat(work.startDate),
          endDate: safeFormat(work.endDate),
          serviceTime: work.workTime,
          responsibilityDesc: work.responsibility,
        })) as WorkExperience[],
        workSkillLabelSet: buildWorkSkillLabelSet(item.geekCard.geekWorks),
        selfEvaluation: item.geekCard.geekDesc.content,
        chatPayload: {
          gid: item.geekCard.encGeekId,
          suid: item.suid,
          jid: res?.zpData?.encryptJobId,
          expectId: item.geekCard.expectId,
          lid: item.geekCard.lid,
          greet: null,
          from: null,
          securityId: item.geekCard.securityId,
          customGreetingGuide: -1,
          triggeredChatFlag: false,
        } as ChatPayloadModel,
      })) as Jobhunter[]
    }) as Promise<Jobhunter[]>
  }

  static triggerChar = (chatPayload: ChatPayloadModel): Promise<string> => {
    delete chatPayload.triggeredChatFlag
    return requestZhipin({
      data: {
        method: 'POST',
        targetUrl: '/wapi/zpjob/chat/start',
        params: chatPayload,
        headers: {
          'content-type': 'application/x-www-form-urlencoded',
        },
      },
    }).then((res: ResultModelZhipin<any>) => {
      return res.message
    }) as Promise<string>
  }
}

function extractFilterOptions(
  filters?: { name: string; options?: { name: string; code: string }[] }[] | null,
  filterName?: string
): SelectorModel[] {
  return filters
    ?.filter((item: any) => item.name === filterName)
    .flatMap((item: any) => item.options)
    .map((item: any) => ({
      label: item.name,
      value: item.code,
    })) as SelectorModel[]
}

function safeFormat(dateInput: string): string {
  const d = dayjs(dateInput)
  return d.isValid() ? d.format('YYYY-MM') : dateInput
}

function buildWorkSkillLabelSet(geekWorks: { workEmphasisList: string[] | null }[]): string[] {
  return Array.from(
    new Set(
      geekWorks.flatMap((skillList) => skillList?.workEmphasisList || []).map((skill) => skill.replace(/\.js$/i, ''))
    )
  )
}

function buildFilterParams(filterObj: any, pageNumber: number) {
  return {
    jobId: filterObj.positionSelected, // 单选
    age: [filterObj.ageRange[0], filterObj.ageRange[1] === 46 ? -1 : filterObj.ageRange[1]],
    activation: filterObj.livenessSelected[0], // 单选
    gender: filterObj.genderSelected[0], // 单选
    recentNotView: filterObj.recentNotViewSelected[0], // 单选
    exchangeResumeWithColleague: filterObj.exchangeResumeWithColleagueSelected[0], // 单选
    school: filterObj.schoolLevelSelected, // 多选
    firstDegree: filterObj.firstDegreeChecked ? filterObj.firstDegree : null,
    switchJobFrequency: filterObj.switchJobFrequencySelected[0], // 单选
    keyword1: filterObj.keyworkSelected.length === 0 ? [-1] : filterObj.keyworkSelected, // 多选
    experience: filterObj.experienceRequireSelected, // 多选
    degree: filterObj.educationalRequireSelected, // 多选
    salary: filterObj.salaryRequireSelected[0], // 单选
    intention: filterObj.intentionSelected, // 多选
    major: 0, // 多选 #TODO
    page: pageNumber,
    coverScreenMemory: 0,
    cardType: 0,
  }
}
