function paginatedResults(model, limited = false) {
  return async (req, res, next) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 5;

    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;

    const results = {};

    if (endIndex < (await model.countDocuments().exec())) {
      results.next = { page: page + 1, limit: limit };
    }
    if (startIndex > 0) {
      results.previous = {
        page: page - 1,
        limit: limit,
      };
    }
    try {
      if (limited)
        results.results = await model
          .find({ author: { $in: req.user.follows } })
          .limit(limit)
          .skip(startIndex)
          .exec();
      else
        results.results = await model
          .find()
          .populate("author")
          .limit(limit)
          .skip(startIndex)
          .exec();

      res.paginatedResults = results;
      next();
    } catch (e) {
      res.status(500).json({ message: e.message });
    }
  };
}

module.exports = paginatedResults;
