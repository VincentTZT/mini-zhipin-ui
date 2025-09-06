<template>
  <el-container class="vx-container">
    <ul
      v-infinite-scroll="viewObj.onLoadMore"
      :infinite-scroll-immediate="false"
      :infinite-scroll-disabled="scrollDisabled"
    >
      <el-header height="auto">
        <el-form
          :model="loginObj"
          label-width="150px"
          label-position="left"
          v-if="!loginObj.authorized"
          :rules="loginObj.rules"
          ref="loginFormRef"
        >
          <el-form-item label="手机号码" prop="phone">
            <el-input
              v-model.number="loginObj.phone"
              clearable
              placeholder="请输入手机号"
              autofocus
              style="width: 200px"
            />
          </el-form-item>
          <el-form-item label="认证信息" prop="cookieString">
            <el-input v-model="loginObj.cookieString" clearable placeholder="请输入cookie" />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="loginObj.onLogin(loginFormRef)">登陆</el-button>
          </el-form-item>
        </el-form>

        <el-form :model="viewObj" label-width="150px" label-position="left" v-if="loginObj.authorized">
          <el-form-item label="岗位">
            <el-select v-model="viewObj.positionSelected" clearable placeholder="请选择岗位" style="width: 450px">
              <el-option
                v-for="(item, index) in viewObj.positionList"
                :key="index"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item class="slider-age-range" label="年龄">
            <el-slider
              v-model="viewObj.ageRange"
              range
              :format-tooltip="viewObj.ageRangeFormat"
              :min="18"
              :max="45"
              style="width: 450px"
            />
            <el-text>{{ viewObj.ageRange }}</el-text>
          </el-form-item>
          <el-form-item label="活跃度[单选]">
            <el-checkbox-group v-model="viewObj.livenessSelected" @change="viewObj.onChangeLiveness">
              <el-checkbox-button
                v-for="(item, index) in viewObj.livenessList"
                :key="index"
                :label="item.label"
                :value="item.value"
              >
                {{ item.label }}
              </el-checkbox-button>
            </el-checkbox-group>
          </el-form-item>
          <el-form-item label="性别">
            <el-checkbox-group v-model="viewObj.genderSelected" @change="viewObj.onChangeGender">
              <el-checkbox-button
                v-for="(item, index) in viewObj.genderList"
                :key="index"
                :label="item.label"
                :value="item.value"
              >
                {{ item.label }}
              </el-checkbox-button>
            </el-checkbox-group>
          </el-form-item>
          <el-form-item label="近期没有看过">
            <el-checkbox-group v-model="viewObj.recentNotViewSelected" @change="viewObj.onChangeRecentNotView">
              <el-checkbox-button
                v-for="(item, index) in viewObj.recentNotViewList"
                :key="index"
                :label="item.label"
                :value="item.value"
              >
                {{ item.label }}
              </el-checkbox-button>
            </el-checkbox-group>
          </el-form-item>
          <el-form-item label="是否与同事交换简历">
            <el-checkbox-group
              v-model="viewObj.exchangeResumeWithColleagueSelected"
              @change="viewObj.onChangeExchangeResumeWithColleague"
            >
              <el-checkbox-button
                v-for="(item, index) in viewObj.exchangeResumeWithColleagueList"
                :key="index"
                :label="item.label"
                :value="item.value"
              >
                {{ item.label }}
              </el-checkbox-button>
            </el-checkbox-group>
          </el-form-item>
          <el-form-item label="院校">
            <el-checkbox-group v-model="viewObj.schoolLevelSelected" @change="viewObj.onChangeSchoolLevel">
              <el-checkbox-button
                v-for="(item, index) in viewObj.schoolLevelList"
                :key="index"
                :label="item.label"
                :value="item.value"
              >
                {{ item.label }}
              </el-checkbox-button>
            </el-checkbox-group>
            <el-checkbox
              style="padding-left: 10px"
              v-model="viewObj.firstSchoolLevel"
              label="只看第一学历(全日制本科)"
              size="large"
            />
          </el-form-item>
          <el-form-item label="跳槽频率[单选]">
            <el-checkbox-group
              v-model="viewObj.switchJobFrequencySelected"
              @change="viewObj.onChangeSwitchJobFrequency"
            >
              <el-checkbox-button
                v-for="(item, index) in viewObj.switchJobFrequencyList"
                :key="index"
                :label="item.label"
                :value="item.value"
              >
                {{ item.label }}
              </el-checkbox-button>
            </el-checkbox-group>
          </el-form-item>
          <el-form-item label="牛人关键词">
            <el-checkbox-group v-model="viewObj.experienceRequireSelected" @change="viewObj.onChangeExperienceRequire">
              <el-checkbox-button
                v-for="(item, index) in viewObj.experienceRequireList"
                :key="index"
                :label="item.label"
                :value="item.value"
              >
                {{ item.label }}
              </el-checkbox-button>
            </el-checkbox-group>
          </el-form-item>
          <el-form-item label="经验要求">
            <el-checkbox-group v-model="viewObj.experienceRequireSelected" @change="viewObj.onChangeExperienceRequire">
              <el-checkbox-button
                v-for="(item, index) in viewObj.experienceRequireList"
                :key="index"
                :label="item.label"
                :value="item.value"
              >
                {{ item.label }}
              </el-checkbox-button>
            </el-checkbox-group>
          </el-form-item>
          <el-form-item label="学历要求">
            <el-checkbox-group
              v-model="viewObj.educationalRequireSelected"
              @change="viewObj.onChangeEducationalRequire"
            >
              <el-checkbox-button
                v-for="(item, index) in viewObj.educationalRequireList"
                :key="index"
                :label="item.label"
                :value="item.value"
              >
                {{ item.label }}
              </el-checkbox-button>
            </el-checkbox-group>
          </el-form-item>
          <el-form-item label="薪资待遇">
            <el-checkbox-group v-model="viewObj.salaryRequireSelected" @change="viewObj.onChangeSalaryRequire">
              <el-checkbox-button
                v-for="(item, index) in viewObj.salaryRequireList"
                :key="index"
                :label="item.label"
                :value="item.value"
              >
                {{ item.label }}
              </el-checkbox-button>
            </el-checkbox-group>
          </el-form-item>
          <el-form-item label="求职意向">
            <el-checkbox-group v-model="viewObj.intentionSelected" @change="viewObj.onChangeIntention">
              <el-checkbox-button
                v-for="(item, index) in viewObj.intentionList"
                :key="index"
                :label="item.label"
                :value="item.value"
              >
                {{ item.label }}
              </el-checkbox-button>
            </el-checkbox-group>
          </el-form-item>
          <el-form-item>
            <el-button
              type="primary"
              @click="viewObj.onQuery"
              :disabled="!viewObj.isAuthorizedAndPositionSelectedValid()"
            >
              <el-icon style="vertical-align: middle">
                <Search />
              </el-icon>
              <span style="vertical-align: middle"> 查询 </span>
            </el-button>
          </el-form-item>
        </el-form>
      </el-header>
      <el-main style="width: 1444px" v-if="loginObj.authorized">
        <el-card
          shadow="hover"
          v-for="(item, index) in viewObj.jobhunterArray"
          :key="index"
          style="margin-bottom: 30px"
          body-class="vx-card-body"
        >
          <template #header>
            <el-row justify="space-between">
              <el-col :span="24" style="gap: 0.5rem; display: flex">
                <el-badge
                  badge-class="badge-class-match"
                  v-for="skillTag in viewObj.assembleTags(item.workSkillLabelSet)"
                  :key="skillTag.label"
                  :is-dot="viewObj.isMatchsearchKeyword(skillTag.label)"
                >
                  <el-tag :type="skillTag.type" effect="dark" size="large" round>
                    {{ skillTag.label }}
                  </el-tag>
                </el-badge>
              </el-col>
            </el-row>
          </template>
          <el-row justify="space-between" style="padding-bottom: 5px">
            <el-col :span="12"> </el-col>
            <el-col :span="12" style="text-align: right">
              {{ item.degreeSchool?.schoolName }} - {{ item.degreeSchool?.degreeName }} |
              {{ item.degreeSchool?.startDate }} - {{ item.degreeSchool?.endDate }}
            </el-col>
          </el-row>
          <el-row style="margin-bottom: 20px">
            <el-col :span="24">
              <span v-html="viewObj.replaceNewLinesWithBr(item.selfEvaluation)" />
            </el-col>
          </el-row>
          <el-row class="vx-card-delimiter" v-for="(workItem, index) in item.workExperienceList" :key="index">
            <el-col :span="24" style="text-align: right">
              <span>
                <span v-html="viewObj.replaceNewLinesWithBr(workItem?.company)" /> -
                <span v-html="viewObj.replaceNewLinesWithBr(workItem?.positionDesc)" /> -
                {{ workItem?.serviceTime }}
              </span>
            </el-col>
            <el-col :span="24">
              <span v-html="viewObj.replaceNewLinesWithBr(workItem.jobDesc)" />
            </el-col>
          </el-row>
          <template #footer>
            <el-row justify="space-between" class="vx-card-header">
              <el-col :span="22" style="gap: 0.5rem; display: flex">
                {{ index + 1 }}. {{ item.jobhunterName }} | {{ item.ageDesc }} | {{ item.gender === 0 ? '女' : '男' }} |
                {{ item.workExperience }} | {{ item.degreeDesc }} | {{ item.expectJob?.cityDesc }} |
                {{ item.expectJob?.positionDesc }} | {{ item.expectJob?.salaryDesc }}| {{ item.intentionDesc }} |
                {{ item.activationDesc || '-' }}
              </el-col>
              <el-col :span="2" style="text-align: right">
                <el-button type="primary" @click="viewObj.onTriggerChat(index)" :disabled="item.triggerChatFlag">
                  打招呼
                </el-button>
              </el-col>
            </el-row>
          </template>
        </el-card>
        <div
          v-loading="viewObj.loading"
          element-loading-text="Loading"
          element-loading-background="rgba(255, 255, 255, 0)"
          style="height: 100px"
        />

        <el-collapse class="keyword-position">
          <el-collapse-item title="&nbsp&nbsp关键词">
            <el-tag
              v-for="keyword in viewObj.searchKeyword.text"
              :key="keyword"
              closable
              @close="viewObj.searchKeyword.handleClose(keyword)"
            >
              {{ keyword }}
            </el-tag>
            <el-input
              v-if="viewObj.searchKeyword.isAddFocus"
              ref="keywordInputRef"
              v-model="viewObj.searchKeyword.inputValue"
              class="w-20"
              @keyup.enter="viewObj.searchKeyword.inputHandleEnter"
              @blur="viewObj.searchKeyword.inputHandleClose"
            />
            <div v-else style="padding-left: 10px">
              <el-button class="button-new-tag" size="small" @click="viewObj.searchKeyword.showInput">
                ➕ 关键词
              </el-button>
              <el-button class="button-new-tag" size="small" @click="viewObj.searchKeyword.cleanKeyword">
                ➖ 清空
              </el-button>
              <el-button class="button-new-tag" size="small" @click="viewObj.searchKeyword.copyKeyword">
                📃 一键复制
              </el-button>
            </div>
          </el-collapse-item>
        </el-collapse>
        <el-statistic :value="viewObj.triggerChatUsed" class="chat-used-position" value-style="color: red">
          <template #suffix>
            <el-icon style="vertical-align: -0.125em">
              <ChatLineRound />
            </el-icon>
          </template>
        </el-statistic>
        <div class="el-backtop" style="bottom: 100px; right: 70px">
          <span>{{ viewObj.jobhunterArray.length }}</span>
        </div>
        <el-backtop :bottom="50" :right="70" />
      </el-main>
    </ul>
  </el-container>
</template>

<script lang="ts" src="./home-view.ts" />
<style src="./home-view.scss" lang="scss" />
