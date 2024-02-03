const express = require("express");
const mysql = require("mysql2");
const bodyParser = require("body-parser");

//DB connection
const conn = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "root",
  port: 3306,
  database: "myntradb",
});

conn.connect(function (err) {
  if (err) throw err;
  console.log("Databse connected");
});

const app = express();
app.use(bodyParser.json());

//USERS
//GET ALL USERS
const getAllUser = async (req, res) => {
  try {
    const { limit, offset, sort } = req.query;
    if (!req.query) {
      res.status(400).send({
        message: "bad request",
      });
    }
    let queryString = `SELECT id,name,email,is_active,password from users order by id ${sort} LIMIT ? OFFSET ? `;
    const [result] = await conn.promise().execute(queryString, [limit, offset]);

    let countQueryString = `SELECT count(id) as count from users `;
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

//GET SINGLE USER
const getUser = async (req, res) => {
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

// GET user
app.get("/v1/users", getAllUser);
app.get("/v1/users/:id", getUser);

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
    console.log(req.params);
    if (!req.params) {
      res.status(400).send({
        message: "bad request",
      });
    }
    let queryString = `SELECT B.product_id as productId,B.name as productName,B.description as description,B.image as image,
    B.rating as rating,B.price as price,
    B.type as type,C.name as sizeName  from product_size as A
    inner join products as B on B.product_id = A.product_id
    inner join sizes as C on C.size_id = A.size_id where B.product_id =?;`;
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
//Products
app.get("/v1/products", getAllProducts);

//productbyid
app.get("v1/products/:id", getProductById);

app.listen(3000, () => {
  console.log("Server Started");
});
