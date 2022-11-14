# 积云在线教育APP开发文档

## 一、创建项目

## 二、安装sass/scss插件

## 三、完善项目目录结构

- common  存放的是公共的文件
	- js
	- css
	- mixins

- api     存放的是封装的api文件
- config  存放的项目配置文件
- mock	  存放的是模拟数据的文件
- utils   存放的是一些库文件

## 四、将项目的资源图片拷贝到项目中

## 五、引入并使用字体图标

### 5.1 访问iconfont官网,选择需要的图标并进行下载
### 5.2 将下载的字体图标拷贝到static目录下,并在App.vue内引入iconfont.css文件
### 5.3 在组件内可以通过fontClass或者Unicode的方式使用

## 六、配置窗口以及tabbar

## 七、实现首页导航栏 搜索框
### 7.1 实现方案

- 直接在pages.json中进行配置来进行实现 (采用这种)

1. 通过titleNView设置的搜索框只能在H5和APP端显示
2. 如果小程序端要进行显示,那么就需要自己去定义一个搜索框组件,并且让这个搜索框组件只在小程序端显示

- 让导航栏消失,自己封装搜索框

- 技术核心点: 条件编译


## 八、实现APP端搜索框文字滚动效果


## 其他: 

### 1. 实现下拉刷新与上拉加载

1.1 进入插件市场,搜索 `【wxs+renderjs实现】高性能的下拉刷新上拉加载组件` 这个
1.2 搜索到之后,点击使用hbulderx导入插件按钮
1.3 将下拉刷新上拉加载插件导入到项目中
1.4 引入mescroll-mixins.js
1.5 在data中注册mixins
1.6 使用me-scroll-body 包裹需要下拉刷新的组件
1.7 在methods需要定义上拉加载和下拉刷新都会触发的方法
1.8 判断如果page.num === 1就执行下拉刷新的操作
1.9 如果page.num === 1 则实行的上拉加载的操作