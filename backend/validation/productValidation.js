import pool from "../db/db.js";

export  function isNumber(number) {
    if (
        number === undefined ||
        number === null ||
        number === "" ||
        Number.isNaN(Number(number))
    ) {
        throw new Error("Expected a number");
    }
}

export async function isUnique(name) {
    const check_name = await pool.query(
        `
        SELECT product_name FROM products
        WHERE product_name = $1
        `,
        [name]
    );

    if (check_name.rows[0]) {
        throw new Error("Product already exists");
    }
}