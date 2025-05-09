import database from "../service/database.js"

export async function getProductByBrandId(req, res) {
    console.log(`GET /product${req.params.id} request`)
    try {
        const result = await database.query({
            text: `SELECT p.*,(
					SELECT row_to_json(pdt_obj)
					FROM
					(
						SELECT "pdTypeId","pdTypeName"
						FROM "pdTypes" 
						WHERE "pdTypeId" = p."pdTypeId"
						)pdt_obj
						)AS pdt
FROM products p
WHERE p."brandId" ILIKE $1`,
            values: [req.params.id]
        })
        if (result.rowCount == 0) {
            return res.status(404).json({ error: `Product not found` })
        }
        return res.status(200).json(result.row)
    }
    catch (err) {
        return res.status(500).json({
            error: err.message
        })
    }
}

export async function deleteProduct(req, res) {
    console.log(`DELETE /products ${req.params.id} is requested!!`)
    try {
        const result = await database.query({
            text: `
            DELETE FROM "products"
            WHERE "pdId"=$1;
            `,
            values: [

                req.params.id
            ]
        })
        if (result.rowCount == 0)
            return res.status(404).json({ error: `id not found` })
        res.status(204).end()
    }
    catch (err) {
        return res.status(500).json({ error: err.message })
    }
}


export async function putProduct(req, res) {
    console.log(`PUT /products ${req.params.id} is requested!!`)
    try {
        const result = await database.query({
            text: `
            UPDATE "products"
            SET "pdName"=$1,
                "pdPrice"=$2,
                "pdRemark"=$3,
                "pdTypeId"=$4,
                "brandId"=$5
            WHERE "pdId"=$6;
            `,
            values: [
                req.body.pdName,
                req.body.pdPrice,
                req.body.pdRemark,
                req.body.pdTypeId,
                req.body.brandId,
                req.params.id
            ]
        })
        if (result.rowCount == 0)
            return res.status(404).json({ error: `id not found` })
        const bodyData = req.body
        const datetime = new Date()
        bodyData.updateDate = datetime
        res.status(201).json(bodyData)
    }
    catch (err) {
        return res.status(500).json({ error: err.message })
    }
}

export async function getProductById(req, res) {
    console.log(`GET /product${req.params.id} request`)
    try {
        const result = await database.query({
            text: `SELECT p.*,(
					SELECT row_to_json(brand_obj)
					FROM
					(
						SELECT "brandId","brandName"
						FROM brands 
						WHERE "brandId" = p."brandId"
						)brand_obj
						)AS brand,
						(
							SELECT row_to_json(pdt_obj)
							FROM
							(
								SELECT "pdTypeId","pdTypeName" 
								FROM "pdTypes"
								WHERE "pdTypeId" = p."pdTypeId"
								)pdt_obj
						)AS pdt
FROM products p
WHERE p."pdId" = $1`,
            values: [req.params.id]
        })
        return res.status(200).json(result.rows)
    }
    catch (err) {
        return res.status(500).json({
            error: err.message
        })
    }
}
export async function getSearchProduct(req, res) {
    console.log(`GET /searchProduct id=${req.params.id} is requested`)
    try {
        const result = await database.query({
            text: `SELECT p.*,(
					SELECT row_to_json(brand_obj)
					FROM
					(
						SELECT "brandId","brandName"
						FROM brands 
						WHERE "brandId" = p."brandId"
						)brand_obj
						)AS brand,
						(
							SELECT row_to_json(pdt_obj)
							FROM
							(
								SELECT "pdTypeId","pdTypeName" 
								FROM "pdTypes"
								WHERE "pdTypeId" = p."pdTypeId"
								)pdt_obj
						)AS pdt
                        FROM products p
                        WHERE (
                        p."pdId" ILIKE $1 
                        OR p."pdName"ILIKE $1
                        OR p."pdRemark" ILIKE $1
                        )
                        `,
            values: [`%${req.params.id}%`]
        })
        return res.status(200).json(result.rows)
    }
    catch (err) {
        return res.status(500).json({
            error: err.message
        })
    }
}

export async function getAllProduct(req, res) {
    console.log(`GET /product request`)
    try {
        const result = await database.query(`SELECT p.*,(
					SELECT row_to_json(brand_obj)
					FROM
					(
						SELECT "brandId","brandName"
						FROM brands 
						WHERE "brandId" = p."brandId"
						)brand_obj
						)AS brand,
						(
							SELECT row_to_json(pdt_obj)
							FROM
							(
								SELECT "pdTypeId","pdTypeName" 
								FROM "pdTypes"
								WHERE "pdTypeId" = p."pdTypeId"
								)pdt_obj
						)AS pdt
FROM products p`)
        return res.status(200).json(result.rows)
    }
    catch (err) {
        return res.status(500).json({
            error: err.message
        })
    }
}
export async function getTenProduct(req, res) {
    console.log(`GET /ten product request`)
    try {
        const result = await database.query(`SELECT p.*,(
					SELECT row_to_json(brand_obj)
					FROM
					(
						SELECT "brandId","brandName"
						FROM brands 
						WHERE "brandId" = p."brandId"
						)brand_obj
						)AS brand,
						(
							SELECT row_to_json(pdt_obj)
							FROM
							(
								SELECT "pdTypeId","pdTypeName" 
								FROM "pdTypes"
								WHERE "pdTypeId" = p."pdTypeId"
								)pdt_obj
						)AS pdt
FROM products p LIMIT 3`)
        return res.status(200).json(result.rows)
    }
    catch (err) {
        return res.status(500).json({
            error: err.message
        })
    }
}
export async function postProduct(req, res) {
    console.log(`POST /products is requested`)
    const bodyData = req.body
    try {
        if (req.body.pdId == null || req.body.pdName == null) {
            return res.status(422).json({ error: 'pdid and pdName is required' })
        }
        const existsResult = await database.query({
            text: `SELECT EXISTS (SELECT * FROM products WHERE "pdId" = $1)`,
            values: [req.body.pdId]
        })
        if (existsResult.rows[0].exists) {
            return res.status(409).json({ error: `pdId ${req.body.pdId} is Exists!!` })
        }
        const result = await database.query({
            text: `INSERT INTO products ("pdId", "pdName", "pdPrice", "pdTypeId", "brandId") 
        VALUES ($1, $2, $3, $4, $5)`,
            values: [
                req.body.pdId,
                req.body.pdName,
                req.body.pdPrice,
                req.body.pdTypeId,
                req.body.brandId,
            ]
        })

        const datetime = new Date()
        bodyData.createDate = datetime
        res.status(201).json(bodyData)
    }
    catch (err) {
        return res.status(500).json({ error: err.message })
    }
}

