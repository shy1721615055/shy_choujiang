<script setup lang='ts'>
import { ref, computed, h, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { storeToRefs } from 'pinia'
import PageHeader from '@/components/PageHeader/index.vue'
import DaiysuiTable from '@/components/DaiysuiTable/index.vue'
import CustomDialog from '@/components/Dialog/index.vue'
import useStore from '@/store'
import type { IPrizeConfig } from '@/types/storeType'

const { t } = useI18n()
const personConfig = useStore().personConfig
const prizeConfig = useStore().prizeConfig

const { getAllPersonList: allPersonList } = storeToRefs(personConfig)
const { getPrizeConfig: prizeList } = storeToRefs(prizeConfig)

const reservedDialogRef = ref<any>(null)
const clearAllDialogRef = ref<any>(null)
const addReservedDialogRef = ref<any>(null)

const selectedPerson = ref<any>(null)
const selectedPrizeId = ref<string>('')

// 添加内定时使用的表单数据
const addFormPersonId = ref<number | ''>('')
const addFormPrizeId = ref<string>('')

const reservedPersons = computed(() => {
    const result = allPersonList.value.filter((p: any) => p.reservedPrizeId != null && p.reservedPrizeId !== '')
    console.log('内定人员列表计算:', result.length, '人', result.map(p => ({ uid: p.uid, name: p.name, reservedPrizeId: p.reservedPrizeId })))
    return result
})

// 可供选择的未内定人员列表
const availablePersons = computed(() => {
    return allPersonList.value.filter((p: any) => !p.reservedPrizeId || p.reservedPrizeId === '')
})

function showReservedDialog(person: any) {
    selectedPerson.value = person
    selectedPrizeId.value = person.reservedPrizeId || ''
    reservedDialogRef.value.showDialog()
}

function confirmReserved() {
    if (selectedPerson.value) {
        personConfig.setReservedPerson(selectedPerson.value.id, selectedPrizeId.value || null)
        // 对话框会自动关闭
    }
}

function clearReserved(personId: number) {
    personConfig.clearReservedPerson(personId)
}

function clearAll() {
    personConfig.clearAllReservedPersons()
    // 对话框会自动关闭
}

function showAddReservedDialog() {
    addFormPersonId.value = ''
    addFormPrizeId.value = ''
    addReservedDialogRef.value.showDialog()
}

function confirmAddReserved() {
    // 检查是否选择了人员（排除空字符串、null、undefined）
    const isPersonSelected = addFormPersonId.value !== '' && addFormPersonId.value !== null && addFormPersonId.value !== undefined
    // 检查是否选择了奖品
    const isPrizeSelected = addFormPrizeId.value && addFormPrizeId.value !== ''

    if (!isPersonSelected || !isPrizeSelected) {
        alert('请选择人员和奖品')
        return
    }

    const person = allPersonList.value.find((p: any) => p.id === addFormPersonId.value)
    console.log('准备添加内定:', person, '奖品ID:', addFormPrizeId.value)

    if (person) {
        personConfig.setReservedPerson(addFormPersonId.value as number, addFormPrizeId.value)
        console.log('添加内定后，人员列表中的该人员:', allPersonList.value.find((p: any) => p.id === addFormPersonId.value))
        // 对话框会通过 submitFunc 自动关闭，不需要手动调用 closeDialog
    }
}

const tableColumns = [
    {
        label: t('data.number'),
        props: 'uid',
    },
    {
        label: '姓名',
        props: 'name',
    },
    {
        label: '内定奖品',
        props: 'reservedPrizeId',
        formatValue: (record: any) => {
            const prize = prizeList.value.find((p: IPrizeConfig) => p.id === record.reservedPrizeId)
            return prize ? prize.name : '-'
        },
    },
    {
        actions: [
            {
                label: '编辑',
                type: 'btn-primary',
                onClick: (record: any) => showReservedDialog(record),
            },
            {
                label: '清除',
                type: 'btn-error',
                onClick: (record: any) => clearReserved(record.id),
            },
        ],
    },
]

</script>

<template>
    <CustomDialog
        ref="reservedDialogRef"
        title="设置内定奖品"
        desc=""
        :submit-func="confirmReserved"
    >
        <template #content>
            <div v-if="selectedPerson" class="form-control w-full">
                <label class="label">
                    <span class="label-text">人员: {{ selectedPerson.name }} ({{ selectedPerson.uid }})</span>
                </label>
                <select v-model="selectedPrizeId" class="select select-bordered w-full">
                    <option value="">无内定</option>
                    <option v-for="prize in prizeList" :key="prize.id" :value="prize.id">
                        {{ prize.name }}
                    </option>
                </select>
            </div>
        </template>
    </CustomDialog>

    <CustomDialog
        ref="clearAllDialogRef"
        :title="t('dialog.titleTip')"
        desc="确定要清除所有内定设置吗？"
        :submit-func="clearAll"
    />

    <CustomDialog
        ref="addReservedDialogRef"
        title="添加内定"
        desc=""
        :submit-func="confirmAddReserved"
    >
        <template #content>
            <div class="form-control w-full gap-4">
                <div class="form-control w-full">
                    <label class="label">
                        <span class="label-text">选择人员</span>
                    </label>
                    <select v-model="addFormPersonId" class="select select-bordered w-full">
                        <option value="">请选择人员</option>
                        <option v-for="person in availablePersons" :key="person.id" :value="person.id">
                            {{ person.name }} ({{ person.uid }})
                        </option>
                    </select>
                </div>

                <div class="form-control w-full">
                    <label class="label">
                        <span class="label-text">选择奖品</span>
                    </label>
                    <select v-model="addFormPrizeId" class="select select-bordered w-full">
                        <option value="">请选择奖品</option>
                        <option v-for="prize in prizeList" :key="prize.id" :value="prize.id">
                            {{ prize.name }}
                        </option>
                    </select>
                </div>
            </div>
        </template>
    </CustomDialog>

    <div class="min-w-1000px">
        <PageHeader title="人员奖品管理">
            <template #buttons>
                <div class="flex gap-3">
                    <button class="btn btn-success btn-sm" @click="showAddReservedDialog">
                        添加内定
                    </button>
                    <button class="btn btn-error btn-sm" @click="clearAllDialogRef.showDialog()">
                        清除所有内定
                    </button>
                    <div>
                        <span>已内定人数: {{ reservedPersons.length }}</span>
                    </div>
                </div>
            </template>
        </PageHeader>

        <DaiysuiTable :table-columns="tableColumns" :data="reservedPersons" />
    </div>
</template>

<style lang='scss' scoped></style>