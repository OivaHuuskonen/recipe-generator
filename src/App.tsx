import { FormEvent, useState } from "react";
import { Loader, Placeholder } from "@aws-amplify/ui-react";
import "./App.css";
import { Amplify } from "aws-amplify";
import { Schema } from "../amplify/data/resource";
import { generateClient } from "aws-amplify/data";
import outputs from "../amplify_outputs.json";


import "@aws-amplify/ui-react/styles.css";

Amplify.configure(outputs);

const amplifyClient = generateClient<Schema>({
  authMode: "userPool",
});

function App() {
  const [result, setResult] = useState<string>("");
  const [loading, setLoading] = useState(false);

  /*const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);

    try {
      const formData = new FormData(event.currentTarget);
      
      const { data, errors } = await amplifyClient.queries.askBedrock({
        ingredients: [formData.get("ingredients")?.toString() || ""],
      });

      if (!errors) {
        setResult(data?.body || "No data returned");
      } else {
        console.log(errors);
      }

  
    } catch (e) {
      alert(`An error occurred: ${e}`);
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);

    try {
      const formData = new FormData(event.currentTarget);
      const ingredients = formData.get("ingredients")?.toString().split(',').map(i => i.trim()) || [];
      
      if (ingredients.length === 0) {
        alert("Please enter at least one ingredient");
        return;
      }

      const response = await amplifyClient.queries.askBedrock({
        ingredients: ingredients,
      });

      if (response.errors) {
        console.error('GraphQL errors:', response.errors);
        setResult("Sorry, there was an error generating the recipe. Please try again.");
      } else if (response.data?.body) {
        setResult(response.data.body);
      } else {
        setResult("No recipe could be generated. Please try different ingredients.");
      }
    } catch (e) {
      console.error('Error:', e);
      setResult("An error occurred while generating the recipe. Please try again.");
    } finally {
      setLoading(false);
    }
};*/


const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
  event.preventDefault();
  setLoading(true);
  setResult(""); // Tyhjennä aiempi tulos

  try {
      const formData = new FormData(event.currentTarget);
      const ingredientsString = formData.get("ingredients")?.toString() || "";
      const ingredients = ingredientsString.split(',').map(i => i.trim()).filter(i => i.length > 0);
      
      console.log('Sending ingredients:', ingredients);

      if (ingredients.length === 0) {
          setResult("Please enter at least one ingredient");
          return;
      }

      const response = await amplifyClient.queries.askBedrock({
          ingredients: ingredients
      });

      console.log('Raw response:', response);

      if (response.errors) {
          console.error('GraphQL errors:', response.errors);
          setResult("Error: Could not generate recipe. Please try again.");
          return;
      }

      if (!response.data) {
          console.error('No data in response');
          setResult("Error: No response from recipe generator");
          return;
      }

      if (response.data.body) {
          setResult(response.data.body);
      } else {
          setResult("Could not generate a recipe. Please try different ingredients.");
      }

  } catch (error) {
      console.error('Error in recipe generation:', error);
      setResult("An error occurred. Please try again.");
  } finally {
      setLoading(false);
  }
};

  return (
    <div className="app-container">
      <div className="header-container">
        <h1 className="main-header">
          Hello, meet your personal
          <br />
          <span className="highlight">Recipe AI</span>
        </h1>
        <p className="description">
          Simply type a few ingredients using the format like ingredient 1,
          ingredient 2, etc. and Recipe AI will generate an all-new recipe on
          demand...
        </p>
      </div>
      <form onSubmit={onSubmit} className="form-container">
        <div className="search-container">
          <input
            type="text"
            className="wide-input"
            id="ingredients"
            name="ingredients"
            placeholder="Ingredient1, Ingredient2, Ingredient3,...etc"
          />
          <button type="submit" className="search-button">
            Generate
          </button>
        </div>
      </form>
      <div className="result-container">
        {loading ? (
          <div className="loader-container">
            <p>Loading...</p>
            <Loader size="large" />
            <Placeholder size="large" />
            <Placeholder size="large" />
            <Placeholder size="large" />
          </div>
        ) : (
          result && <p className="result">{result}</p>
        )}
      </div>
    </div>
  );
}

export default App;