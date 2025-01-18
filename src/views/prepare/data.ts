export const allData = [
  {
    id: '1',
    name: '食品级',
    重量: 300,
    list: [
      {
        id: '1-001',
        materialCode: '1-001',
        materialName: '磷酸铁',
        actualNeed: 700,
        消耗系数: 0.5,
      },
      {
        id: '1-002',
        materialCode: '1-002',
        materialName: '铜离子',
        actualNeed: 400,
        消耗系数: 0.4,
      }
    ]
  },
  {
    id: '2',
    name: '工业级',
    重量: 300,
    list: [
      {
        id: '2-001',
        materialCode: '2-001',
        materialName: '葡萄糖',
        actualNeed: 500,
        消耗系数: 0.2,
      },
      {
        id: '2-002',
        materialCode: '2-002',
        materialName: '蔗糖',
        actualNeed: 800,
        消耗系数: 0.3,
      }
    ]
  }
]

export function getBatchForMaterial(materialCode) {
  switch (materialCode) {
    case '1-001':
      return batch1_001
      break
    case '1-002':
      return batch1_002
      break
    case '2-001':
      return batch2_001
      break
    case '2-002':
      return batch2_002
      break
  }
}

const batch1_001 = [
  {
    批次号: '1-001-001',
    物料规格: 40,
    库存: 120,
    id: '1-001-001'
  },
  {
    批次号: '1-001-002',
    物料规格: 100,
    库存: 2000,
    id: '1-001-002'
  },
  {
    批次号: '1-001-003',
    物料规格: 300,
    库存: 1000,
    id: '1-001-003'
  },
  {
    批次号: '1-001-004',
    物料规格: 100,
    库存: 1000,
    id: '1-001-004'
  }
]
const batch1_002 = [
  {
    批次号: '1-002-001',
    物料规格: 100,
    库存: 1000,
    id: '1-002-001'
  },
  {
    批次号: '1-002-002',
    物料规格: 200,
    库存: 2000,
    id: '1-002-002'
  }
]
const batch2_001 = [
  {
    批次号: '2-001-001',
    物料规格: 100,
    库存: 1000,
    id: '2-001-001'
  },
  {
    批次号: '2-001-002',
    物料规格: 200,
    库存: 2000,
    id: '2-001-002'
  },
  {
    批次号: '2-001-003',
    物料规格: 300,
    库存: 1000,
    id: '2-001-003'
  },
  {
    批次号: '2-001-004',
    物料规格: 100,
    库存: 1000,
    id: '2-001-004'
  }
]
const batch2_002 = [
  {
    批次号: '2-002-001',
    物料规格: 100,
    库存: 1000,
    id: '2-002-001'
  },
  {
    批次号: '2-002-002',
    物料规格: 200,
    库存: 2000,
    id: '2-002-002'
  }
]
