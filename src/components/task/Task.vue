<script setup>
import { message } from "ant-design-vue";
import { onMounted, ref } from "vue";
import dayjs from "dayjs";
import {TaskService} from "@/api/task.js";
onMounted(() => {
  getList()
})
let searchName = ref('')
let taskStatus = ref([
  {label: '未开始', value: 1},
  {label: '进行中', value: 2},
  {label: '已结束', value: 3},
])
let taskStatusValue = ref(null)
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
  {title: '任务名称', dataIndex: 'taskName', key: 'taskName'},
  {title: '任务图片', dataIndex: 'taskImg', key: 'taskImg'},
  // {title: '内容', dataIndex: 'taskContent', key: 'taskContent'},
  {title: '创建时间', dataIndex: 'createTime', key: 'createTime'},
  {title: '任务开始时间', dataIndex: 'taskBeginTime', key: 'taskBeginTime'},
  {title: '任务结束时间', dataIndex: 'taskEndTime', key: 'taskEndTime'},
  {title: '报名开始时间', dataIndex: 'signBeginTime', key: 'signBeginTime'},
  {title: '报名截止时间', dataIndex: 'signEndTime', key: 'signEndTime'},
  {title: '积分值', dataIndex: 'pointsNum', key: 'pointsNum'},
  {title: '浏览数', dataIndex: 'viewNum', key: 'viewNum'},
  {title: '分享数', dataIndex: 'shareNum', key: 'shareNum'},
  {title: '收藏数', dataIndex: 'collectNum', key: 'collectNum'},
  {title: '任务状态', dataIndex: 'taskStatus', key: 'taskStatus'},
  {title: '操作', width: 200, dataIndex: 'action', key: 'action'},
])
function getList() {
  TaskService.list({
    pageSize: pagination.value.pageSize,
    pageNum: pagination.value.currentPage,
    taskName: searchName.value,
    taskStatus: taskStatusValue.value,
  }).then(res => {
    if(res.code === 200){
      displayData.value = res.data.data
      pagination.value.total = res.data.totalNum
    } else {
      message.error(res.msg)
    }
  })
}

let modalData = ref({
  taskName: "",
  taskImg: "",
  taskContent:"",
  taskBeginTime:"",
  taskEndTime:"",
  signEndTime:"",
  signBeginTime: "",
  pointsNum: ""
})
let modalVisible = ref(false)
let isEdit = ref(false)
let currentId = ref('')

const openModal = (edit, data) => {
  isEdit.value = edit
  if(isEdit.value) {
    search(data.id)
    currentId.value = data.id
  }
  modalVisible.value = true
}
const closeModal = () => {
  modalVisible.value = false
  resetModal()
}
function resetModal() {
  for (let valueKey in modalData.value) {
    modalData.value[valueKey] = ''
  }
  imageUrl.value = ''
  activityStartTime.value = null
  activityEndTime.value = null
  activityDeadline.value = null
  activityBeginline.value = null
}

function save() {
  modalData.value.taskBeginTime = dayjs(activityStartTime.value).format(dateFormat)
  modalData.value.taskEndTime = dayjs(activityEndTime.value).format(dateFormat)
  modalData.value.signEndTime = dayjs(activityDeadline.value).format(dateFormat)
  modalData.value.signBeginTime = dayjs(activityBeginline.value).format(dateFormat)
  if(isEdit.value) {
    update()
  } else {
    add()
  }
}

let activityStartTime = ref(null)
let activityEndTime = ref(null)
let activityDeadline = ref(null)
let activityBeginline = ref(null)
const dateFormat = 'YYYY-MM-DD HH:mm:ss';
function search(id) {
  TaskService.select({id}).then(res => {
    console.log(res);
    if(res.code === 200) {
      modalData.value = res.data

      activityStartTime.value = dayjs(modalData.value.taskBeginTime, dateFormat)
      activityEndTime.value = dayjs(modalData.value.taskEndTime, dateFormat)
      activityDeadline.value = dayjs(modalData.value.signEndTime, dateFormat)
      activityBeginline.value = dayjs(modalData.value.signBeginTime, dateFormat)
    } else {
      message.error(res.msg)
    }
  })
}
function update() {
  TaskService.update({
    id: currentId.value,
    ...modalData.value
  }).then(res => {
    console.log(res);
    if(res.code === 200) {
      message.success('修改成功')
      closeModal()
      getList()
    } else {
      message.error(res.msg)
    }
  })
}
function add() {
  TaskService.add({...modalData.value}).then(res => {
    if(res.code === 200) {
      message.success('添加成功')
      closeModal()
      getList()
    } else {
      message.error(res.msg)
    }
  })
}
function del(id){
  TaskService.del({id}).then(res => {
    if(res.code === 200 ){
      message.success('删除成功')
      getList()
    } else {
      message.error(res.msg)
    }
  })
}

let headers = {
  Authorization: 'Bearer '+localStorage.getItem('token')
}
let imgUrl = ref('https://hlgxc.hechuangjia.com/backapi/')
let baseURL = import.meta.env.VITE_BASE_URL
let fileList = ref([])
let imageUrl = ref('')
const handleFile = info => {
  console.log(info);
  if (info.file.status === 'done') {
    message.success(`${info.file.name} 文件上传成功`);
    if(info.file.response) {
      imageUrl.value =  info.file.response.data
      modalData.value.taskImg = imageUrl.value
      console.log(imageUrl.value);
    }
  } else if (info.file.status === 'error') {
    message.error(`${info.file.name} 文件上传失败`);
  }
}
import {CommonService} from "@/api/CommonService.js";
// 导出
let downLoading = ref(false)
function exportFile() {
  downLoading.value = true
  CommonService.exportData('/task/export', {
    taskName: searchName.value,
    taskStatus: taskStatusValue.value,
  }, '任务认领').then(() => {
    downLoading.value = false
  })
}
</script>

<template>
  <div class="content-container">
    <div class="top-group">
      <a-row :gutter="[24,8]">
        <a-col :span="6">
          <a-form-item label="任务名称">
            <a-input style="width: 100%" v-model:value="searchName" placeholder="请输入" allowClear/>
          </a-form-item>
        </a-col>
        <a-col :span="6">
          <a-form-item label="任务状态">
            <a-select style="width: 100%" :options="taskStatus" v-model:value="taskStatusValue" placeholder="请选择" allowClear/>
          </a-form-item>
        </a-col>
        <a-col :span="2"  style="text-align: right">
          <a-button  type="primary" @click="getList">搜索</a-button>
        </a-col>
        <a-col :span="10" style="text-align: right">
          <a-button  type="primary" class="mr-10" @click="openModal(false, null)">添加</a-button>
          <!--          <a-popconfirm title="确定删除吗？" ok-text="确定" cancel-text="取消" @confirm="del(true, null)">
                      <a-button  type="primary" class="mr-10" danger>删除</a-button>
                    </a-popconfirm>-->
          <a-button type="primary" @click="exportFile" :loading="downLoading">
            <template #icon>
              <Icon icon="DownloadOutlined"/>
            </template>
            导出数据
          </a-button>
        </a-col>
      </a-row>
    </div>
    <div class="table">
      <!--       :row-selection="rowSelection" :row-key="record => record.id"-->
      <a-table id="printContent"  :data-source="displayData" :columns="columns" :pagination="pagination">
        <template #bodyCell="{column, record}">
          <template v-if="column.key === 'taskImg'">
            <a-image :src="imgUrl + 'files/' + record.taskImg" alt="" style="width: 100px"/>
          </template>
          <!--          <template v-if="column.key === 'taskBeginTime'">
                      {{dayjs(record.taskBeginTime).format('YYYY年MM月DD HH:mm')}}
                    </template>
                    <template v-if="column.key === 'taskEndTime'">
                      {{dayjs(record.taskEndTime).format('YYYY年MM月DD HH:mm')}}
                    </template>
                    <template v-if="column.key === 'signEndTime'">
                      {{dayjs(record.signEndTime).format('YYYY年MM月DD HH:mm')}}
                    </template>-->
          <template v-if="column.key === 'taskStatus'">
            {{record.taskStatus === 1 ? '未开始' : (record.taskStatus === 2 ? '进行中' : '已结束')}}
          </template>
          <template v-if="column.key === 'action'">
            <a-button type="primary" class="mr-10" @click="openModal(true, record)">编辑</a-button>
            <a-popconfirm title="确定删除吗？" ok-text="确定" cancel-text="取消" @confirm="del(record.id)">
              <a-button type="primary" danger>删除</a-button>
            </a-popconfirm>
          </template>
        </template>
      </a-table>
    </div>
    <a-modal :open="modalVisible"  :title="isEdit ? '编辑任务': '添加'" :footer="false" :mask-closable="false" @cancel="closeModal">
      <a-form-item label="任务名称" required :label-col="{span: 6}">
        <a-input v-model:value="modalData.taskName" placeholder="请输入"></a-input>
      </a-form-item>
      <a-form-item label="任务内容" required :label-col="{span: 6}">
        <a-textarea v-model:value="modalData.taskContent" placeholder="请输入"></a-textarea>
      </a-form-item>
      <a-form-item label="积分" required :label-col="{span: 6}">
        <a-input v-model:value="modalData.pointsNum" placeholder="请输入"></a-input>
      </a-form-item>
      <a-form-item label="任务开始时间" required :label-col="{span: 6}">
        <a-date-picker show-time v-model:value="activityStartTime" placeholder="开始时间" style="width: 100%"/>
      </a-form-item>
      <a-form-item label="任务结束时间" required :label-col="{span: 6}">
        <a-date-picker show-time v-model:value="activityEndTime" placeholder="结束时间" style="width: 100%"/>
      </a-form-item>
      <a-form-item label="认领开始时间" required :label-col="{span: 6}">
        <a-date-picker show-time v-model:value="activityBeginline" placeholder="报名开始时间" style="width: 100%"/>
      </a-form-item>
      <a-form-item label="认领截止时间" required :label-col="{span: 6}">
        <a-date-picker show-time v-model:value="activityDeadline" placeholder="报名截止时间" style="width: 100%"/>
      </a-form-item>
      <a-form-item label="上传图片" :label-col="{span: 6}">
        <a-upload  list-type="picture-card" name="file" v-model:file-list="fileList"   :show-upload-list="false" accept="image/*" :headers="headers"
                   :action="baseURL + '/common/upload'" @change="handleFile">
          <img v-if="imageUrl" :src="imgUrl + 'files/'+imageUrl" alt="avatar" style="width: 100%"/>
          <div v-else>
            <Icon icon="UploadOutlined" style="font-size: 28px"/>
            <div class="ant-upload-text">选择文件</div>
          </div>
        </a-upload>
      </a-form-item>
      <a-row>
        <a-col :span="6" :offset="6"><a-button type="primary" @click="save">立即提交</a-button></a-col>
        <a-col :span="6"><a-button type="default" @click="resetModal">重置</a-button></a-col>
      </a-row>
    </a-modal>

  </div>
</template>

<style scoped lang="less">

</style>
