
<template>
  <div class="content-container">
    <div class="top-group">
      <a-row :gutter="[24,8]">
        <a-col :span="7">
          <a-form-item label="账号">
            <a-input style="width: 100%" v-model:value="searchName" placeholder="请输入账号" allowClear/>
          </a-form-item>
        </a-col>
        <a-col :span="7">
          <a-form-item label="姓名名称">
            <a-input style="width: 100%" v-model:value="searchAName" placeholder="请输入姓名" allowClear/>
          </a-form-item>
        </a-col>
        <a-col :span="7">
          <a-form-item label="社区">
            <a-select :options="areaList" v-model:value="searchCCode" placeholder="请选择" allowClear/>
          </a-form-item>
        </a-col>
        <a-col :span="3"  style="text-align: right">
          <a-button  type="primary" @click="getList">搜索</a-button>
        </a-col>
      </a-row>
      <a-row :gutter="[24,8]">
        <a-col :span="24" style="text-align: right">
          <a-button  type="primary" class="mr-10" @click="openModal(false, null)">添加</a-button>
          <a-popconfirm title="确定删除吗？" ok-text="确定" cancel-text="取消" @confirm="del(true, null)">
            <a-button  type="primary" class="mr-10" danger>删除</a-button>
          </a-popconfirm>
          <a-button  type="primary" class="mr-10" @click="openPoint">同步用户积分</a-button>
          <a-button  type="primary" @click="reset">重置登录次数</a-button>
          <!--          <a-button  type="primary" @click="exportFile">导出数据</a-button>-->
        </a-col>
      </a-row>
    </div>
    <a-divider />
    <div class="table">
      <a-table id="printContent" :row-selection="rowSelection" :row-key="record => record.userId"  :data-source="displayData" :columns="columns" :pagination="pagination">
        <template #bodyCell="{column, record}">
          <template v-if="column.key === 'loginDate'">
            {{dayjs(record.loginDate).format('YYYY年MM月DD HH:mm:ss')}}
          </template>
          <template v-if="column.key === 'action'">
            <a-button type="primary" class="mr-10" @click="openModal(true, record)">编辑</a-button>
            <a-button type="primary" class="mr-10" @click="openMenu(record)">修改菜单权限</a-button>
            <a-popconfirm title="确定删除吗？" ok-text="确定" cancel-text="取消" @confirm="del(false, record.userId)">
              <a-button type="primary" danger>删除</a-button>
            </a-popconfirm>
          </template>
        </template>
      </a-table>
    </div>

    <!--添加-->
    <a-modal :open="modalVisible" :title="isEdit ? '修改用户': '新增用户'" :footer="false" :mask-closable="false" @cancel="closeModal">
      <a-form-item label="手机号" required :label-col="{span: 4}">
        <a-input v-model:value="currentUsr.userName" placeholder="请输入"></a-input>
      </a-form-item>
      <a-form-item label="密码" required :label-col="{span: 4}">
        <a-input-password v-model:value="currentUsr.passWord" placeholder="请输入"></a-input-password>
      </a-form-item>
      <a-form-item label="别名" required :label-col="{span: 4}">
        <a-input v-model:value="currentUsr.aliasName"  placeholder="请输入"></a-input>
      </a-form-item>
      <a-form-item label="部门" required :label-col="{span: 4}">
        <a-input v-model:value="currentUsr.deptName"  placeholder="请输入"></a-input>
      </a-form-item>
      <a-form-item label="性别" required :label-col="{span: 4}">
        <a-radio-group v-model:value="currentUsr.gender">
          <a-radio :value="'1'">男</a-radio>
          <a-radio :value="'2'">女</a-radio>
        </a-radio-group>
      </a-form-item>
      <a-form-item label="省" required :label-col="{span: 4}">
        <a-select :options="province" v-model:value="currentUsr.provinceCode" @change="provinceChange"  placeholder="请选择"></a-select>
      </a-form-item>
      <a-form-item label="市" required :label-col="{span: 4}">
        <a-select :options="city" v-model:value="currentUsr.cityCode" @change="cityChange"  placeholder="请选择"></a-select>
      </a-form-item>
      <a-form-item label="县" required :label-col="{span: 4}">
        <a-select :options="country" v-model:value="currentUsr.countyCode" @change="countryChange"  placeholder="请选择"></a-select>
      </a-form-item>
      <a-form-item label="街道" required :label-col="{span: 4}">
        <a-select :options="street" v-model:value="currentUsr.streetCode" @change="streetChange"  placeholder="请选择"></a-select>
      </a-form-item>
      <a-form-item label="社区" required :label-col="{span: 4}">
        <a-select :options="areas" v-model:value="currentUsr.areasCode"  placeholder="请选择"></a-select>
      </a-form-item>
      <a-form-item label="启用状态" :label-col="{span: 4}">
        <a-radio-group v-model:value="currentUsr.enabled">
          <a-radio :value="0">启用</a-radio>
          <a-radio :value="1">停用</a-radio>
        </a-radio-group>
      </a-form-item>
      <a-form-item label="用户头像" required :label-col="{span: 4}">
        <a-upload v-model:file-list="fileList"  list-type="picture-card"  :show-upload-list="false" name="file" accept="image/*"
                  :action="baseURL + '/uploadFileController/uploadServlet?type=15'" :headers="headers" @change="handleFile">
          <img v-if="imageUrl" :src="imgUrl + 'getFileController/getFile?fileName='+imageUrl" alt="avatar" style="width: 100%" />
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

    <!--同步用户积分-->
    <a-modal title="上传用户信息" :open="pointModal" :footer="false" :mask-closable="false" @cancel="closePoint">
      <a-upload-dragger
          v-model:fileList="xlsList"
          name="file"  :show-upload-list="false" accept=".xls"
          :action="baseURL + 'uploadExcelFileController/uploadServlet'"
          @change="handleXlsFile"
      >
        <p class="ant-upload-drag-icon">
          <Icon icon="UploadOutlined" style="font-size: 28px"/>
        </p>
        <p class="ant-upload-text">点击选择文件或拖拽文件到此处</p>
        <p class="ant-upload-hint">
          仅支持 .xls 文件
        </p>
      </a-upload-dragger>
      <a-row class="mt-16">
        <a-col :span="12" :offset="10"><a-button type="primary" @click="closePoint">立即提交</a-button></a-col>
      </a-row>
    </a-modal>

    <!--  菜单  -->
    <a-modal title="请选择权限" :open="menuModal" :footer="false" :mask-closable="false" @cancel="closeMenu" width="50%">
      <div v-for="item in checkList">
        <div class="main-tit">
          <a-checkbox v-model:checked="item.checked" @change="handleChildChange(item)">{{item.label}}</a-checkbox>
        </div>
        <div class="sub">
          <a-checkbox v-for="child in item.child" v-model:checked="child.checked">
            {{child.label}}
          </a-checkbox>
        </div>
      </div>
      <a-row>
        <a-col :span="6" :offset="6"><a-button type="primary" @click="updateUsrMenu">确定</a-button></a-col>
        <a-col :span="6"><a-button type="default" @click="closeMenu">取消</a-button></a-col>
      </a-row>
    </a-modal>
  </div>
</template>

<script setup>
let checkList = ref([])
function getFull() {
  MenuService.fullList({}).then(res => {
    let temp = []
    if(res.code === 200){
      res.data.forEach(val => {
        if(val.childList.length > 0) {
          temp = []
          val.childList.forEach(cval => {
            temp.push({
              value: cval.id,
              label: cval.menuName,
              checked: false
            })
          })
        }
        checkList.value.push({
          value: val.id,
          label: val.menuName,
          checked: false,
          child: [...temp]
        })
      })
    }
  })
}
function handleChildChange(data) {
  checkList.value.forEach(val => {
    if(val.value === data.value) {
      val.child.forEach(cval => {
        cval.checked = data.checked
      })
    }
  })
}
let menuModal = ref(false)
const openMenu = (data) => {
  currentId.value = data.userId
  getUsrMenu(data.userId)
  menuModal.value = true
}
const closeMenu = () => {
  menuModal.value = false
}
let currentUserMenuList = ref([])
function getUsrMenu(userId) {
  UsrService.usrMenu({userId}).then(res => {
    if(res.code === 200) {
      currentUserMenuList.value = res.data
      updateCheckList()
    }
  })
}
function updateCheckList() {
  // 遍历 checkList
  checkList.value.forEach(item => {
    // 遍历 currentUserMenuList 中的每个菜单项
    currentUserMenuList.value.forEach(menuItem => {
      if(menuItem.id === item.value) {
        item.checked = true
      }
      // 如果 menuItem 中有 childList
      if (menuItem.childList && menuItem.childList.length > 0) {
        // 遍历 childList 中的每个子项
        menuItem.childList.forEach(childItem => {
          // 在 checkList 的子项中查找匹配的 value
          if (item.child && item.child.length > 0) {
            item.child.forEach(child => {
              if (child.value === childItem.id) {
                child.checked = true; // 匹配成功，设置 checked 为 true
              }
            });
          }
        });
      }
    });
  });
}
let currentUserMenu = ref([])
function updateUsrMenu() {
  checkList.value.forEach(val => {
    if(val.checked) {
      currentUserMenu.value.push(val.value)
    }
    if(val.child.length>0) {
      val.child.forEach(cval => {
        if(cval.checked) {
          currentUserMenu.value.push(cval.value)
        }
      })
    }
  })
  UsrService.updateUsrMenu({
    userId: currentId.value,
    menuIdList: currentUserMenu.value
  }).then(res => {
    if(res.code === 200) {
      message.success('修改成功')
      closeMenu()
      getList()
    } else {
      message.error(res.msg)
    }
  })
}
let pointModal = ref(false)
let xlsList = ref([])
const openPoint = () => {
  pointModal.value = true
}
const closePoint = () => {
  pointModal.value = false
}
const handleXlsFile = info => {
  if (info.file.status !== 'uploading') {
    console.log(info.file, info.fileList);
  }
  if (info.file.status === 'done') {
    message.success(`${info.file.name} 文件上传成功`);
  } else if (info.file.status === 'error') {
    message.error(`${info.file.name} 文件上传失败`);
  }
}
function save() {
  province.value.forEach(val => {
    if(val.areasCode === currentUsr.value.provinceCode) {
      currentUsr.value.provinceName = val.areasName
    }
  })
  city.value.forEach(val => {
    if(val.areasCode === currentUsr.value.cityCode) {
      currentUsr.value.cityName = val.areasName
    }
  })
  country.value.forEach(val => {
    if(val.areasCode === currentUsr.value.countyCode) {
      currentUsr.value.countryName = val.areasName
    }
  })
  street.value.forEach(val => {
    if(val.areasCode === currentUsr.value.streetCode) {
      currentUsr.value.streetName = val.areasName
    }
  })
  areas.value.forEach(val => {
    if(val.areasCode === currentUsr.value.areasCode) {
      currentUsr.value.areasName = val.areasName
    }
  })
  if(isEdit.value) {
    update()
  } else {
    add()
  }
}

function provinceChange() {
  getAreaList({
    level:2,
    pCode: currentUsr.value.provinceCode,
    aCode: 110100
  }).then(res => {
    if(res.code === 200) {
      city.value = res.rows
      city.value.forEach(val => {
        val.label = val.areasName
        val.value = val.areasCode
      })
    } else {
      message.error(res.msg)
    }
  })
}
function cityChange() {
  getAreaList({
    level: 3,
    aCode: 110114,
    pCode: currentUsr.value.cityCode
  }).then( res => {
    if(res.code === 200) {
      country.value = res.rows
      country.value.forEach(val => {
        val.label = val.areasName
        val.value = val.areasCode
      })
    } else {
      message.error(res.msg)
    }
  })
}
function countryChange() {
  getAreaList({
    level: 4,
    pCode: currentUsr.value.countyCode
  }).then(res => {
    if(res.code === 200) {
      street.value = res.rows
      street.value.forEach(val => {
        val.label = val.areasName
        val.value = val.areasCode
      })
    } else {
      message.error(res.msg)
    }
  })
}

function streetChange() {
  getAreaList({
    level: 5,
    pCode: currentUsr.value.streetCode
  }).then(res => {
    if(res.code === 200) {
      areas.value = res.rows
      areas.value.forEach(val => {
        val.label = val.areasName
        val.value = val.areasCode
      })
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
  if (info.file.status !== 'uploading') {
    console.log(info.file, info.fileList);
  }
  if (info.file.status === 'done') {
    message.success(`${info.file.name} 文件上传成功`);
    if(info.file.response) {
      imageUrl.value =  info.file.response.url
      currentUsr.value.userPicUrl = imageUrl.value
    }
  } else if (info.file.status === 'error') {
    message.error(`${info.file.name} 文件上传失败`);
  }
}
import {MenuService, UsrService} from "@/api/system.js";

import { message } from "ant-design-vue";
import { onMounted, ref } from "vue";

import dayjs from 'dayjs';

onMounted(() => {
  getList()
  getFull()
  getAreaList({level: 5}).then(res => {
    if(res.code === 200) {
      areaList.value = res.rows
      areaList.value.forEach(val => {
        val.label = val.areasName
        val.value = val.areasCode
      })
    } else {
      message.error(res.msg)
    }
  })
})


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
  { title: 'ID', dataIndex: 'userId', key: 'userId' },
  { title: '账号', dataIndex: 'userName', key: 'userName' },
  { title: '别名', dataIndex: 'aliasName', key: 'aliasName' },
  { title: '部门', dataIndex: 'deptName', key: 'deptName' },
  { title: '注册时间', dataIndex: 'loginDate', key: 'loginDate' },
  { title: '登录次数', dataIndex: 'loginNumber', key: 'loginNumber' },
  { title: '操作', dataIndex: 'action', key: 'action' },
])
let selectIds = ref('')
const rowSelection = {
  onChange: (selectedRowKeys, selectedRows) => {
    selectIds.value = selectedRowKeys
  },
  getCheckboxProps: record => ({
    userId: record.userId,
  }),
};

let areaList = ref([])
async function getAreaList(data) {
  let param = {
    areasLevel: data.level ?? '',
    parentCode: data.pCode ?? '',
    areasCode: data.aCode ?? '',
    areasName: data.aName ?? ''
  }
  return UsrService.areaList(param)
}

function getList() {
  UsrService.list({
    page: pagination.value.currentPage,
    rows: pagination.value.pageSize,
    userName: searchName.value,
    aliasName: searchAName.value,
    areasId: searchCCode.value,
  }).then(res => {
    console.log(res);
    if(res.code === 200) {
      displayData.value = res.rows
      pagination.value.total = res.total
    } else {
      message.error(res.msg)
    }
  })
}

let searchName = ref('')
let searchAName = ref('')
let searchCCode = ref(null)


// 新增、编辑
let currentUsr = ref(
    {
      userName:"",
      passWord:"",
      aliasName:"",
      gender:"1",
      provinceCode:null,
      provinceName:"",
      cityCode:null,
      cityName:"",
      countyCode:null,
      countryName:"",
      streetCode:null,
      streetName:"",
      areasCode:null,
      areasName:"",
      userPicUrl:"",
      enabled:0,
      deptName: '',
    }
)
let province = ref([])
let city = ref([])
let country = ref([])
let street = ref([])
let areas = ref([])
let modalVisible = ref(false)
let isEdit = ref(false)
let currentId = ref('')
const openModal = (edit, data) => {
  isEdit.value = edit
  if(isEdit.value) {
    search(data.userId)
    currentId.value = data.userId
  }
  getAreaList({
    level: 1,
    aCode: 110000
  }).then(res => {
    console.log(res);
    if(res.code === 200) {
      province.value = res.rows
      province.value.forEach(val => {
        val.label = val.areasName
        val.value = val.areasCode
      })
      if(isEdit.value){
        provinceChange()
        cityChange()
        countryChange()
        streetChange()
      }
    } else {
      message.error(res.msg)
    }
  })
  modalVisible.value = true
}
const closeModal = () => {
  modalVisible.value = false
  resetModal()
}
function resetModal() {
  for (let valueKey in currentUsr.value) {
    currentUsr.value[valueKey] = null
    if(valueKey === 'gender') {
      currentUsr.value[valueKey] = '1'
    }
    if(valueKey === 'enabled') {
      currentUsr.value[valueKey] = 0
    }
  }
}
// 搜索
function search(userId) {
  UsrService.search({userId}).then(res => {
    console.log(res);
    if(res.code === 200) {
      currentUsr.value = res.user
      imageUrl.value = currentUsr.value.userPicUrl
    } else {
      message.error(res.msg)
    }
  })
}

// 修改
function update() {
  UsrService.update({
    userId: currentId.value,
    ...currentUsr.value
  }).then(res => {

    if(res.code === 200 ){
      message.success('修改成功')
      getList()
      closeModal()
    } else {
      message.error(res.msg)
    }
  })
}

// 新增
function add() {
  UsrService.add(currentUsr.value).then(res => {
    if(res.code === 200 ){
      message.success('添加成功')
      getList()
      closeModal()
    } else {
      message.error(res.msg)
    }
  })
}
// 删除
function del(isMulti, id) {
  if(isMulti) {
    if(!selectIds.value.length > 0) {
      message.warning('请先勾选数据')
      return
    }
    console.log(selectIds.value.join(','));
  }
  UsrService.del({
    user_ids: isMulti ? selectIds.value.join(',') : id
  }).then(res => {
    if(res.code === 200 ){
      message.success('删除成功')
      getList()
    } else {
      message.error(res.msg)
    }
  })

}

// 重置登录次数
function reset() {
  if(!selectIds.value.length > 0) {
    message.warning('请先勾选数据')
    return
  }
  UsrService.reset({
    user_ids: selectIds.value.join(',')
  }).then(res => {
    if(res.code === 200 ){
      message.success('重置成功')
      getList()
    } else {
      message.error(res.msg)
    }
  })
}

// 导出数据
function exportFile() {
  let link = document.createElement("a");
  link.style.display = "none";
  link.href = baseURL + '/uploadExcelFileController/exportUserList?areasId=' + searchCCode.value + '&userName='+searchName.value;
  link.setAttribute("download", '用户信息.xls');
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link); // 下载完成移除元素
}

</script>


<style scoped lang="less">
.main-tit{
  font-weight: bold;
  color: #000;
  font-size: 16px;
  margin-top: 10px;
  label{
    font-size: 16px;
  }
}
.sub{
  padding-left: 32px;
}
</style>
