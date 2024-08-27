const AppError = require("../utils/appError");
const { validationResult } = require("express-validator");
require("dotenv").config();
const conn = require("../services/db");

exports.get = (req, res) => {
  let sqlQuery = `
    SELECT bp.id, bp.name, bp.description, bp.status, bp.created_at, bp.updated_at,
           bpi.id as item_id, bpi.business_packages_id, bpi.plan_id, bpi.name as item_name, bpi.price, bpi.status as item_status
    FROM business_packages bp
    LEFT JOIN business_packages_item bpi ON bp.id = bpi.business_packages_id
  `;

  conn.query(sqlQuery, (err, result) => {
    if (err) {
      return res.status(500).send({
        msg: err,
      });
    } else {
      // Group the results by business package
      const groupedResult = result.reduce((acc, row) => {
        if (!acc[row.business_packages_id]) {
          acc[row.business_packages_id] = {
            id: row.id,
            name: row.name,
            description: row.description,
            status: row.status,
            created_at: row.created_at,
            updated_at: row.updated_at,
            items: [],
          };
        }
        if (row.item_id) {
          acc[row.business_packages_id].items.push({
            id: row.item_id,
            business_packages_id: row.business_packages_id,
            plan_id: row.plan_id,
            name: row.item_name,
            price: row.price,
            status: row.item_status,
          });
        }
        return acc;
      }, {});

      const finalResult = Object.values(groupedResult);

      res.status(200).send({
        status: "success",
        length: finalResult.length,
        data: finalResult,
      });
    }
  });
};

exports.register = (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  conn.query(
    `SELECT * FROM business_packages WHERE (name) = LOWER(${conn.escape(
      req.body.name
    )});`,
    (err, result) => {
      if (result && result.length) {
        return res.status(409).send({
          msg: "This Business Package already exists",
        });
      } else {
        var date_time = new Date();
        const sqlQuery = `INSERT INTO business_packages (name, description, created_at, updated_at) VALUES (?, ?, ?, ?)`;
        const values = [
          req.body.name,
          req.body.description,
          date_time,
          date_time,
        ];
        conn.query(sqlQuery, values, (err, result) => {
          if (err) {
            return res.status(500).send({
              msg: err,
            });
          } else {
            const businessPackageId = result.insertId;
            const itemsQuery = `INSERT INTO business_packages_item (business_packages_id, plan_id,price ,status) VALUES ?`;
            const itemsValues = req.body.items.map((item) => [
              businessPackageId,
              item.plan_id,
              item.price,
              item.status,
            ]);

            conn.query(itemsQuery, [itemsValues], (err, itemResult) => {
              if (err) {
                return res.status(500).send({
                  msg: err,
                });
              } else {
                res.status(200).send({
                  status: "success",
                  msg: "Business Package and items registered successfully",
                });
              }
            });
          }
        });
      }
    }
  );
};

exports.edit = (req, res) => {
  let sqlQuery = `
    SELECT bp.*,  bpi.id, bpi.plan_id, bpi.price, bpi.status
    FROM business_packages bp
    LEFT JOIN business_packages_item bpi ON bp.id = bpi.business_packages_id
    WHERE bp.id = ?`;

  conn.query(sqlQuery, [req.params.id], (err, results) => {
    if (err) {
      return res.status(500).send({
        msg: err,
      });
    } else {
      if (results.length === 0) {
        return res.status(404).send({
          status: "error",
          msg: "Business package not found",
        });
      }

      const businessPackage = {
        ...results[0],
        items: results.map((row) => ({
          id: row.id,
          plan_id: row.plan_id,
          price: row.price,
          status: row.status,
        })),
      };

      delete businessPackage.plan_id;
      delete businessPackage.price;

      res.status(200).send({
        status: "success",
        data: businessPackage,
      });
    }
  });
};

exports.update = (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const date_time = new Date();

  // Update business_packages table
  const updatePackageQuery = `UPDATE business_packages SET name = ?, updated_at = ? WHERE id = ?`;
  const packageValues = [req.body.name, date_time, req.params.id];

  conn.query(updatePackageQuery, packageValues, (packageErr, packageResult) => {
    if (packageErr) {
      console.error(packageErr);
      return res.status(500).send({
        msg: "Internal Server Error",
      });
    }

    // Update or insert into business_packages_item table
    const updateItemQuery = `UPDATE business_packages_item SET price = ?, status = ? WHERE id = ?`;
    const insertItemQuery = `INSERT INTO business_packages_item (business_packages_id, plan_id, price ,status) VALUES (?, ?, ?, ?)`;

    // Assuming req.body.items is an array of objects with optional id, plan_id, and price
    const itemUpdatePromises = req.body.items.map((item) => {
      return new Promise((resolve, reject) => {
        if (item.id) {
          // If the item has an id, update it
          const updateItemValues = [item.price, item.status, item.id];
          conn.query(
            updateItemQuery,
            updateItemValues,
            (updateErr, updateResult) => {
              if (updateErr) {
                reject(updateErr);
              } else {
                resolve(updateResult);
              }
            }
          );
        } else {
          // If the item doesn't have an id, insert a new record
          const insertItemValues = [
            req.params.id,
            item.plan_id,
            item.price,
            item.status,
          ];
          conn.query(
            insertItemQuery,
            insertItemValues,
            (insertErr, insertResult) => {
              if (insertErr) {
                reject(insertErr);
              } else {
                resolve(insertResult);
              }
            }
          );
        }
      });
    });

    Promise.all(itemUpdatePromises)
      .then(() => {
        res.status(200).send({
          status: "success",
          msg: "Business Packages and items updated successfully",
        });
      })
      .catch((itemErr) => {
        console.error(itemErr);
        res.status(500).send({
          msg: "Error updating Business Package items",
        });
      });
  });
};

exports.delete = (req, res) => {
  const packageId = req.params.id;

  // Delete from business_packages_item table first
  const deleteItemsQuery =
    "DELETE FROM business_packages_item WHERE business_packages_id = ?";
  conn.query(deleteItemsQuery, [packageId], (itemErr, itemResult) => {
    if (itemErr) {
      return res.status(500).send({
        msg: itemErr,
      });
    }

    // Then delete from business_packages table
    const deletePackageQuery = "DELETE FROM business_packages WHERE id = ?";
    conn.query(deletePackageQuery, [packageId], (packageErr, packageResult) => {
      if (packageErr) {
        return res.status(500).send({
          msg: packageErr,
        });
      }

      res.status(200).send({
        status: "success",
        msg: "Business Package and associated items deleted successfully",
      });
    });
  });
};

exports.status = (req, res) => {
  const status = req.body.status; // This should be "active" or "inactive"
  const id = req.params.id;
  const sqlQuery = `UPDATE business_packages SET status = ? WHERE id = ?;`;
  const values = [status, id];

  conn.query(sqlQuery, values, (err, result) => {
    if (err) {
      return res.status(500).send({
        msg: err,
      });
    } else {
      res.status(200).send({
        status: "success",
        msg: "Status Update successful",
      });
    }
  });
};
