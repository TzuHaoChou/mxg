<template>
	<view class="search-container">
		<!-- #ifdef MP-WEIXIN -->
		<uni-search-bar v-model="content" clearButton="auto" :focus="focus" cancelButton="always"
			@confirm="handleSearch" @cancel="navBack()" radius="100" placeholder="搜索你想要的内容">
			<template v-slot:searchIcon>
				<text class="iconfont icon-search"></text>
			</template>
			<template v-slot:clearIcon>
				<text class="iconfont icon-roundclosefill"></text>
			</template>
		</uni-search-bar>
		<!-- #endif -->
		<searchword @doSearch="doSearch" v-if="!searched"></searchword>
		
		<tabr v-model.snsync="tabindex" v-if="searched"></tabr>
		<block v-if="searched">
			<course-list ref="mescrollItem0" :i="0" :index="tabindex" :params="params" :content="content"></course-list>
			<article-list ref="mescrollItem1" :i="1" :index="tabindex" :params="params" :content="content"></article-list>
			<question-list ref="mescrollItem2" :i="2" :index="tabindex"  :params="params" :content="content"></question-list>
		</block>
	</view>
</template>

<script>
	import MescrollMoreMixin from "@/uni_modules/mescroll-uni/components/mescroll-uni/mixins/mescroll-more.js"
	
	import courseList from "@/pages/search/components/course-list.vue"
	import articleList from "@/pages/search/components/article-list.vue"
	import questionList from "@/pages/search/components/question-List.vue"
	import searchword from "@/pages/search/components/searchword.vue"
	// 导航栏
	import tabr from "@/components/tab-tbr/tab-bar.vue"
	// 下拉排序组件
	import downBar from "@/components/down-bar/down-bar.vue"
	import {
		HISTORY_EY
	} from "@/enum/kowrd.js"
	export default {
		mixins : [MescrollMoreMixin],
		components: {
			searchword,
			tabr,
			downBar,courseList,articleList,questionList
		},
		data() {
			return {
				tabindex:0, //tab默认选择
				searched: false,
				content: "",
				focus: false,
				params: null,
				// #ifdef APP-PLUS
				currentWebview: null,
				// #endif
			}
		},
		onLoad(options) {
			this.listenerParams(options)
		},
		// 点击导航栏按钮触发的方法
		onNavigationBarButtonTap(e) {
			if (e.index === 0) {
				this.navBack()
			}
		},
		// 监听输入实时输入的内容
		onNavigationBarSearchInputChanged(e) {
			this.content = e.text
		},
		// 监听是否在手机上点击了搜索按钮
		onNavigationBarSearchInputConfirmed() {
			// #ifdef APP-PLUS
			this.currentWebview.setTitleNViewSearchInputFocus(false)
			// #endif

			this.doSearch()
		},
		methods: {
			// 监听跳转到搜索页的时候有没有传递参数
			listenerParams(options) {
				// #ifdef APP-PLUS
				this.currentWebview = this.$mp.page.$getAppWebview()
				// #endif

				// 有参数, 进行搜索查询
				if (JSON.stringify(options) !== "{}") {
					this.params = options
					// this.content=options.labelName
				
					// 调用搜索框方法
					this.handelSearchValue()
					// 调用搜索值
					this.doSearch({value : options.labelName})
				} else {
					// #ifdef APP-PLUS
					// 没有参数,则需要让搜索框获取到焦点
					this.currentWebview.setTitleNViewSearchInputFocus(true)
					// #endif
				}
			},

			// 搜索框查询方法
			handleSearch() {
				console.log("进行查询")
			},
			// 搜索查询方法
			doSearch(obj) {
				// 获取输入框输入的内容
			this.content = obj && obj.value ? obj.value : this.content
				this.searched = true
				
				
				this.$nextTick(()=>{
					this.$util.throttle(()=>{
						this.$refs[`mescrollItem${this.tabindex}`].search()
					})
				})
				
				this.handlesetLoclData()
			},
			// 存储
			handlesetLoclData() {
				uni.getStorage({
					key:HISTORY_EY,
					success: (res) => {
						console.log(res,"<==res");
						this.content && res.data.indexOf(this.content) < 0 && res.data.unshift(this.content)
						uni.setStorageSync(HISTORY_EY, res.data)
					},
					fail: (err) => {
						console.log(err);
						this.content && uni.setStorageSync(HISTORY_EY,[this.content])
					}
				})
			}
		}
	}
</script>

<style>

</style>
