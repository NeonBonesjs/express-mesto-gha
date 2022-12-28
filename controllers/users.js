/* eslint-disable no-shadow */
const User = require('../models/users');
const { NOT_FOUND_CODE, NOT_VALID_CODE, DEFAULT_ERROR_CODE } = require('../error/errors');

module.exports.getUsers = (req, res) => {
  User.find({})
    .then((users) => res.send({ users }))
    .catch(() => res.status(DEFAULT_ERROR_CODE).send({ message: 'На сервере произошла ошибка' }));
};

module.exports.getUserById = (req, res) => {
  User.findById(req.params.userId)
    .orFail(new Error('NotFound'))
    .then(({
      name,
      about,
      avatar,
      _id,
    }) => res.send({
      name, about, avatar, _id,
    }))
    .catch((err) => {
      if (err.name === 'CastError') { return res.status(NOT_VALID_CODE).send({ message: 'Некорректный айди.' }); }
      if (err.message === 'NotFound') { return res.status(NOT_FOUND_CODE).send({ message: 'Пользователь по указанному _id не найден.' }); }
      return res.status(DEFAULT_ERROR_CODE).send({ message: 'На сервере произошла ошибка' });
    });
};

module.exports.createUser = (req, res) => {
  const { name, about, avatar } = req.body;
  User.create({ name, about, avatar })
    .then(({
      name, about, avatar, _id,
    }) => res.send({
      name, about, avatar, _id,
    }))
    .catch((err) => {
      if (err.name === 'ValidationError') { return res.status(NOT_VALID_CODE).send({ message: 'Переданы некорректные данные при создании пользователя' }); }
      return res.status(DEFAULT_ERROR_CODE).send({ message: 'На сервере произошла ошибка' });
    });
};

module.exports.changeUserInfo = (req, res) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(req.user._id, { name, about }, { new: true, runValidators: true })
    .orFail(new Error('NotFound'))
    .then(({
      name, about, avatar, _id,
    }) => res.send({
      name, about, avatar, _id,
    }))
    .catch((err) => {
      if (err.message === 'NotFound') { return res.status(NOT_FOUND_CODE).send({ message: 'Пользователь по указанному _id не найден.' }); }
      if (err.name === 'ValidationError') { return res.status(NOT_VALID_CODE).send({ message: 'Переданы некорректные данные, или ошибка валидации' }); }
      if (err.name === 'CastError') { return res.status(NOT_VALID_CODE).send({ message: 'Пользователь с некорректным _id.' }); }
      return res.status(DEFAULT_ERROR_CODE).send({ message: 'На сервере произошла ошибка' });
    });
};

module.exports.changeUserAvatar = (req, res) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(req.user._id, { avatar }, { new: true, runValidators: true })
    .orFail(new Error('NotFound'))
    .then(({
      name, about, avatar, _id,
    }) => res.send({
      name, about, avatar, _id,
    }))
    .catch((err) => {
      if (err.message === 'NotFound') { return res.status(NOT_FOUND_CODE).send({ message: 'Пользователь по указанному _id не найден.' }); }
      if (err.name === 'ValidationError') { return res.status(NOT_VALID_CODE).send({ message: 'Переданы некорректные данные, или ошибка валидации' }); }
      if (err.name === 'CastError') { return res.status(NOT_VALID_CODE).send({ message: 'Пользователь с некорректным _id.' }); }
      return res.status(DEFAULT_ERROR_CODE).send({ message: 'На сервере произошла ошибка' });
    });
};
