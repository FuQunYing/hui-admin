<script setup>
import { FrontUsrService } from "@/api/system.js";
import {PlatformService} from "@/api/point.js";
import { message } from "ant-design-vue";
import {onMounted, ref} from "vue";
import dayjs from "dayjs";
import { Modal } from 'ant-design-vue';


onMounted(() => {
  getList()
  getBusinessTypeList()
})

let phoneNumber = ref('')
let userName = ref('')

let displayData = ref([])
let pagination = ref({
  currentPage: 1,
  pageSize: 20,
  total: 0,
  onChange: (current, pageSize) => {
    pagination.value.currentPage = current
    pagination.value.pageSize = pageSize
    getList()
  },
  showTotal: (total) => `共 ${total} 条`,
  showSizeChanger: true,
  pageSizeOptions: ['10', '20', '30', '40', '50'],
})
let columns = ref([
  { title: 'ID', dataIndex: 'frontUserId', key: 'frontUserId' },
  { title: '用户名称', dataIndex: 'userName', key: 'userName' },
  { title: '昵称', dataIndex: 'nickName', key: 'nickName' },
  { title: '性别', dataIndex: 'gender', key: 'gender' },
  // { title: '年龄', dataIndex: 'age', key: 'age'},
  { title: '政治面貌', dataIndex: 'politicsStatus', key: 'politicsStatus'},
  { title: '其他身份', dataIndex: 'otherIdenty', key: 'otherIdenty'},
  { title: '平台积分', dataIndex: 'platformPoints', key: 'platformPoints'},
  { title: '平台荣誉值', dataIndex: 'honorValue', key: 'honorValue' },
  { title: '手机号', dataIndex: 'phoneNumber', key: 'phoneNumber' },
  { title: '创建时间', dataIndex: 'createTime', key: 'createTime' },
  { title: '用户头像', dataIndex: 'userPhoto', key: 'userPhoto' },
  { title: '操作', dataIndex: 'action', key: 'action', fixed: 'right', width: 100, },
])
let selectIds = ref('')
const rowSelection = ref({
  onChange: (selectedRowKeys, selectedRows) => {
    selectIds.value = selectedRowKeys
    console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
  },
  getCheckboxProps: record => ({
    frontUserId: record.frontUserId,
  }),
})

function getList() {
  displayData.value = []
  FrontUsrService.list({
    page: pagination.value.currentPage,
    rows: pagination.value.pageSize,
    phoneNumber: phoneNumber.value,
    userName: userName.value,
  }).then(res => {
    if(res.code === 200) {
      displayData.value = res.rows
      pagination.value.total = res.total
    } else {
      message.error(res.msg)
    }
  })
}

function del() {
  if(!selectIds.value.length > 0) {
    message.warning('请先勾选数据')
    return
  }
  Modal.confirm({
    title: '请谨慎选择删除项，如果删除本人账号所有门禁家属的门禁就会被删除！',
    okText: '删除本人门禁',
    cancelText: '删除本人账号的所有门禁',
    onOk() {
      FrontUsrService.del({
        frontUserIds: selectIds.value.join(','),
        type: 1
      }).then(res => {
        if(res.code === 200) {
          message.success('删除成功')
          getList()
          // selectIds.value = ''
          // rowSelection.value.selectedRowKeys = []
        }
      })
    },
    onCancel() {
      FrontUsrService.del({
        frontUserIds: selectIds.value.join(','),
        type: 2
      }).then(res => {
        if(res.code === 200) {
          message.success('删除成功')
          getList()
          // selectIds.value = ''
          // rowSelection.value.selectedRowKeys = []
        }
      })
    }
  })

}

let modalVisible = ref(false)
let currentId = ref('')
const openEditModal = (data) => {
  currentId.value = data.frontUserId
  modalVisible.value = true
  selectUsr()
}
const closeEditModal = () => {
  modalVisible.value = false
  resetEdit()
}

let editUsrName = ref('')
let editName = ref('')
let editGender = ref(1)
let editAge = ref('')
let editPoint = ref(100)
let editPol = ref(1)
let editOther = ref(0)
let editHoner = ref(0)
let editPhone = ref('')
function selectUsr() {
  FrontUsrService.select({
    frontUserId: currentId.value
  }).then(res => {
    if(res.code === 200) {
      editUsrName.value = res.frontUser.userName
      editName.value = res.frontUser.nickName
      editGender.value = res.frontUser.gender
      editAge.value = res.frontUser.age
      editPoint.value = res.frontUser.platformPoints
      editPol.value = res.frontUser.politicsStatus
      editOther.value = res.frontUser.otherIdenty
      editHoner.value = res.frontUser.honorValue
      editPhone.value = res.frontUser.phoneNumber
    } else {
      message.error(res.msg)
    }
  })
}
function handleEdit() {
  FrontUsrService.update({
    frontUserId: currentId.value,
    userName: editUsrName.value,
    nickName: editName.value,
    gender: editGender.value,
    age: editAge.value,
    platformPoints: editPoint.value,
    politicsStatus: editPol.value,
    otherIdenty: editOther.value,
    honorValue: editHoner.value,
    phoneNumber: editPhone.value,
  }).then(res => {
    if(res.code === 200) {
      message.success('编辑成功')
      getList()
      closeEditModal()
    } else {
      message.error(res.msg)
    }
  })
}
function resetEdit() {
  editName.value = ''
  editGender.value = 1
  editAge.value = ''
  editPoint.value = 0
}

let pointVisible = ref(false)
let pointTypes = ref([])

function getBusinessTypeList() {
  PlatformService.businessList({}).then(res => {
    if(res.code === '200') {
      pointTypes.value = res.rows
      pointTypes.value.forEach(val => {
        val.value = val.businessTypeId
        val.label = val.businessTypeName
      })
    } else {
      message.error(res.msg)
    }
  })
}

let pointTypeValue = ref(null)
let addPoint = ref(0)
const openPoint = () => {
  if(!selectIds.value.length > 0) {
    message.warning('请先勾选数据')
    return
  }
  pointVisible.value = true
}
const closePoint = (() => {
  pointVisible.value = false
  resetPointModal()
})
const resetPointModal = () => {
  addPoint.value = 0
  pointTypeValue.value = null
}
function handleAddPoint() {
  FrontUsrService.addPoints({
    frontUserIds: selectIds.value.join(','),
    jfType: pointTypeValue.value,
    jf: addPoint.value
  }).then(res => {
    if(res.code === 200) {
      message.success('添加成功')
      closePoint()
      getList()
    } else {
      message.error(res.msg)
    }
  })
}

</script>

<template>
  <div class="content-container">
    <div class="top-group">
      <a-row :gutter="[24,8]">
        <a-col :span="6">
          <a-form-item label="手机号">
            <a-input style="width: 100%" v-model:value="phoneNumber" placeholder="请输入" allowClear/>
          </a-form-item>
        </a-col>
        <a-col :span="6">
          <a-form-item label="姓名">
            <a-input style="width: 100%" v-model:value="userName" placeholder="请输入" allowClear/>
          </a-form-item>
        </a-col>
        <a-col :span="12"  style="text-align: right">
          <a-button type="primary" @click="getList" class="mr-10">搜索</a-button>
          <!--          <a-button type="primary" class="mr-10">添加</a-button>-->
          <a-button  type="primary" class="mr-10" danger @click="del">删除</a-button>
          <a-button type="primary" @click="openPoint">手动添加积分</a-button>
        </a-col>
      </a-row>
    </div>
    <a-divider />
    <div class="table">
      <a-table id="printContent" :row-selection="rowSelection" :row-key="record => record.frontUserId" :scroll="{ x: 1400, y: '50vh'}"
               :data-source="displayData" :columns="columns" :pagination="pagination">
        <template #bodyCell="{column, record}">
          <template v-if="column.key === 'createTime'">
            {{dayjs(record.createTime).format('YYYY-MM-DD HH:mm:ss')}}
          </template>
          <template v-if="column.key === 'userName'">
            <span>{{record.userName ? record.userName : '未知'}}</span>
          </template>
          <template v-if="column.key === 'nickName'">
            <span>{{record.nickName ? record.nickName : '未知'}}</span>
          </template>
          <template v-if="column.key === 'phoneNumber'">
            <span>{{record.phoneNumber ? record.phoneNumber : '未知'}}</span>
          </template>
          <template v-if="column.key === 'politicsStatus'">
            <span>{{record.politicsStatus === 1 ? '党员': (record.politicsStatus === 2 ? '团员': (record.politicsStatus === 3 ? '群众': '未知'))}}</span>
          </template>
          <template v-if="column.key === 'otherIdenty'">
            <span>{{record.otherIdenty === 1 ? '居民代表':
                (record.otherIdenty === 2 ? '退役军人':
                    (record.otherIdenty === 3 ? '社区工作人员': '无'))}}</span>
          </template>
          <template v-if="column.key === 'gender'">
            <span>{{record.gender === 1 ? '男' : record.gender === 2 ? '女' : '未知'}}</span>
          </template>
          <template v-if="column.key === 'userPhoto'" >
            <img v-if="record.userPhoto" style="height: 40px" :src="record.userPhoto" alt="">
            <span v-else>未知</span>
          </template>
          <template v-if="column.key === 'action'">
            <a-button type="primary" class="mr-10" @click="openEditModal(record)">编辑</a-button>
          </template>
        </template>
      </a-table>
    </div>
    <!--编辑弹窗-->
    <a-modal :open="modalVisible" title="修改用户信息" :footer="false" @cancel="closeEditModal">
      <a-form-item label="用户姓名" required :label-col="{span: 4}">
        <a-input v-model:value="editUsrName" placeholder="请输入"></a-input>
      </a-form-item>
      <a-form-item label="用户昵称" required :label-col="{span: 4}">
        <a-input v-model:value="editName" placeholder="请输入"></a-input>
      </a-form-item>
      <a-form-item label="性别" required :label-col="{span: 4}">
        <a-radio-group v-model:value="editGender">
          <a-radio :value="1">男</a-radio>
          <a-radio :value="2">女</a-radio>
        </a-radio-group>
      </a-form-item>
      <a-form-item label="年龄" required :label-col="{span: 4}">
        <a-input v-model:value="editAge"  placeholder="请输入"></a-input>
      </a-form-item>
      <a-form-item label="政治面貌" required :label-col="{span: 4}">
        <a-radio-group v-model:value="editPol">
          <a-radio :value="1">党员</a-radio>
          <a-radio :value="2">团员</a-radio>
          <a-radio :value="3">群众</a-radio>
        </a-radio-group>
      </a-form-item>
      <a-form-item label="其他身份" required :label-col="{span: 4}">
        <a-radio-group v-model:value="editOther">
          <a-radio :value="0">无</a-radio>
          <a-radio :value="1">居民代表</a-radio>
          <a-radio :value="2">退役军人</a-radio>
          <a-radio :value="3">社区工作人员</a-radio>
        </a-radio-group>
      </a-form-item>
      <a-form-item label="平台积分" required :label-col="{span: 4}">
        <a-input v-model:value="editPoint"  placeholder="请输入"></a-input>
      </a-form-item>
      <a-form-item label="荣誉值" required :label-col="{span: 4}">
        <a-input v-model:value="editHoner"  placeholder="请输入"></a-input>
      </a-form-item>
      <a-form-item label="手机号" required :label-col="{span: 4}">
        <a-input v-model:value="editPhone"  placeholder="请输入"></a-input>
      </a-form-item>
      <a-row class="mt-16">
        <a-col :span="8" :offset="6"><a-button type="primary" @click="handleEdit">立即提交</a-button></a-col>
        <a-col :span="2"><a-button type="default" @click="resetEdit">重置</a-button></a-col>
      </a-row>
    </a-modal>

    <a-modal :open="pointVisible" title="添加用户积分" :footer="false" @cancel="closePoint">
      <a-form-item label="积分类型" required :label-col="{span: 4}">
        <a-select :options="pointTypes" v-model:value="pointTypeValue" placeholder="请选择"></a-select>
      </a-form-item>
      <a-form-item label="积分数量" required :label-col="{span: 4}">
        <a-input v-model:value="addPoint"  placeholder="请输入"></a-input>
      </a-form-item>
      <a-row class="mt-16">
        <a-col :span="8" :offset="6"><a-button type="primary" @click="handleAddPoint">立即提交</a-button></a-col>
        <a-col :span="2"><a-button type="default" @click="resetPointModal">重置</a-button></a-col>
      </a-row>
    </a-modal>
  </div>
</template>

<style scoped lang="less">

</style>
