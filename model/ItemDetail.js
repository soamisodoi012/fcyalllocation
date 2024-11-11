const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Category = require('./Category');  // Import the Category model

const Item = sequelize.define('Item', {
  itemCode: {
    type: DataTypes.STRING,
    primaryKey: true,
    allowNull: false,
    defaultValue: 'other'
  },
  itemName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  categoryCode: {  // Use categoryId as the foreign key to reference Category
    type: DataTypes.STRING,
    allowNull: false,
    references: {
      model: Category,
      key: 'categoryCode',  // Ensure this matches the primary key of Category
    },
  }
}, {
  timestamps: false,
});

// Define the association between Category and Item
Item.associate= function(model){
Category.hasMany(Item, { foreignKey: 'categoryId' });
Item.belongsTo(Category, { foreignKey: 'categoryId' });}

module.exports = Item;
