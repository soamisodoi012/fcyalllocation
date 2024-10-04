const FcyInAu = require('../model/FcyInAu');
const getAllFcyInAu = async (req, res) => {
    try {
      const fcy = await FcyInAu.findAll();
      res.status(200).json(fcy);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  };
  const getFcyInAuById = async (req, res) => {
    try {
      const fcy = await FcyInAu.findById(req.params.pk);
      res.status(200).json(fcy);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  };
  module.exports ={ 
    getAllFcyInAu,
    getFcyInAuById,
}