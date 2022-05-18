<script setup lang="ts">
import { onMounted, reactive, ref, watch } from 'vue'
import { NSelect, NDropdown, NIcon, NModal, NButton, SelectOption, NInput, SelectGroupOption } from 'naive-ui';
import { PlusCircleOutlined } from '@vicons/antd';
import { useChatStore } from '@/stores/chat';
import { GroupnameVerify, nameVerify, processReturnArr } from '@/utils/common';
import { debounce } from 'lodash'
import { getGroupsByName, type GetfindByNameRs } from '@/apis/api/modules/group';
import { storeToRefs } from 'pinia';
import { useAppStore } from '@/stores/app';
import { getUsersByName } from '@/apis/api/modules/user';
const chatstate = useChatStore()
const appstate = useAppStore()
const { groupGather, friendGather } = storeToRefs(chatstate)

let searchData: any = ref([]);
const selectValue = ref<string>('')
function setSearchData() {
  const data = [...Object.values(chatstate.groupGather), ...Object.values(chatstate.friendGather)]
  searchData.value = data.map((obj) => {
    return {
      label: ((obj as Group).groupName) || ((obj as Friend).username),
      value: ((obj as Group).groupId) || ((obj as Friend).userId)
    }
  })
}
function handleSearch(value: string) {
  chatstate.set_active_room(chatstate.groupGather[value])
}
setSearchData()
watch(() => groupGather, () => {
  setSearchData()
}, { deep: true })
watch(() => friendGather, () => {
  setSearchData()
}, { deep: true })

//+号下滑区配置
const showModalRef = reactive({
  showAddGroup: false,
  showJoinGroup: false,
  showAddFriend: false
})
const dropDownOptions = [
  {
    label: '创建群',
    key: 'showAddGroup',
    props: {
      onClick: () => {
        showModalRef.showAddGroup = !showModalRef.showAddGroup
      }
    }
  },
  {
    label: '加入群',
    key: 'showJoinGroup',
    props: {
      onClick: () => {
        showModalRef.showJoinGroup = !showModalRef.showJoinGroup
      }
    }
  },
  {
    label: '添加好友',
    key: 'showAddFriend',
    props: {
      onClick: () => {
        showModalRef.showAddFriend = !showModalRef.showAddFriend
      }
    }
  },
]
//创群配置
const addGroupValue = ref<string>('')
function addGroup() {
  showModalRef.showAddGroup = false;
  if (!GroupnameVerify(addGroupValue.value)) {
    return showModalRef.showAddGroup = true
  }
  chatstate.socket!.emit('addGroup', {
    userId: appstate.user.userId,
    groupName: addGroupValue.value,
    createTime: new Date().valueOf(),
  })
  addGroupValue.value = ''
}


//加群配置
const joinGroupValue = ref<string>('')
const joinGroupLoading = ref<boolean>(false)
const groupOptionsRef = ref<SelectOption[]>([])


async function groupSearch(query: string) {
  if (!query.length) {
    return groupOptionsRef.value = []
  }
  joinGroupLoading.value = true
  const res = await getGroupsByName(query);
  const data = processReturnArr<GetfindByNameRs>(res)
  groupOptionsRef.value = data?.map(item => {
    return {
      label: item.groupName,
      value: item.groupId
    }
  })
  joinGroupLoading.value = false
}

const handleGroupSearch = debounce(groupSearch, 200);
function joinGroup() {
  showModalRef.showAddGroup = false;
  chatstate.socket!.emit('joinGroup', {
    userId: appstate.user.userId,
    groupId: joinGroupValue.value
  })
  joinGroupValue.value = ''
}

//加好友配置
const addFriendValue = ref<string>('')
const addFriendLoading = ref<boolean>(false)
const friendOptionsRef = ref<SelectOption[]>([])

async function friendSearch(query: string) {
  if (!query.length) {
    return friendOptionsRef.value = []
  }
  addFriendLoading.value = true
  const res = await getUsersByName(query)
  const data = processReturnArr<any>(res)
  friendOptionsRef.value = data?.map(item => {
    return {
      label: item.username,
      value: item.userId
    }
  })
  addFriendLoading.value = false
}
const handleFriendSearch = debounce(friendSearch, 200);
function addFriend() {
  showModalRef.showAddFriend = false;
  chatstate.socket!.emit('addFriend', {
    userId: appstate.user.userId,
    friendId: addFriendValue.value,
    createTime: new Date().valueOf(),
  })
  addFriendValue.value = ''
}
</script>
<template>
  <div class="search">
    <div class="search-select">
      <n-select v-model:value='selectValue' filterable :show-arrow=false placeholder="搜索聊天组" :options="searchData"
        @update:value="handleSearch">
      </n-select>
      <div class="search-dropdown">
        <n-dropdown class="" trigger="hover" :options="dropDownOptions">
          <n-icon size="35" :component="PlusCircleOutlined" />
        </n-dropdown>
      </div>

    </div>
    <n-modal v-model:show="showModalRef.showAddGroup" preset="card" style="width:500px" title="创建群" size="small"
      :bordered="false" :segmented="{
        content: 'soft'
      }">
      <div style="display:flex">
        <n-input v-model:value="addGroupValue" placeholder="请输入群名字" />
        <n-button @click="addGroup">确定</n-button>
      </div>
    </n-modal>
    <n-modal v-model:show="showModalRef.showJoinGroup" preset="card" style="width:500px" title="加入群" size="small"
      :bordered="false" :segmented="{
        content: 'soft'
      }">
      <div style="display:flex">
        <n-select v-model:value="joinGroupValue" filterable placeholder="请输入群名字" :options="groupOptionsRef"
          :loading="joinGroupLoading" clearable remote @search="handleGroupSearch" />
        <n-button @click="joinGroup">确定</n-button>
      </div>

    </n-modal>
    <n-modal v-model:show="showModalRef.showAddFriend" preset="card" style="width:500px" title="添加好友" size="small"
      :bordered="false" :segmented="{
        content: 'soft'
      }">
      <div style="display:flex">
        <n-select v-model:value="addFriendValue" filterable placeholder="请输入好友名字" :options="friendOptionsRef"
          :loading="addFriendLoading" clearable remote @search="handleFriendSearch" />
        <n-button @click="addFriend">确定</n-button>
      </div>
    </n-modal>
  </div>
</template>

<style lang="scss" scoped>
.search {
  position: relative;
  height: 60px;
  padding: 10px;
  display: flex;
  align-items: center;

  .search-select {
    width: 100%;


    .search-dropdown {
      position: absolute;
      right: 10px;
      top: 23px;
      width: 40px;
      height: 34px;
      font-size: 20px;
      cursor: pointer;
      line-height: 40px;
      color: gray;
      transition: 0.2s all linear;
      border-radius: 4px;

      &:hover {
        background-color: skyblue;
      }
    }
  }
}
</style>
