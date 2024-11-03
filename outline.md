---

### Step 1: Setting Up Your Project
**Explanation**:
First, create the project structure and install necessary dependencies. This sets the foundation for a functional backend server.

**Connections**:
This step is essential for configuring the server and setting up the database connection.

**Code**:
```bash
# Create project directory and navigate into it
mkdir first-server
cd first-server

# Create server folder and navigate into it
mkdir server
cd server

# Create the server.js file
touch server.js

# Initialize the server directory as a Node application
npm init -y

# Install dependencies
npm install mongoose express dotenv cors

# Install nodemon as a dev dependency for automatic server restarts
npm install --save-dev nodemon

# Create essential project folders
mkdir config controllers models routes middlewares tests

# Create the .env file for environment variables
touch .env
```

**Testing**:
- Verify `server.js` is listed as the `main` entry in `package.json`.
- Confirm the folder structure and dependencies are correctly set up.

**Folder Structure**:
```
first-server/
└── server/
    ├── config/
    │   └── mongoose.config.js
    ├── controllers/
    ├── models/
    ├── routes/
    ├── middlewares/
    ├── tests/
    ├── node_modules/
    ├── .env
    ├── package.json
    ├── package-lock.json
    └── server.js
```

---

### Step 2: Writing the `server.js` File

**Explanation**:
Set up the server with Express, integrate `cors`, load environment variables, and parse JSON. Add environment variable validation for better error handling.

**Connections**:
This builds on Step 1 by enabling the server to handle requests and serve as the backbone of the API.

**Code**:

```javascript
// server.js
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import dbConnect from "./config/mongoose.config.js";
import { errorHandler } from "./middlewares/errorHandler.js";
import recipeRoutes from "./routes/recipeRoutes.js";

dotenv.config();

// Validate environment variables
const requiredEnv = ["PORT", "MONGODB_URI"];
requiredEnv.forEach((env) => {
  if (!process.env[env]) {
    console.error(`Error: Missing required environment variable: ${env}`);
    process.exit(1);
  }
});

const app = express();
const PORT = process.env.PORT || 8000;

app.use(express.json(), cors());
dbConnect();

// Integrate routes
app.use("/api", recipeRoutes);

// Use custom error handler
app.use(errorHandler);

app.listen(PORT, () => console.log(`Listening on port: ${PORT}`));
```

**Testing**:

- Run `npm run dev` and check for `Listening on port: <PORT>` in the console.
- Confirm that missing environment variables prompt an error message.

---

### Step 3: Setting Up the `.env` File

**Explanation**:
Store sensitive data like MongoDB connection strings securely.

**Connections**:
Step 2 uses `dotenv` to load the `.env` file into the environment.

**Code**:

```env
PORT=8000
MONGODB_URI=mongodb+srv://<username>:<password>@<host>/?retryWrites=true&w=majority&appName=<cluster>
```

---

### Step 4: Configuring `mongoose.config.js` and Expanding the Recipe Schema

**Explanation**:
Configure the MongoDB connection and create a detailed `Recipe` schema with enhanced validation for data integrity.

**Connections**:
The schema will be used in Step 10 for CRUD operations.

**Code**:

```javascript
// config/mongoose.config.js
import { connect } from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();
const MONGODB_URI = process.env.MONGODB_URI;

async function dbConnect() {
  try {
    await connect(MONGODB_URI, {
      dbName: 'myDatabase', // Replace with your database name
    });
    console.log("Connected to MongoDB!");
  } catch (error) {
    console.error("Database connection error:", error);
    throw error;
  }
}

export default dbConnect;

// models/Recipe.js
import {model, Schema} from "mongoose";

const RecipeSchema = newSchema({
  title: {
    type: String,
    required: [true, 'Title is required'],
    maxlength: [100, 'Title cannot exceed 100 characters'],
  },
  ingredients: [
    {
      name: { type: String, required: [true, 'Ingredient name is required'] },
      amount: {
        type: Number,
        required: [true, 'Ingredient amount is required'],
        min: [0, 'Amount must be a positive number'],
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

export default model("Recipe", RecipeSchema);
```

---

### Step 5: Writing CRUD Routes for Recipes

**Explanation**:
Create routes to handle CRUD operations for the `Recipe` model with enhanced error handling.

**Connections**:
Integrates with Step 4's `Recipe` schema.

**Code**:

```javascript
// routes/recipeRoutes.js
import express from "express";
import Recipe from "../models/Recipe.js";

const router = express.Router();

router.get("/recipes", async (req, res) => {
  try {
    const recipes = await Recipe.find();
    res.status(200).json(recipes);
  } catch (error) {
    res.status(500).json({ message: "Error fetching recipes", error });
  }
});

router.post("/recipes", async (req, res) => {
  try {
    const newRecipe = new Recipe(req.body);
    await newRecipe.save();
    res.status(201).json(newRecipe);
  } catch (error) {
    res.status(400).json({ message: "Error saving recipe", error });
  }
});

router.put("/recipes/:id", async (req, res) => {
  try {
    const updatedRecipe = await Recipe.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!updatedRecipe) {
      return res.status(404).json({ message: "Recipe not found" });
    }
    res.status(200).json(updatedRecipe);
  } catch (error) {
    res.status(400).json({ message: "Error updating recipe", error });
  }
});

router.delete("/recipes/:id", async (req, res) => {
  try {
    const deletedRecipe = await Recipe.findByIdAndDelete(req.params.id);
    if (!deletedRecipe) {
      return res.status(404).json({ message: "Recipe not found" });
    }
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: "Error deleting recipe", error });
  }
});

export default router;
```

**Testing**:

- Test API endpoints with Postman or a similar tool to confirm correct behavior and error handling.

---

### Step 6: Integrating Routes into `server.js`

**Explanation**:
Connect the CRUD routes to the server.

**Connections**:
Completes the integration of CRUD operations into the server.

**Code**:

```javascript
// server.js (continuation)
import recipeRoutes from "./routes/recipeRoutes.js";
app.use("/api", recipeRoutes);
```

---

### Step 7: Setting Up Axios for API Requests

**Explanation**:
Create an Axios utility for making API requests.

**Connections**:
Prepares for Step 8, where external data is fetched using Axios.

**Code**:

```javascript
// utils/apiClient.js
import axios from "axios";

const apiClient = axios.create({
  baseURL: "https://api.example.com", // Replace with the actual API base URL
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${process.env.API_KEY}`, // Use API_KEY from .env
  },
});

export default apiClient;
```

---

### Step 8: Creating a Form for Recipe Submission

**Explanation**:
Create an HTML form for users to submit recipes, complete with dynamic input handling for ingredients and instructions.

**Connections**:
The form integrates with the `POST /recipes` route in Step 5 to submit data.

**Code**:

```html
<form id="recipeForm" action="/add-recipe" method="POST">
  <!-- Form fields go here -->
</form>

<script>
  let ingredientCount = 1;
  let instructionCount = 1;

  function addIngredient() {
    const container = document.getElementById("ingredientsContainer");
    const ingredientDiv = document.createElement("div");
    ingredientDiv.className = "ingredient";
    ingredientDiv.innerHTML = `
      <input type="text" name="ingredients[${ingredientCount}][name]" placeholder="Ingredient

 Name" required />
      <input type="number" name="ingredients[${ingredientCount}][amount]" placeholder="Amount" step="any" required />
      <input type="text" name="ingredients[${ingredientCount}][unit]" placeholder="Unit (e.g., grams, cups)" />
    `;
    container.appendChild(ingredientDiv);
    ingredientCount++;
  }

  function addInstruction() {
    const container = document.getElementById("instructionsContainer");
    const instructionDiv = document.createElement("div");
    instructionDiv.className = "instruction";
    instructionDiv.innerHTML = `
      <input type="number" name="analyzedInstructions[${instructionCount}][stepNumber]" placeholder="Step Number" min="1" required />
      <textarea name="analyzedInstructions[${instructionCount}][step]" placeholder="Step Description" required></textarea>
    `;
    container.appendChild(instructionDiv);
    instructionCount++;
  }
</script>
```

**Testing**:

- Submit the form to check that data is correctly sent to the backend and saved to the database.

---

### Step 9: Create API Controller for External Requests

**Explanation**:
Handle external API requests using Axios.

**Connections**:
Connects Step 7 (Axios setup) with Step 10 (routes for external API calls).

**Code**:

```javascript
// controllers/apiController.js
import apiClient from "../utils/apiClient.js";

export const fetchExternalRecipes = async (req, res) => {
  try {
    const response = await apiClient.get("/recipes");
    res.status(200).json(response.data);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to fetch recipes from external API", error });
  }
};
```

---

### Step 10: Implement `RecipeList` and `RecipeCard` Components

**Explanation**:
These components are designed to display the list of recipes fetched from the backend. `RecipeList` maps over the `recipes` prop and renders individual `RecipeCard` components for each recipe. This step ensures that the user interface dynamically updates with recipes from the backend or external API.

**Connections**:
This step builds on **Step 6**, where recipes were fetched and passed to `RecipeList`. It also ties back to **Step 9**, where the structure of recipes was defined in the schema.

**Code**:

```javascript
// client/src/components/RecipeList.js
import React from "react";
import RecipeCard from "./RecipeCard";

function RecipeList({ recipes }) {
  console.log("Recipes passed to RecipeList:", recipes); // Test point

  return (
    <div>
      {recipes.map((recipe) => (
        <RecipeCard key={recipe._id} recipe={recipe} />
      ))}
    </div>
  );
}

export default RecipeList;

// client/src/components/RecipeCard.js
function RecipeCard({ recipe }) {
  return (
    <div>
      <h3>{recipe.title}</h3>
      <p>{recipe.ingredients.map(ingredient => ingredient.name).join(", ")}</p>
      <img src={recipe.image} alt={recipe.title} style={{ width: "200px", height: "auto" }} />
    </div>
  );
}

export default RecipeCard;
```

**Test**:

- Add a `console.log()` in the `RecipeList` component to verify that the `recipes` prop is received and mapped correctly.
- **Why**: To ensure data from the backend is being rendered in `RecipeList`.
- **Successful Return Indicates**: The `RecipeList` and `RecipeCard` components correctly display recipe data.

---

### Step 11: Implement Ingredient Comparison Logic

**Explanation**:
This function helps identify common ingredients between two recipes. It's useful for comparing recipes and determining similarities, which can be used for sorting or grouping in the frontend.

**Connections**:
This step builds on **Step 10** and prepares for potential enhancements in the UI, such as highlighting similar recipes or dynamically rearranging recipes based on shared ingredients.

**Code**:

```javascript
// client/src/utils/compareIngredients.js
function compareIngredients(recipe1, recipe2) {
  const commonIngredients = recipe1.ingredients.filter((ingredient) =>
    recipe2.ingredients.some((ing) => ing.name === ingredient.name)
  );
  console.log("Common ingredients:", commonIngredients); // Test point
  return commonIngredients;
}

export default compareIngredients;

// Test the function with sample data in a component or a test file
compareIngredients(
  {
    ingredients: [{ name: "spaghetti" }, { name: "cheese" }, { name: "eggs" }],
  },
  { ingredients: [{ name: "cheese" }, { name: "tomato" }, { name: "eggs" }] }
);
```

**Testing**:

- **Console Test**: Run the function with sample data and check the console for `Common ingredients:`.
- **Why**: Validates the logic for ingredient comparison.
- **Successful Return Indicates**: The function correctly identifies shared ingredients between recipes.

---

### Final Steps and Checks

1. **Test API Calls**: Confirm the frontend fetches recipes from the backend and displays them in `RecipeList` and `RecipeCard`.
2. **Verify Ingredient Comparison**: Use the `compareIngredients` function in a component or utility test to ensure it returns the expected results.
3. **Run Linter**: Ensure code follows best practices using a linter like ESLint.
4. **Write Unit Tests**: Set up Jest and add tests for the backend and frontend components.
5. **UI Adjustments**: Integrate the `compareIngredients` logic with UI components to enhance the user experience by showing similar recipes or sorting by common ingredients.

---

These updates ensure a more robust, maintainable, and secure development process.
