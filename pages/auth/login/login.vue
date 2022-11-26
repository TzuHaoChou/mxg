<template>
	<view class="login">
		<text class="iconfont icon-close back-btn"></text>
		<view class="left">LODIN</view>
		<view class="welcome">欢迎回来</view>
		<view class="input-content">
			<view class="input-item">
				<text class="tit">手机号码</text>
				<view class="row">
					<input v-model="mobile" type="number" placeholder="请输入手机号码">
				</view>
			</view>
			<view class="input-item">
				<text class="tit"></text>
				<view class="row">
					<input v-model="code" type="number" placeholder="请输入手机验证">
					<mxg-code :mobile="mobile"></mxg-code>
				</view>
			</view>
			<button class="loginbotton" type="primary" :loading="loading" @click="login">登录</button>
		</view>
		<!-- #ifdef APP-PLUS || MP-WEIXIN -->
		<view class="other-wrapper">
			<view class="line center">
				<text class="tit">社交账号登录</text>
			</view>
			<view class="row">
				<image @click="toProviderLogin('weixin')" class="icon" src="/static/share/weixin.png"></image>
				<!-- #ifdef APP-PLUS -->
				<image @click="toProviderLogin('qq')" class="icon" src="/static/share/qq.png"></image>
				<!-- #endif -->
			</view>
		</view>
		<!-- #endif -->
		<!-- 协议 -->
		<view class="agreement center">
			<text class="iconfont icon-roundcheckfill" :class="{active: agreement}" @click="checkAgreement"></text>
			<text @click="checkAgreement">请认真阅读并同意</text>
			<text class="tit" @click="navTo('/pages/public/xieyi')">《用户服务协议》</text>
			<text class="tit" @click="navTo('/pages/public/yinsi')">《隐私权政策》</text>
		</view>
	</view>
</template>

<script>
	import systemApi from "@/api/model.js"
	export default {

		data() {
			return {
				mobile: '18625832229', // 用户名
				code: '123456', // 验证码
				agreement: true, // 是否同意协议
				loading: false, // 登录中
				templateCode : 'MSM_1999123123'
			};
		},
		methods: {
		async login() {
				if(!this.agreement){
					this.$util.msg("请阅读并同意用户服务及隐私协议")
					return
				}
				// 检测手机号格式是否正确
				if(!this.$util.checkStr(this.mobile, 'mobile')){
					this.$util.msg("请输入有效手机号码")
					return
				}
				// 检测验证码是否正确
				if(!this.$util.checkStr(this.code, 'mobileCode')){
					this.$util.msg("验证码输入错误")
					return
				}
				this.loading = true
				uni.showLoading({
					title : '登录中',
					mask : true
				})
				try{
					const data = {mobile : this.mobile, code : this.code}
					const response =await systemApi.login(data)
					this.loading = false
					uni.hideLoading()
					this.loginSuccessCallBack(response)
				}catch(e){
					//TODO handle the exception
				}
				// setTimeout(() => {
				// 	this.loading = false
				// }, 1000)
			},
			
			loginSuccessCallBack(data){
				this.$util.msg("登录成功")
				this.$store.commit('setToken',data)
				setTimeout(()=>{
					this.navBack()
				},500)
				
				
				
			},
			//同意协议
			checkAgreement() {
				this.agreement = !this.agreement
			},

			// 微信、QQ提供商登录
			toProviderLogin(provider) {},
		}
	}
</script>

<style lang="scss">
	.login {
		padding-top: 200rpx;

		.back-btn {
			// background-color: red;
			padding: 8rpx;
			position: absolute;
			left: 9rpx;
			top: calc(var(--status-bar-height) + 20rpx);
			font-size: 20rpx;
			color: #aaa;
		}

		.left {
			font-size: 120rpx;
			color: #f8f8f8;
		}

		.welcome {
			position: relative;
			top: -90rpx;
			padding-left: 60rpx;
			font-size: 46rpx;
			color: #555;
			text-shadow: 1px 0px 1px rgba(0, 0, 0, .3);
		}

		.input-content {
			padding: 0 60rpx;
		}

		.input-item {
			display: flex;
			flex-direction: column;
			justify-content: center;
			align-items: flex-start;
			padding-left: 30rpx;
			background: #f8f6fc;
			height: 120rpx;
			border-radius: 4px;
			margin-bottom: 50rpx;

			&:last-child {
				margin-bottom: 0;
			}

			.row {
				width: 100%;
			}

			.tit {
				height: 50rpx;
				line-height: 56rpx;
				font-size: 26rpx;
				color: #606266;
			}

			input {
				flex: 1;
				height: 60rpx;
				font-size: 30rpx;
				color: #303133;
				width: 100%;
			}

		}

		.loginbotton {
			background-color: #344fb7;
		}
	}

	.other-wrapper {
		display: flex;
		flex-direction: column;
		align-items: center;
		padding-top: 20rpx;
		margin-top: 80rpx;

		.weixin {
			border: 0;
		}

		.line {
			margin-bottom: 40rpx;

			.tit {
				margin: 0 32rpx;
				font-size: 24rpx;
				color: #606266;
			}

			&:before,
			&:after {
				content: '';
				width: 160rpx;
				height: 0;
				border-top: 1px solid #e0e0e0;
			}
		}

		.icon {
			width: 80rpx;
			height: 80rpx;
			margin: 0 50rpx;
		}
	}

	.agreement {
		position: absolute;
		left: 0;
		bottom: 10rpx;
		width: 750rpx;
		height: 90rpx;
		font-size: 24rpx;
		color: #999;

		.iconfont {
			font-size: 36rpx;
			color: #ccc;
			margin-right: 8rpx;

			&.active {
				color: $i-color-primary;
			}
		}

		.tit {
			color: #40a2ff;
		}
	}
</style>
