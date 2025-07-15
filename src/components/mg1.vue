<template>
  <div class="mg1-root">
    <div class="mg1-main-card">
      <img class="mg1-main-img" src="../assets/head.png" alt="main" />
      <div class="mg1-content">
        <div class="mg1-title">Use the bluetooth SMS andwidth, then you can</div>
        <div class="mg1-desc">Compressing the monitor won't do anything, we need to synthesize the cross-platform HTTP feed.</div>
        <div class="mg1-user-row">
          <el-avatar :size="40" src="https://image-resource.mastergo.com/57000091966935/57000091966937/b253f033eb4e3f396f8ee23280a1b034.png" />
          <div class="mg1-user-info">
            <div class="mg1-user-name">Darlene Robertson</div>
            <div class="mg1-user-date">March 12, 2021</div>
          </div>
          <span class="mg1-arrow">
            <svg width="20" height="18" viewBox="0 0 20 18" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M0 8.75C0 8.42 0.1317 8.10212 0.3661 7.8677C0.6005 7.63328 0.9185 7.50158 1.25 7.50158H15.7325L10.365 2.13658C10.1303 1.90186 9.99842 1.58352 9.99842 1.25158C9.99842 0.91964 10.1303 0.601296 10.365 0.366579C10.5997 0.131863 10.9181 0 11.25 0C11.5819 0 11.9003 0.131863 12.135 0.366579L19.635 7.86658C19.7514 7.98269 19.8438 8.12063 19.9068 8.2725C19.9698 8.42436 20.0022 8.58716 20.0022 8.75158C20.0022 8.916 19.9698 9.0788 19.9068 9.23066C19.8438 9.38253 19.7514 9.52047 19.635 9.63658L12.135 17.1366C11.9003 17.3713 11.5819 17.5032 11.25 17.5032C10.9181 17.5032 10.5997 17.3713 10.365 17.1366C10.1303 16.9019 9.99842 16.5835 9.99842 16.2516C9.99842 15.9196 10.1303 15.6013 10.365 15.3666L15.7325 10.0016H1.25C0.9185 10.0016 0.6005 9.86988 0.3661 9.63546C0.1317 9.40104 0 9.0831 0 8.75158Z" fill="#5374FF"/>
            </svg>
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// No script logic required for static layout
</script>

<style scoped lang="less">
/* Design tokens as CSS variables */
:root {
  /* Whites/White */
  --mg1-white: #FFFFFF;
  /* Blacks/High emphasis */
  --mg1-black-high: #313237;
  /* Blacks/Mid emphasis */
  --mg1-black-mid: #718797;
  /* AppColors/ppl */
  --mg1-blue: #5374FF;
  /* box shadow */
  --mg1-shadow: 0px 0px 0px 20px rgba(0, 0, 0, 0.02);
}
.mg1-root {
  min-height: 100vh;
  background: lightblue; //var(--mg1-white);
  display: flex;
  justify-content: center;
  align-items: center;
}
.mg1-main-card {
  width: 540px;
  height: 680px;
  background: white;
  border-radius: 10px;
  box-shadow: var(--mg1-shadow);
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
}
.mg1-main-img {
  width: 500px;
  height: 380px;
  border-radius: 10px;
  object-fit: cover;
  margin-bottom: 20px;
}
.mg1-content {
  width: 500px;
  background: var(--mg1-white);
  border-radius: 10px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 40px 20px 20px 20px;
  box-sizing: border-box;
}
.mg1-title {
  font-family: 'Amiko-Bold', sans-serif;
  font-size: 25px;
  color: var(--mg1-black-high);
  line-height: 33.8px;
  margin-bottom: 8px;
}
.mg1-desc {
  font-family: 'Inter-Regular', sans-serif;
  font-size: 16px;
  color: var(--mg1-black-mid);
  line-height: 26.4px;
  margin-bottom: 32px;
}
.mg1-user-row {
  display: flex;
  align-items: center;
  gap: 10px;
}
.mg1-user-info {
  display: flex;
  flex-direction: column;
  margin-left: 10px;
}
.mg1-user-name {
  font-family: 'Inter-SemiBold', sans-serif;
  font-size: 16px;
  color: var(--mg1-black-high);
  line-height: 26.4px;
}
.mg1-user-date {
  font-family: 'Inter-Regular', sans-serif;
  font-size: 12px;
  color: var(--mg1-black-mid);
  line-height: 16.8px;
}
.mg1-arrow {
  margin-left: auto;
  display: flex;
  align-items: center;
}
</style> 