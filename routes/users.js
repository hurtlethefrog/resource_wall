const express = require('express');
const router  = express.Router();

module.exports = (db) => {
router.put("/edit", (req, res) => {
  // will need to consolelog req.body when put button works
const profileChanges = req.body
const updateQuery = `
  UPDATE resources
  SET thumbnail_url = $1, bio = $2, title = $3
  WHERE id = $4;
  `
  db.query(updateQuery, [profileChanges, req.user.id])
  .then(() => {
    res.redirect(`/${req.user.id}`)
  })
})

router.get("/edit", (req, res) => {
const user_id = req.user.id
  db.query(`
  SELECT thumbnail_url, full_name, bio
  FROM users
  WHERE id = $1;
  `, [user_id])
  .then(() => {
      res.render("users-edit", { user:req.user })
  })
  .catch(err => {
    res
      .status(500)
      .json({ error: err.message });
  });
});

router.get("/:id/liked", (req, res) => {
const user_id = req.params.id
  db.query(`
  SELECT resource_id, resources.external_url, resources.thumbnail_url, description, title
    FROM liked
    JOIN users ON user_id = users.id
    JOIN resources ON resource_id = resources.id
    WHERE users.id = $1;
    `, [user_id])
    .then(data => {
        const allResources = data.rows;
        res.render("resource-liked", { allResources, user:req.user });
      })
      .catch(err => {
        res
          .status(500)
          .json({ error: err.message });
      });
  });

router.get("/:id", (req, res) => {
const user_id = req.params.id
  db.query(`
  SELECT thumbnail_url, full_name, bio
  FROM users
  WHERE id = $1;
  `, [user_id])
  .then(data => {
    const userData = data.rows[0];
    res.render("users", {userData, user:req.user})
  })
  .catch(err => {
    res
        .status(500)
        .json({ error: err.message });
    });
  });
  return router;
}
