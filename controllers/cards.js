const Card = require('../models/cards');
const { NOT_FOUND_CODE, NOT_VALID_CODE, DEFAULT_ERROR_CODE } = require('../error/errors');

module.exports.getCard = (req, res) => {
  Card.find({})
    .then((cards) => res.send({ cards }))
    .catch(() => res.status(DEFAULT_ERROR_CODE).send({ message: 'На сервере произошла ошибка' }));
};

module.exports.createCard = (req, res) => {
  const { name, link } = req.body;
  const owner = req.user._id;
  Card.create({ name, link, owner })
    .then(({
      // eslint-disable-next-line no-shadow
      likes, _id, name, link, owner, createdAt,
    }) => res.send({
      likes, _id, name, link, owner, createdAt,
    }))
    .catch((err) => {
      if (err.name === 'ValidationError') { return res.status(NOT_VALID_CODE).send({ message: 'Переданы некорректные данные при создании карточки.' }); }
      return res.status(DEFAULT_ERROR_CODE).send({ message: 'На сервере произошла ошибка' });
    });
};

module.exports.deleteCard = (req, res) => {
  Card.findByIdAndRemove(req.params.cardId)
    .orFail(new Error('NotFound'))
    .then(() => res.send({ message: 'Карточка удалена' }))
    .catch((err) => {
      if (err.message === 'NotFound') { return res.status(NOT_FOUND_CODE).send({ message: 'Карточка с указанным _id не найдена.' }); }
      if (err.name === 'CastError') { return res.status(NOT_VALID_CODE).send({ message: 'Некорректный айди.' }); }
      return res.status(DEFAULT_ERROR_CODE).send({ message: 'На сервере произошла ошибка' });
    });
};

module.exports.likeCard = (req, res) => {
  Card.findByIdAndUpdate(req.params.cardId, { $addToSet: { likes: req.user._id } }, { new: true })
    .then(({
      likes, _id, name, link, owner, createdAt,
    }) => res.send({
      likes, _id, name, link, owner, createdAt,
    }))
    .catch((err) => {
      if (err.name === 'CastError') { return res.status(NOT_VALID_CODE).send({ message: 'Некорректный айди.' }); }
      if (err.name === 'TypeError') { return res.status(NOT_FOUND_CODE).send({ message: 'Запрашиваемая карточка не найден' }); } if (err.name === 'ValidationError') { return res.status(400).send({ message: 'Переданы некорректные данные для постановки/снятии лайка.' }); }
      return res.status(DEFAULT_ERROR_CODE).send({ message: 'На сервере произошла ошибка' });
    });
};

module.exports.dislikeCard = (req, res) => {
  Card.findByIdAndUpdate(req.params.cardId, { $pull: { likes: req.user._id } }, { new: true })
    .then(({
      likes, _id, name, link, owner, createdAt,
    }) => res.send({
      likes, _id, name, link, owner, createdAt,
    }))
    .catch((err) => {
      if (err.name === 'CastError') { return res.status(NOT_VALID_CODE).send({ message: 'Некорректный айди.' }); }
      if (err.name === 'TypeError') { return res.status(NOT_FOUND_CODE).send({ message: 'Запрашиваемая карточка не найден' }); } if (err.name === 'ValidationError') { return res.status(400).send({ message: 'Переданы некорректные данные для постановки/снятии лайка.' }); }
      return res.status(DEFAULT_ERROR_CODE).send({ message: 'На сервере произошла ошибка' });
    });
};
