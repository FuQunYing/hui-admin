<script setup>
import { MenuService } from "@/api/system.js";
import { message } from "ant-design-vue";
import { onMounted, ref } from "vue";

onMounted(() => {
  getList()
  getFull()
})


let searchName = ref('')
let modalName = ref('')
let modalPath = ref('')
let modalDesc = ref('')
let modalLevel = ref(1)
let modalKey = ref('')
let modalEnable = ref(0)
let parentMenu = ref(null)

let modalVisible = ref(false)
let isEdit = ref(false)
let currentId = ref('')

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
  { title: 'ID',width: 100, dataIndex: 'id', key: 'id' },
  { title: '菜单名称', width: 150,dataIndex: 'menuName', key: 'menuName' },
  { title: '菜单路径', width: 150,dataIndex: 'menuPath', key: 'menuPath', },
  { title: '菜单等级', dataIndex: 'menuLevel', key: 'menuLevel' },
  { title: '菜单标识', dataIndex: 'menuKey', key: 'menuKey' },
  // { title: '菜单状态', dataIndex: 'enabled', key: 'enabled' },
  { title: '操作', dataIndex: 'action', key: 'action' },
])
let selectIds = ref('')
const rowSelection = {
  onChange: (selectedRowKeys, selectedRows) => {
    selectIds.value = selectedRowKeys
    console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
  },
  getCheckboxProps: record => ({
    userId: record.userId,
  }),
};

function getList() {
  MenuService.list({
    pageNum: pagination.value.currentPage,
    pageSize: pagination.value.pageSize,
    r_name: searchName.value,
  }).then(res => {
    console.log(res);
    if(res.code === 200) {
      displayData.value = res.data.records
      pagination.value.total = res.data.totalRow
    } else {
      message.error(res.msg)
    }
  })
}
function search(id) {
  MenuService.search({id}).then(res => {
    console.log(res);
    if(res.code === 200){
      modalName.value = res.data.menuName
      modalPath.value = res.data.menuPath
      modalKey.value = res.data.menuKey
      modalLevel.value = res.data.menuLevel
      parentMenu.value = res.data.menuParentId
    } else {
      message.error(res.msg)
    }
  })
}
// 全部菜单
let selectList = ref([])
function getFull() {
  MenuService.fullList({}).then(res => {
    console.log(res);
    if(res.code === 200){
      res.data.forEach(val => {
        selectList.value.push({
          value: val.id,
          label: val.menuName
        })
      })
    }
  })
}
const openModal = (edit,data) => {
  isEdit.value = edit
  if(isEdit.value) {
    search(data.id)
    currentId.value = data.id
  }
  modalVisible.value = true
}

const closeModal = () => {
  modalVisible.value = false
  modalName.value = ''
  modalPath.value = ''
  modalDesc.value = ''
  modalKey.value = ''
  modalLevel.value = 1
  modalEnable.value = 0
  parentMenu.value = null
}
function del(isMulti,id) {
  if(isMulti) {
    if(!selectIds.value.length > 0) {
      message.warning('请先勾选数据')
      return
    }
    console.log(selectIds.value.join(','));
  }
  MenuService.del({
    id: isMulti ? selectIds.value : [id]
  }).then(res => {
    if(res.code === 200 ){
      message.success('删除成功')
      getList()
    } else {
      message.error(res.msg)
    }
  })
}
function add() {
  MenuService.add({
    menuName: modalName.value,
    menuPath: modalPath.value,
    menuIcon: modalDesc.value,
    menuParentId: parentMenu.value ? parentMenu.value : 0 ,
    menuLevel: modalLevel.value,
    menuKey: modalKey.value,
    menuStatus: modalEnable.value,
  }).then(res => {
    if(res.code === 200 ){
      message.success('添加成功')
      getList()
      getFull()
      closeModal()
    } else {
      message.error(res.msg)
    }
  })
}
function update() {
  MenuService.update({
    id: currentId.value,
    menuName: modalName.value,
    menuPath: modalPath.value,
    menuIcon: modalDesc.value,
    menuParentId: parentMenu.value ? parentMenu.value : 0 ,
    menuLevel: modalLevel.value,
    menuKey: modalKey.value,
    menuStatus: modalEnable.value,
  }).then(res => {
    if(res.code === 200 ){
      message.success('编辑成功')
      getList()
      getFull()
      closeModal()
    } else {
      message.error(res.msg)
    }
  })
}
function save() {
  if(isEdit.value) {
    update()
  } else {
    add()
  }
}


</script>

<template>
  <div class="content-container">
    <div class="top-group">
      <a-row :gutter="[24,8]">
        <a-col :span="10">
          <a-form-item label="菜单名称">
            <a-input style="width: 100%" v-model:value="searchName" placeholder="请输入" allowClear/>
          </a-form-item>
        </a-col>

        <a-col :span="2"  style="text-align: right">
          <a-button  type="primary" @click="getList">搜索</a-button>
        </a-col>
        <a-col :span="12" style="text-align: right">
          <a-button  type="primary" class="mr-10" @click="openModal(false, null)">添加</a-button>
          <a-popconfirm title="确定删除吗？" ok-text="确定" cancel-text="取消" @confirm="del(true, null)">
            <a-button  type="primary" class="mr-10" danger>删除</a-button>
          </a-popconfirm>
        </a-col>
      </a-row>
    </div>
    <a-divider />
    <div class="table">
      <a-table id="printContent" :row-selection="rowSelection" :row-key="record => record.id"  :data-source="displayData" :columns="columns" :pagination="pagination">
        <template #bodyCell="{column, record}">
          <template v-if="column.key === 'action'">
            <a-button type="primary" class="mr-10" @click="openModal(true, record)">编辑</a-button>
            <a-popconfirm title="确定删除吗？" ok-text="确定" cancel-text="取消" @confirm="del(false, record.id)">
              <a-button type="primary" danger>删除</a-button>
            </a-popconfirm>
          </template>
        </template>
      </a-table>
    </div>

    <!--    添加，编辑-->
    <a-modal :open="modalVisible" :title="isEdit ? '编辑菜单': '添加菜单'" :footer="false" :mask-closable="false" @cancel="closeModal">
      <a-form-item label="菜单名称" required :label-col="{span: 4}">
        <a-input v-model:value="modalName" placeholder="请输入"></a-input>
      </a-form-item>
      <a-form-item label="菜单路由" required :label-col="{span: 4}">
        <a-input v-model:value="modalPath" placeholder="请输入"></a-input>
      </a-form-item>
      <a-form-item label="菜单Key" required :label-col="{span: 4}">
        <a-textarea v-model:value="modalKey" placeholder="请输入"></a-textarea>
      </a-form-item>
      <a-form-item label="菜单等级" required :label-col="{span: 4}">
        <a-radio-group v-model:value="modalLevel">
          <a-radio :value="1">一级</a-radio>
          <a-radio :value="2">二级</a-radio>
        </a-radio-group>
      </a-form-item>
      <a-form-item label="启用状态" :label-col="{span: 4}">
        <a-radio-group v-model:value="modalEnable">
          <a-radio :value="0">启用</a-radio>
          <a-radio :value="1">停用</a-radio>
        </a-radio-group>
      </a-form-item>
      <a-form-item label="上级菜单" required :label-col="{span: 4}">
        <a-select :options="selectList" v-model:value="parentMenu"
                  :disabled="modalLevel===1" placeholder="请选择"></a-select>
      </a-form-item>
      <a-row>
        <a-col :span="6" :offset="6"><a-button type="primary" @click="save">立即提交</a-button></a-col>
        <a-col :span="6"><a-button type="default" @click="save">重置</a-button></a-col>
      </a-row>
    </a-modal>

  </div>
</template>

<style scoped lang="less">

</style>
