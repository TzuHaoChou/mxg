<template>
	<view class="code center ">
		<text class=".code-btn" @click="sendSmsCode" >{{codeDuration ? codeDuration + 's' : '验证码'}}</text>
	</view>
</template>

<script>
	import systemApi from "@/api/model.js"
	export default {
		name: "mxg-code",
		props: {
			mobile: {
				type: String,
				default: ""
			},
			templateCode: {
				type: String,
				default: ""
			}
		},
		data() {
			return {
				codeDuration: null,
				interval: null,
				disabled: false
			};
		},
		methods: {
			async sendSmsCode() {
				// 如果输入框内容为空,则提示手机号不能为空
				if (!this.mobile) {
					this.$util.msg("手机号不能为空")
					return
				}
				// 如果输入框的手机号不符合规范, 则提示手机号格式不正确
				const rules = /^(13[0-9]|14[01456879]|15[0-35-9]|16[2567]|17[0-8]|18[0-9]|19[0-35-9])\d{8}$/
				if (!rules.test(this.mobile)) {
					this.$util.msg("手机号格式不正确")
					return
				}

				// 如果正在倒计时,则不继续往下执行
				if (this.disabled) {
					uni.showModal({
						content: `请在${this.codeDuration}秒后重试`,
						showCancel: false
					})
					return
				}
				// 
				const data = {
					mobile: this.mobile.trim(),
					templateCode: this.templateCode.trim()
				}
				// 发送请求
				try {

					// 开启loading加载
					uni.showLoading({
						mask: true
					})

					// 发送验证码接口调用成功
					await systemApi.sendSmsCode(data)

					// 隐藏loading
					uni.hideLoading()

					// 提示发送成功
					this.$util.msg("发送成功")

					// 调用成功之后在进行倒计时
					// 设置倒计时未60s
					this.codeDuration = 60
					// 设置为按钮禁用
					this.disabled = true
					// 开启定时器
					this.interval = setInterval(() => {
						// 开始倒计时
						this.codeDuration--
						// 如果倒计时为0 
						if (this.codeDuration <= 0) {
							// 并且定时器是开启的状态
							if (this.interval) {
								// 清楚定时器
								clearInterval(this.interval)
								// s设置保存定时器的变量为null
								this.interval = null
								// 设置按钮为不禁用
								this.disabled = false
							}
						}
					}, 1000)

				} catch (e) {
					//TODO handle the exception
					uni.hideLoading()
					this.$util.msg("验证码发送失败")
				}

				// 输入框为空 提示手机号不能为空
				// 手机号输入不符合规则 提示手机号格式不正确
				// 更换手机号与原手机号一致，不允许发送
			}
		}
	}
</script>

<style lang="scss">
	.code {
		width: 160rpx;
		background-color: #345dc2;
		border-radius: 10rpx;
		// display: flex;
		// align-items: center;
		// justify-content: center;
	}

	.code-btn {
		padding: 10rpx 0;
		font-size: 25rpx;
		color: #FFFFFF;
	}
</style>
