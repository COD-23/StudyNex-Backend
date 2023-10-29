const asyncHandler = require("express-async-handler");
const { errorResponse, successResponse } = require("../helpers/apiResponse");
const Org = require("../models/orgModel");
const randomstring = require("randomstring");
const User = require("../models/userModel");

const createOrg = asyncHandler(async (req, res) => {
  try {
    const { admin_id, name, image } = req.body;

    if (!admin_id || !name || !image) {
      errorResponse({ res, message: "Please fill required fields!" });
    }
    const orgExists = await Org.findOne({ name });

    if (orgExists)
      return errorResponse({
        res,
        message: "Organization with same name already exists!",
      });

    const org = await Org.create({
      admin_id,
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
      successResponse({
        res,
        message: "Organization created successfully",
        data: data,
      });
    } else {
      errorResponse({
        res,
        message: "Something went wrong! Unable to create organization",
      });
    }
  } catch (error) {
    console.log(error);
    errorResponse({ res, message: "Something went wrong!" });
  }
});

const joinOrg = asyncHandler(async (req, res) => {
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
      
      successResponse({
        res,
        message: "Organization joined successfully",
        data: userData,
      });
    } else {
      errorResponse({
        res,
        message: "Oraganization doesn't exist",
      });
    }
  } catch (error) {
    console.log(error);
    errorResponse({ res, message: "Something went wrong!" });
  }
});

module.exports = { createOrg, joinOrg };
