<template>
    <div v-if="cartId != null" >
        <button  class="btn btn-success text-white" @click="$router.push(`/cartshow/${cartId}`)">
            {{cartId}} [{{ qty }}] - {{ money }}฿
        </button>
    </div>
</template>
<script>
import axios from 'axios';
axios.defaults.withCredentials = true
import { EventBus } from "../event-bus"
export default {
    name: "CartInfo",
    data() {
        return {
            cartId: null,
            qty: 0,
            money: 0,
            id:null
        }
    },
    async mounted() {
        //เริ่มใช้ Component ก็ให้ส่งสัญญานให้แสดงผล
        EventBus.on('cartdtlOK', (data) => {
            this.sumCart(data.id)
        })
        // ถ้า Logout ก็ส่งสํญญานให้เอาข้อมูลออก
        EventBus.on('memlogout', () => {
            this.clearCart()
        })
    },
    methods: {
        async sumCart(cid) {
            console.log(`sumCart${cid}`)
            await axios.get(`http://localhost:3000/carts/sumcart/${cid}`)
                .then(res => {
                    console.log("SumCart" + res.data)
                    this.cartId = res.data.id
                    this.qty = res.data.qty
                    this.money = res.data.money
                })
                .catch(err => {
                    console.error(err);
                });
        },
        clearCart()
        {
            console.log('Clear Cart')
            this.cartId = null
            this.qty = 0
            this.money = 0
        }
    }
}
</script>
<style></style>