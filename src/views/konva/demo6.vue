<template>
    <div class="konva-demo6">
      <div ref="containerRef" class="stage-container"></div>
    </div>
  </template>

  <script setup lang="ts">
  import { onBeforeUnmount, onMounted, ref } from 'vue'
  import Konva from 'konva'

  type PinDirection = 'left' | 'right' | null

  interface ColumnDef {
    key: string
    title: string
    width: number
    pin: PinDirection
    align?: 'left' | 'center' | 'right'
  }

  interface RowData {
    [key: string]: string | number
  }

  const containerRef = ref<HTMLDivElement | null>(null)

  // Demo columns: configure pin to 'left' | 'right' | null
  const columns: ColumnDef[] = [
    { key: 'id', title: 'ID', width: 80, pin: 'left', align: 'right' },
    { key: 'name', title: 'Name', width: 120, pin: 'left' },
    { key: 'age', title: 'Age', width: 80, pin: null, align: 'right' },
    { key: 'gender', title: 'Gender', width: 80, pin: null },
    { key: 'country', title: 'Country', width: 120, pin: null },
    { key: 'city', title: 'City', width: 120, pin: null },
    { key: 'state', title: 'State', width: 100, pin: null },
    { key: 'zipcode', title: 'Zip Code', width: 100, pin: null },
    { key: 'address', title: 'Address', width: 200, pin: null },
    { key: 'phone', title: 'Phone', width: 140, pin: null },
    { key: 'mobile', title: 'Mobile', width: 140, pin: null },
    { key: 'company', title: 'Company', width: 150, pin: null },
    { key: 'department', title: 'Department', width: 120, pin: null },
    { key: 'position', title: 'Position', width: 130, pin: null },
    { key: 'salary', title: 'Salary', width: 100, pin: null, align: 'right' },
    { key: 'experience', title: 'Experience', width: 100, pin: null, align: 'right' },
    { key: 'education', title: 'Education', width: 120, pin: null },
    { key: 'skills', title: 'Skills', width: 180, pin: null },
    { key: 'notes', title: 'Notes', width: 200, pin: null },
    { key: 'email', title: 'Email', width: 220, pin: 'right' }
  ]

  // Demo data with 20 columns
  const data: RowData[] = Array.from({ length: 300 }, (_, i) => ({
    id: i + 1,
    name: `User ${i + 1}`,
    age: 18 + ((i * 7) % 40),
    gender: ['Male', 'Female', 'Other'][(i * 3) % 3],
    country: ['China', 'USA', 'UK', 'Germany', 'France', 'Japan', 'Canada', 'Australia'][(i * 3) % 8],
    city: ['Beijing', 'Shanghai', 'New York', 'London', 'Berlin', 'Paris', 'Tokyo', 'Toronto', 'Sydney'][(i * 5) % 9],
    state: ['CA', 'NY', 'TX', 'FL', 'WA', 'IL', 'PA', 'OH', 'GA', 'NC'][(i * 7) % 10],
    zipcode: `${10000 + (i * 123) % 90000}`,
    address: `${i + 1} Main Street, Apt ${(i % 50) + 1}`,
    phone: `+1-555-${String(1000 + i).slice(-4)}`,
    mobile: `+1-666-${String(2000 + i).slice(-4)}`,
    company: ['TechCorp', 'DataSoft', 'CloudInc', 'WebSolutions', 'AppDev', 'SystemsLtd', 'CodeWorks', 'DigitalPro'][(i * 11) % 8],
    department: ['Engineering', 'Marketing', 'Sales', 'HR', 'Finance', 'Operations', 'Support', 'Design'][(i * 13) % 8],
    position: ['Developer', 'Manager', 'Analyst', 'Designer', 'Consultant', 'Specialist', 'Coordinator', 'Director'][(i * 17) % 8],
    salary: `$${(30000 + (i * 1000) % 120000).toLocaleString()}`,
    experience: `${(i % 20) + 1} years`,
    education: ['Bachelor', 'Master', 'PhD', 'Associate', 'High School', 'Certificate'][(i * 19) % 6],
    skills: ['JavaScript, React', 'Python, Django', 'Java, Spring', 'C#, .NET', 'PHP, Laravel', 'Go, Gin', 'Ruby, Rails', 'Node.js, Express'][(i * 23) % 8],
    notes: `Additional notes for user ${i + 1}. Lorem ipsum dolor sit amet.`,
    email: `user${i + 1}@${['gmail.com', 'yahoo.com', 'outlook.com', 'company.com', 'example.org'][(i * 29) % 5]}`
  }))

  // Layout config
  const headerHeight = 40
  const rowHeight = 32
  const scrollbarSize = 16
  const tablePadding = 0
  const headerBg = '#f7f7f9'
  const bodyBgOdd = '#ffffff'
  const bodyBgEven = '#fbfbfd'
  const borderColor = '#dcdfe6'
  const headerTextColor = '#303133'
  const bodyTextColor = '#303133'
  const scrollbarBg = '#f1f1f1'
  const scrollbarThumb = '#c1c1c1'
  const scrollbarThumbHover = '#a8a8a8'
  
  let stage: Konva.Stage | null = null
  let headerLayer: Konva.Layer | null = null
  let bodyLayer: Konva.Layer | null = null
  let fixedLayer: Konva.Layer | null = null
  let fixedHeaderLayer: Konva.Layer | null = null
  let scrollbarLayer: Konva.Layer | null = null

  let centerBodyClipGroup: Konva.Group | null = null

  let leftHeaderGroup: Konva.Group | null = null
  let centerHeaderGroup: Konva.Group | null = null
  let rightHeaderGroup: Konva.Group | null = null

  let leftBodyGroup: Konva.Group | null = null
  let centerBodyGroup: Konva.Group | null = null
  let rightBodyGroup: Konva.Group | null = null

  // Scrolling state
  let scrollY = 0
  let scrollX = 0

  // Scrollbar elements
  let vScrollbar: Konva.Group | null = null
  let hScrollbar: Konva.Group | null = null
  let vThumb: Konva.Rect | null = null
  let hThumb: Konva.Rect | null = null

  // Drag state
  let isDraggingVThumb = false
  let isDraggingHThumb = false
  let dragStartY = 0
  let dragStartX = 0
  let dragStartScrollY = 0
  let dragStartScrollX = 0
  
  // Compute helpers
  function getSplitColumns() {
    const leftCols = columns.filter((c) => c.pin === 'left')
    const rightCols = columns.filter((c) => c.pin === 'right')
    const centerCols = columns.filter((c) => !c.pin)
    const sumWidth = (arr: ColumnDef[]) => arr.reduce((acc, c) => acc + c.width, 0)
    return {
      leftCols,
      centerCols,
      rightCols,
      leftWidth: sumWidth(leftCols),
      centerWidth: sumWidth(centerCols),
      rightWidth: sumWidth(rightCols),
      totalWidth: sumWidth(columns)
    }
  }

  function clamp(n: number, min: number, max: number) {
    return Math.max(min, Math.min(max, n))
  }

  function getTextX(x: number) {
    // Simple left-aligned text with 8px padding
    return x + 8
  }

  function getScrollLimits() {
    if (!stage) return { maxScrollX: 0, maxScrollY: 0 }

    const { totalWidth, leftWidth, rightWidth } = getSplitColumns()
    const stageWidth = stage.width()
    const stageHeight = stage.height()
    const contentHeight = data.length * rowHeight
    const visibleContentWidth = stageWidth - leftWidth - rightWidth - scrollbarSize

    const maxScrollX = Math.max(0, totalWidth - leftWidth - rightWidth - visibleContentWidth)
    const maxScrollY = Math.max(0, contentHeight - (stageHeight - headerHeight - scrollbarSize))

    return { maxScrollX, maxScrollY }
  }
  
  function ensureStage() {
    const el = containerRef.value
    if (!el) return
    const width = el.clientWidth || 800
    const height = el.clientHeight || 420

    if (!stage) {
      stage = new Konva.Stage({ container: el, width, height })
    } else {
      stage.size({ width, height })
    }

    if (!headerLayer) {
      headerLayer = new Konva.Layer()
      stage.add(headerLayer)
    }

    if (!bodyLayer) {
      bodyLayer = new Konva.Layer()
      stage.add(bodyLayer)
    }

    if (!fixedLayer) {
      fixedLayer = new Konva.Layer()
      stage.add(fixedLayer)
    }

    if (!fixedHeaderLayer) {
      fixedHeaderLayer = new Konva.Layer()
      stage.add(fixedHeaderLayer)
    }

    if (!scrollbarLayer) {
      scrollbarLayer = new Konva.Layer()
      stage.add(scrollbarLayer)
    }

    const { leftWidth, rightWidth } = getSplitColumns()
    const contentHeight = height - headerHeight - scrollbarSize

    // Always recreate clipping group for center scrollable content
    centerBodyClipGroup = new Konva.Group({
      x: leftWidth,
      y: headerHeight,
      clip: {
        x: 0,
        y: 0,
        width: width - leftWidth - rightWidth - scrollbarSize,
        height: contentHeight
      }
    })
    bodyLayer.add(centerBodyClipGroup)
  }
  
  function clearGroups() {
    headerLayer?.destroyChildren()
    bodyLayer?.destroyChildren()
    fixedLayer?.destroyChildren()
    fixedHeaderLayer?.destroyChildren()
    scrollbarLayer?.destroyChildren()

    // Reset scrollbar references
    vScrollbar = null
    hScrollbar = null
    vThumb = null
    hThumb = null

    // Reset centerBodyClipGroup reference
    centerBodyClipGroup = null
  }

  function rebuildGroups() {
    if (!stage || !headerLayer || !bodyLayer || !fixedLayer || !fixedHeaderLayer || !scrollbarLayer) return

    const { leftCols, centerCols, rightCols, leftWidth, rightWidth } = getSplitColumns()
    const stageWidth = stage.width()
    const stageHeight = stage.height()

    // Ensure centerBodyClipGroup exists
    if (!centerBodyClipGroup) {
      const contentHeight = stageHeight - headerHeight - scrollbarSize
      centerBodyClipGroup = new Konva.Group({
        x: leftWidth,
        y: headerHeight,
        clip: {
          x: 0,
          y: 0,
          width: stageWidth - leftWidth - rightWidth - scrollbarSize,
          height: contentHeight
        }
      })
      bodyLayer.add(centerBodyClipGroup)
    }

    leftHeaderGroup = new Konva.Group({ x: 0, y: 0 })
    centerHeaderGroup = new Konva.Group({ x: leftWidth - scrollX, y: 0 })
    rightHeaderGroup = new Konva.Group({ x: stageWidth - rightWidth - scrollbarSize, y: 0 })

    leftBodyGroup = new Konva.Group({ x: 0, y: headerHeight - scrollY })
    centerBodyGroup = new Konva.Group({ x: -scrollX, y: 0 - scrollY })
    rightBodyGroup = new Konva.Group({ x: stageWidth - rightWidth - scrollbarSize, y: headerHeight - scrollY })

    // Add center scrollable header to header layer (lower layer)
    headerLayer.add(centerHeaderGroup)

    // Add fixed headers to fixed header layer (top layer)
    fixedHeaderLayer.add(leftHeaderGroup, rightHeaderGroup)

    // Add center scrollable content to clipped group
    console.log('Adding centerBodyGroup to centerBodyClipGroup')
    console.log('centerBodyGroup position:', centerBodyGroup.x(), centerBodyGroup.y())
    console.log('centerBodyClipGroup position:', centerBodyClipGroup.x(), centerBodyClipGroup.y())
    centerBodyClipGroup.add(centerBodyGroup)

    // Add fixed columns to fixed layer (on top)
    fixedLayer.add(leftBodyGroup, rightBodyGroup)

    console.log('Left cols:', leftCols.map(c => c.key))
    console.log('Center cols:', centerCols.map(c => c.key))
    console.log('Right cols:', rightCols.map(c => c.key))

    drawHeaderPart(leftHeaderGroup, leftCols, 0)
    drawHeaderPart(centerHeaderGroup, centerCols, 0)
    drawHeaderPart(rightHeaderGroup, rightCols, 0)

    drawBodyPart(leftBodyGroup, leftCols)
    drawBodyPart(centerBodyGroup, centerCols)
    drawBodyPart(rightBodyGroup, rightCols)

    createScrollbars()

    headerLayer.batchDraw()
    bodyLayer?.batchDraw()
    fixedLayer?.batchDraw()
    fixedHeaderLayer?.batchDraw()
    scrollbarLayer?.batchDraw()
  }
  
  function createScrollbars() {
    if (!stage || !scrollbarLayer) return

    const stageWidth = stage.width()
    const stageHeight = stage.height()
    const { maxScrollX, maxScrollY } = getScrollLimits()

    // Create mask for vertical scrollbar header area to hide overflowing content
    const vScrollbarHeaderMask = new Konva.Rect({
      x: stageWidth - scrollbarSize,
      y: 0,
      width: scrollbarSize,
      height: headerHeight,
      fill: headerBg,
      stroke: borderColor,
      strokeWidth: 1
    })
    scrollbarLayer.add(vScrollbarHeaderMask)

    // Vertical scrollbar
    if (maxScrollY > 0) {
      vScrollbar = new Konva.Group()
      scrollbarLayer.add(vScrollbar)

      const vTrack = new Konva.Rect({
        x: stageWidth - scrollbarSize,
        y: headerHeight,
        width: scrollbarSize,
        height: stageHeight - headerHeight - scrollbarSize,
        fill: scrollbarBg,
        stroke: borderColor,
        strokeWidth: 1
      })
      vScrollbar.add(vTrack)

      const thumbHeight = Math.max(20, (stageHeight - headerHeight - scrollbarSize) * (stageHeight - headerHeight - scrollbarSize) / (data.length * rowHeight))
      const thumbY = headerHeight + (scrollY / maxScrollY) * (stageHeight - headerHeight - scrollbarSize - thumbHeight)

      vThumb = new Konva.Rect({
        x: stageWidth - scrollbarSize + 2,
        y: thumbY,
        width: scrollbarSize - 4,
        height: thumbHeight,
        fill: scrollbarThumb,
        cornerRadius: 2,
        draggable: false
      })
      vScrollbar.add(vThumb)

      setupVerticalScrollbarEvents()
    }

    // Horizontal scrollbar
    if (maxScrollX > 0) {
      hScrollbar = new Konva.Group()
      scrollbarLayer.add(hScrollbar)

      const hTrack = new Konva.Rect({
        x: 0,
        y: stageHeight - scrollbarSize,
        width: stageWidth - scrollbarSize,
        height: scrollbarSize,
        fill: scrollbarBg,
        stroke: borderColor,
        strokeWidth: 1
      })
      hScrollbar.add(hTrack)

      const { leftWidth, rightWidth, centerWidth } = getSplitColumns()
      const visibleWidth = stageWidth - leftWidth - rightWidth - scrollbarSize
      const thumbWidth = Math.max(20, visibleWidth * visibleWidth / centerWidth)
      const thumbX = leftWidth + (scrollX / maxScrollX) * (visibleWidth - thumbWidth)

      hThumb = new Konva.Rect({
        x: thumbX,
        y: stageHeight - scrollbarSize + 2,
        width: thumbWidth,
        height: scrollbarSize - 4,
        fill: scrollbarThumb,
        cornerRadius: 2,
        draggable: false
      })
      hScrollbar.add(hThumb)

      setupHorizontalScrollbarEvents()
    }
  }

  function drawHeaderPart(group: Konva.Group | null, cols: ColumnDef[], startX: number) {
    if (!group) return

    // background
    const totalWidth = cols.reduce((acc, c) => acc + c.width, 0)
    const bg = new Konva.Rect({
      x: startX + tablePadding,
      y: 0,
      width: totalWidth,
      height: headerHeight,
      fill: headerBg,
      stroke: borderColor,
      strokeWidth: 1
    })
    group.add(bg)

    let x = startX
    cols.forEach((col) => {
      const cell = new Konva.Rect({
        x,
        y: 0,
        width: col.width,
        height: headerHeight,
        stroke: borderColor,
        strokeWidth: 1,
        listening: false
      })
      group.add(cell)

      const label = new Konva.Text({
        x: getTextX(x),
        y: headerHeight / 2,
        text: col.title,
        fontSize: 14,
        fontFamily: 'system-ui, -apple-system, Segoe UI, Roboto, Arial, Noto Sans, Ubuntu',
        fill: headerTextColor,
        align: 'left',
        verticalAlign: 'middle'
      })
      label.offsetY(label.height() / 2)
      group.add(label)

      x += col.width
    })
  }
  
  function setupVerticalScrollbarEvents() {
    if (!vThumb || !stage) return

    vThumb.on('mousedown', (e) => {
      isDraggingVThumb = true
      dragStartY = e.evt.clientY
      dragStartScrollY = scrollY
      stage!.container().style.cursor = 'grabbing'
    })

    vThumb.on('mouseenter', () => {
      if (vThumb) vThumb.fill(scrollbarThumbHover)
      scrollbarLayer?.batchDraw()
    })

    vThumb.on('mouseleave', () => {
      if (vThumb && !isDraggingVThumb) vThumb.fill(scrollbarThumb)
      scrollbarLayer?.batchDraw()
    })
  }

  function setupHorizontalScrollbarEvents() {
    if (!hThumb || !stage) return

    hThumb.on('mousedown', (e) => {
      isDraggingHThumb = true
      dragStartX = e.evt.clientX
      dragStartScrollX = scrollX
      stage!.container().style.cursor = 'grabbing'
    })

    hThumb.on('mouseenter', () => {
      if (hThumb) hThumb.fill(scrollbarThumbHover)
      scrollbarLayer?.batchDraw()
    })

    hThumb.on('mouseleave', () => {
      if (hThumb && !isDraggingHThumb) hThumb.fill(scrollbarThumb)
      scrollbarLayer?.batchDraw()
    })
  }

  function drawBodyPart(group: Konva.Group | null, cols: ColumnDef[]) {
    if (!stage || !group) return

    const visibleHeight = stage.height() - headerHeight - scrollbarSize
    const totalRows = data.length
    const totalHeight = totalRows * rowHeight
    const totalWidth = cols.reduce((acc, c) => acc + c.width, 0)

    // background banding
    for (let i = 0; i < totalRows; i += 1) {
      const y = i * rowHeight
      const bg = new Konva.Rect({
        x: 0,
        y,
        width: totalWidth,
        height: rowHeight,
        fill: i % 2 === 0 ? bodyBgOdd : bodyBgEven,
        listening: false
      })
      group.add(bg)
    }

    // grid + text
    data.forEach((row, rowIndex) => {
      let x = 0
      cols.forEach((col) => {
        const y = rowIndex * rowHeight
        const cell = new Konva.Rect({
          x,
          y,
          width: col.width,
          height: rowHeight,
          stroke: borderColor,
          strokeWidth: 1,
          listening: false
        })
        group.add(cell)

        const value = String(row[col.key] ?? '')
        const textNode = new Konva.Text({
          x: getTextX(x),
          y: y + rowHeight / 2,
          text: value,
          fontSize: 13,
          fill: bodyTextColor,
          align: 'left',
          verticalAlign: 'middle'
        })
        textNode.offsetY(textNode.height() / 2)
        group.add(textNode)

        x += col.width
      })
    })

    // mask bottom beyond content when content shorter than viewport
    if (totalHeight < visibleHeight) {
      const mask = new Konva.Rect({
        x: 0,
        y: totalHeight,
        width: totalWidth,
        height: visibleHeight - totalHeight,
        fill: '#fff',
        listening: false
      })
      group.add(mask)
    }
  }
  
  function updateVerticalScroll(offsetY: number) {
    if (!stage || !leftBodyGroup || !centerBodyGroup || !rightBodyGroup) return
    const { maxScrollY } = getScrollLimits()
    scrollY = clamp(scrollY + offsetY, 0, maxScrollY)

    const bodyY = headerHeight - scrollY
    const centerY = -scrollY

    // Only body content moves vertically, headers stay fixed
    leftBodyGroup.y(bodyY)
    rightBodyGroup.y(bodyY)
    centerBodyGroup.y(centerY)

    updateScrollbars()
    bodyLayer?.batchDraw()
    fixedLayer?.batchDraw()
  }

  function updateHorizontalScroll(offsetX: number) {
    if (!stage || !centerHeaderGroup || !centerBodyGroup) return
    const { maxScrollX } = getScrollLimits()
    const { leftWidth } = getSplitColumns()
    scrollX = clamp(scrollX + offsetX, 0, maxScrollX)

    const headerX = leftWidth - scrollX
    const centerX = -scrollX

    // Only center scrollable content moves horizontally
    centerHeaderGroup.x(headerX)
    centerBodyGroup.x(centerX)

    updateScrollbars()
    headerLayer?.batchDraw()
    bodyLayer?.batchDraw()
  }

  function updateScrollbars() {
    if (!stage) return

    const stageWidth = stage.width()
    const stageHeight = stage.height()
    const { maxScrollX, maxScrollY } = getScrollLimits()

    // Update vertical thumb position
    if (vThumb && maxScrollY > 0) {
      const thumbHeight = Math.max(20, (stageHeight - headerHeight - scrollbarSize) * (stageHeight - headerHeight - scrollbarSize) / (data.length * rowHeight))
      const thumbY = headerHeight + (scrollY / maxScrollY) * (stageHeight - headerHeight - scrollbarSize - thumbHeight)
      vThumb.y(thumbY)
    }

    // Update horizontal thumb position
    if (hThumb && maxScrollX > 0) {
      const { leftWidth, rightWidth, centerWidth } = getSplitColumns()
      const visibleWidth = stageWidth - leftWidth - rightWidth - scrollbarSize
      const thumbWidth = Math.max(20, visibleWidth * visibleWidth / centerWidth)
      const thumbX = leftWidth + (scrollX / maxScrollX) * (visibleWidth - thumbWidth)
      hThumb.x(thumbX)
    }

    scrollbarLayer?.batchDraw()
  }

  function handleWheel(e: WheelEvent) {
    e.preventDefault()
    if (e.shiftKey) {
      // Horizontal scroll with Shift+Wheel
      updateHorizontalScroll(e.deltaY)
    } else {
      // Vertical scroll
      updateVerticalScroll(e.deltaY)
    }
  }
  
  function handleMouseMove(e: MouseEvent) {
    if (!stage) return

    if (isDraggingVThumb) {
      const deltaY = e.clientY - dragStartY
      const { maxScrollY } = getScrollLimits()
      const stageHeight = stage.height()
      const trackHeight = stageHeight - headerHeight - scrollbarSize
      const thumbHeight = Math.max(20, trackHeight * trackHeight / (data.length * rowHeight))
      const scrollRatio = deltaY / (trackHeight - thumbHeight)
      const newScrollY = dragStartScrollY + scrollRatio * maxScrollY

      scrollY = clamp(newScrollY, 0, maxScrollY)
      updateScrollPositions()
    }

    if (isDraggingHThumb) {
      const deltaX = e.clientX - dragStartX
      const { maxScrollX } = getScrollLimits()
      const { leftWidth, rightWidth, centerWidth } = getSplitColumns()
      const stageWidth = stage.width()
      const visibleWidth = stageWidth - leftWidth - rightWidth - scrollbarSize
      const thumbWidth = Math.max(20, visibleWidth * visibleWidth / centerWidth)
      const scrollRatio = deltaX / (visibleWidth - thumbWidth)
      const newScrollX = dragStartScrollX + scrollRatio * maxScrollX

      scrollX = clamp(newScrollX, 0, maxScrollX)
      updateScrollPositions()
    }
  }

  function handleMouseUp() {
    if (isDraggingVThumb || isDraggingHThumb) {
      isDraggingVThumb = false
      isDraggingHThumb = false
      if (stage) stage.container().style.cursor = 'default'

      if (vThumb && !isDraggingVThumb) vThumb.fill(scrollbarThumb)
      if (hThumb && !isDraggingHThumb) hThumb.fill(scrollbarThumb)
      scrollbarLayer?.batchDraw()
    }
  }

  function updateScrollPositions() {
    if (!leftBodyGroup || !centerBodyGroup || !rightBodyGroup || !centerHeaderGroup) return

    const { leftWidth } = getSplitColumns()
    const bodyY = headerHeight - scrollY
    const centerX = -scrollX
    const headerX = leftWidth - scrollX

    // Update fixed columns (only Y position changes)
    leftBodyGroup.y(bodyY)
    rightBodyGroup.y(bodyY)

    // Update center scrollable content (both X and Y)
    centerBodyGroup.x(centerX)
    centerBodyGroup.y(-scrollY)

    // Update center header (only X position changes)
    centerHeaderGroup.x(headerX)

    // Fixed headers (leftHeaderGroup and rightHeaderGroup) never move - they stay at (0,0) and fixed right position

    updateScrollbars()
    headerLayer?.batchDraw()
    bodyLayer?.batchDraw()
    fixedLayer?.batchDraw()
    fixedHeaderLayer?.batchDraw()
  }

  function handleResize() {
    ensureStage()
    // Rebuild groups to adjust right pinned x position
    clearGroups()
    rebuildGroups()
  }

  onMounted(() => {
    ensureStage()
    clearGroups()
    rebuildGroups()

    const el = containerRef.value
    el?.addEventListener('wheel', handleWheel, { passive: false })
    window.addEventListener('resize', handleResize)
    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('mouseup', handleMouseUp)
  })

  onBeforeUnmount(() => {
    const el = containerRef.value
    el?.removeEventListener('wheel', handleWheel)
    window.removeEventListener('resize', handleResize)
    window.removeEventListener('mousemove', handleMouseMove)
    window.removeEventListener('mouseup', handleMouseUp)

    stage?.destroy()
    stage = null
    headerLayer = null
    bodyLayer = null
    fixedLayer = null
    fixedHeaderLayer = null
    scrollbarLayer = null
    centerBodyClipGroup = null
  })
  </script>
  
  <style scoped>
  .konva-demo6 {
    height: 100%;
    display: flex;
    flex-direction: column;
  }
  .stage-container {
    /* Set a fixed demo height; adjust as needed */
    height: 460px;
    width: 100%;
    border: 1px solid #e5e7eb;
    background: #fff;
  }
  </style>