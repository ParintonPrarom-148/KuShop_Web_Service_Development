<template>
    <div v-for="(pd, pdId) in products" :key="pdId" class="mt-5">
        <div class="row ">
            <div class="col-md-6 col-sm-12 ">
                <div class="card mx-auto mb-3" style="width: 18rem">
                    <img :src="`http://localhost:3000/img_pd/${pd.pdId}.jpg`" alt="" class="rounded shadow-sm">
                </div>
            </div>
            <div class="col-md-6 col-sm-12 ">
                <table class="table">
                    <tbody>
                        <tr class="table-secondary">
                            <td>
                                <h4>{{ pd.pdId }}</h4>
                            </td>
                            <td>
                                <h4>{{ pd.pdName }}</h4>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <h5>ราคา</h5>
                            </td>
                            <td>
                                <h5>{{ pd.pdPrice }}</h5>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <h5>ยี่ห้อ</h5>
                            </td>
                            <td>
                                <h5>{{ pd.brand.brandName }}</h5>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <h5>รายละเอียด</h5>
                            </td>
                            <td>
                                <h5>{{ pd.pdRemark }}</h5>
                            </td>
                        </tr>
                    </tbody>
                </table>
                <!-- สร้างปุ่มเพื่อทำการนำสินค้าลงตะกร้า เรียก function chkLogin -->
                <button class="btn btn-primary" @click="chkLogin()">
                    <i class="bi bi-cart lead"></i> ใส่ตะกร้า&nbsp;
                </button>
                <button class="btn btn-warning float-end"><i class="bi bi-pencil-fill lead"></i>
                    แก้ไข&nbsp;&nbsp;</button>
            </div>
        </div>
    </div>
</template>
<script>
import axios from 'axios'
import { EventBus } from "../event-bus"
import Cookies from 'js-cookie' //imporo js-cookie มาใช้งาน
import { jwtDecode } from 'jwt-decode'; //ใช้แทน jsonwebtoken เพราะ jsonwebtoken ไม่เข้ากับ Vue.js

axios.defaults.withCredentials = true
export default {
    name: 'ProductShow',
    data() {
        return {
            token: "",
            decodedToken: null, //token ที่ถูกแกะแล้ว
            memEmail: null,
            cartId: null,//เพื่อตรวจสอบตะกร้า	
            products: [],//array เก็บข้อมูลสินค่า
            id: null, // รหัสสินค้าที่ส่งมา
        }
    },

    mounted() {
        // อ่านค่าจะ parameter ที่ส่งมาจาก routes
        this.id = this.$route.params.pdId
        // ระบุ id ของสินค้าที่ต้องการ
        // ระบุ Request ไปที่ Backend ตามที่ Backend กำหนด
        axios.get(`http://localhost:3000/products/${this.id}`)
            .then(res => {
                this.products = res.data;
            })
            .catch(err => {
                console.error(err);
            });
    },
    methods: {
        
    async chkLogin() {
        console.log('chkLogin')
        await this.getCookie() //ตรวจสอบว่า Login แล้วหรือยัง
        if (this.memEmail == null) {
            alert("ต้อง Login เข้าระบบก่อน")
            console.warn("ยังไม่ได้ login ")
            return false //ถ้ายังไม่ Login บอกให้ Login
        }
        console.log("login แล้ว")
        await this.chkCart() // ถ้า Login แล้วให้ตรวจสอบว่ามี Cart หรือยัง
        if(this.cartId == null)
            {              
                 await this.addCart() // ถ้ายังไม่มีให้สร้างตะกร้า
            }
            this.addCartDtl() // ถ้ามีตะกร้าแล้วให้เอาสินค้าใส่ตะกร้า
    },
    async getCookie() {
        try {
            this.token = await Cookies.get('token'); //อ่านค่าจาก Cookies ที่ชื่อ token แล้วเอาใส่ตัวแปร token
            // jwt-decode ไม่ใช้ secretkey แกะแต่ส่วน payload - ฝั่งBackend ที่ต้องการความเชื่อถือได้
            this.decodedToken = jwtDecode(this.token)
            this.memEmail = this.decodedToken.memEmail
        } catch (err) {
            console.error(`fail decode token ${err}`)
        }
    },
    async chkCart()
        {
            console.log('chkCart')
            let members={ // กำหนดค่า
                memEmail:this.memEmail
                }
            try { // Request POST Method
                    const response = await axios.post(`http://localhost:3000/carts/chkcart`,members)
                    this.cartId=response.data.cartId  
                    console.log( this.cartId)            
            }
            catch(err){console.log(err)}                
        },
        async addCart()
        {
            console.log("addCard")
            let customer={ //1.สร้างชุดข้อมูลส่งไปให้ Backend POST
                cusId:this.memEmail
            }
            try{ //2.ส่ง Method Request POST
                const response =await axios.post(
                `http://localhost:3000/carts/addcart`,customer
                )
                // 3.รับค่า Response จาก Backend เพื่ีอแสดงผล
                this.backendMessage = response.data.messageAddCart;
                this.cartId=response.data.messageAddCart
                console.log( response.data)
            }
            catch(err){
                console.log(err)
            }
        },
        async addCartDtl()
        {
            
            console.log("addCartDtl")
            let cartdtl={ //1.สร้างชุดข้อมูลส่งไปให้ Backend POST
                cartId:this.cartId,
                pdId:this.id,
                pdPrice:this.products[0].pdPrice
            }
            try{ //2.ส่ง Method Request POST
            const response =await axios.post(
            `http://localhost:3000/carts/addcartdtl`,cartdtl
            )
            // ส่งสัญญานหลังติดต่อ Backend
            EventBus.emit('cartdtlOK',{id:this.cartId}) //***ตรงนี้ที่ Error ตอนบรรยาย
            // 3.รับค่า Response จาก Backend เพื่ีอแสดงผล
            this.backendMessage = response.data.messageAddCartDtl;
            console.log( response.data)
        }
        catch(err){
            console.log(err)
        }

        }

    },


}
</script>
<style></style>