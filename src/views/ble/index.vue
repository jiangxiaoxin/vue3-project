<template>
    <div>
        <div style="margin-bottom:12px;">
            <button @click="searchList" :disabled="scanning">{{ scanning ? '扫描中…' : '搜索蓝牙设备' }}</button>
            <input type="text">
            
        </div>
        <div>
            <button @click="stopScan" :disabled="!scanning" style="margin-left:8px;">停止</button>
        </div>
        <div v-if="errorMsg" style="color:#d33;margin:8px 0;">{{ errorMsg }}</div>
        <div v-if="!supported" style="color:#d33;">当前浏览器不支持 Web Bluetooth，请使用 HTTPS 下的 Chrome/Edge（移动端支持更好）。</div>
        <div v-else style="margin:12px 0;">
            <div style="margin-bottom:8px; font-size:13px; color:#333;">填写要写入的 Service/Characteristic UUID（16/128 位均可）：</div>
            <div style="display:flex; gap:8px; flex-wrap:wrap; align-items:center;">
                <input v-model="serviceUuid" placeholder="服务 UUID（如 6e400001-b5a3-f393-e0a9-e50e24dcca9e 或 0x180F）" style="width:360px;" />
                <input v-model="charUuid" placeholder="特征 UUID（写入特征）" style="width:360px;" />
            </div>
            <div style="margin-top:8px; display:flex; gap:8px; align-items:center;">
                <input v-model="payload" placeholder="要发送的文本内容" style="width:360px;" />
                <button @click="sendMessage" :disabled="!isConnected || !writeChar">发送</button>
                <span v-if="isConnected" style="color:#2b7;">已连接: {{ connectedName }}</span>
            </div>
        </div>
        <ul>
            <li v-for="d in devices" :key="d.id" style="margin:6px 0;">
                <div><strong>{{ d.name || '未知设备' }}</strong></div>
                <div style="font-size:12px;color:#666;">id: {{ d.id }}</div>
                <div  style="font-size:12px;color:#666;">RSSI: {{ d.rssi }}</div>
                <div style="font-size:12px;color:#666;">TxPower: {{ d.txPower }}</div>
                <div  style="font-size:12px;color:#666;">UUIDs: {{ d.uuids?.join(', ') }}
                </div>
                <div style="font-size:12px;color:#999;">发现时间: {{ new Date(d.seenAt).toLocaleTimeString() }}</div>
                <div style="margin-top:6px;">
                    <button @click="connectTo(d.id)" :disabled="scanning">连接</button>
                </div>
            </li>
        </ul>
    </div>

</template>
<script lang="ts" setup>
import { ref, onBeforeUnmount } from "vue"

type DiscoveredDevice = {
    id: string
    name: string | null
    rssi?: number
    txPower?: number
    uuids?: string[]
    seenAt: number
    device?: any
}

const devices = ref<DiscoveredDevice[]>([])
const supported = ref<boolean>(typeof navigator !== 'undefined' && !!(navigator as any).bluetooth)
const scanning = ref<boolean>(false)
const errorMsg = ref<string>("")
const serviceUuid = ref<string>("battery_service")
const charUuid = ref<string>("battery_level")
const payload = ref<string>("")
const isConnected = ref<boolean>(false)
const connectedName = ref<string>("")
let gattServer: any = null
let writeChar: any = null

let activeScan: any | null = null
let onAdvert: ((ev: any) => void) | null = null

function upsertDevice(partial: DiscoveredDevice) {
    const idx = devices.value.findIndex(d => d.id === partial.id)
    if (idx >= 0) {
        devices.value[idx] = { ...devices.value[idx], ...partial, seenAt: Date.now() }
    } else {
        devices.value.push({ ...partial, seenAt: Date.now() })
    }
}


const searchList = async () => {
    errorMsg.value = ""
    if (!supported.value) {
        errorMsg.value = "当前环境不支持 Web Bluetooth"
        return
    }

    // 优先使用扫描 API（可发现多个设备）
    const navAny = navigator as any
    // if (navAny.bluetooth && navAny.bluetooth.requestLEScan && 'onadvertisementreceived' in (navAny as any).BluetoothDevice?.prototype || 'onadvertisementreceived' in ({} as any)) {
    //     try {
    //         // 请求 LE 扫描（需要用户手势触发且 HTTPS）
    //         scanning.value = true
    //         devices.value = []
    //         activeScan = await navAny.bluetooth.requestLEScan({
    //             // acceptAllAdvertisements 目前在部分平台有效
    //             acceptAllAdvertisements: true,
    //             keepRepeatedDevices: true
    //         })

    //         onAdvert = (event: any) => {
    //             console.log('onAdvert',event);
    //             // debugger
    //             const dev = event.device as any
    //             upsertDevice({
    //                 id: dev.id,
    //                 name: dev.name || null,
    //                 rssi: event.rssi,
    //                 txPower: event.txPower,
    //                 uuids: (dev as any).uuids || [],
    //                 seenAt: Date.now(),
    //                 device: dev
    //             })
    //         }
    //         (navigator as any).bluetooth.addEventListener('advertisementreceived', onAdvert)
    //     } catch (e: any) {
    //         scanning.value = false
    //         errorMsg.value = e?.message || String(e)
    //     }
    //     return
    // }

    // 回退：使用 requestDevice（一次只能选一个，由浏览器选择器返回）

    /**
     * 00001530-1212-efde-1523-785feabcd123, 
     * 00001800-0000-1000-8000-00805f9b34fb, 
     * 00001801-0000-1000-8000-00805f9b34fb, 
     * 0000180a-0000-1000-8000-00805f9b34fb, 
     * 0000180f-0000-1000-8000-00805f9b34fb, 
     * 6e400001-b5a3-f393-e0a9-e50e24dcca9e
     */
    try {
        const device: any = await navigator.bluetooth.requestDevice({
            acceptAllDevices: true,
            optionalServices: ["battery_service"]
        })
        upsertDevice({ id: device.id, name: device.name || null, seenAt: Date.now(), device })


        const server = await device.gatt.connect()
        console.log("🚀 ~ searchList ~ server:", server)

        gattServer = server
        connectedName.value = device.name || ''

        const svcUuid = "battery_service"
        // console.log("🚀 ~ connectTo ~ svcUuid:", svcUuid)

        const chUuid = charUuid.value
        // console.log("🚀 ~ connectTo ~ chUuid:", chUuid)

        if (!svcUuid || !chUuid) {
            isConnected.value = true
            return
        }

        const allServices = await server.getPrimaryServices()
        console.log("🚀 ~ searchList ~ allServices:", allServices)

        //TODO 这里的service 要提前在request device 时就optional 里标明，这里才能拿到
        const service = await server.getPrimaryService(svcUuid)
        console.log("🚀 ~ connectTo ~ service:", service)

        const characteristic = await service.getCharacteristic(chUuid)
        console.log("🚀 ~ connectTo ~ characteristic:", characteristic)

        writeChar = characteristic
        isConnected.value = true

        const val = await characteristic.readValue()
        console.log("🚀 ~ connectTo ~ val:", val.getUint8(0))


    } catch (e: any) {
        errorMsg.value = e?.message || String(e)
    }
}

const stopScan = () => {
    try {
        if (onAdvert && (navigator as any).bluetooth?.removeEventListener) {
            (navigator as any).bluetooth.removeEventListener('advertisementreceived', onAdvert)
        }
        onAdvert = null
        if (activeScan && typeof activeScan.stop === 'function') {
            activeScan.stop()
        }
    } catch { }
    finally {
        activeScan = null
        scanning.value = false
    }
}

onBeforeUnmount(() => {
    stopScan()
})

async function connectTo(id: string) {
    return

    errorMsg.value = ""
    isConnected.value = false
    writeChar = null
    gattServer = null
    connectedName.value = ""

    const rec = devices.value.find(d => d.id === id)
    // optionalServices = 用户输入（支持逗号/空格） + 广播发现的 uuids
    const inputUuids = (serviceUuid.value || "")
        .split(/[\s,]+/)
        .map(s => s.trim())
        .filter(Boolean)
    const advUuids = (rec?.uuids || []).filter(Boolean)
    const optionalServices = Array.from(new Set([...inputUuids, ...advUuids]))

    try {
        // 关键：始终通过 requestDevice 声明 optionalServices 以获取访问权限
        const device: any = await (navigator as any).bluetooth.requestDevice({
            acceptAllDevices: true,
            optionalServices
        })

        const server = await device.gatt.connect()
        gattServer = server
        connectedName.value = device.name || ''

        const svcUuid = inputUuids[0] || serviceUuid.value
        console.log("🚀 ~ connectTo ~ svcUuid:", svcUuid)

        const chUuid = charUuid.value
        console.log("🚀 ~ connectTo ~ chUuid:", chUuid)

        if (!svcUuid || !chUuid) {
            isConnected.value = true
            return
        }
        const service = await server.getPrimaryService(svcUuid)
        console.log("🚀 ~ connectTo ~ service:", service)

        const characteristic = await service.getCharacteristic(chUuid)
        console.log("🚀 ~ connectTo ~ characteristic:", characteristic)

        writeChar = characteristic
        isConnected.value = true

        const val = await characteristic.readValue()
        console.log("🚀 ~ connectTo ~ val:", val.getUint8(0))


    } catch (e: any) {
        errorMsg.value = e?.message || String(e)
    }
}

async function sendMessage() {
    errorMsg.value = ""
    if (!isConnected.value || !writeChar) {
        errorMsg.value = "尚未连接或未找到可写特征值（请填写 UUID 并连接）"
        return
    }
    try {
        const enc = new TextEncoder()
        const data = enc.encode(payload.value || "")
        if (writeChar.writeValue) {
            await writeChar.writeValue(data)
        } else if (writeChar.writeValueWithResponse) {
            await writeChar.writeValueWithResponse(data)
        } else if (writeChar.writeValueWithoutResponse) {
            await writeChar.writeValueWithoutResponse(data)
        } else {
            throw new Error('该特征不支持写入')
        }
    } catch (e: any) {
        errorMsg.value = e?.message || String(e)
    }
}
</script>