<script setup>
import JAN from '../JANReader.vue';
</script>

<template>
	<v-form>
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
					<JAN></JAN>
					<v-btn color="secondary" class="ma-2">JAN・ISBN・ISDN検索</v-btn>
				</v-row>
			</v-col>
		</v-row>

		<v-text-field label="タイトル" prepend-icon="mdi-format-title" clearable required></v-text-field>
		<v-text-field label="作者・著者" prepend-icon="mdi-account" clearable></v-text-field>
		<v-text-field label="JAN・ISBN・ISDN" prepend-icon="mdi-barcode" clearable></v-text-field>
		<v-text-field label="購入場所・イベント" prepend-icon="mdi-store" clearable></v-text-field>
		<v-text-field label="保管場所" prepend-icon="mdi-library-shelves" clearable required></v-text-field>
		<v-textarea label="備考" prepend-icon="mdi-comment" counter></v-textarea>
		<v-file-input label="サムネイル" prepend-icon="mdi-image"></v-file-input>
		
		<v-row>
			<v-col>
				<v-btn type="submit" block color="primary" class="ma-2">登録</v-btn>
			</v-col>
			<v-col>
				<v-btn type="submit" block color="info" class="ma-2">連続登録</v-btn>
			</v-col>
		</v-row>
	</v-form>
</template>

<script>

</script>