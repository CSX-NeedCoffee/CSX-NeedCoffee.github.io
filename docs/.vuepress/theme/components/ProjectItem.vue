<template>
  <a class="projectItem a" target="_blank" href="https://www.bootstrapmb.com">
    <div class="projectItemLeft">
      <h1>后端笔记</h1>
      <p>主要技术方向</p>
    </div>
    <div class="projectItemRight">
      <img src="/images/icon2.svg" alt="" />
    </div>
  </a>
</template>
<style scoped lang="less">
//  重置浏览器对a标签的默认样式
a:hover,
a:link,
a:visited,
a:active,
a:focus {
  text-decoration: none;
  outline: none;
  border: none;
  color: inherit;
  -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
}
.projectItem {
  margin: 7px;
  display: flex;
  background-color: rgba(255, 255, 255, 0.25);
  border-radius: 8px;
  padding: 15px;
  height: 100px;
  width: calc(25% - 15px);
  backdrop-filter: blur(0px);
  -webkit-backdrop-filter: blur(0px);
  transition: opacity 0.5s ease, background-color 0.2s ease, border 0.2s ease,
    transform 0.3s ease;

  .projectItemLeft {
    transition: width 0.4s ease;
    height: 100%;
    width: 80%;

    h1 {
      font-weight: normal;
      font-size: 16px;
      margin: 0px;
      transition: font-size 0.2s ease;
    }

    p {
      font-size: 12px;
      margin-top: 15px;
    }
  }

  .projectItemRight {
    overflow: hidden;
    transition: width 0.4s ease;
    display: flex;
    justify-content: center;
    align-items: center;
    width: 20%;
    height: 100%;

    img {
      transform: rotate(0deg);
      transition: transform 0.4s ease;
      height: 39px;
      width: 39px;
    }
  }

  &:hover {
    box-shadow: 0 8px 16px -4px #2c2d300c;
    transform: translateY(-2px);

    .projectItemLeft {
      width: 100%;
      h1 {
        font-size: 18px;
      }
    }
    .projectItemRight {
      width: 0%;
      img {
        transform: rotate(45deg);
      }
    }
  }
}
</style>
