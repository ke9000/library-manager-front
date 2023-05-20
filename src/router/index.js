import {createRouter, createWebHistory} from "vue-router"
import Index from "../components/Index.vue"
import Create from "../components/pages/Create.vue"
import Detail from "../components/pages/Detail.vue"
import List from "../components/pages/List.vue"
import Search from "../components/pages/Search.vue"

const routes = [
	{
		path: "/",
		name: "Index",
		component: Index,
	},
	{
		path: "/create",
		name: "Create",
		component: Create,
	},
	{
		path: "/detail",
		name: "Detai;",
		component: Detail,
	},
	{
		path: "/list",
		name: "List",
		component: List,
	},	{
		path: "/search",
		name: "Search",
		component: Search,
	},
];

const router = createRouter({
	history: createWebHistory(),
	routes,
});

export default router
