const Card = require('../models/cards');
const NotFoundError = require('../error/NotFoundError');
const ValidationError = require('../error/ValidationError');
const CustomError = require('../error/CustomError');

module.exports.getCard = (req, res, next) => {
  Card.find({})
    .then((cards) => res.send({ cards }))
    .catch(next);
};

module.exports.createCard = (req, res, next) => {
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
      if (err.name === 'ValidationError') {
        next(new ValidationError(`${Object.values(err.errors).map((error) => error.message).join(', ')}`));
      }
      return next(err);
    });
};

module.exports.deleteCard = (req, res, next) => {
  Card.findById(req.params.cardId)
    .orFail(new NotFoundError('Карточка с указанным _id не найдена.'))
    .then((card) => {
      if (String(card.owner) !== req.user._id) {
        throw new CustomError('Недостаточно прав', 403);
      }
      return card.remove()
        .then(() => res.send({ message: 'Карточка удалена' }));
    })
    .catch(next);
};

module.exports.likeCard = (req, res, next) => {
  Card.findByIdAndUpdate(req.params.cardId, { $addToSet: { likes: req.user._id } }, { new: true })
    .orFail(new NotFoundError('Запрашиваемая карточка не найденa'))
    .then(({
      likes, _id, name, link, owner, createdAt,
    }) => res.send({
      likes, _id, name, link, owner, createdAt,
    }))
    .catch(next);
};

module.exports.dislikeCard = (req, res, next) => {
  Card.findByIdAndUpdate(req.params.cardId, { $pull: { likes: req.user._id } }, { new: true })
    .orFail(new NotFoundError('Запрашиваемая карточка не найденa'))
    .then(({
      likes, _id, name, link, owner, createdAt,
    }) => res.send({
      likes, _id, name, link, owner, createdAt,
    }))
    .catch(next);
};
