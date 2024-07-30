<template>
  <div class="table-container">
    <div v-for="(row, index) in data" :key="index" class="table-row">
      <template v-for="(item, index) in row" :key="index">
        <template v-if="item.type === 1">
          <div class="table-cell table-cell-green"></div>
        </template>
        <template v-else-if="item.type === 2">
          <div class="table-cell table-cell-red"></div>
        </template>
        <template v-else-if="item.type === 3">
          <div class="table-cell table-cell-black"></div>
        </template>
        <template v-else-if="item.type === 4">
          <div class="table-cell table-cell-transparent"></div>
        </template>
      </template>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref } from 'vue'

const data = ref([
  [
    {
      type: 4
    },
    {
      type: 4
    },
    {
      type: 1,
      label: '1'
    },
    {
      type: 1,
      label: '2'
    },
    {
      type: 1,
      label: '3'
    },
    {
      type: 3
    },
    {
      type: 1
    },
    {
      type: 1
    },
    {
      type: 3
    },
    {
      type: 1
    },
    {
      type: 1
    },
    {
      type: 1
    },
    {
      type: 4
    },
    {
      type: 4
    }
  ],
  [
    {
      type: 4
    },
    {
      type: 1
    },
    {
      type: 1,
      label: '1'
    },
    {
      type: 1,
      label: '2'
    },
    {
      type: 2,
      label: '3'
    },
    {
      type: 3
    },
    {
      type: 1
    },
    {
      type: 2
    },
    {
      type: 3
    },
    {
      type: 1
    },
    {
      type: 2
    },
    {
      type: 1
    },
    {
      type: 1
    },
    {
      type: 4
    }
  ],
  [
    {
      type: 1
    },
    {
      type: 1
    },
    {
      type: 1,
      label: '1'
    },
    {
      type: 1,
      label: '2'
    },
    {
      type: 1,
      label: '3'
    },
    {
      type: 3
    },
    {
      type: 1
    },
    {
      type: 1
    },
    {
      type: 3
    },
    {
      type: 1
    },
    {
      type: 1
    },
    {
      type: 1
    },
    {
      type: 1
    },
    {
      type: 1
    }
  ],
  [
    {
      type: 4
    },
    {
      type: 1
    },
    {
      type: 1,
      label: '1'
    },
    {
      type: 1,
      label: '2'
    },
    {
      type: 2,
      label: '3'
    },
    {
      type: 3
    },
    {
      type: 1
    },
    {
      type: 2
    },
    {
      type: 3
    },
    {
      type: 1
    },
    {
      type: 2
    },
    {
      type: 1
    },
    {
      type: 1
    },
    {
      type: 4
    }
  ],
  [
    {
      type: 4
    },
    {
      type: 4
    },
    {
      type: 1,
      label: '1'
    },
    {
      type: 1,
      label: '2'
    },
    {
      type: 1,
      label: '3'
    },
    {
      type: 3
    },
    {
      type: 1
    },
    {
      type: 1
    },
    {
      type: 3
    },
    {
      type: 1
    },
    {
      type: 1
    },
    {
      type: 1
    },
    {
      type: 4
    },
    {
      type: 4
    }
  ]
])
</script>

<style lang="less" scoped>
.table-container {
  background-color: white;
}

.table-row {
  display: flex;
}

.table-cell {
  width: 20px;
  height: 20px;
  box-sizing: border-box;
  border-right: 1px solid black;
  border-bottom: 1px solid black;
}

.table-cell-green {
  background-color: green;
}

.table-cell-red {
  background-color: red;
}

.table-cell-black {
  background-color: black;
}

.table-cell-transparent {
  background-color: transparent;
  border-color: transparent;
}
</style>
