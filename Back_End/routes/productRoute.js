import express from "express"
import * as productC from "../controllers/productController.js"

const router = express.Router()

router.get('/products',productC.getAllProduct)
router.get('/products/ten',productC.getTenProduct)
router.get('/products/:id',productC.getProductById)
router.get('/products/search/:id',productC.getSearchProduct)
router.get('/products/brands/:id',productC.getProductByBrandId)
router.post('/products',productC.postProduct)
router.put('/products/:id',productC.putProduct)
router.delete('/products/:id',productC.deleteProduct)
export default router