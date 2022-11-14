export default {
	data(){
		return {
			
		}
	},
	methods : {
		// 页面跳转的方法
		navTo(url, options = {}){
			if(!url) return
			
			if(options.login){
				uni.navigateTo({
					url : '/pages/auth/login'
				})
			}
			
			uni.navigateTo({
				url
			})
		},
		
		// 页面后退
		navBack(delta = 1){
			uni.navigateBack({
				delta
			})
		},
		handelSearchValue(item){
			// #ifdef APP-PLUS
			const currentWebview = this.$mp.page.$getAppWebview();
			currentWebview.setTitleNViewSearchInputText(item);
			// #endif
			// h5
			// #ifdef H5
			// h5搜索的值
			this.$nextTick(()=>{
				const placeholder = document.querySelector('.uni-page-head-search-placeholder')
				// console.log(placeholder);
				placeholder.innerHTML=''
				// 获取input
				const inputSearch = document.querySelector('.uni-input-input[type=search]');
				// 赋值点击内容
				inputSearch.value=item
			})
			
			// #endif
		}
	}
}