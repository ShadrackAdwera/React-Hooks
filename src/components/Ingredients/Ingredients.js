import React, { useState, useEffect, useCallback } from 'react';
import IngredientForm from './IngredientForm';
import Search from './Search';
import IngredientList from './IngredientList';
import ErrorModal from '../UI/ErrorModal'

const Ingredients = () => {
  const [ingredients, setIngredients] = useState([]);
  const [isLoading, setIsLoading] = useState(false)
  const [errorFetch, setErrorFetch] = useState()

  useEffect(() => {
    setIsLoading(true)
    fetch('https://react-hooks-demo-7a4ec.firebaseio.com/ingredients.json')
      .then((response) => {
        setIsLoading(false)
        return response.json();
      })
      .then((responseData) => {
        const loadedIngredients = [];
        for (const key in responseData) {
          loadedIngredients.push({
            id: key,
            title: responseData[key].title,
            amount: responseData[key].amount,
          });
        }
        setIngredients(loadedIngredients);
      }).catch(error=>{
        setErrorFetch(error.message)
      });
  }, []);

  const addIngredientHandler = (ingredient) => {
    setIsLoading(true)
    fetch('https://react-hooks-demo-7a4ec.firebaseio.com/ingredients.json', {
      method: 'POST',
      body: JSON.stringify(ingredient),
      headers: { 'Content-Type': 'application/json' },
    })
      .then((response) => {
        setIsLoading(false)
        return response.json();
      })
      .then((responseData) => {
        setIngredients((prevIngredients) => [
          ...prevIngredients,
          { id: responseData.name, ...ingredient },
        ]);
      }).catch(error=>{
        setErrorFetch(true)
        setIsLoading(false)
      });
  };

  const removeIngredientHandler = (id) => {
    setIsLoading(true)
    fetch(
      `https://react-hooks-demo-7a4ec.firebaseio.com/ingredients/${id}.json`,
      {
        method: 'DELETE',
      }
    ).then((response) => {
      setIsLoading(false)
      setIngredients((prevIngredients) =>
        prevIngredients.filter((ingredient) => ingredient.id !== id)
      );
    }).catch(error=>{
      setIsLoading(false)
      setErrorFetch(error.message)
    });
  };

  const filteredIngredientsHandler = useCallback((filteredIngredient) => {
    setIngredients(filteredIngredient);
  }, []);

  const clearError = () => {
    setErrorFetch(null)
  }

  return (
    <div className="App">
      {errorFetch? <ErrorModal onClose={clearError}>{errorFetch}</ErrorModal> : null}
      <IngredientForm onAddIngredient={addIngredientHandler} loading={isLoading} />

      <section>
        <Search onLoadIngredients={filteredIngredientsHandler} />
        <IngredientList
          ingredients={ingredients}
          onRemoveItem={removeIngredientHandler}
        />
      </section>
    </div>
  );
};

export default Ingredients;
