<template>
    <div class="row d-flex justify-content-center">
        <div class="col-lg-6 col-md-8 col-sm-12 ">
            <form @submit.prevent="handleSubmit()">
                <div class="card row mt-5 " style="background-color: #EEFFEE;">
                    <div class="card-body">
                        <h1 class="card-title text-secondary ">ลงทะเบียนสมาชิกใหม่</h1>
                        <div class="col-lg-12 mb-3">
                            <div class="form-floating mb-3">
                                <input type="email" class="form-control" id="memEmail"
                                autocomplete="off" required placeholder="Email" v-model.trim="memEmail" >
                                <label for="memEmail">Email</label>
                            </div>
                        </div>
                        <div class="col-lg-12 mb-3">
                            <div class="form-floating mb-3">
                                <input type="text" class="form-control" id="memName"  
                                autocomplete="off" required placeholder="ชื่อ" v-model="memName">
                                <label for="memName">ชื่อ</label>
                            </div>
                        </div>
                        <div class="col-lg-12 mb-3">
                            <div class="form-floating mb-3">
                                <input type="password" class="form-control" id="password"  
                                autocomplete="off" required placeholder="Password"
                          v-model="password">
                                <label for="password">Password</label>
                            </div>
                        </div>
                        <div class="col-sm-12">
                            <button class="btn btn-primary float-end" type="submit" >
                            <i class="bi bi-check-lg"></i>&nbsp;ตกลง</button>
                        </div>
                    </div>
                </div>
            </form>
            <!-- ส่วนแสดงสถานะ จากการตอบกลับของ Backend -->
            <p v-if="regist==true" class="alert alert-success mt-3">ลงทะเบียนสำเร็จ</p>
            <p v-else-if="regist==false" class="alert alert-danger mt-3">ลงทะเบียนผิดพลาด {{backendmessage}}</p>
        </div>
    </div>
</template>

<script>
import axios from 'axios'
export default {
    name:'TheRegister',
    data(){
        return{
            memEmail:null,
            memName:null,
            password:null,
            regist:null, //อ่านค่าว่าลงทะเบียนสำเร็จหรือไม่
            backendmessage:null //อ่านข้อความที่ส่งมาจาก Backend
        }
    },
    methods:{
        async handleSubmit(){
            let members={
                memEmail:this.memEmail,
                memName:this.memName,
                password:this.password
            }
            try{
                const response = await axios.post(`http://localhost:3000/members`,members)
                this.regist=response.data.regist
                this.backendmessage=response.data.message
            }
            catch(err){
                console.log(err)
            }
        }
    }
}
</script>

<style>

</style>