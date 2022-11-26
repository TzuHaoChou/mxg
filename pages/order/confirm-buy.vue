<template>
	<view class="confirm-order">
		<view class="goods">
			<text>商品信息</text>
			<course-item></course-item>
		</view>

		<view class="card option-pay">
			<view class="title">支付方式</view>
			<!-- APP端的IOS设备展示 -->
			<view class="ios" v-if="isIOS">
				<text>余额：</text>
				<text>0.00 币(不足支付)</text>
			</view>

			<!-- 非APP端的IOS设备展示 -->
			<radio-group v-else @change="payChange">
				<!-- #ifndef MP-WEIXIN -->
				<label class="pay-item center space-between">
					<view class="left center">
						<image src="/static/pay/alipay.png"></image>
						<text>支付宝</text>
					</view>
					<radio value="alipay" :checked="provider==='alipay'" style="transform:scale(0.8)" />
				</label>
				<!-- #endif -->
				<!-- #ifndef MP-ALIPAY -->
				<label class="pay-item center space-between">
					<view class="left center">
						<image src="/static/pay/wxpay.png"></image>
						<text>微信支付</text>
					</view>
					<radio value="wxpay" :checked="provider==='wxpay'" style="transform:scale(0.8)" />
				</label>
				<!-- #endif -->
			</radio-group>
		</view>

		<view class="card price">
			<view class="space-between">
				<text>商品金额</text>
				<text>￥888.8</text>
			</view>
			<view class="space-between">
				<text>优惠价</text>
				<text>￥699.9</text>
			</view>
		</view>
		<!-- 占底部按钮位置 -->
		<view style="height: 130rpx;"></view>

		<view class="pay space-between">
			<view>
				<text class="grey">实付金额:</text>
				<text>￥699.9</text>
			</view>
			<view>
				<button v-if="!isIOS" class="btn" @click="iosPayHandler">充值并支付
				</button>
				<!-- #ifndef MP-WEIXIN -->
				<button v-else class="btn" :loading="loading" :disabled="loading" >提交订单</button>
				<!-- #endif -->
				<!-- #ifdef MP-WEIXIN -->
				<button v-else class="btn" :loading="loading" :disabled="loading" >提交订单</button>
				<!-- #endif -->
			</view>
		</view>
	</view>
</template>
<script>
	import courseItem from '@/components/common/i-course-item.vue'

	export default {
		components: {
			courseItem
		},

		data() {
			return {
				course: {}, // 商品信息
				isIOS: false, // 是否为APP端的IOS设备
				provider: 'alipay', // 选择支付方式
				loading: false, // 是否提交中
			}
		},

		}
</script>
<style lang="scss">
	.confirm-order {
		font-size: 29rpx;
		color: #333;
	}

	.goods {
		background-color: #FFF;
		padding: 20rpx 30rpx 0 30rpx;
	}

	.card {
		padding: 0 30rpx;
		background-color: #FFF;
		margin-top: 30rpx;
		border-radius: 20rpx;
		box-shadow: 1px 0 5px 0 rgba(0, 0, 0, 0.08);
	}

	.option-pay {
		.title {
			line-height: 90rpx;
			border-bottom: $i-underline;
		}

		.ios {
			line-height: 90rpx;

			text:last-child {
				color: $i-text-color-red;
			}
		}

		.pay-item {
			line-height: 90rpx;

			.left {
				image {
					width: 60rpx;
					height: 60rpx;
				}

				text {
					font-size: 33rpx;
					padding-left: 20rpx;
				}
			}
		}
	}

	.price {
		>view {
			line-height: 90rpx;
			border-bottom: 1px solid #F8F9FB;
		}
	}

	.pay {
		position: fixed;
		left: 0;
		right: 0;
		bottom: 0;
		align-items: center;
		height: 100rpx;
		padding: 0 30rpx;
		background-color: #fff;
		border-top: $i-underline;

		view:first-child>text:last-child {
			color: $i-text-color-red;
			font-size: 35rpx;
		}

		.btn {
			background-color: $i-color-primary;
			color: #fff;
			border-radius: 50rpx;
			line-height: 80rpx;
			font-size: 30rpx;

			&::after {
				// 加载中时，隐藏边框
				border: none;
			}
		}
	}
</style>
