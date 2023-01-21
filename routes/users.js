const router = require('express').Router();
const { Joi, celebrate } = require('celebrate');
const {
  getUsers,
  getUserById,
  changeUserInfo,
  changeUserAvatar,
  getThisUserInfo,
} = require('../controllers/users');

router.get('/', getUsers);
router.get('/me', getThisUserInfo);
router.get('/:userId', celebrate({
  params: Joi.object().keys({
    userId: Joi.string().alphanum().length(24),
  }),
}), getUserById);
router.patch('/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    about: Joi.string().required().min(2).max(30),
  }),
}), changeUserInfo);
router.patch('/me/avatar', celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().required().pattern(/^(https?:\/\/)(www\.)?([\da-z-.]+)\.([a-z.]{2,6})[\da-zA-Z-._~:?#[\]@!$&'()*+,;=/]*\/?#?$/, 'URL'),
  }),
}), changeUserAvatar);
module.exports = router;
