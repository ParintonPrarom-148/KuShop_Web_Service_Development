import { createRouter,createWebHistory } from "vue-router"
import TheLogin from "@/components/TheLogin.vue"
import TheHome from "@/components/TheHome.vue"
import TheRegister from "@/components/TheRegister.vue"
import PageMember from "@/components/PageMember.vue"
import ProductShow from "../components/ProductShow.vue"
import CartShow from "../components/CartShow.vue"
import CartList from "../components/CartList.vue"

const routes = [
    {
        path:'/',
        name:'Home',
        component:TheHome
    },
    {
        path:'/login',
        name:'Login',
        component:TheLogin
    },
    {
        path:'/register',
        name:'Register',
        component:TheRegister
    },
    {
        path:'/pagemember',
        name:'PageMember',
        component:PageMember
    },
    {
        // กำหนดว่า route นี้รับ parameter ต้องระบุให้ตรงกันด้วย
        path:'/ProductShow/:pdId',
        name:'ProductShow',
        component:ProductShow
    },
    {
        // กำหนดว่า route นี้รับ parameter ต้องระบุให้ตรงกันด้วย
        path:'/cartShow/:cartId',
        name:'CartShow',
        component:CartShow
    },
    {
        path:'/cartList/',
        name:'CartList',
        component:CartList
    }



]
const router = createRouter({
    // history:createWebHistory(process.env.BASE_URL),routes
    history:createWebHistory(import.meta.env.BASE_URL),routes
})
export default router
