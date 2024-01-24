const { errorResponse } = require("../helpers/apiResponse");
const Quiz = require("../models/quizModel");
const QuizUserMap = require("../models/quizUserMapModel");
const User = require("../models/userModel");

const create = async (req, res) => {
  try {
    const { title, quiz, org_id, channel_id } = req.body;

    if (!title || !quiz || !org_id || !channel_id) {
      return "empty";
    }

    const quizData = await Quiz.create({
      title,
      quiz,
      org_id,
      channel_id,
      is_active: true,
    });

    await quizData.populate("org_id");
    await quizData.populate("channel_id");

    if (quizData) {
      return quizData;
    }
    return null;
  } catch (error) {
    console.log(error);
  }
};

const getAll = async (req, res) => {
  try {
    const { org_id, channel_id, active } = req.query;

    if (!org_id || !channel_id) {
      return "empty";
    }
    const quizzes = await Quiz.find({
      org_id,
      channel_id,
      is_active: active ? true : false,
    }).sort({ updatedAt: -1 });
    return quizzes;
  } catch (error) {
    console.log(error);
  }
};

const get = async (req, res) => {
  try {
    const { quiz_id } = req.query;

    if (!quiz_id) {
      return "empty";
    }
    const quiz = await Quiz.find({
      _id: quiz_id,
    });
    const submissions = await QuizUserMap.find({
      quiz_id,
    }).populate("user_id", "-password");
    return {
      quiz: quiz,
      submissions: submissions.map((data) => ({
        user: data.user_id,
        points: data.points,
      })),
    };
  } catch (error) {
    console.log(error);
  }
};

const submit = async (req, res) => {
  try {
    const { quiz_id, answers, points } = req.body;

    if (!quiz_id) {
      return "empty";
    }
    const userSubmittedQuizzes = await QuizUserMap.find({
      user_id: req.user._id,
      quiz_id,
    });
    if (userSubmittedQuizzes) {
      return "exists";
    }
    const quizzes = await QuizUserMap.create({
      quiz_id,
      user_id: req.user._id,
      answers,
      points,
    });

    const prevPoints = User.find(
      { _id: req.user._id },
      "quizPerformance.currentPerformance"
    );
    console.log(prevPoints);
    const newPoints = prevPoints ? prevPoints + points : points;

    await User.updateOne(
      { _id: req.user._id },
      {
        $set: { "quizPerformance.currentPerformance": newPoints },
        $push: { "quizPerformance.pastPerformances": newPoints },
      },
      { new: true }
    );

    return quizzes;
  } catch (error) {
    console.log(error);
  }
};

const getQuizByUser = async (req, res) => {
  try {
    const { org_id, active, channel_id } = req.query;

    if (!org_id) {
      return "empty";
    }
    let quizzes = null;
    if (channel_id) {
      quizzes = await Quiz.find({
        org_id,
        channel_id,
        is_active: active ? true : false,
      });
    } else {
      quizzes = await Quiz.find({
        org_id,
        is_active: active ? true : false,
      });
    }
    const userSubmittedQuizzes = await QuizUserMap.find({
      user_id: req.user._id,
    }).populate("quiz_id");

    const submittedQuizIds = userSubmittedQuizzes.map((userMap) =>
      userMap.quiz_id._id.toString()
    );

    const notSubmittedQuizzes = quizzes.filter(
      (quiz) => !submittedQuizIds.includes(quiz._id.toString())
    );

    return {
      notSubmittedQuizzes,
      userSubmittedQuizzes,
    };
  } catch (error) {
    console.log(error);
  }
};

const stopQ = async (req, res) => {
  try {
    const { quiz_id } = req.query;

    if (!quiz_id) {
      return "empty";
    }
    await Quiz.updateOne(
      { _id: quiz_id },
      { $set: { is_active: false } },
      { new: true }
    );
    const quizzes = await Quiz.find({
      _id: quiz_id,
    });
    return quizzes;
  } catch (error) {
    console.log(error);
  }
};

module.exports = { create, getAll, get, submit, getQuizByUser, stopQ };
