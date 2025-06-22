const Card = require('../models/Card');
const List = require('../models/List');
const { checkBoardMembership } = require('../services/permissionService');

// @desc    Create a new card
// @route   POST /api/cards
exports.createCard = async (req, res) => {
  const { title, listId, boardId } = req.body;

  try {
    if (!(await checkBoardMembership(boardId, req.user._id))) {
      return res.status(403).json({ message: 'You are not a member of this board' });
    }

    const list = await List.findById(listId);
    if (!list) {
      return res.status(404).json({ message: 'List not found' });
    }

    const card = new Card({ title, list: listId, board: boardId });
    const createdCard = await card.save();

    // Add card to the list's cards array
    list.cards.push(createdCard._id);
    await list.save();
    
    res.status(201).json(createdCard);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get card details
// @route   GET /api/cards/:id
exports.getCardById = async (req, res) => {
    try {
        const card = await Card.findById(req.params.id).populate('assignees', 'name email');
        if (!card) {
            return res.status(404).json({ message: 'Card not found' });
        }

        if (!(await checkBoardMembership(card.board, req.user._id))) {
            return res.status(403).json({ message: 'You are not a member of this board' });
        }
        res.json(card);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


// @desc    Update a card
// @route   PUT /api/cards/:id
exports.updateCard = async (req, res) => {
  const { title, description, dueDate, labels, assignees } = req.body;

  try {
    const card = await Card.findById(req.params.id);
    if (!card) {
      return res.status(404).json({ message: 'Card not found' });
    }

    if (!(await checkBoardMembership(card.board, req.user._id))) {
      return res.status(403).json({ message: 'You are not authorized' });
    }

    card.title = title || card.title;
    card.description = description || card.description;
    card.dueDate = dueDate || card.dueDate;
    if (labels) card.labels = labels;
    if (assignees) card.assignees = assignees;

    const updatedCard = await card.save();
    res.json(updatedCard);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// @desc    Move a card to a different list
// @route   PUT /api/cards/:id/move
exports.moveCard = async (req, res) => {
  const { cardId } = req.params;
  const { sourceListId, destListId, destIndex } = req.body;

  try {
    const card = await Card.findById(cardId);
    if (!card) return res.status(404).json({ message: 'Card not found.' });

    if (!(await checkBoardMembership(card.board, req.user._id))) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    if (card.list.toString() !== sourceListId) {
      return res.status(400).json({ message: 'Source list mismatch' });
    }

    await List.findByIdAndUpdate(sourceListId, { $pull: { cards: cardId } });

    const update = destIndex != null ? { $each: [cardId], $position: destIndex } : { $each: [cardId] };
    await List.findByIdAndUpdate(destListId, { $push: { cards: update } });

    card.list = destListId;
    await card.save();

    res.status(200).json({ message: 'Card moved successfully', card });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// @desc    Delete a card
// @route   DELETE /api/cards/:id
exports.deleteCard = async (req, res) => {
    try {
        const card = await Card.findById(req.params.id);
        if (!card) return res.status(404).json({ message: 'Card not found.' });

        if (!(await checkBoardMembership(card.board, req.user._id))) {
            return res.status(403).json({ message: 'Not authorized' });
        }

        // Remove card from its list
        await List.findByIdAndUpdate(card.list, { $pull: { cards: card._id } });

        await card.deleteOne();

        res.json({ message: 'Card deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};