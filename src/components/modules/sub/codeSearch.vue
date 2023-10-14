<template>
	<v-dialog max-width="1024px" class="text-center">
		<template v-slot:activator="{ props }">
			<v-btn color="secondary" v-bind="props" class="ma-2">{{ btnTxt }}</v-btn>
		</template>
		<template v-slot:default="{ isActive }">
			<v-card>
				<v-toolbar color="primary">
					<v-toolbar-title class="pa-4 ma-2">コード検索ツール</v-toolbar-title>
				</v-toolbar>
				<v-form class="ma-4 pa-4" @submit.prevent>
					<v-row>
						<v-text-field label="コード" prepend-icon="mdi-barcode" v-model="code" clearable ></v-text-field>
					</v-row>
					<v-row>
						<v-col cols="8">
							<v-radio-group label="検索方式" inline v-model="searchType">
								<v-radio label="Yahoo(JAN)" value="yshop"></v-radio>
								<v-radio label="楽天(JAN・ISBN)" value="rakuten"></v-radio>
								<v-radio label="ISDN(同人誌)" value="isdn"></v-radio>
							</v-radio-group>
						</v-col>
						<v-col cols="4">
							<v-btn type="submit" block color="primary" class="ma-2 py-7" @click="searchItem">検索</v-btn>
						</v-col>
					</v-row>
					<hr>
					<!-- <div v-if=""> -->
						<v-data-table
							v-model:items-per-page="itemsPerPage"
							:headers="headers"
							:items="results"
							:loading="loading"
							item-value="name"
							class="elevation-1"
						>
						<template v-slot:item.thumb="{ item }">
							<v-img
								:src="item.columns.thumb"
								width="150"
								class="ma-4"
							></v-img>
						</template>
						<template v-slot:item.selectbtn="{ item }">
							<v-btn color="secondary" @click="selectItem(item); isActive.value = false;">選択</v-btn>
						</template>
						</v-data-table>
					<!-- </div> -->
				</v-form>
				<v-card-actions class="justify-end">
					<v-btn variant="text" @click="isActive.value = false;">画面を閉じる</v-btn>
				</v-card-actions>
			</v-card>
		</template>
	</v-dialog>
</template>

<script>
import axios from 'axios';

export default{
	props:{
		btnTxt: {
			default: "JAN・ISBN・ISDN検索"
		},
		read_code:{
			default: ""
		}
	},
	computed:{
		code:{
			get(){
				return this.read_code
			}
		}
	},
	data(){
		return{
			//form
			//code: "",
			searchType: "",

			//outdata
			itemsPerPage: 5,
			headers: [
				{
					title: 'ID',
					align: 'start',
					sortable: false,
					key: 'id'
				},
				{
					title: 'コード',
					key: 'code'
				},
				{
					title: '商品名',
					key: 'title'
				},
				{
					title: '作者',
					key: 'author'
				},
				{
					title: '発売日',
					key: 'date'
				},
				{
					title: '画像',
					key: 'thumb'
				},
				{
					title: '選択',
					key: 'selectbtn'
				}
			],
			results: [],
			loading: false,
		}
	},
	methods:{
		tempdata(){
			return new Promise((resolve, reject) => {
				//なんらかのaxios とか
				setTimeout(()=>{
					const res = 
					[{
						id: 1,
						code: 4549767173511,
						title: 'THE IDOLM＠STER シンデレラガールズ 公式コンサートライト 5thLIVE TOUR Ver. 橘ありす LaLaBit Market 限',
						author: "",
						thumb: 'https://thumbnail.image.rakuten.co.jp/@0_mall/book/cabinet/5065/4540774145065.jpg'
					},
					{
						id: 2,
						code: 4573173314244,
						title: '【先着特典】THE IDOLM@STER CINDERELLA MASTER Cool jewelries! 004(ジャケ柄ステッカー)',
						author: "",
						thumb: 'https://item-shopping.c.yimg.jp/i/l/lashinbangtsuuhan_l02671864'
					}];
					resolve(res)
				},1000)
			})
		},

		getdata(code, type){
			try{
				return axios.get(`https://lib-search-gw.ke9000.workers.dev/api/${code}/${type}/`)
			} catch(e) {
				throw new Error("failed to get from api"+ e )
			}
		},

		async searchItem(){
			this.results = []
			this.loading = true
			console.log(this.code, this.searchType)

			//データ受け取り
			try{
				const result = await this.getdata(this.code, this.searchType)
				this.results = result.data
			} catch(e) {
				console.error(e)
			}

			//this.result = await this.tempdata()
			this.loading = false
		},
		input_code(){
			alert(this.read_code)
			this.code = this.read_code
		},
		selectItem(item){
			const send_item = {
				id: item.columns.id,
				code: item.columns.code,
				title: item.columns.title,
				author: item.columns.author,
				date: item.columns.date,
				thumb: item.columns.thumb
			}
			this.$emit('select-data', send_item)
		},
	},
}
</script>