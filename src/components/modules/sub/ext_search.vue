<template>
	<div class="ext_search"></div>
</template>
<script>
import axios from 'axios';

export default{
	data(){
		return{
			search_url: "",
			yahoo_url: "https://shopping.yahooapis.jp/ShoppingWebService/V3/itemSearch",
			rakuten_url: "https://app.rakuten.co.jp/services/api/BooksTotal/Search/20170404",
			isdn_url: "https://isdn.jp/xml/"
		}
	},
	methods:{
		search(code, searchType){
			const req_url = this.create_serach_url(code, searchType)
			const results = this.createData(req_url);
			//エラーハンドリングどうする？
			
			//searchtypeで整形
			console.log(results.data)
			return results
		},

		create_serach_url(code, searchType){
			
			const yahoo_params = {
				appid: import.meta.env.VITE_YSHOP_APPID,
				jan_code: code,
				image_size: "600"
			}

			const rakuten_params = {
				applicationId: import.meta.env.VITE_RAKUTEN_APPID,
				isbnjan: code,
				formatVersion: "2"
			}

			const isdn_params = {
				isdn: code
			}

			switch(searchType){ //radiobuttonのvalueで分岐
				case 'yshop':
					this.search_url = this.yahoo_url + "?" + new URLSearchParams(yahoo_params).toString();
					break
				case 'rakuten':
					this.search_url = this.rakuten_url + "?" + new URLSearchParams(rakuten_params).toString();
					break
				case 'isdn':
					this.search_url = this.isdn_url + "/" + new URLSearchParams(isdn_params).toString();
					break
				default:
					console.log("ラジオボタンの選択を確認できませんでした")
			}

			return this.search_url
		},

		createData(search_url){
			return new Promise((resolve,reject) => {
				
				const res = axios.get(search_url, { headers: { 'Access-Control-Allow-Origin': '*' } });
				resolve(res.data.ResulvitSet[0].Result[0])
			})
		},

		formatData(searchType, body){
			const res = ""
			switch(searchType){
				case 'yshop':
					break;
				case 'rakuten':
					break;
				case 'isdn':
					break;
				default:
					console.log("ラジオボタンの選択を確認できませんでした")
			}
		}
	}
}
</script>