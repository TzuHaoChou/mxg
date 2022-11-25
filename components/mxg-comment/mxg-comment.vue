<template>
	<view>
		<view v-if="isShow" class="mask" @click="show" catchtouchmove="true" @touchmove.stop.prevent="()=>{}">
		</view>
		<!-- 评论 -->
		<view v-if="isShow" class="course-comment center column" catchtouchmove="true" @touchmove.stop.prevent="()=>{}">
			<uni-rate :size="22" v-model="comment.score" />
			<text class="desc">{{descArr[comment.score-1]}}</text>
			<view class="input-box center">
				<textarea :value="comment.content" @input="getContent" class="textarea" placeholder="请输入评价内容……" />
				<text class="btn" @click="submitComment">提交</text>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		props: {
			comment: {
				type: Object,
				default: () => ({
					userId: 1, // 当前用户id
					nickName: "x涛",
					userImage: "xx.jpg",
					content: '', // 评论内容
					score: 5 // 评分值
				})
			},
			descArr: { // 每个评分对象中文说明
				type: Array,
				default: () => [
					'极差,课程很糟糕，我要吐槽。',
					'差,我对课程不满意。',
					'中评,课程一般。',
					'良好,课程还可以。',
					'推荐,课程非常棒。',
				]
			}
		},

		data() {
			return {
				isShow: false,
			}
		},
		methods: {
			//显示隐藏评论窗口
			show() {
				this.isShow = !this.isShow
			},

			// 评论框失去焦点获取内容
			getContent(e) {
				console.log(e.detail.value)
				this.comment.content = e.detail.value
			},

			// 点击提交评论
			submitComment() {
				//去除左右空格
				this.comment.content = this.comment.content.trim()
				console.log('提交内容', this.comment)
				this.$emit('submitComment', this.comment)
			}
		}
	}
</script>

<style lang="scss">
	.course-comment {
		position: fixed;
		left: 0;
		right: 0;
		bottom: 50%;
		z-index: 100;
		width: 650rpx;
		margin: 0 auto;
		padding-top: 30rpx;
		font-size: 30rpx;
		background-color: #fff;
		border-radius: 20rpx;

		.desc {
			// 字间隔
			letter-spacing: 2px;
			padding: 20rpx 0;
			color: $i-text-color-black;
		}

		.input-box {
			border-top: $i-underline;
			width: 100%;
			// 不换行
			white-space: nowrap;
		}

		.textarea {
			font-size: 30rpx;
			padding: 10rpx;
			width: 100%;
			height: 100rpx;
			background-color: #F8F9FB;
			border-radius: 0 0 0 16rpx;
		}

		.btn {
			padding: 0 15rpx;
			color: $i-text-color-blue;
		}
	}
</style>
