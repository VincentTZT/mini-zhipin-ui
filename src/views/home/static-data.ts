export default {
  livenessList: [
    { label: '不限', value: 0 },
    { label: '刚刚活跃', value: 2501 },
    { label: '今天活跃', value: 2502 },
    { label: '3日内活跃', value: 2503 },
    { label: '本周活跃', value: 2504 },
    { label: '本月活跃', value: 2505 }
  ] as SelectorModel[],
  genderList: [
    { label: '不限', value: 0 },
    { label: '男', value: 2201 },
    { label: '女', value: 2202 }
  ] as SelectorModel[],
  recentNotViewList: [
    { label: '不限', value: 0 },
    { label: '近14天没有', value: 2301 }
  ],
  exchangeResumeWithColleagueList: [
    { label: '不限', value: 0 },
    { label: '近一个月没有', value: 1301 }
  ],
  schoolLevelList: [
    { label: '不限', value: 0 },
    { label: '985', value: 1104 },
    { label: '211', value: 1103 },
    { label: '双一流院校', value: 1102 },
    { label: '留学', value: 1105 },
    { label: '国内外名校', value: 1106 },
    { label: '公办本科', value: 1107 }
  ] as SelectorModel[],
  switchJobFrequencyList: [
    { label: '不限', value: 0 },
    { label: '5年少于3份', value: 1201 },
    { label: '平均每份工作大于1年', value: 1202 }
  ],
  experienceRequireList: [
    { label: '不限', value: 0 },
    { label: '在校/应届', value: 109 },
    { label: '24年毕业', value: 110 },
    { label: '25年毕业', value: 111 },
    { label: '25年后毕业', value: 112 },
    { label: '1年以内', value: 103 },
    { label: '1-3年', value: 104 },
    { label: '3-5年', value: 105 },
    { label: '5-10年', value: 106 },
    { label: '10年以上', value: 107 }
  ] as SelectorModel[],
  educationalRequireList: [
    { label: '不限', value: 0 },
    { label: '初中及以下', value: 209 },
    { label: '中专/中技', value: 208 },
    { label: '高中', value: 206 },
    { label: '大专', value: 202 },
    { label: '本科', value: 203 },
    { label: '硕士', value: 204 },
    { label: '博士', value: 205 }
  ] as SelectorModel[],
  salaryRequireList: [
    { label: '不限', value: 0 },
    { label: '3k以下', value: 402 },
    { label: '3k-5k', value: 403 },
    { label: '5k-10k', value: 404 },
    { label: '10k-20k', value: 405 },
    { label: '20k-50k', value: 406 },
    { label: '50k以上', value: 407 }
  ] as SelectorModel[],
  intentionList: [
    { label: '不限', value: 0 },
    { label: '离职-随时到岗', value: 701 },
    { label: '在职-暂不考虑', value: 702 },
    { label: '在职-考虑机会', value: 703 },
    { label: '在职-月内到岗', value: 704 }
  ]
}
