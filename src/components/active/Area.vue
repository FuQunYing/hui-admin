<script setup>
import { message } from "ant-design-vue";
import { onMounted, ref, onBeforeUnmount,shallowRef } from "vue";
import dayjs from "dayjs";
import { AreaActiveService, InfoService} from "@/api/active.js";


onMounted(() => {
  getActives()
})

let searchName = ref('')
let activeStatus = ref([
  {label: '报名中', value: 1},
  {label: '进行中', value: 2},
  {label: '已结束', value: 3},
])
let activeStatusValue = ref(null)
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
  {title: 'ID', dataIndex: 'id', key: 'id'},
  {title: '活动名称', dataIndex: 'activityName', key: 'activityName'},
  {title: '活动封面', dataIndex: 'activityImg', key: 'activityImg'},
  // {title: '活动内容', dataIndex: 'activityContent', key: 'activityContent'},
  {title: '活动地址', dataIndex: 'activityAddress', key: 'activityAddress'},
  {title: '活动人数', dataIndex: 'activityPeopleNum', key: 'activityPeopleNum'},
  {title: '积分', dataIndex: 'point', key: 'point'},
  {title: '活动类型', dataIndex: 'activityType', key: 'activityType'},
  {title: '活动状态', dataIndex: 'activityStatus', key: 'activityStatus'},
  {title: '主办方', dataIndex: 'sponsorName', key: 'sponsorName'},
  {title: '主办方电话', dataIndex: 'sponsorPhone', key: 'sponsorPhone'},
  {title: '开始时间', dataIndex: 'startTime', key: 'startTime'},
  {title: '结束时间', dataIndex: 'endTime', key: 'endTime'},
  {title: '报名开始', dataIndex: 'signStartTime', key: 'signStartTime'},
  {title: '报名截止', dataIndex: 'signEndTime', key: 'signEndTime'},
  {title: '操作', width: 200, dataIndex: 'action', key: 'action'},
])
let selectIds = ref('')
const rowSelection = {
  onChange: (selectedRowKeys, selectedRows) => {
    selectIds.value = selectedRowKeys
    console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
  },
  getCheckboxProps: record => ({
    id: record.id,
  }),
};

function getList() {
  AreaActiveService.list({
    pageSize: pagination.value.pageSize,
    pageNum: pagination.value.currentPage,
    activityName: searchName.value,
    activityType: activeTypeValue.value,
    activityStatus: activeStatusValue.value,
  }).then(res => {
    if(res.code === 200){
      displayData.value = res.data.data
      pagination.value.total = res.data.totalNum
      activeTypeList.value.forEach(val => {
        displayData.value.forEach(item => {
          if(val.value === item.activityType) {
            item.activityType = val.label
          }
        })
      })
    } else {
      message.error(res.msg)
    }
  })
}
let activeTypeList = ref([])
let activeTypeValue = ref(null)
function getActives() {
  InfoService.types({
    objtype: 3
  }).then(res => {
    if(res.code === 200) {
      activeTypeList.value = res.rows
      activeTypeList.value.forEach(val => {
        val.label = val.objTypeName
        val.value = val.objTypeId
      })
    } else {
      message.error(res.msg)
    }
    getList()
  })
}

// 新增、编辑弹窗 ===
const dateFormat = 'YYYY-MM-DD HH:mm:ss';
let currentModalData = ref({
  activityName: "",
  activityImg: "",
  activityContent: "",
  startTime: null,
  endTime: null,
  signEndTime: null,
  activityAddress: "",
  activityPeopleNum: '',
  point: '',
  sponsorName: "",
  sponsorPhone: "",
  activityType: null
})
let modalVisible = ref(false)
let isEdit = ref(false)
let currentId = ref('')
const openModal = (edit, data) => {
  console.log(data);
  isEdit.value = edit
  if(isEdit.value) {
    select(data.id)
    currentId.value = data.id
  }
  modalVisible.value = true
}
const closeModal = () => {
  modalVisible.value = false
  resetModal()
}
function resetModal() {
  for (let valueKey in currentModalData.value) {
    currentModalData.value[valueKey] = ''
  }
  imageUrl.value = ''
  activityStartTime.value = null
  activityEndTime.value = null
  activityDeadline.value = null
  activityStartLine.value = null
}

let activityStartTime = ref()
let activityEndTime = ref()
let activityDeadline = ref()
let activityStartLine = ref()
function select(id){
  AreaActiveService.select({id}).then(res => {
    if(res.code === 200){
      console.log(currentModalData.value);
      currentModalData.value = res.data
      imageUrl.value = res.data.activityImg
      activityStartTime.value = dayjs(currentModalData.value.startTime)
      activityEndTime.value = dayjs(currentModalData.value.endTime)
      activityDeadline.value = dayjs(currentModalData.value.signEndTime)
      activityStartLine.value = currentModalData.value.signStartTime ? dayjs(currentModalData.value.signStartTime) : ''
      console.log(activityStartTime.value,activityEndTime.value,activityDeadline.value,activityStartLine.value);
    } else {
      message.error(res.msg)
    }
  })
}
function save() {
  currentModalData.value.startTime = dayjs(activityStartTime.value).format(dateFormat)
  currentModalData.value.endTime = dayjs(activityEndTime.value).format(dateFormat)
  currentModalData.value.signEndTime = dayjs(activityDeadline.value).format(dateFormat)
  currentModalData.value.signStartTime = dayjs(activityStartLine.value).format(dateFormat)
  console.log(currentModalData.value);
  if(isEdit.value) {
    update()
  } else {
    add()
  }
}
function add() {
  AreaActiveService.add({...currentModalData.value}).then(res => {
    if(res.code === 200){
      message.success('添加成功')
      closeModal()
      getList()
    } else {
      message.error(res.msg)
    }
  })
}
function update() {
  AreaActiveService.update({
    id: currentId.value,
    ...currentModalData.value
  }).then(res => {
    if(res.code === 200){
      message.success('修改成功')
      closeModal()
      getList()
    } else {
      message.error(res.msg)
    }
  })
}

function del(isMulti, id) {
  if (isMulti) {
    if (!selectIds.value.length > 0) {
      message.warning('请先勾选数据')
      return
    }
    AreaActiveService.delList({id: selectIds.value}).then(res => {
      if(res.code === 200){
        message.success('删除成功')
        getList()
      } else {
        message.error(res.msg)
      }
    })
  } else {
    AreaActiveService.del({id}).then(res => {
      if(res.code === 200){
        message.success('删除成功')
        getList()
      } else {
        message.error(res.msg)
      }
    })
  }
}
// 上传图片
let headers = {
  Authorization: 'Bearer '+localStorage.getItem('token')
}
let imgUrl = ref('https://hlgxc.hechuangjia.com/backapi/')
// let imgUrl = ref('http://101.42.27.93:8081/api')
let baseURL = import.meta.env.VITE_BASE_URL
let fileList = ref([])
let imageUrl = ref('')
const handleFile = info => {
  console.log(info);
  if (info.file.status === 'done') {
    message.success(`${info.file.name} 文件上传成功`);
    if(info.file.response) {
      imageUrl.value =  info.file.response.data
      console.log(imageUrl.value);
      currentModalData.value.activityImg = imageUrl.value
    }
  } else if (info.file.status === 'error') {
    message.error(`${info.file.name} 文件上传失败`);
  }
}

// 报名列表
let showSignInList = ref(false)
const openSignInList = (data) => {
  console.log(data);
  currentId.value = data.id
  currentActiveName.value = data.activityName
  getSignInList()
  showSignInList.value = true
}
const closeSignInList = () => {
  showSignInList.value = false
}
let uName = ref('')
let checkStatus = ref([
  {label: '全部', value: -1},
  {label: '待审核', value: 0},
  {label: '通过', value: 1},
  {label: '不通过', value: 2},
])
let checkStatusValue = ref(-1)
let currentActiveName = ref('')
let signInList = ref([])
let pagination1 = ref({
  currentPage: 1,
  pageSize: 20,
  total: 0,
  onChange: (current, pageSize) => {
    pagination.value.currentPage = current
    pagination.value.pageSize = pageSize
    getSignInList()
  },
  showTotal: (total) => `共 ${total} 条`,
  showSizeChanger: true,
  pageSizeOptions: ['10', '20', '30', '40', '50'],
})
let columns1 = ref([
  {title: 'ID', dataIndex: 'id', key: 'id'},
  {title: '用户姓名', dataIndex: 'userName', key: 'userName'},
  {title: '审核状态', dataIndex: 'checkStatus', key: 'checkStatus'},
  {title: '报名时间', dataIndex: 'signDate', key: 'signDate'},
  {title: '备注', dataIndex: 'remark', key: 'remark'},
  {title: '操作', width: 260, dataIndex: 'action', key: 'action'},
])

function getSignInList() {
  AreaActiveService.signInList({
    pageSize: pagination1.value.pageSize,
    pageNum: pagination1.value.currentPage,
    checkStatus: checkStatusValue.value,
    userName: uName.value,
    activityId: currentId.value,
  }).then(res => {
    if(res.code === 200){
      signInList.value = res.data.data
      pagination1.value.total = res.data.totalNum
    } else {
      message.error(res.msg)
    }
  })
}
let remarkModal = ref(false)
let checkRemark = ref('')
let currentSignId = ref('')
let currentSignStatus = ref('')
const openCheck = (id, status) => {
  remarkModal.value = true
  currentSignId.value = id;
  currentSignStatus.value = status
}
const closeCheckModal = () => {
  remarkModal.value = false
  remark.value = ''
}
function handleCheck(id, checkStatus) {
  AreaActiveService.check({
    id,
    checkStatus,
    remark: checkRemark.value,
  }).then(res => {
    if(res.code === 200){
      message.success('操作成功')
      getSignInList()
      closeCheckModal()
    } else {
      message.error(res.msg)
    }
  })
}
let showCode = ref(false)
let qrCodeId = ref('')
function getCode(id){
  qrCodeId.value = id
  showCode.value = true
}
const closeCode = () => {
  showCode.value = false
}

let imgUrl1 = ref('https://hlgxc.hechuangjia.com')
// let imgUrl1 = ref('http://101.42.27.93:8081')
import { Editor, Toolbar } from '@wangeditor/editor-for-vue'
// 编辑器实例，必须用 shallowRef
const editorRef = shallowRef()

// TODO 富文本上传图片
const toolbarConfig = {}
const editorConfig = {
  placeholder: '请输入内容...',
  MENU_CONF:{
    uploadImage: {
      server: baseURL + '/common/upload',
      fieldName: 'file',
      headers,
      customInsert(res, insertFn) {
        console.log(res);
        // 从 res 中找到 url alt href ，然后插入图片
        const img = imgUrl1.value + '/files/' + res.data
        insertFn(img)
      }
    }
  }
}

// 组件销毁时，也及时销毁编辑器
onBeforeUnmount(() => {
  const editor = editorRef.value
  if (editor == null) return
  editor.destroy()
})

const handleCreated = (editor) => {
  editorRef.value = editor // 记录 editor 实例，重要！
}
import {CommonService} from "@/api/CommonService.js";
// 导出
let downLoading = ref(false)
function exportFile() {
  downLoading.value = true
  CommonService.exportData('/communityActivity/export', {
    activityName: searchName.value,
    activityType: activeTypeValue.value,
    activityStatus: activeStatusValue.value,
  }, '社区活动').then(() => {
    downLoading.value = false
  })
}
</script>

<template>
  <div class="content-container">
    <div class="top-group">
      <a-row :gutter="[24,8]">
        <a-col :span="6">
          <a-form-item label="活动名称">
            <a-input style="width: 100%" v-model:value="searchName" placeholder="请输入" allowClear/>
          </a-form-item>
        </a-col>
        <a-col :span="6">
          <a-form-item label="活动状态">
            <a-select :options="activeStatus" style="width: 100%" v-model:value="activeStatusValue" placeholder="请选择" allowClear/>
          </a-form-item>
        </a-col>
        <a-col :span="6">
          <a-form-item label="活动类型">
            <a-select :options="activeTypeList" style="width: 100%" v-model:value="activeTypeValue" placeholder="请选择" allowClear/>
          </a-form-item>
        </a-col>
        <a-col :span="2" style="text-align: right">
          <a-button type="primary" @click="getList">搜索</a-button>
        </a-col>
        <a-col :span="4" style="text-align: right">
          <a-button type="primary" class="mr-10 mb-10" @click="openModal(false, null)">添加</a-button>
          <a-popconfirm title="确定删除吗？" ok-text="确定" cancel-text="取消" @confirm="del(true, null)">
            <a-button type="primary" class="mr-10" danger>删除</a-button>
          </a-popconfirm>
        </a-col>
      </a-row>
    </div>
    <a-row class="mb-16">
      <a-col :span="24" style="text-align: right">
        <a-button type="primary" @click="exportFile" :loading="downLoading">
          <template #icon>
            <Icon icon="DownloadOutlined"/>
          </template>
          导出数据
        </a-button>
      </a-col>
    </a-row>

    <div class="table">
      <a-table id="printContent" :row-selection="rowSelection" :row-key="record => record.id" :data-source="displayData"
               :columns="columns" :pagination="pagination">
        <template #bodyCell="{column, record}">
          <template v-if="column.key === 'activityContent'">
            <div v-html="record.activityContent" style="max-width: 150px"></div>
          </template>
          <template v-if="column.key === 'startTime'">
            {{dayjs(record.startTime).format(dateFormat)}}
          </template>
          <template v-if="column.key === 'endTime'">
            {{dayjs(record.endTime).format(dateFormat)}}
          </template>
          <template v-if="column.key === 'signEndTime'">
            {{dayjs(record.signEndTime).format(dateFormat)}}
          </template>
          <template v-if="column.key === 'activityStatus'">
            {{record.activityStatus === 1 ? '报名中' : (record.activityStatus === 2 ? '进行中':'已结束')}}
          </template>
          <template v-if="column.key === 'activityImg'">
            <a-image :src="imgUrl + 'files/' + record.activityImg" alt="" style="width: 100px"/>
          </template>
          <template v-if="column.key === 'action'">
            <a-button type="primary" class="mr-10 mb-10" @click="openModal(true, record)">编辑</a-button>
            <a-popconfirm title="确定删除吗？" ok-text="确定" cancel-text="取消" @confirm="del(false, record.id)">
              <a-button type="primary" danger>删除</a-button>
            </a-popconfirm>
            <br>
            <a-button class="mb-10" type="primary" ghost @click="openSignInList(record)">查看报名列表</a-button>
            <br>
            <a-button  type="primary" @click="getCode(record.id)">获取活动二维码</a-button>
          </template>
        </template>
      </a-table>
    </div>

    <a-modal :open="modalVisible" :title="isEdit ? '编辑活动':'添加活动'" :footer="false" @cancel="closeModal"  width="95%" style="top: 2.5vh">
      <a-form-item label="活动名称" required :label-col="{span: 6}">
        <a-input v-model:value="currentModalData.activityName" placeholder="请输入"></a-input>
      </a-form-item>
      <a-form-item label="活动类型" required :label-col="{span: 6}">
        <a-select :options="activeTypeList" v-model:value="currentModalData.activityType" placeholder="请选择"></a-select>
      </a-form-item>
      <a-form-item label="活动地址" required :label-col="{span: 6}">
        <a-input v-model:value="currentModalData.activityAddress" placeholder="请输入"></a-input>
      </a-form-item>
      <!--      <a-form-item label="活动内容" required :label-col="{span: 6}">
              <a-textarea v-model:value="currentModalData.activityContent" placeholder="请输入"></a-textarea>
            </a-form-item>-->
      <a-form-item label="活动人数" required :label-col="{span: 6}">
        <a-textarea v-model:value="currentModalData.activityPeopleNum" placeholder="请输入"></a-textarea>
      </a-form-item>
      <a-form-item label="活动积分" required :label-col="{span: 6}">
        <a-input v-model:value="currentModalData.point" placeholder="请输入"></a-input>
      </a-form-item>
      <a-form-item label="主办方" required :label-col="{span: 6}">
        <a-textarea v-model:value="currentModalData.sponsorName" placeholder="请输入"></a-textarea>
      </a-form-item>
      <a-form-item label="主办方电话" required :label-col="{span: 6}">
        <a-textarea v-model:value="currentModalData.sponsorPhone" placeholder="请输入"></a-textarea>
      </a-form-item>
      <a-form-item label="活动开始时间" required :label-col="{span: 6}">
        <a-date-picker show-time v-model:value="activityStartTime" placeholder="开始时间" style="width: 100%"/>
      </a-form-item>
      <a-form-item label="活动结束时间" required :label-col="{span: 6}">
        <a-date-picker show-time v-model:value="activityEndTime" placeholder="结束时间" style="width: 100%"/>
      </a-form-item>
      <a-form-item label="报名开始时间" required :label-col="{span: 6}">
        <a-date-picker show-time v-model:value="activityStartLine" placeholder="报名开始时间" style="width: 100%"/>
      </a-form-item>
      <a-form-item label="报名截止时间" required :label-col="{span: 6}">
        <a-date-picker show-time v-model:value="activityDeadline" placeholder="报名截止时间" style="width: 100%"/>
      </a-form-item>
      <a-form-item label="上传图片" :label-col="{span: 6}">
        <a-upload  list-type="picture-card" name="file"   :show-upload-list="false" v-model:file-list="fileList" accept="image/*" :headers="headers"
                   :action="baseURL + '/common/upload'" @change="handleFile">
          <img v-if="imageUrl" :src="imgUrl + 'files/'+imageUrl" alt="avatar" style="width: 100%"/>
          <div v-else>
            <Icon icon="UploadOutlined" style="font-size: 28px"/>
            <div class="ant-upload-text">选择文件</div>
          </div>
        </a-upload>
      </a-form-item>
      <a-form-item label="活动内容" required :label-col="{span: 4}">
        <div style="border: 1px solid #ccc" v-if="modalVisible">
          <Toolbar
              style="border-bottom: 1px solid #ccc"
              :editor="editorRef"
              :defaultConfig="toolbarConfig"
          />
          <Editor
              style="height: 25vh; overflow-y: hidden;"
              v-model="currentModalData.activityContent"
              :defaultConfig="editorConfig"
              @onCreated="handleCreated"
          />
        </div>
      </a-form-item>
      <a-row>
        <a-col :span="6" :offset="6"><a-button type="primary" @click="save">立即提交</a-button></a-col>
        <a-col :span="6"><a-button type="default" @click="resetModal">重置</a-button></a-col>
      </a-row>
    </a-modal>

    <a-drawer :open="showSignInList" :title="'《'+currentActiveName + '》活动报名列表'"  width="50%" @close="showSignInList = false">
      <div class="top-group">
        <a-row :gutter="[24,8]">
          <a-col :span="10">
            <a-form-item label="用户名称">
              <a-input style="width: 100%" v-model:value="uName" placeholder="请输入" allowClear/>
            </a-form-item>
          </a-col>
          <a-col :span="10">
            <a-form-item label="审核状态">
              <a-select :options="checkStatus" style="width: 100%" v-model:value="checkStatusValue" placeholder="请选择" allowClear/>
            </a-form-item>
          </a-col>
          <a-col :span="4" style="text-align: right">
            <a-button type="primary" @click="getSignInList">搜索</a-button>
          </a-col>
        </a-row>
      </div>
      <a-table :pagination="pagination1" :data-source="signInList" :columns="columns1">
        <template #bodyCell="{column, record}">
          <template v-if="column.key === 'checkStatus'">
            {{record.checkStatus === 0 ? '待审核' : (record.checkStatus === 1 ? '通过':'不通过')}}
          </template>
          <template v-if="column.key === 'signDate'">
            {{dayjs(record.signDate).format(dateFormat)}}
          </template>
          <template v-if="column.key === 'action'">
            <a-button type="primary" class="mr-10" @click="handleCheck(record.id,1)">审核通过</a-button>
            <a-button danger ghost class="mr-10" @click="openCheck(record.id,2)">审核不通过</a-button>
          </template>
        </template>
      </a-table>
    </a-drawer>

    <a-modal :open="remarkModal" title="请填写不通过原因" @cancel="closeCheckModal" @ok="handleCheck(currentSignId,currentSignStatus)">
      <a-textarea placeholder="请输入" v-model:value="checkRemark"></a-textarea>
    </a-modal>

    <a-modal :open="showCode" title="活动二维码" @cancel="closeCode" :footer="false" style="text-align: center">
      {{'https://hlgxc.hechuangjia.com/open?id='+qrCodeId}}
      <a-space direction="vertical" align="center">
        <a-qrcode :value="'https://hlgxc.hechuangjia.com/open?id='+qrCodeId" size="240"/>
        <!--        <a-qrcode :value="'https://hcj.vague.work/open?id='+qrCodeId" size="240"/>-->
      </a-space>
    </a-modal>
  </div>
</template>

<style scoped lang="less">

</style>
