const usersStorage = require("../storages/usersStorage");
const {
  body,
  validationResult,
  matchedData,
  query,
} = require("express-validator");

const alphaErr = "must only contain letters.";
const lengthErr = "must be between 1 and 10 characters.";

const validateUser = [
  body("firstName")
    .trim()
    .isAlpha()
    .withMessage(`First name ${alphaErr}`)
    .isLength({ min: 1, max: 10 })
    .withMessage(`FirstName ${lengthErr}`),
  body("lastName")
    .trim()
    .isAlpha()
    .withMessage(`Last name ${alphaErr}`)
    .isLength({ min: 1, max: 10 })
    .withMessage(`Last Name ${lengthErr}`),
  body("email").isEmail().normalizeEmail(),
  body("age")
    .optional({ values: "falsy" })
    .isInt({ min: 18, max: 120 })
    .withMessage("Age must be 18 and above (max 120)"),
  body("bio")
    .optional({ values: "falsy" })
    .trim()
    .isLength({ max: 200 })
    .withMessage("Message cannot exceed 200 characters"),
  query("user").notEmpty().trim(),
];

exports.usersSearchGet = [
  validateUser,
  (req, res) => {
    const searchQuery = req.query.user?.toLowerCase() || "";
    const users = usersStorage.getUsers();
    const result = users.filter((user) => {
      const firstName = user.firstName?.toLowerCase() || "";
      const email = user.email?.toLowerCase() || "";
      return firstName === searchQuery || email === searchQuery;
    });

    if (!searchQuery) {
      return res.redirect("/");
    }

    if (result.length === 0) {
      return res.status(404).render("searchNotFound", { title: "User list" });
    }
    console.log(result);
    res.render("search", { title: "User list", users: result });
  },
];

exports.usersListGet = (req, res) => {
  res.render("index", {
    title: "User list",
    users: usersStorage.getUsers(),
  });
};

exports.usersCreateGet = (req, res) => {
  res.render("createUser", {
    title: "Create user",
    formData: req.body,
  });
};

exports.usersCreatePost = [
  validateUser,
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(404).render("createUser", {
        title: "Create user",
        errors: errors.array(),
        formData: req.body,
      });
    }
    const { firstName, lastName, email, age, bio } = matchedData(req);
    usersStorage.addUser({ firstName, lastName, email, age, bio });
    res.redirect("/");
  },
];

exports.usersUpdateGet = (req, res) => {
  const user = usersStorage.getUser(req.params.id);
  res.render("updateUser", {
    title: "Update user",
    user,
  });
};

exports.usersUpdatePost = [
  validateUser,
  (req, res) => {
    const user = usersStorage.getUser(req.params.id);
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(404).render("updateUser", {
        title: "Update user",
        user,
        errors: errors.array(),
      });
    }
    const { firstName, lastName, email, age, bio } = matchedData(req);
    usersStorage.updateUser(req.params.id, {
      firstName,
      lastName,
      email,
      age,
      bio,
    });
    res.redirect("/");
  },
];

exports.usersDeletePost = (req, res) => {
  usersStorage.deleteUser(req.params.id);
  res.redirect("/");
};
