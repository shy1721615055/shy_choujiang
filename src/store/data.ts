import type { IPersonConfig, IPrizeConfig } from '@/types/storeType'
import { id } from 'zod/v4/locales'

const originUrl = 'https://to2026.xyz'
type IPersonConfigWithoutUuid = Omit<IPersonConfig, 'uuid'>

const generateDefaultPersonList = (): IPersonConfigWithoutUuid[] => {
    const list: IPersonConfigWithoutUuid[] = []
    for (let i = 1; i <= 300; i++) {
        const uid = `5200${String(i).padStart(3, '0')}`
        
        // 设置特定人员的姓名
        let name = uid
        if (uid === '5200001') {
            name = '周叶'
        } else if (uid === '5200002') {
            name = '李月梅'
        } else if (uid === '5200003') {
            name = '叶欢欢'
        }
        
        list.push({
            uid,
            name,
            department: '默认部门',
            identity: '参与者',
            avatar: '',
            x: (i - 1) % 17 + 1,
            y: Math.floor((i - 1) / 17) + 1,
            id: i - 1,
            isWin: false,
            createTime: new Date().toString(),
            updateTime: new Date().toString(),
            prizeName: [],
            prizeTime: [],
            prizeId: [],
            reservedPrizeId: null,
        })
    }
    return list
}

export const defaultPersonList = <IPersonConfigWithoutUuid[]>generateDefaultPersonList()

export const defaultMusicList = [
    {
        id: `Geoff Knorr - China (The Industrial Era).ogg${new Date().getTime().toString()}`,
        name: 'Geoff Knorr - China (The Industrial Era).ogg',
        url: `${originUrl}/resource/audio/Geoff Knorr - China (The Industrial Era).ogg`,
    },
    {
        id: `Geoff Knorr&Phill Boucher - China (The Atomic Era).ogg${new Date().getTime().toString()}`,
        name: 'Geoff Knorr&Phill Boucher - China (The Atomic Era).ogg',
        url: `${originUrl}/resource/audio/Geoff Knorr&Phill Boucher - China (The Atomic Era).ogg`,
    },
    {
        id: `Radetzky March.mp3${new Date().getTime().toString()}`,
        name: 'Radetzky March.mp3',
        url: `${originUrl}/resource/audio/Radetzky March.mp3`,
    },
    {
        id: `Shanghai.mp3${new Date().getTime().toString()}`,
        name: 'Shanghai.mp3',
        url: `${originUrl}/resource/audio/Shanghai.mp3`,
    },
    {
        id: `Waltz No.2.mp3${new Date().getTime().toString()}`,
        name: 'Waltz No.2.mp3',
        url: `${originUrl}/resource/audio/Waltz No.2.mp3`,
    },
    {
        id: `WildChinaTheme.mp3${new Date().getTime().toString()}`,
        name: 'WildChinaTheme.mp3',
        url: `${originUrl}/resource/audio/WildChinaTheme.mp3`,
    },
    {
        id: `边程&房东的猫 - 美好事物-再遇少年.ogg${new Date().getTime().toString()}`,
        name: '边程&房东的猫 - 美好事物-再遇少年.ogg',
        url: `${originUrl}/resource/audio/边程&房东的猫 - 美好事物-再遇少年.ogg`,
    },
    {
        id: `大乔小乔 - 相见难别亦难.ogg${new Date().getTime().toString()}`,
        name: '大乔小乔 - 相见难别亦难.ogg',
        url: `${originUrl}/resource/audio/大乔小乔 - 相见难别亦难.ogg`,
    },
    {
        id: `你要跳舞吗-新裤子.mp3${new Date().getTime().toString()}`,
        name: '你要跳舞吗-新裤子.mp3',
        url: `${originUrl}/resource/audio/你要跳舞吗-新裤子.mp3`,
    },
    {
        id: `生命-声音玩具.mp3${new Date().getTime().toString()}`,
        name: '生命-声音玩具.mp3',
        url: `${originUrl}/resource/audio/生命-声音玩具.mp3`,
    },
    {
        id: `与非门 - Happy New Year.ogg${new Date().getTime().toString()}`,
        name: '与非门 - Happy New Year.ogg',
        url: `${originUrl}/resource/audio/与非门 - Happy New Year.ogg`,
    },

]

export const defaultPrizeList = <IPrizeConfig[]>[
    {
        id: '001',
        name: '1号奖品',
        sort: 1,
        isAll: false,
        count: 1,
        isUsedCount: 0,
        picture: {
            id: '1',
            name: '1号奖品',
            url: `${originUrl}/resource/image/image1.png`,
        },
        separateCount: {
            enable: false,
            countList: [],
        },
        desc: '1号奖品',
        isShow: true,
        isUsed: false,
        frequency: 1,
    },
    {
        id: '002',
        name: '2号奖品',
        sort: 2,
        isAll: false,
        count: 1,
        isUsedCount: 0,
        picture: {
            id: '2',
            name: '2号奖品',
            url: `${originUrl}/resource/image/image2.png`,
        },
        separateCount: {
            enable: false,
            countList: [],
        },
        desc: '2号奖品',
        isShow: true,
        isUsed: false,
        frequency: 1,
    },
    {
        id: '003',
        name: '3号奖品',
        sort: 3,
        isAll: false,
        count: 1,
        isUsedCount: 0,
        picture: {
            id: '3',
            name: '3号奖品',
            url: `${originUrl}/resource/image/image3.png`,
        },
        separateCount: {
            enable: false,
            countList: [],
        },
        desc: '3号奖品',
        isShow: true,
        isUsed: false,
        frequency: 1,
    },
    {
        id: '004',
        name: '4号奖品',
        sort: 4,
        isAll: false,
        count: 1,
        isUsedCount: 0,
        picture: {
            id: '4',
            name: '4号奖品',
            url: `${originUrl}/resource/image/image4.png`,
        },
        separateCount: {
            enable: false,
            countList: [],
        },
        desc: '4号奖品',
        isShow: true,
        isUsed: false,
        frequency: 1,
    },
    {
        id: '005',
        name: '5号奖品',
        sort: 5,
        isAll: false,
        count: 1,
        isUsedCount: 0,
        picture: {
            id: '5',
            name: '5号奖品',
            url: `${originUrl}/resource/image/image5.png`,
        },
        separateCount: {
            enable: false,
            countList: [],
        },
        desc: '5号奖品',
        isShow: true,
        isUsed: false,
        frequency: 1,
    },
    {
        id: '006',
        name: '6号奖品',
        sort: 6,
        isAll: false,
        count: 1,
        isUsedCount: 0,
        picture: {
            id: '1',
            name: '6号奖品',
            url: `${originUrl}/resource/image/image1.png`,
        },
        separateCount: {
            enable: false,
            countList: [],
        },
        desc: '6号奖品',
        isShow: true,
        isUsed: false,
        frequency: 1,
    },
    {
        id: '007',
        name: '7号奖品',
        sort: 7,
        isAll: false,
        count: 1,
        isUsedCount: 0,
        picture: {
            id: '2',
            name: '7号奖品',
            url: `${originUrl}/resource/image/image2.png`,
        },
        separateCount: {
            enable: false,
            countList: [],
        },
        desc: '7号奖品',
        isShow: true,
        isUsed: false,
        frequency: 1,
    },
    {
        id: '008',
        name: '8号奖品',
        sort: 8,
        isAll: false,
        count: 1,
        isUsedCount: 0,
        picture: {
            id: '3',
            name: '8号奖品',
            url: `${originUrl}/resource/image/image3.png`,
        },
        separateCount: {
            enable: false,
            countList: [],
        },
        desc: '8号奖品',
        isShow: true,
        isUsed: false,
        frequency: 1,
    },
    {
        id: '009',
        name: '9号奖品',
        sort: 9,
        isAll: false,
        count: 1,
        isUsedCount: 0,
        picture: {
            id: '4',
            name: '9号奖品',
            url: `${originUrl}/resource/image/image4.png`,
        },
        separateCount: {
            enable: false,
            countList: [],
        },
        desc: '9号奖品',
        isShow: true,
        isUsed: false,
        frequency: 1,
    },
    {
        id: '010',
        name: '10号奖品',
        sort: 10,
        isAll: false,
        count: 1,
        isUsedCount: 0,
        picture: {
            id: '5',
            name: '10号奖品',
            url: `${originUrl}/resource/image/image5.png`,
        },
        separateCount: {
            enable: false,
            countList: [],
        },
        desc: '10号奖品',
        isShow: true,
        isUsed: false,
        frequency: 1,
    },
]
export const defaultCurrentPrize = <IPrizeConfig>{
    id: '001',
    name: '1号奖品',
    sort: 1,
    isAll: false,
    count: 1,
    isUsedCount: 0,
    picture: {
        id: '1',
        name: '1号奖品',
        url: `${originUrl}/resource/image/image1.png`,
    },
    separateCount: {
        enable: false,
        countList: [],
    },
    desc: '1号奖品',
    isShow: true,
    isUsed: false,
    frequency: 1,
}
export const defaultTemporaryPrize = <IPrizeConfig>{
    id: '',
    name: '',
    sort: 0,
    isAll: false,
    count: 1,
    isUsedCount: 0,
    picture: {
        id: '-1',
        name: '',
        url: '',
    },
    separateCount: {
        enable: true,
        countList: [],
    },
    desc: '',
    isShow: false,
    isUsed: false,
    frequency: 1,
}

export const defaultImageList = [
]
export const defaultPatternList = [21, 38, 55, 54, 53, 70, 87, 88, 89, 23, 40, 57, 74, 91, 92, 76, 59, 42, 25, 24, 27, 28, 29, 46, 63, 62, 61, 78, 95, 96, 97, 20, 19, 31, 48, 66, 67, 84, 101, 100, 32, 33, 93, 65, 82, 99]

export const defaultServerHostList = [
    {
        id: 'default',
        name: '默认服务器',
        value: 'default',
        host: 'https://to2026.xyz:8080',
    },
    {
        id: 'local',
        name: '本地服务器',
        value: 'local',
        host: 'http://127.0.0.1:8080',
    },
    {
        id: 'custom',
        name: '自定义服务器',
        value: 'custom',
        host: '',
    },
]
