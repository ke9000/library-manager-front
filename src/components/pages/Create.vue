<script setup>
import JAN from '../modules/sub/JANReader.vue';
import codeSearch from '../modules/sub/codeSearch.vue';
</script>

<template>
	<v-form @submit.prevent>
		<v-row>
			<!-- form-obj-1 -->
			<v-col>
				<v-radio-group label="種別" inline>
					<v-radio label="CD" value="1"></v-radio>
					<v-radio label="本(一般)" value="2"></v-radio>
					<v-radio label="本(同人)" value="3"></v-radio>
					<v-radio label="その他" value="4"></v-radio>
				</v-radio-group>
			</v-col>
		
			<!-- input-tools -->
			<v-col align-self="center">
				<v-row justify="end">
					<JAN @select-data="setdata"></JAN>
					<codeSearch @select-data="setdata"></codeSearch>
				</v-row>
			</v-col>
		</v-row>

		<v-text-field label="タイトル" prepend-icon="mdi-format-title" v-model="title" clearable required></v-text-field>
		<v-text-field label="作者・著者" prepend-icon="mdi-account" v-model="author" clearable></v-text-field>
		<v-text-field label="JAN・ISBN・ISDN" prepend-icon="mdi-barcode" v-model="code" clearable></v-text-field>
		<v-text-field label="購入場所・イベント" prepend-icon="mdi-store" v-model="place" clearable></v-text-field>
		<v-text-field label="保管場所" prepend-icon="mdi-library-shelves" v-model="storage" clearable required></v-text-field>
		<v-textarea label="備考" prepend-icon="mdi-comment" v-model="other" counter></v-textarea>
		<v-row align-self="center">
			<v-col cols="8">
				<v-text-field label="サムネイルURL(自動入力)" prepend-icon="mdi-image" v-on:change="getPic" readonly v-bind:model-value="imgURL"></v-text-field>
			</v-col>
			<v-col cols="4">
				<!-- ファイル受け取り用・非表示 -->
				<input style="display: none" ref="input" type="file" accept="image/jpeg, image/jpg, image/png" @change="selectedFile()">
				<v-row>
					<v-col>
						<v-btn block color="success" class="py-7" prepend-icon="mdi-camera" @click="btnclick">選択</v-btn>

					</v-col>
					<v-col>
						<v-btn block color="secondary" class="py-7" @click="clearURL">クリア</v-btn>
					</v-col>
				</v-row>
				<v-row>

				</v-row>
			</v-col>
		</v-row>
		<v-row>
			<div v-if="base64text.length >= 2" class="text-center">
				<img v-bind:src="base64text" style="width: 50%;">
			</div>
		</v-row>
		<v-row >
			<v-col>
				<v-btn type="submit" block color="primary" class="ma-2">登録</v-btn>
			</v-col>
			<v-col >
				<v-btn type="submit" block color="info" class="ma-2">連続登録</v-btn>
			</v-col>
		</v-row>
	</v-form>
</template>

<script>


export default {
	data(){
		return {
			//field
			title: "",
			author: "",
			code: "",
			place: "",
			storage: "",
			imgURL: "",


			thumbnail_url: "",
			isSelecting: false,
			base64text: ""
		};
	},
	components:{
		codeSearch
	},
	methods:{
		getPic: function(e){
			console.log(e.target.files[0]);
		},
		btnclick: function(){
			this.$refs.input.click();
		},
		async selectedFile(){
			this.isUploading = true
			const file = this.$refs.input.files[0]
			if(file){
				console.log(file)
				console.log(file.name)
				this.displaytext = file.name
				//画像→URL化、imgurでもいいか

				const reader = new FileReader()
				reader.readAsDataURL(file)
				reader.onload = (event) => {
					this.base64text = event.currentTarget.result

					console.log(this.base64text)
					//this.displaytext = base64text
				}
			} else {
				return;
			}
		},
		clearURL(){
			this.imgURL = ""
		},
		setdata(data){
			alert(data.title)
			console.log(data)
			this.title = data.title
			this.author = data.author
			this.code = data.code
			this.other = data.date
			this.imgURL=data.thumb
		}
	}
}
</script>