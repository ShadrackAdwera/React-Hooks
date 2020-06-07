import React, { useEffect, useCallback, useReducer, useMemo } from 'react';
import IngredientForm from './IngredientForm';
import Search from './Search';
import IngredientList from './IngredientList';
import ErrorModal from '../UI/ErrorModal';
import useHttp from '../hooks/http';

const ingredientReducer = (currentIngredients, action) => {
  switch (action.type) {
    case 'CREATE':
      return [...currentIngredients, action.ingredient];
    case 'READ':
      return action.ingredients;
    case 'DELETE':
      return currentIngredients.filter((ingrd) => ingrd.id !== action.id);
    default:
      throw new Error('FUCC OFF');
  }
};

const Ingredients = () => {
  const [userIngredients, dispatch] = useReducer(ingredientReducer, []);
  const {
    isLoading,
    error,
    data,
    reqExtra,
    identifier,
    clear,
    sendRequest,
  } = useHttp();

  useEffect(() => {
    if (!isLoading && !error && identifier === 'REMOVE_INGREDIENT') {
      dispatch({ type: 'DELETE', id: reqExtra });
    } else if (!isLoading && !error && identifier === 'ADD_INGREDIENT') {
      dispatch({
        type: 'CREATE',
        ingredient: { id: data.name, ...reqExtra },
      });
    }
  }, [data, reqExtra, identifier, isLoading, error]);

  const addIngredientHandler = useCallback(
    (ingredient) => {
      sendRequest(
        'https://react-hooks-demo-7a4ec.firebaseio.com/ingredients.json',
        'POST',
        JSON.stringify(ingredient),
        'ADD_INGREDIENT'
      );
    },
    [sendRequest]
  );

  const removeIngredientHandler = useCallback(
    (id) => {
      sendRequest(
        `https://react-hooks-demo-7a4ec.firebaseio.com/ingredients/${id}.json`,
        'DELETE',
        null,
        id,
        'REMOVE_INGREDIENT'
      );
    },
    [sendRequest]
  );

  const filteredIngredientsHandler = useCallback((filteredIngredient) => {
    dispatch({
      type: 'READ',
      ingredients: filteredIngredient,
    });
  }, []);

  const ingredientList = useMemo(() => {
    return (
      <IngredientList
        ingredients={userIngredients}
        onRemoveItem={removeIngredientHandler}
      />
    );
  }, [userIngredients, removeIngredientHandler]);

  return (
    <div className="App">
      {error ? <ErrorModal onClose={clear}>{error}</ErrorModal> : null}
      <IngredientForm
        onAddIngredient={addIngredientHandler}
        loading={isLoading}
      />

      <section>
        <Search onLoadIngredients={filteredIngredientsHandler} />
        {ingredientList}
      </section>
    </div>
  );
};

export default Ingredients;
