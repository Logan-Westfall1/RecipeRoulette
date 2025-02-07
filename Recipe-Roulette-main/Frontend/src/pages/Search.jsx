import React, { useState, useRef } from 'react';
import axios from 'axios';
import '../App.css';

function Search() {
    const [searchTerm, setSearchTerm] = useState('');
    const [allergyTerm, setAllergyTerm] = useState('');
    const [ingredients, setIngredients] = useState([]);
    const [allergies, setAllergies] = useState([]);
    const [results, setResults] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const ingredientInputRef = useRef(null);
    const allergyInputRef = useRef(null);

    // Define the resetSearch function here
    const resetSearch = () => {
        setSearchTerm('');
        setAllergyTerm('');
        setIngredients([]);
        setAllergies([]);
        setResults([]);
        setError('');
        setIsLoading(false); // Ensure loading state is also reset
    };

    const handleSearch = async () => {
        setIsLoading(true);
        setError('');
        setResults([]); // Ensure results are cleared at the start of a new search

        const ingredientsQuery = ingredients.join(',');
        const allergiesQuery = allergies.join(',');

        try {
            const response = await axios.get(`http://localhost:8800/search`, {
                params: { ingredients: ingredientsQuery, allergies: allergiesQuery }
            });
            setResults(response.data);
        } catch (error) {
            console.error('Error fetching search results:', error);
            setError('Failed to fetch search results. Please try again later.');
        } finally {
            setIsLoading(false);
        }
    };
    
    const addIngredient = () => {
        if (searchTerm && !ingredients.includes(searchTerm)) {
            setIngredients(prev => [...prev, searchTerm.trim()]);
            setSearchTerm('');
            ingredientInputRef.current.focus();
        }
    };

    const addAllergy = () => {
        if (allergyTerm && !allergies.includes(allergyTerm)) {
            setAllergies(prev => [...prev, allergyTerm.trim()]);
            setAllergyTerm('');
            allergyInputRef.current.focus();
        }
    };

    return (
        <div className="search-container" style = {{ paddingTop: results.length > 0 ? '750px' : '70px' }}>
            <h2>Search a Recipe</h2>

            <div className="search-sections">
                <div className="section ingredients-section">
                    <input
                        ref={ingredientInputRef}
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="Enter ingredients (e.g., flour, sugar)"
                        className="input-large"
                    />
                    <button onClick={addIngredient} disabled={!searchTerm}>Add Ingredient</button>
                    <div className="tags-container ingredients-list">
                        {ingredients.map((ingredient, index) => (
                            <div key={index} className="tag ingredient-tag">
                                {ingredient} <span className="remove-tag" onClick={() => setIngredients(ingredients.filter(ing => ing !== ingredient))}>x</span>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="section allergies-section">
                    <input
                        ref={allergyInputRef}
                        type="text"
                        value={allergyTerm}
                        onChange={(e) => setAllergyTerm(e.target.value)}
                        placeholder="Allergies or dietary restrictions (e.g., nuts, dairy)"
                        className="input-large"
                    />
                    <button onClick={addAllergy} disabled={!allergyTerm}>Add Allergy</button>
                    <div className="tags-container">
                        {allergies.map((allergy, index) => (
                            <div key={index} className="tag allergy-tag">
                                {allergy} <span className="remove-tag" onClick={() => setAllergies(allergies.filter(allergy => allergy !== allergy))}>x</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            <div className="action-buttons" >
                {results.length > 0 ? (
                    <button onClick={resetSearch}>Search a New Recipe</button>
                ) : (
                    <button onClick={handleSearch} disabled={ingredients.length === 0 && allergies.length === 0 || isLoading}>Search</button>
                )}
            </div>

            {isLoading && <p>Searching...</p>}
            {error && <p className="error-message">{error}</p>}
            {results.length > 0 ? (
                results.map((recipe) => (
                    <div key={recipe.id} className="recipe-details">
                        <div className="post">
                            <h3>{recipe.title}</h3>
                            <p>{recipe.description}</p>
                            <img src={`http://localhost:8800/uploads/${recipe.img}`} alt={recipe.title} style={{ width: "250px", height: "200px" }} />
                            <p>Ingredients: {recipe.recipe}</p>
                            <p>Instructions: {recipe.instructions}</p>
                            <p>Nutrition: {recipe.nutrition}</p>
                        </div>
                    </div>
                ))
            ) : !isLoading && <p>No results found</p>}
        </div>
    );
}

export default Search;
