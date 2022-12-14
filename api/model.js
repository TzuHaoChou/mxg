import request from "@/utils/request.js"

// 发送验证码接口 

const sendSmsCode = (data) => {
	return request({url : '/system/sms/code', method : 'POST', data})
}

const login = (data) => {
	return request({url : '/auth/login', method : 'POST', data})
}

export default {
	sendSmsCode,
	login
}