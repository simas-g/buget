import mongoose, { model, models, Schema } from "mongoose";
const CategorySchema = new Schema({
  userId: { type: mongoose.Schema.ObjectId, required: true },
  name: { type: String, required: true },
});
const Category = models.Category || model("Category", CategorySchema);
export default Category;
