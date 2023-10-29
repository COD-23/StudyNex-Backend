const asyncHandler = require("express-async-handler");
const { errorResponse, successResponse } = require("../helpers/apiResponse");
const { create, join, fetch } = require("../services/orgService");

const createOrg = asyncHandler(async (req, res) => {
  const data = await create(req, res);
  if (data) {
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
});

const getOrg = asyncHandler(async(req,res) =>{
  const data = await fetch(req,res);
  if(data){
    res.status(200).send(data);
  }else{
    errorResponse({
      res,
      message: "Something went wrong! Unable to fetch organizations",
    })
  }
})

const joinOrg = asyncHandler(async (req, res) => {
  const data = await join(req, res);

  if (data) {
    successResponse({
      res,
      message: "Organization joined successfully",
      data: data,
    });
  } else {
    errorResponse({
      res,
      message: "Please enter valid code.Oraganization doesn't exist!!",
    });
  }
});



module.exports = { createOrg, joinOrg,getOrg };
