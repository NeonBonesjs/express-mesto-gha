const Card = require('../models/cards');

module.exports.getCard = (req, res) => {
  Card.find({})
    .then((cards) => res.send({ cards }))
    .catch((err) => res.status(500).send({ message: err.message }));
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
      if (err.name === 'ValidationError') { return res.status(400).send({ message: 'Переданы некорректные данные при создании карточки.' }); }
      return res.status(500).send({ message: err.message });
    });
};

module.exports.deleteCard = (req, res) => {
  Card.findByIdAndRemove(req.params.cardId)
    .orFail(new Error('NotFound'))
    .then(() => res.send({ message: 'Карточка удалена' }))
    .catch((err) => {
      if (err.message === 'NotFound') { return res.status(404).send({ message: 'Карточка с указанным _id не найдена.' }); }
      if (err.name === 'CastError') { return res.status(400).send({ message: 'Некорректный айди.' }); }
      return res.status(500).send({ message: err.message });
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
      if (err.name === 'CastError') { return res.status(400).send({ message: 'Некорректный айди.' }); }
      if (err.name === 'TypeError') { return res.status(404).send({ message: 'Запрашиваемая карточка не найден' }); } if (err.name === 'ValidationError') { return res.status(400).send({ message: 'Переданы некорректные данные для постановки/снятии лайка.' }); }
      return res.status(500).send({ message: err.message });
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
      if (err.name === 'CastError') { return res.status(400).send({ message: 'Некорректный айди.' }); }
      if (err.name === 'TypeError') { return res.status(404).send({ message: 'Запрашиваемая карточка не найден' }); } if (err.name === 'ValidationError') { return res.status(400).send({ message: 'Переданы некорректные данные для постановки/снятии лайка.' }); }
      return res.status(500).send({ message: err.message });
    });
};
