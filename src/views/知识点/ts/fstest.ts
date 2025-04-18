// let path = require('path')

// console.log(Object.keys(path))

// const { resolve } = path

// var a = { name: '省20%' }
// var b = JSON.stringify(a)
// var c = encodeURI(b)
// var d = encodeURIComponent(b)
// console.log('c', c)
// console.log('d', d)

// var e = decodeURI(c)
// var f = decodeURIComponent(d)
// console.log('e', e)
// console.log('f', f)

var data = {
  searchValue: null,
  createBy: '{"userName":"admin","nickName":"管理员"}',
  createTime: '2025-02-24 11:45:42',
  updateBy: '{"userName":"admin","nickName":"管理员"}',
  updateTime: '2025-02-24 11:45:42',
  params: {},
  createById: 'admin',
  createByName: '管理员',
  updateById: 'admin',
  updateByName: '管理员',
  id: '1893869886707384322',
  tenantId: null,
  inspectionPlanNo: null,
  inspectionTaskNo: 'GCP-JC202502240001',
  materialType: 'process',
  status: 'sampled',
  outboundStatus: null,
  appearanceTaskNo: null,
  arrivalNumber: null,
  purchaseArrivalNumber: null,
  supplierNumber: null,
  supplier: null,
  withInspectionResult: null,
  customerCode: 'NDSD',
  customerName: '宁德时代',
  executeResolution: null,
  deliveryDate: null,
  retestCount: null,
  inspectionResult: null,
  materialCode: '020901270001',
  materialName: '磷酸铁锂（A6-5C）',
  specification: '≥99.5%，500g/瓶',
  modelCode: null,
  batchNo: null,
  quantity: null,
  detectionClassification: null,
  detectionType: 'temporarySampling',
  unit: null,
  unitCode: null,
  signWms: null,
  qualifiedQuantity: null,
  notQualifiedQuantity: null,
  qualifiedStatus: null,
  attachment: null,
  isolationMaterial: null,
  materialBatch: 'WRGA84A2502146605',
  cancelReason: '11',
  cancelPerson: '管理员',
  cancelTime: '2025-02-24',
  judgeFlag: 'Y',
  judgement: null,
  storeWarehouse: null,
  equipCodes: null,
  outlineCode: 'GC202409007-V0',
  processPlanNo: 'Prtl202502145185',
  productBatch: null,
  packageBarcode: null,
  packageBatchNo: null,
  inspectionType: null,
  switchProcessCheck: null,
  urgency: null,
  factory: '郧阳分',
  factoryCode: '001001',
  workshopCode: '001001002',
  workshopName: '二车间',
  productionLineCode: '001001002001',
  productionLineName: 'WRG',
  processCode: '06',
  processName: '粗磨',
  materialTypes: null,
  materialTypeList: null,
  procedureCode: null,
  testValueSource: null
}

var str = JSON.stringify(data)
// console.log('str', str)

var a = encodeURI(str)
console.log('🚀 ~ a :', a)

console.log('out', JSON.parse(decodeURI(a)))
