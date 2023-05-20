<script setup>
import Header from './components/Header.vue'
</script>

<template>
	<v-app>
		<Header></Header>
		<v-main>
			<router-view></router-view>
		</v-main>
	</v-app>
</template>
