/* eslint-disable @typescript-eslint/no-unused-vars */
interface ResultModelZhipin<T> {
  zpData?: T
  code?: number
  message?: string
}

interface SelectorModel {
  label?: string | number
  value?: string | number
}

interface FilterModel {
  majorList?: SelectorModel[]
  livenessList?: SelectorModel[]
  genderList?: SelectorModel[]
  recentNotViewList?: SelectorModel[]
  exchangeResumeWithColleagueList?: SelectorModel[]
  schoolLevelList?: SelectorModel[]
  switchJobFrequencyList?: SelectorModel[]
  keyworkList?: SelectorModel[]
  experienceRequireList?: SelectorModel[]
  educationalRequireList?: SelectorModel[]
  salaryRequireList?: SelectorModel[]
  intentionList?: SelectorModel[]
  firstDegree: number
}

interface Jobhunter {
  jobhunterId: string // 求职人id
  jobhunterName?: string // 求职人姓名
  livenessDesc?: string // 活跃状态
  ageDesc?: string // 年龄描述
  gender?: number // 性别
  workExperience?: string // 工作经验
  degreeDesc?: string // 学历描述
  intentionDesc?: string // 求职意向描述
  expectJob?: ExpectJob // 期望岗位
  educationList?: Education[] // 学历学校
  workExperienceList: WorkExperience[] // 工作经验列表
  workSkillLabelSet: string[] // 工作技能标签列表
  selfEvaluation?: string // 自我评价
  chatPayload: ChatPayloadModel // 打招呼请求体
  geekHighLightInfo?: string //  亮点
  followPayload: FollowPayloadModel // 关注请求体
  triggerClicked: boolean
}

interface ExpectJob {
  cityDesc?: string // 城市描述
  positionDesc?: string // 岗位描述
  salaryDesc?: string // 薪资描述
}

interface Education {
  startDate?: string // 开始时间
  endDate?: string // 结束时间
  schoolName?: string // 学校名称
  major?: string // 专业名称
  degreeName?: string // 学历名称
}

interface WorkExperience {
  company?: string // 公司名称
  positionDesc?: string // 岗位描述
  startDate?: string // 开始时间
  endDate?: string // 结束时间
  serviceTime?: string // 服务时长
  responsibilityDesc?: string // 主要职责
}

interface ElementTagModel {
  label?: string
  type?: string
  match: boolean
}

interface ChatPayloadModel {
  gid?: string | null
  suid?: string | null
  jid?: string | null
  expectId?: number
  lid?: string | null
  greet?: string | null
  from?: string | null
  securityId?: string | null
  customGreetingGuide?: number | null
  triggeredChatFlag?: boolean // 触发聊天标志
}

interface FollowPayloadModel {
  markType: number
  encryptMarkId: string
  securityId?: string | null
  followed?: boolean // 是否关注
}
