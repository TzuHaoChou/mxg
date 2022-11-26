<template>
	<view class="">
		<courseHeader></courseHeader>
		<view class="course" :style="'height:' + pageHeight + 'px'">
			<tabar :tabs="courseTabs" v-model="index"></tabar>
			<swiper class="swiper-box" @change="tabsindex" :indicator-dots="true" circular :current="index"
				:interval="3000" :duration="1000">
				<swiper-item v-for="(item,index) in 4" :key="index">
					<scroll-view upper-threshold="0" @scrolltoupper="scrolltoupper" class="scroll-view" scroll-y="true">
						<view class="bottom">
							<course-info :detailUrls="courseDetail.detailUrls" v-if="index==0"></course-info>
							<course-dir :chapterList="chapterList" :activeObject="activeObject"
								@playVideo="handlePlayVideo" :isBuy="isBuy" v-if="index==1"></course-dir>
							<courseComment :commentList="commentList" v-if="index === 2"></courseComment>
							<course-group :groupList="groupList" v-if="index === 3"></course-group>
						</view>

					</scroll-view>

				</swiper-item>
			</swiper>
		</view>
		<bottom-btn @clickBottom="handleClickBottom" courseId="1"
			:name="isBuy || courseDetail.isFree === 1 ? '立即观看' : '立即购买'"></bottom-btn>
		<!-- 视频播放 -->
		<view @click.stop="stops" v-if="videoUrl" @playVideo="handlePlayVideo" class="mask vidobox">
			<view class="name">
				<text>免费试看</text>
				<text class=" iconfont icon-close" @click.stop="stops"></text>
			</view>
			<video id="myVideo" class="video" :src="videoUrl" controls></video>
		</view>
	</view>
</template>

<script>
	import courseInfo from '@/pages/course/components/course-info.vue'
	import courseDir from '@/pages/course/components/course-dir.vue'
	import courseComment from '@/pages/course/components/courseComment.vue'
	import courseGroup from '@/pages/course/components/course-group.vue'
	import courseHeader from "@/pages/course/components/course-header.vue"
	import tabar from "@/components/common/tab-bar.vue"
	import courseTabs from "@/config/course-details-tabs.js"
	import courseDetailApi from "@/api/course.js"
	import bottomBtn from "@/pages/course/components/bottom-btn.vue"
	export default {
		components: {
			courseHeader,
			tabar,
			courseGroup,
			courseComment,
			courseDir,
			courseInfo,
			bottomBtn
		},
		data() {
			return {
				enableScroll: false,
				courseTabs,
				index: 0,
				pageHeight: 300,
				statusBarHeight: 0,
				detailTop: 0,
				courseId: null,
				statusNavHeight: 0,
				courseDetail: {},
				chapterList: [],
				commentList: [],
				groupList: [],
				isBuy: false,
				coursePlayStatus: false,
				videoUrl: '',
				activeObject: {
					chapterIndex: -1,
					sectionsIndex: -1
				},
				videoContext: null, // 视频播放方法实例对象
			}
		},
		onLoad(options) {
			this.viewportheight()
			this.getCourseId(options.id)
			this.loadRequest()
		},
		onReachBottom() {
			this.enableScroll = true
		},
		// 页面初次渲染完成
		onReady() {
			let view = uni.createSelectorQuery().in(this).select(".course")
			view.fields({
				rect: true
			}, data => {
				this.detailTop = data.top
			}).exec()
			this.videoContext = uni.createVideoContext('myVideo')
		},
		// 实时监听页面滚动 
		onPageScroll(e) {
			this.enableScroll = true
		},
		methods: {

			// 点击试看触发的方法
			handlePlayVideo(data) {
				this.activeObject.chapterIndex = data.activeObject.chapterIndex
				this.activeObject.sectionsIndex = data.activeObject.sectionIndex

				console.log(this.isBuy, "aaaa");

				if (!this.isBuy) {
					this.navTo(
						`/pages/course/course-play?id=${this.courseId}&chapterIndex=${this.activeObject.chapterIndex}&sectionsIndex=${this.activeObject.sectionsIndex}`
					)
					return
				} else {

				}



				// console.log("this.activeObject",this.activeObject)
				this.videoUrl = data.data.videoUrl
				this.$nextTick(() => {
					this.videoContext.play()
				})

			},
			stops() {
				this.videoContext.stop()
				this.videoUrl = null
			},
			tabsindex(event) {
				this.index = event.detail.current
				const res = uni.getSystemInfoSync()
				uni.pageScrollTo({
					scrollTop: res.windowHeight,
					duration: 150
				})
			},
			scrolltoupper() {
				uni.pageScrollTo({
					scrollTop: 0,
					duration: 150
				})
			},
			// 到达页面底部触发
			onReachBottom() {
				// 详情区域可滚动
				this.enableScroll = true
			},
			// 监听视口高度
			viewportheight() {
				// 获取系统信息
				const res = uni.getSystemInfoSync()
				const system = res.platform
				this.pageHeight = res.windowHeight
				const statusBarHeight = res.statusBarHeight
				//判断是安卓还是ios
				if (system === 'android') {
					this.statusNavHeight = (48 + statusBarHeight)
				} else if (system === 'ios') {
					this.statusNavHeight = (44 + statusBarHeight)
				}
				// 可使用的窗口
				this.pageHeight = res.windowHeight - this.statusNavHeight
			},


			handleClickBottom() {
				if (this.isBuy || this.courseDetail.isFree === 1) {
					this.navTo('/pages/course/course-play?id' + this.courseId)
				} else {
					this.navTo("/pages/order/confirm-buy?course=" + encodeURIComponent(JSON.stringify(this.courseDetail)))
				}
			},
			// 获取课程id
			getCourseId(id) {
				this.courseId = id
			},

			// 初始化加载所有数据
			loadRequest() {
				this.getCourseDetail()
				this.getChapterList()
				this.getCommentList()
				this.getGroupList()
				this.getCourseStatus()
			},

			//获取课程状态 (查询课程是否已购买)
			async getCourseStatus() {
				try {
					// 获取本地是否存在token
					const token = uni.getStorageSync("edu-app-token")
					if (token) {
						const res = await courseDetailApi.findCourseStatus(this.courseId)
						this.isBuy = res.isBuy
						console.log("课程是否已购买", this.isBuy)
					}
				} catch (e) {
					console.log("error", e)
				}
			},

			// 获取课程详情数据
			async getCourseDetail() {
				try {
					this.courseDetail = await courseDetailApi.getCourseDetail(this.courseId)
					console.log("课程详情:", this.courseDetail)

					uni.setNavigationBarTitle({
						title: this.courseDetail.title
					})
				} catch (e) {
					//TODO handle the exception
					console.log("error", e)
				}
			},
			// 获取章节数据
			async getChapterList() {
				try {
					this.chapterList = await courseDetailApi.getChapterList(this.courseId)
					console.log("课程章节:", this.chapterList)
				} catch (e) {
					console.log("error", e)
				}
			},
			// 获取评价数据
			async getCommentList() {
				try {
					this.commentList = await courseDetailApi.getCommentList(this.courseId)
					console.log("课程评价:", this.commentList)
				} catch (e) {
					console.log("error", e)
				}
			},
			// 获取套餐数据
			async getGroupList() {
				try {
					this.groupList = await courseDetailApi.getGroupList(this.courseId)
					console.log("课程套餐:", this.groupList)
				} catch (e) {
					console.log("error", e)
				}
			},
			handleChangeCurrent(event) {
				this.index = event.detail.current
				const res = uni.getSystemInfoSync()
				uni.pageScrollTo({
					scrollTop: res.windowHeight,
					duration: 150
				})
			},
		}
	}
</script>

<style lang="scss">
	.course {
		overflow: hidden;
		// background-color: red;

		.swiper-box,
		.scroll-view {
			height: 100%;
		}

		.bottom {
			padding-bottom: 180rpx;
		}
	}

	.vidobox {
		z-index: 100;
		text-align: center;

		.name {
			color: #fff;
			position: relative;
			top: 280rpx;
			font-size: 38rpx;
			font-weight: bold;

			.icon-close {
				margin-left: 15rpx;
			}

		}

		.video {
			width: 750rpx;
			height: 420rpx;
			position: absolute;
			left: 50%;
			top: 50%;
			transform: translate(-50%, -50%);
		}
	}
</style>
