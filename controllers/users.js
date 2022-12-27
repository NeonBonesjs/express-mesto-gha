/* eslint-disable no-shadow */
const User = require('../models/users');

module.exports.getUsers = (req, res) => {
  User.find({})
    .then((users) => res.send({ users }))
    .catch(() => res.status(500).send({ message: 'Произошла ошибка' }));
};

module.exports.getUserById = (req, res) => {
  User.findById(req.params.userId)
    .then(({
      name,
      about,
      avatar,
      _id,
    }) => res.send({
      name, about, avatar, _id,
    }))
    .catch((err) => {
      if (err.name === 'CastError') { return res.status(404).send({ message: 'Пользователь по указанному _id не найден.' }); }
      return res.status(500).send({ message: err.message });
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
      if (err.name === 'ValidationError') { return res.status(400).send({ message: 'Переданы некорректные данные при создании пользователя' }); }
      return res.status(500).send({ message: err.message });
    });
};

module.exports.changeUserInfo = (req, res) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(req.user._id, { name, about }, { new: true, runValidators: true })
    .then(({
      name, about, avatar, _id,
    }) => res.send({
      name, about, avatar, _id,
    }))
    .catch((err) => {
      if (err.name === 'ValidationError') { return res.status(400).send({ message: 'Переданы некорректные данные, или ошибка валидации' }); }
      if (err.name === 'CastError') { return res.status(404).send({ message: 'Пользователь с указанным _id не найден.' }); }
      return res.status(500).send({ message: err.message });
    });
};

module.exports.changeUserAvatar = (req, res) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(req.user._id, { avatar }, { new: true, runValidators: true })
    .then(({
      name, about, avatar, _id,
    }) => res.send({
      name, about, avatar, _id,
    }))
    .catch((err) => {
      if (err.name === 'ValidationError') { return res.status(400).send({ message: 'Переданы некорректные данные, или ошибка валидации' }); }
      if (err.name === 'CastError') { return res.status(404).send({ message: 'Пользователь с указанным _id не найден.' }); }
      return res.status(500).send({ message: err.message });
    });
};
