
const itemDetail = require('../model/ItemDetail');
const Category= require('../model/Category');
const createItemDetail = async (req, res) => {
  try {
    const { categoryId } = req.body;

    // Check if categoryId exists in the Category table
    const category = await Category.findOne({ where: { categoryCode: categoryId } });
    if (!category) {
      return res.status(404).json({
        message: 'Category not found',
      });
    }

    // If category exists, create the item
    const item = await itemDetail.create(req.body);
    return res.status(200).json({ item });
  } catch (err) {
    console.error('Error creating item detail:', err);
    return res.status(500).json({
      message: 'An error occurred while creating item detail',
      error: err.message,
    });
  }
};

const createItemCategory=async(req, res) => {
try {
    const category = await Category.create(req.body);
    return res.status(200).json({ category });
} catch (err) {
    return res.status(500).json({
      message: 'An error occurred while creating item category',
      error: err.message,
    });
  
}};
const getItemsByCategory = async (req, res) => {
  try {
    // Fetch all categories with associated items
    const categories = await Category.findAll({
      include: [{
        model: itemDetail, // Ensure this is the correct model name
        attributes: ['itemName', 'itemCode'], // Adjust attributes based on your model
      }],
    });

    // Debug: Log the fetched categories
    console.log(JSON.stringify(categories, null, 2));

    // Map categories to the desired format
    const response = categories.map(category => ({
      id: category.categoryCode, // or category.id if you have an id field
      name: category.categoryName,
      Elements: category.Items ? category.Items.map(item => item.itemName) : [],
    }));

    return res.status(200).json(response);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};
module.exports = {
    createItemDetail,
    getItemsByCategory,
    createItemCategory,
}