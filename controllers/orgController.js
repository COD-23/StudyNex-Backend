const asyncHandler = require("express-async-handler");
const { errorResponse, successResponse } = require("../helpers/apiResponse");
const Org = require("../models/orgModel");
const randomstring = require("randomstring");

const createOrg = asyncHandler(async (req, res) => {
  try {
    const { admin_id, name, users } = req.body;

    if (!admin_id || !name) {
      errorResponse({ res, message: "Please fill required fields!" });
    }
    const orgExists = await Org.findOne({ name });

    if (orgExists)
      errorResponse({
        res,
        message: "Organization with same name already exists!",
      });

    const org = await Org.create({
      admin_id,
      name,
      org_code: randomstring.generate(7),
      users,
    });

    if (org) {
      const data = {
        admin_id: org.admin_id,
        name: org.name,
        org_code: org.org_code,
        users: org.users,
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
    errorResponse({ res, message: "Something went wrong!" });
  }
});

module.exports = { createOrg };
