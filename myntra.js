const express = require("express");
const router = express.Router();
const conn = require("./database");

//GET ALL USERS
// const getAllUser = async (req, res) => {
//   try {
//     const { limit, offset, sort } = req.query;
//     if (!req.query) {
//       res.status(400).send({
//         message: "bad request",
//       });
//     }
//     let queryString = `SELECT id,name,email,is_active,password from users order by id ${sort} LIMIT ? OFFSET ? `;
//     const [result] = await conn.promise().execute(queryString, [limit, offset]);

//     let countQueryString = `SELECT count(id) as count from users `;
//     const [countResult] = await conn.promise().execute(countQueryString);

//     const responseBody = {
//       message: "Successfully got all users",
//       list: result,
//       count: countResult[0].count,
//     };
//     res.status(200).send(responseBody);
//     // console.log(result);
//   } catch (error) {
//     console.log(error);
//     res.status(500).send({
//       message: "Error while getting user",
//       error,
//     });
//   }
// };

//GET USER
const getUserById = async (req, res) => {
  try {
    const { id } = req.params;
    // console.log(req.params);
    if (!req.params) {
      res.status(400).send({
        message: "bad request",
      });
    }
    let queryString = `SELECT name,email from users where user_id = ?`;
    const [result] = await conn.promise().execute(queryString, [id]);

    if (result.length === 0) {
      res.status(404).send({
        message: "User not found",
      });
    }
    res.status(200).send({
      message: "Successfully retrieved user",
      result,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      message: "Error while getting user",
      error,
    });
  }
};

//GET PRODUCTS
const getAllProducts = async (req, res) => {
  try {
    const { start_price, end_price, type, limit, offset, sort, sortType } =
      req.query;
    // console.log(req.query);
    if (!req.query) {
      res.status(400).send({
        message: "bad request",
      });
    }

    let whereArray = [];
    let whereData = [];
    let sortArray = [];

    if (start_price && end_price) {
      whereArray.push("price between ? and ?");
      whereData.push(start_price);
      whereData.push(end_price);
    }

    if (type) {
      whereArray.push("type = ?");
      whereData.push(type);
    }

    if (sort && sortType) {
      sortArray.push(sortType);
    }

    // console.log(sortArray);
    let sortString = "";
    if (sortArray.length) {
      sortString = `ORDER BY ${sortArray} ${sort}`;
    }

    let whereString = "";
    if (whereArray.length) {
      whereString = `WHERE ${whereArray.join(" and ")}`;
    }
    // console.log(whereString);
    // console.log(sortString);
    let queryString = `SELECT product_id,name,description,image,rating,price,is_active,type from products
       ${whereString} ${sortString} limit ? offset ?`;
    // console.log(queryString);
    const [result] = await conn
      .promise()
      .execute(queryString, [...whereData, limit, offset]);

    let countQueryString = `SELECT count(product_id) as count from products `;
    const [countResult] = await conn.promise().execute(countQueryString);

    const responseBody = {
      message: "Successfully got all users",
      list: result,
      count: countResult[0].count,
    };
    res.status(200).send(responseBody);
    // console.log(result);
  } catch (error) {
    console.log(error);
    res.status(500).send({
      message: "Error while getting user",
      error,
    });
  }
};

const getProductById = async (req, res) => {
  try {
    const { id } = req.params;
    // console.log(req.params);
    if (!id) {
      res.status(400).send({
        message: "bad request",
      });
    }
    let queryString = `
      SELECT B.product_id as productId,
      B.name as productName,
      B.description as description,
      B.image as image,
      B.rating as rating,B.price as price,
      B.type as type,
      C.name as sizeName from product_size as A
      INNER JOIN products as B on B.product_id = A.product_id
      INNER JOIN sizes as C on C.size_id = A.size_id WHERE B.product_id =?`;
    const [result] = await conn.promise().execute(queryString, [id]);

    if (result.length === 0) {
      res.status(404).send({
        message: "Product not found",
      });
    }
    res.status(200).send({
      message: "Successfully retrieved product",
      result,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      message: "Error while getting product",
      error,
    });
  }
};

//WISHLIST
const getWishlist = async (req, res) => {
  try {
    const { user_id } = req.headers;
    if (!user_id) {
      res.status(400).send({
        message: "bad request",
      });
    }
    let queryString = `select C.user_id,C.name,B.name, B.description ,
       B.image,B.price, B.rating,A.quantity,
       A.is_active from wishlist as A
      inner join products as B on B.product_id = A.product_id
      inner join users as C on C.user_id = A.user_id where C.user_id = ?`;
    const [result] = await conn.promise().execute(queryString, [user_id]);

    if (result.length === 0) {
      res.status(404).send({
        message: "Nothing in a wishlist",
      });
    }
    let countQueryString = `select count(C.user_id) as count from wishlist as A
      inner join products as B on B.product_id = A.product_id
      inner join users as C on C.user_id = A.user_id where C.user_id = ?`;
    const [countResult] = await conn
      .promise()
      .execute(countQueryString, [user_id]);

    const responseBody = {
      message: "Succefully got wishlist",
      list: result,
      count: countResult[0].count,
    };
    res.status(200).send(responseBody);
  } catch (error) {
    console.log(error);
    res.status(500).send({
      message: "Error while getting wishlist",
      error,
    });
  }
};

//add wishlist
const addWishlist = async (req, res) => {
  try {
    const { user_id, product_id, is_active, quantity } = req.body;
    if (!user_id && !product_id && !is_active && !quantity) {
      res.status(400).send({
        message: "bad request",
      });
    }

    let queryString = `insert into wishlist
      (user_id,product_id,is_active,quantity)
       values (?, ?, ?, ?)`;
    const [result] = await conn
      .promise()
      .execute(queryString, [user_id, product_id, is_active, quantity]);

    res.status(201).send({
      message: "wishlist created successfully",
      result,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      message: "Error while creating wishlist",
      error,
    });
  }
};

//update wishlist
const updateWishlist = async (req, res) => {
  try {
    const { quantity } = req.body;
    const { user_id } = req.headers;

    if (!user_id) {
      res.status(400).send({
        message: "bad request",
      });
    }
    if (!quantity) {
      res.status(400).send({
        message: "Bad request",
      });
    }

    let queryString = `update wishlist
      set quantity = ?
      where user_id = ?`;
    const [result] = await conn
      .promise()
      .execute(queryString, [quantity, user_id]);

    if (result.affectedRows === 0) {
      res.status(400).send({
        message: "Nothing to update in a wishlist",
      });
    }
    let countQueryString = `select count(C.user_id) as count from wishlist as A
      inner join products as B on B.product_id = A.product_id
      inner join users as C on C.user_id = A.user_id where C.user_id = ?`;
    const [countResult] = await conn
      .promise()
      .execute(countQueryString, [user_id]);

    const responseBody = {
      message: "Wishlist updated successfully",
      list: result,
      count: countResult[0].count,
    };
    res.status(200).send(responseBody);
  } catch (error) {
    console.log(error);
    res.status(500).send({
      message: "Error while updating wishlist",
      error,
    });
  }
};

// delete wishlist
const deleteWishlist = async (req, res) => {
  try {
    const { is_active } = req.body;
    const { user_id } = req.headers;

    if (!user_id) {
      res.status(400).send({
        message: "bad request",
      });
    }

    if (is_active !== 0) {
      res.status(400).send({
        message: "Bad request",
      });
    }

    let queryString = `update wishlist
      set is_active = ?
      where user_id = ?`;
    const [result] = await conn
      .promise()
      .execute(queryString, [is_active, user_id]);

    if (result.length === 0) {
      res.status(400).send({
        message: "Nothing in a wishlist",
      });
    }
    let countQueryString = `select count(C.user_id) as count from wishlist as A
      inner join products as B on B.product_id = A.product_id
      inner join users as C on C.user_id = A.user_id where C.user_id = ?`;
    const [countResult] = await conn
      .promise()
      .execute(countQueryString, [user_id]);

    const responseBody = {
      message: "Wishlist deleted successfully",
      list: result,
      count: countResult[0].count,
    };
    res.status(200).send(responseBody);
  } catch (error) {
    console.log(error);
    res.status(500).send({
      message: "Error while deleting wishlist",
      error,
    });
  }
};

//user routes
// app.get("/v1/users", getAllUser);
router.get("/users/:id", getUserById);

//Products routes
router.get("/products", getAllProducts);
router.get("/products/:id", getProductById);

//Wishlist routes
router.get("/wishlist", getWishlist);
router.post("/wishlist", addWishlist);
router.delete("/wishlist/:id", deleteWishlist);
router.put("/wishlist/:id", updateWishlist);

module.exports = router;
