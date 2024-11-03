import { model, Schema } from "mongoose";

const RecipeSchema = new Schema({
  title: {
    type: String,
    required: [true, "Title is required"],
    maxlength: [100, "Title cannot exceed 100 characters"],
  },
  ingredients: [
    {
      name: { type: String, required: [true, "Ingredient name is required"] },
      amount: {
        type: Number,
        required: [true, "Ingredient amount is required"],
        min: [0, "Amount must be a positive number"],
      },
      unit: { type: String },
    },
  ],
  instructions: { type: String, required: true },
  summary: { type: String },
  preparationTime: { type: Number },
  cookingTime: { type: Number },
  servings: { type: Number },
  image: { type: String },
  nutrition: {
    calories: { type: Number },
    fat: { type: Number },
    protein: { type: Number },
    carbs: { type: Number },
  },
  diets: { type: [String] },
  dishTypes: { type: [String] },
  cuisines: { type: [String] },
  sourceUrl: { type: String },
  analyzedInstructions: [
    {
      stepNumber: { type: Number },
      step: { type: String },
    },
  ],
});
