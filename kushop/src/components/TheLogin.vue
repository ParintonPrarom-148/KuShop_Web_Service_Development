<template>
  <div class="row mt-5">
    <div class="col-sm-12 col-md-6 col-lg-6 mb-5">
      <img src="../assets/LogoSRC.png" alt="" width="80%">
    </div>
    <div class="col-sm-12 col-md-6 col-lg-6 mb3">
      <!-- เมื่อสั่ง Submit ให้เรียก Function handleSubmit -->
      <form @submit.prevent="handleSubmit()">
        <div class="col-sm-12 col-md-10 col-lg-8">
          <div class="form-floating mb-3">
            <input class="form-control" type="email" id="loginname" v-model="loginname" autocomplete="off" required
              autofocus placeholder="loginname">
            <label for="loginname">Loginname</label>
          </div>
        </div>
        <div class="col-sm-12  col-md-10 col-lg-8">
          <div class="form-floating mb-3">
            <input class="form-control" type="password" id="password" v-model="password" required
              placeholder="Password">
            <label for="password">Password</label>
          </div>
        </div>
        <div class="row">
          <div class="col-sm-12  col-md-6 mb-3">
            <a href="/register" class="btn btn-outline-danger">
              <i class="bi bi-heart-fill"></i>&nbsp;ลงทะเบียนใหม่</a>
          </div>
          <div class="col-sm-12 col-md-6">
            <button class="btn btn-primary " type="submit" style="width: 6rem;">
              <i class="bi bi-check-lg"></i>&nbsp;ตกลง</button>
          </div>
        </div>
      </form>
    </div>
  </div>
  <!-- ส่วนแสดงสถานะ จากการตอบกลับของ Backend -->
  <p v-if="backendMessage == 'success'" class="alert alert-success ">
    เข้าระบบสำเร็จ-{{ backendMessage }}</p>
  <p v-else-if="backendMessage == 'fail'" class="alert alert-danger">
    เข้าระบบผิดพลาด-{{ backendMessage }}</p>
</template>


<script>
import axios from 'axios' //import axios มาใช้งาน
axios.defaults.withCredentials = true
import { EventBus } from "../event-bus" //import event-bus มาใช้งาน
import Cookies from 'js-cookie' //imporo js-cookie มาใช้งาน
import { jwtDecode } from 'jwt-decode'
export default {
  name: 'TheLogin',
  data() {
    return { //กำหนดตัวแปรที่ใช้งานกับ Template และค่าเริ่มต้น
      loginname: null,
      password: null,
      login: null,
      // กำหนดอ่าน Token
      token: null,
      decodedToken: null,
    }
  },
  mounted() {
    this.getCookie(); //เมื่อเริ่ม Component ให้เรียก methods getCookie()
  },
  methods: {
    async handleSubmit() { // Function
      let members = { // กำหนดค่า
        loginname: this.loginname,
        password: this.password
      }
      try { // Request POST Method
        const response = await axios.post(`http://localhost:3000/members/login`, members)
        this.login = response.data.login
        // ย้ายหน้าถ้า login สำเร็จ
        if(this.login)
          {            
            // event bus เมื่อ Login สำเร็จส่งสัญญานชื่อ login_ok วิ่งไปตาม bus
            EventBus.emit('login_ok')
    await this.chkCart()
            this.$router.push('/pagemember')
    
          }

      }
      catch (err) {
        console.log(err)
      }
    },
    getCookie() {
      try {
        this.token = Cookies.get('token');
        this.decodedToken = jwtDecode(this.token)
        if (this.decodedToken != null)
          this.$router.push('/pagemember')
      } catch (err) {
        console.error(`fail decode token ${err}`)
      }
    },
    async chkCart()
        { //เมื่อ Login สำเร็จให้ตรวจสอบว่ามีตะกร้าค้างอยู่หรือเปล่า
            console.log('chkCart')
            let members={ // กำหนดค่า
                memEmail:this.loginname
                }
            try { // Request POST Method
                    const response = await axios.post(`http://localhost:3000/carts/chkcart`,members)
                    let cartId=response.data.cartId  
                    // ส่งสัญญานหลังติดต่อ Backend
                    EventBus.emit('cartdtlOK',{id:cartId})
                    console.log( cartId)            
            }
            catch(err){console.log(err)}                
        }

  }
}
</script>


<style></style>