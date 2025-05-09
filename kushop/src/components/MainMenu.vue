<template>
    <nav class="navbar navbar-expand-lg bg-body-tertiary">
        <div class="container-fluid">
            <a class="navbar-brand" href="#">Kushop</a>
            <button class="navbar-toggler" type="button" data-bs-toggle="collapse" 
data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation"> <span class="navbar-toggler-icon"></span>
            </button>
            <div class="collapse navbar-collapse" id="navbarNav">
                <ul class="navbar-nav">
                    <li class="nav-item">
                        <router-link to="/" style="text-decoration: none;">
                            <div class="nav-link">Home</div>
                        </router-link>
                    </li>
                    <li class="nav-item "  v-if="decodedToken!=null" >
                        <router-link to="/pagemember" style="text-decoration: none;">
                        <div class="nav-link fw-bold">{{ memName }}</div>
                        </router-link>
                    </li>
                     <li class="nav-item " v-if="decodedToken==null ">
                        <router-link to="/login" style="text-decoration: none;">
                            <div class="nav-link">Login</div>
                        </router-link>
                    </li>   
                    <li class="nav-item ">
                        <router-link to="/cartlist" style="text-decoration: none;">
                            <div class="nav-link fw-bold">Cart</div>
                        </router-link>
                    </li>
                </ul>
                <ul class="navbar-nav ms-auto" v-if="decodedToken!=null ">
                    <li class="nav-item  pe-3" >
                    <CartInfo />
                 </li>                    
                    <li class="nav-item" >
                        <a href="#" @click="memLogout()" style="text-decoration:none">
                            <div class="nav-link fw-bold">ลงชื่อออก</div>
                        </a>
                    </li>
                </ul>  
            </div>
        </div>
    </nav>
</template>
<script>
import CartInfo from './CartInfo.vue';
import Cookies from 'js-cookie'
import {jwtDecode} from 'jwt-decode'
import axios from 'axios';
axios.defaults.withCredentials = true
import {EventBus} from "../event-bus"
export default {
    components:{
        CartInfo
    },
    name: 'MainMenu',
    data(){
        return {
            token:"",
            decodedToken:null, //token ที่ถูกแกะแล้ว
            memEmail:null,
            memName:null,
            dutyId:null,
            login:false
        }
    },
    mounted() {
        this.getCookie(); //เมื่อเริ่ม Component ให้เรียก methods getCookie()
        // ให้ดักรอ Event ชื่อ login_ok เมื่อมีสัญญานเกิดขึ้นใน bus ให้ทำงานตามระบุ
        EventBus.on('login_ok',()=>{
            // อ่าน Cookie อีกครั้ง
            this.getCookie()
        })
        // ให้ chkCart เมื่อ mount
        this.chkCart()
    },
    methods:{
        getCookie() {
            try{
                this.token = Cookies.get('token'); 
                this.decodedToken = jwtDecode(this.token)
                console.log(`MainMenu-->${this.decodedToken}`)
                this.memEmail=this.decodedToken.memEmail
                this.memName=this.decodedToken.memName
                this.dutyId=this.decodedToken.dutyId
            }catch(err){
                console.error(`fail decode token ${err}`)
                // ถ้าอ่าน Cookie ไม่ได้ให้กำหนด decodedToken เพื่อการแสดงผล
                this.decodedToken=null
            }
        },
        async memLogout(){
            const cf = window.confirm('ต้องการออกจากระบบ?')
            if (cf){
                try {
                  const response = await axios.get(`http://localhost:3000/members/logout`)
                    this.login = response.data.login //อ่านค่าที่ส่งกลับมาจาก backend
                    // ถ้า login = false
                      // ถ้า login = false
                      if (!this.login) {
                        EventBus.emit('memlogout')
                        this.getCookie() //ให้อ่าน Cookie ใหม่ - เพิ่อให้แน่ใจ                    
                        this.$router.push('/') //ย้ายหน้าไปหน้า Home
                    }

                }
                catch (err) {
                    console.log(err)
                }
            }
        },
        async chkCart()
        { //เมื่อ Login สำเร็จให้ตรวจสอบว่ามีตะกร้าค้างอยู่หรือเปล่า
            console.log('chkCart')
            let members={ // กำหนดค่า
                memEmail:this.memEmail
                }
            try { // Request POST Method
                    const response = await axios.post(`http://localhost:3000/carts/chkcart`,members)
                    let cartId=response.data.cartId  
                    // ส่งสัญญานหลังติดต่อ Backend
                    EventBus.emit('cartdtlOK',{id:cartId})
                    console.log( "---"+cartId)            
            }
            catch(err){console.log(err)}                
        }

    }
}
</script>

<style></style>
