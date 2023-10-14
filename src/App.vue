<script setup>
import Header from './components/globals/Header.vue'
</script>

<template>
	<v-app>
		<Header></Header>
		<v-main>
			<v-container fluid>
				<router-view></router-view>
			</v-container>
		</v-main>
	</v-app>
</template>

<script>
</script>