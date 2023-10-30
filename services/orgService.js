const asyncHandler = require("express-async-handler");
const Org = require("../models/orgModel");
const randomstring = require("randomstring");
const User = require("../models/userModel");
const { errorResponse } = require("../helpers/apiResponse");

const fetch = async (req, res) => {
  const { query } = req;
  const org = await Org.findOne({ slug: query.org });
  await org.populate("users");
  // const data = {
  //   org: org,
  //   users: users,
  // };
  return org;
};

const create = async (req, res) => {
  try {
    const { name, image } = req.body;

    if (!name || !image) {
      errorResponse({ res, message: "Please fill required fields!" });
    }
    const orgExists = await Org.findOne({ name });

    if (orgExists) {
      return errorResponse({
        res,
        message: "Organization with same name already exists!",
      });
    }

    const org = await Org.create({
      admin_id: req.user._id,
      name,
      org_code: randomstring.generate(7),
      image,
    });

    if (org) {
      const data = {
        admin_id: org.admin_id,
        name: org.name,
        org_code: org.org_code,
        image: org.image,
      };
      return data;
    }
  } catch (error) {
    console.log(error);
    errorResponse({ res, message: "Something went wrong!" });
  }
};

const join = async (req, res) => {
  try {
    const { userId, org_code } = req.body;

    if (!userId) {
      errorResponse({ res, message: "Please fill required fields!" });
    }

    const org = await Org.findOne({ org_code: org_code });

    if (org) {
      //Storing id of the user to Org collection
      org.users.push(userId);
      await org.save(); // updating document

      //Linking user with org
      const user = await User.findOne({ _id: userId });
      user.org_joined = org.slug;
      await user.save();

      const userData = await org.populate("users"); // retrieving respective users data using populate
      return userData;
    }
  } catch (error) {
    console.log(error);
    errorResponse({ res, message: "Something went wrong!" });
  }
};
module.exports = { create, join, fetch };
