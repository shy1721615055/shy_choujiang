import type { IPersonConfig, IPrizeConfig } from '@/types/storeType'
import dayjs from 'dayjs'
import { defineStore } from 'pinia'
import { v4 as uuidv4 } from 'uuid'
import { computed, ref, toRaw } from 'vue'
import { IndexDb } from '@/utils/dexie'
import { defaultPersonList } from './data'
import { usePrizeConfig } from './prizeConfig'

// 获取IPersonConfig的key组成数组
export const personListKey = Object.keys(defaultPersonList[0])
export const usePersonConfig = defineStore('person', () => {
    const personDb = new IndexDb('person', ['allPersonList', 'alreadyPersonList'], 1, ['createTime'])
    // NOTE: state
    const personConfig = ref({
        allPersonList: defaultPersonList.map((item: any) => {
            item.uuid = uuidv4()
            return item
        }) as IPersonConfig[],
        alreadyPersonList: [] as IPersonConfig[],
    })

    // NOTE: getter
    // 获取全部配置
    const getPersonConfig = computed(() => personConfig.value)
    // 获取全部人员名单
    const getAllPersonList = computed(() => personConfig.value.allPersonList)
    // 获取未获此奖的人员名单（现在返回所有人，允许重复中奖）
    const getNotThisPrizePersonList = computed(() => {
        // 返回所有人，不再过滤已经中过该奖的人
        return personConfig.value.allPersonList
    })

    // 获取已中奖人员名单
    const getAlreadyPersonList = computed(() => {
        return personConfig.value.allPersonList.filter((item: IPersonConfig) => {
            return item.isWin === true
        })
    })
    // 获取中奖人员详情
    const getAlreadyPersonDetail = computed(() => personConfig.value.alreadyPersonList)
    // 获取未中奖人员名单（现在返回所有人，因为可以重复中奖）
    const getNotPersonList = computed(() => personConfig.value.allPersonList)
    
    // 获取所有人员名单（用于显示）
    const getAllPersonListForDisplay = computed(() => {
        return personConfig.value.allPersonList
    })

    // NOTE: action
    // 添加全部未中奖人员
    function addNotPersonList(personList: IPersonConfig[]) {
        if (personList.length <= 0) {
            return
        }
        personList.forEach((item: IPersonConfig) => {
            personConfig.value.allPersonList.push(item)
        })
        personDb.setAllData('allPersonList', personList)
    }

    // 设置内定人员
    function setReservedPerson(personId: number, prizeId: string | null) {
        const personIndex = personConfig.value.allPersonList.findIndex(p => p.id === personId)
        if (personIndex !== -1) {
            // 创建新的对象以触发响应式更新
            const updatedPerson = {
                ...toRaw(personConfig.value.allPersonList[personIndex]),
                reservedPrizeId: prizeId,
            }
            // 替换数组中的元素
            personConfig.value.allPersonList.splice(personIndex, 1, updatedPerson)
            // 强制触发响应式更新
            personConfig.value.allPersonList = [...personConfig.value.allPersonList]
            
            personDb.updateData('allPersonList', toRaw(updatedPerson))
            console.log('设置内定成功:', updatedPerson.uid, '->', prizeId)
        } else {
            console.warn('未找到人员 ID:', personId)
        }
    }

    // 批量设置内定人员
    function setReservedPersons(reservations: Array<{personId: number, prizeId: string}>) {
        reservations.forEach(({ personId, prizeId }) => {
            setReservedPerson(personId, prizeId)
        })
    }

    // 获取内定人员列表
    function getReservedPersons() {
        return personConfig.value.allPersonList.filter(p => p.reservedPrizeId != null && p.reservedPrizeId !== '')
    }

    // 清除内定设置
    function clearReservedPerson(personId: number) {
        setReservedPerson(personId, null)
    }

    // 清除所有内定设置
    function clearAllReservedPersons() {
        personConfig.value.allPersonList = personConfig.value.allPersonList.map(person => ({
            ...toRaw(person),
            reservedPrizeId: null,
        }))
        const allPersonListRaw = toRaw(personConfig.value.allPersonList)
        personDb.deleteAll('allPersonList')
        personDb.setAllData('allPersonList', allPersonListRaw)
    }
    // 添加数据
    function addOnePerson(person: IPersonConfig[]) {
        if (person.length <= 0) {
            return
        }
        if (person.length > 1) {
            console.warn('只支持添加单个用户')
            return
        }
        person.forEach((item: IPersonConfig) => {
            personConfig.value.allPersonList.push(item)
            personDb.setData('allPersonList', item)
        })
    }
    // 添加已中奖人员（不标记为已中奖，允许重复抽取）
    function addAlreadyPersonList(personList: IPersonConfig[], prize: IPrizeConfig | null) {
        if (personList.length <= 0) {
            return
        }
        personList.forEach((person: IPersonConfig) => {
            personConfig.value.allPersonList.map((item: IPersonConfig) => {
                if (item.id === person.id && prize != null) {
                    // 不再设置 isWin = true，允许重复中奖
                    // item.isWin = true
                    
                    // 只记录中奖历史
                    item.prizeName.push(prize.name)
                    item.prizeTime.push(dayjs(new Date()).format('YYYY-MM-DD HH:mm:ss'))
                    item.prizeId.push(prize.id as string)
                }
                return item
            })
            personConfig.value.alreadyPersonList.push(person)
            personDb.updateData('allPersonList', toRaw(person))
            personDb.setData('alreadyPersonList', toRaw(person))
        })
    }
    // 从已中奖移动到未中奖
    function moveAlreadyToNot(person: IPersonConfig) {
        if (person.id === undefined || person.id == null) {
            return
        }
        const alreadyPersonListLength = personConfig.value.alreadyPersonList.length
        for (let i = 0; i < personConfig.value.allPersonList.length; i++) {
            if (person.id === personConfig.value.allPersonList[i].id) {
                personConfig.value.allPersonList[i].isWin = false
                personConfig.value.allPersonList[i].prizeName = []
                personConfig.value.allPersonList[i].prizeTime = []
                personConfig.value.allPersonList[i].prizeId = []
                personDb.updateData('allPersonList', toRaw(personConfig.value.allPersonList[i]))
                break
            }
        }
        const alreadyPersonListRaw = toRaw(personConfig.value.alreadyPersonList)
        for (let i = 0; i < alreadyPersonListLength; i++) {
            personConfig.value.alreadyPersonList = alreadyPersonListRaw.filter((item: IPersonConfig) =>
                item.id !== person.id,
            )
        }
        personDb.deleteData('alreadyPersonList', person)
    }
    // 删除指定人员
    function deletePerson(person: IPersonConfig) {
        if (person.id !== undefined || person.id != null) {
            const allPersonListRaw = toRaw(personConfig.value.allPersonList)
            const alreadyPersonListRaw = toRaw(personConfig.value.alreadyPersonList)
            personConfig.value.allPersonList = allPersonListRaw.filter((item: IPersonConfig) => item.id !== person.id)
            personConfig.value.alreadyPersonList = alreadyPersonListRaw.filter((item: IPersonConfig) => item.id !== person.id)
            personDb.deleteData('allPersonList', person)
            personDb.deleteData('alreadyPersonList', person)
        }
    }
    // 删除所有人员
    function deleteAllPerson() {
        personConfig.value.allPersonList = []
        personConfig.value.alreadyPersonList = []
        personDb.deleteAll('allPersonList')
        personDb.deleteAll('alreadyPersonList')
    }

    // 删除所有人员
    function resetPerson() {
        personConfig.value.allPersonList = []
        personConfig.value.alreadyPersonList = []
        personDb.deleteAll('allPersonList')
        personDb.deleteAll('alreadyPersonList')
    }
    // 重置已中奖人员
    function resetAlreadyPerson() {
        // 把已中奖人员合并到未中奖人员，要验证是否已存在
        personConfig.value.allPersonList.forEach((item: IPersonConfig) => {
            item.isWin = false
            item.prizeName = []
            item.prizeTime = []
            item.prizeId = []
        })
        personConfig.value.alreadyPersonList = []
        const allPersonListRaw = toRaw(personConfig.value.allPersonList)
        personDb.deleteAll('allPersonList')
        personDb.setAllData('allPersonList', allPersonListRaw)
        personDb.deleteAll('alreadyPersonList')
    }
    function setDefaultPersonList() {
        personConfig.value.allPersonList = defaultPersonList.map((item: any) => {
            item.uuid = uuidv4()
            return item
        })
        personConfig.value.alreadyPersonList = []
        personDb.setAllData('allPersonList', defaultPersonList)
        personDb.deleteAll('alreadyPersonList')
    }
    // 重置所有配置
    function reset() {
        personConfig.value = {
            allPersonList: [] as IPersonConfig[],
            alreadyPersonList: [] as IPersonConfig[],
        }
        personDb.deleteAll('allPersonList')
        personDb.deleteAll('alreadyPersonList')
    }
    return {
        personConfig,
        getPersonConfig,
        getAllPersonList,
        getNotThisPrizePersonList,
        getAlreadyPersonList,
        getAlreadyPersonDetail,
        getNotPersonList,
        addNotPersonList,
        addOnePerson,
        addAlreadyPersonList,
        moveAlreadyToNot,
        deletePerson,
        deleteAllPerson,
        resetPerson,
        resetAlreadyPerson,
        setDefaultPersonList,
        reset,
        setReservedPerson,
        setReservedPersons,
        getReservedPersons,
        clearReservedPerson,
        clearAllReservedPersons,
    }
})
