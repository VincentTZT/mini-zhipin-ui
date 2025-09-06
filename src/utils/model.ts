/* eslint-disable @typescript-eslint/no-unused-vars */
interface ResultModel<T> {
  body?: T
  code?: number
  count?: number
  success: boolean
  message?: string
}

interface ResultModelZhipin<T> {
  zpData?: T
  code?: number
  message?: string
}

interface SelectorModel {
  label?: string | number
  value?: string | number
}

interface QrcodeKeyModel {
  qrId: string
  randKey?: string
  secretKey?: string
  shortRandKey?: string
}

interface Jobhunter {
  jobhunterId?: String
  jobhunterName?: string
  activationDesc?: string
  expectId: string
  securityId: string
  lid: string
  suid: string
  ageDesc?: string
  gender?: number
  workExperience?: string
  degreeDesc?: String
  intentionDesc?: string
  expectJob?: expectJob
  degreeSchool?: degreeSchool
  workExperienceList: workExperience[]
  workSkillLabelSet: string[]
  selfEvaluation?: string
  triggerChatFlag: boolean
  pageNumber: number
}

interface expectJob {
  cityDesc?: string
  positionDesc?: string
  salaryDesc?: string
}

interface degreeSchool {
  startDate?: String
  endDate?: String
  schoolName?: String
  degreeName?: String
}

interface workExperience {
  company?: String
  positionDesc?: String
  startDate?: String
  endDate?: String
  departmentDesc?: String
  serviceTime?: String
  jobDesc?: String
  workPerformance?: String
  workEmphasis?: String
  positionLabelSet: String[]
}

interface ElementTagModel {
  label?: string
  type?: string
  match: boolean
}
