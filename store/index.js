import Vue from "vue"
import Vuex from "vuex"
Vue.use(Vuex)
import {USER_INFO_KEY, TOKEN_KEY} from "@/enum/user-key.js"

const store = new Vuex.Store({
	state: {
		userInfo: uni.getStorageSync(USER_INFO_KEY) || {}, // 用户信息
		accessToken: uni.getStorageSync(TOKEN_KEY) || "", // 访问令牌
	},
	getters: {
		// 是否有登录
		hasLogin(state) {
			return !!state.accessToken // 取反两次把原数据转换为布尔类型，有值就是true
		}
	},
	mutations: {
		// 更新状态数据
		setState(state, obj) {
			for (let key in obj) {
				// 每个对象的key作为状态名, value作为状态值
				state[key] = obj[key]
			}
		},
		// 更新用户登录状态
		setToken(state, data) {
			// 解构属性，
			const {
				userInfo,
				access_token
			} = data
			// 状态赋值保存
			if (userInfo) {
				state.userInfo = userInfo
				uni.setStorageSync('USER_INFO_KEY', userInfo)
			}
			if (access_token) {
				state.accessToken = access_token
				uni.setStorageSync('TOKEN_KEY', access_token)
			}
		},
		logout(state) {
			// 状态清空
			state.userInfo = {}
			state.accessToken = ''
			// 移除本地数据
			uni.removeStorageSync('USER_INFO_KEY')
			uni.removeStorageSync('TOKEN_KEY')
		}
	},
	actions: {

	}
})
export default store
