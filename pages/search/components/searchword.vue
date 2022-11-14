<template>
	<view class="box">
		<view class="top">
			<text>热门搜索</text>
		</view>
		<view class="left" >
			<view @click="clickTagHandler(item)"  v-for="(item,index) in hotList" :key="index">{{item}}</view>
		</view>
		<view class="bottom space-between" >
			<text>历史搜索</text>
			<text @click="clearHistory">清空</text>
		</view>
		<view class="left">
			<view @click="clickTagHandler(item)" v-for="(item,index) in historyList" :key="index">
				{{item}}
			</view>
		</view>
		
	</view>
</template>

<script>
	import {HISTORY_EY} from "@/enum/kowrd.js"
	export default{
		data() {
			return {
			//热门搜索
			 hotList: ['Java', 'SpringBoot', 'SpringCloud', 'Python', 'Vue', 'React'], 
			 historyList: uni.getStorageSync(HISTORY_EY) || ['Vue', 'Java'], //历史搜索
			}
		},
		methods:{
			// 清空
			clearHistory(){
				this.historyList=[] //data
				uni.removeStorageSync(HISTORY_EY)//本地
			},
			// 点击标签
			clickTagHandler(item){
			this.handelSearchValue(item)
			// 开始搜索
			 this.$emit('doSearch', {value: item} )
			}
		}
	}
</script>

<style lang="scss">
	.box {
		padding: 25rpx;

		.top {
			font-size: 30rpx;
		}
		.left{
			display: flex;
			 flex-wrap: wrap;
			 // margin-top: 20rpx;
			 // margin-bottom: 60rpx;
			 margin: 20rpx 0 60rpx 0;
			view{
				font-size: 28rpx;
				color: #999;
				border: 1rpx solid #999;
				border-radius: 8rpx;
				padding: 6rpx 15rpx;
				margin: 10rpx;
				overflow: hidden;
				white-space: nowrap;
				text-overflow: ellipsis;
			}
		}

	}
</style>
