<template>
    <!-- vue.js form ถ้าไม่กำหนด @submit.prevent จะทำการเปลี่ยนหน้าเมือ submit -->
    <form @submit.prevent="searchProduct()">
        <div class="row">
            <div class="h1 col-md-6 col-sm-12text-danger">ผลิตภันฑ์ของเรา</div>
            <div class="col-md-4 col-sm-6">
                <input type="text" class="form-control" v-model="stext">
            </div>
            <div class="col">
                <button class="btn btn-primary" type="submit" @click="searchProduct()">ค้นหา</button>
            </div>
        </div>
    </form>
    <!-- ส่วนแสดงผล -->
    <div class="row">
        <div v-for="(pd, pdId) in products" :key="pdId" class="col-lg-4 col-md-6 col-sm-12">
            <div class="card mt-3" style="width: 18rem;background-color: #EEEEEE;">
                <img :src="`http://localhost:3000/img_pd/${pd.pdId}.jpg`" class="card-img-top p-2" alt="">
                <div class="card-body">
                    <h5 class="card-title">{{ pd.pdName }}</h5>
                    <p class="card-text">{{ pd.brand.brandName }} - {{ pd.pdPrice }}</p>
                    <!-- <a href="#" class="btn btn-primary">Go somewhere</a> -->
                    <!-- กำหนด router-link แสดง Component ProductShow -->
                    <!-- จะมีการส่งParameter ไปกับ router-link ด้วยจะต้องใช้ :to และกำหนด params -->
                    <!-- และส่งเป็นลักษณะชุดข้อมูล key:value -->
                    <!-- สามารถส่ง parameter ได้หลายตัวโดยระบุเป็นชุดข้อมูลซ้่อนเข้าไปได้ -->
                    <router-link :to="{name:'ProductShow',params:{pdId:pd.pdId} }"
                        style="text-decoration: none;">
                        <div  class="btn btn-primary">ดูรายละเอียด</div>
                    </router-link>                    
                </div>

            </div>
        </div>
    </div>
</template>
<script>
import axios from 'axios'
export default {
    name: 'PageProduct',
    data() {
        return {
            products: [],
            // เพิ่มตัวแปรเพื่อติดต่อระหว่าง Form กับ methods กำหนดค่าเริ่มต้นเป็นค่าว่าง
            stext: ''
        }
    },
    // lifecycle hook -->แทรก-ตรวจสอบ-การทำงานของ Component
    // mounted --> เชื่อมต่อ --> ตัว Component เริ่มทำงาน
    mounted() {
        axios.get(`http://localhost:3000/products/ten`)
            .then(res => {
                this.products = res.data
            })
            .catch(err => console.log(err.message)) //ถ้าผิดพลาดแสดง err
    },
    // สร้าง method ของ Component เพื่อรองรับการทำงาน
    // สร้างได้หลาย methods รวมอยู่ในนี้
    methods: {
        // สร้าง method สำหรับรับการ search จาก Form
        // อ้างอิงตัวแปรใน Component ต้องมี this นำหน้าตัวแปร --> this.stext
        searchProduct() {
            axios.get(`http://localhost:3000/products/search/${this.stext}`)
                .then(res => {
                    this.products = res.data
                })
                .catch(err => console.log(err.message)) //ถ้าผิดพลาดแสดง err
        }
    }
}
</script>

<style>
</style>