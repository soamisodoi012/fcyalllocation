const FcyLive = require('../model/FcyLive');
const getAllFcyLive = async (req, res) => {
    try {
        const page = parseInt(req.query.page, 10) || 1;
        const pageSize = parseInt(req.query.pageSize, 10) || 2;
      const fcy = await FcyLive.findAll();
      const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const paginatedData = fcy.slice(startIndex, endIndex);
    res.json({
        data: paginatedData,
        totalItems: fcy.length,
        currentPage: page,
        totalPages: Math.ceil(fcy.length / pageSize),
      });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  };
  const getFcyLiveById = async (req, res) => {
    try {
      const fcy = await FcyLive.findById(req.params.pk);
      res.status(200).json(fcy);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  };
  module.exports ={ 
    getAllFcyLive,
    getFcyLiveById,
}