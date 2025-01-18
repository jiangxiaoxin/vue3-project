
export const allData = [
    {
        id: '1',
        name: '食品级',
        list: [
            {
                materialCode: '1-001',
                materialName: '磷酸铁',
                actualNeed: 2700
            },
            {
                materialCode: '1-002',
                materialName: '铜离子',
                actualNeed: 3000
            }
        ]
    },
    {
        id: '2',
        name: '工业级',
        list: [
            {
                materialCode: '2-001',
                materialName: '葡萄糖',
                actualNeed: 500
            },
            {
                materialCode: '2-002',
                materialName: '蔗糖',
                actualNeed: 1000
            }
        ]
    }
]

export function getBatchForMaterial(materialCode){
    switch(materialCode){
        case "1-001":
            return batch1_001
        break;
        case "1-002":
            return batch1_002
        break;
        case "2-001":
            return batch2_001
        break;
        case "2-002":
            return batch2_002
        break;
    }
}

const batch1_001 = [
    {
        "批次号": '1-001-001',
        "物料规格": 100,
        "库存": 1000
    },
    {
        "批次号": '1-001-002',
        "物料规格": 200,
        "库存": 2000
    },
    {
        "批次号": '1-001-003',
        "物料规格": 300,
        "库存": 1000
    },
    {
        "批次号": '1-001-004',
        "物料规格": 100,
        "库存": 1000
    }
]
const batch1_002 = [
    {
        "批次号": '1-002-001',
        "物料规格": 100,
        "库存": 1000
    },
    {
        "批次号": '1-002-002',
        "物料规格": 200,
        "库存": 2000
    }
]
const batch2_001 = [
    {
        "批次号": '2-001-001',
        "物料规格": 100,
        "库存": 1000    
    },
    {
        "批次号": '2-001-002',
        "物料规格": 200,
        "库存": 2000
    },
    {
        "批次号": '2-001-003',
        "物料规格": 300,
        "库存": 1000    
    },
    {
        "批次号": '2-001-004',
        "物料规格": 100,
        "库存": 1000
    }
]
const batch2_002 = [
    {
        "批次号": '2-002-001',
        "物料规格": 100,
        "库存": 1000
    },
    {
        "批次号": '2-002-002',
        "物料规格": 200,
        "库存": 2000
    }
]


