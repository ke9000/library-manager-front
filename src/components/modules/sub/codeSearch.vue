<script setup>
import axios from 'axios';
</script>

<template>
	<div class="text-center">
		<v-btn color="secondary" class="ma-2" @click.stop="codeSearchDialog = true">{{ codeSearchButton }}</v-btn>
		<v-dialog max-width="1024px" class="text-center" v-model="codeSearchDialog">
			<v-card>
				<v-toolbar color="primary">
					<v-toolbar-title class="pa-4 ma-2">コード検索ツール</v-toolbar-title>
				</v-toolbar>
				<div  class="ma-4 pa-4">
					<v-form @submit.prevent>
						<v-row>
							<v-text-field label="コード" prepend-icon="mdi-barcode" v-model="searchCode" clearable></v-text-field>
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
					</v-form>
					<hr>
					<!-- v-if 検索結果が出るまで表示しない？ -->
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
							<v-btn color="secondary" @click="sendItem(item);">選択</v-btn>
						</template>
					</v-data-table>
					<!-- 表示コントロール検討 -->
				</div>
				<v-card-actions class="justify-end">
					<v-btn varient="text" @click.stop="codeSearchDialog = !codeSearchDialog">画面を閉じる</v-btn>
				</v-card-actions>
			</v-card>
		</v-dialog>
	</div>
</template>

<script>
export default{
	data(){
		return{
			//dialog control
			codeSearchDialog: false,

			//search prop
			searchCode: "",
			searchType: "",

			//outTable def
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
	props:{
		//btnName
		codeSearchButton: {
			type: String,
			default: "コード検索"
		},

		//intentCode
		intentCode: {
			type: Number,
			default: null
		}
	},
	watch: {
		//intentCodeが変更されたらsearchCodeの値を変更する
		//ここに書いてあるものは変更が監視される
		intentCode: function(newVal) {
			this.searchCode = newVal
		}
	},
	methods:{
		//search Req funcs
		async searchItem(){
			this.results = []
			this.loading = true
			console.log(this.code, this.searchType)

			//データ受け取り
			try{
				const result = await this.getdata(this.searchCode, this.searchType)
				this.results = result.data
			} catch(e) {
				console.error(e)
			}

			this.loading = false
		},
		getdata(code, type){
			try{
				return axios.get(`https://lib-search-gw.ke9000.workers.dev/api/${code}/${type}/`)
			} catch(e) {
				throw new Error("failed to get from api"+ e )
			}
		},

		//item Select - inputForm funcs
		sendItem(item){
			const data = {
				id: item.columns.id,
				code: item.columns.code,
				title: item.columns.title,
				author: item.columns.author,
				date: item.columns.date,
				thumb: item.columns.thumb
			}
			this.$emit('sendItemData', data)

			this.codeSearchDialog = !this.codeSearchDialog;
		},
	}
}
</script>