<template>
	<v-navigation-drawer app v-model="drawer" clipped >
		<v-container>
			<v-list-item>
				<v-list-item-content>
					<v-list-item-title class="title grey--text text--darken-2">メニュー</v-list-item-title>
				</v-list-item-content>
			</v-list-item>
			<v-divider></v-divider>
		</v-container>
		<v-list>
			<v-list-item title="HOME" to="/"></v-list-item>
			<v-list-item title="アイテム新規登録" to="/create"></v-list-item>
			<v-list-item title="アイテム一覧" to="/list"></v-list-item>
			<v-list-item title="アイテム検索" to="/search"></v-list-item>
		</v-list>
	</v-navigation-drawer>

	<v-app-bar color="primary" dark app>
		<v-app-bar-nav-icon @click="drawer = !drawer"></v-app-bar-nav-icon>
		<v-app-bar-title>本・CD物品管理システム</v-app-bar-title>
	</v-app-bar>
</template>

<script>
export default {
	data() {
		return {
			drawer: true,
		}
	},
};
</script>