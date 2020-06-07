import React, { useEffect, useCallback, useReducer } from 'react';
import IngredientForm from './IngredientForm';
import Search from './Search';
import IngredientList from './IngredientList';
import ErrorModal from '../UI/ErrorModal';

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

const httpReducer = (httpState, action) => {
  switch (action.type) {
    case 'SEND':
      return {loading:true, error:null};
    case 'RESPONSE':
      return {...httpState,loading:false}
    case 'ERROR':
      return {loading:false, error:action.error}
    case 'CLEAR' :
      return { ...httpState, error:null}
    default:
      throw new Error('Fucc them kids');
  }
};

const Ingredients = () => {
  const [userIngredients, dispatch] = useReducer(ingredientReducer, []);
  const [httpState, dispatchHttp] = useReducer(httpReducer, { loading: false, error: null });
  //const [ingredients, setIngredients] = useState([]);
  // const [isLoading, setIsLoading] = useState(false);
  // const [errorFetch, setErrorFetch] = useState();

  useEffect(() => {
    dispatchHttp({type: 'SEND'})
    fetch('https://react-hooks-demo-7a4ec.firebaseio.com/ingredients.json')
      .then((response) => {
        dispatchHttp({type:'RESPONSE'})
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
        //setIngredients(loadedIngredients);
        dispatch({
          type: 'READ',
          ingredients: loadedIngredients,
        });
      })
      .catch((error) => {
        dispatchHttp({type:'ERROR', error: error.message})
      });
  }, []);

  const addIngredientHandler = useCallback((ingredient) => {
    dispatchHttp({type: 'SEND'})
    fetch('https://react-hooks-demo-7a4ec.firebaseio.com/ingredients.json', {
      method: 'POST',
      body: JSON.stringify(ingredient),
      headers: { 'Content-Type': 'application/json' },
    })
      .then((response) => {
        dispatchHttp({type: 'RESPONSE'})
        return response.json();
      })
      .then((responseData) => {
        // setIngredients((prevIngredients) => [
        //   ...prevIngredients,
        //   { id: responseData.name, ...ingredient },
        // ]);
        dispatch({
          type: 'CREATE',
          ingredient: { id: responseData.name, ...ingredient },
        });
      })
      .catch((error) => {
        dispatchHttp({type:'ERROR', error: error.message})
      });
  });

  const removeIngredientHandler = (id) => {
    dispatchHttp({type:'SEND'})
    fetch(
      `https://react-hooks-demo-7a4ec.firebaseio.com/ingredients/${id}.json`,
      {
        method: 'DELETE',
      }
    )
      .then((response) => {
        dispatchHttp({type:'RESPONSE'})
        // setIngredients((prevIngredients) =>
        //   prevIngredients.filter((ingredient) => ingredient.id !== id)
        // );
        dispatch({
          type: 'DELETE',
          id: id,
        });
      })
      .catch((error) => {
        dispatchHttp({type:'ERROR', error: error.message})
      });
  };

  const filteredIngredientsHandler = useCallback((filteredIngredient) => {
    //setIngredients(filteredIngredient);
    dispatch({
      type: 'READ',
      ingredients: filteredIngredient,
    });
  }, []);

  const clearError = useCallback(() => {
    dispatchHttp({type:'CLEAR'})
  }, []);

  return (
    <div className="App">
      {httpState.error ? (
        <ErrorModal onClose={clearError}>{httpState.error}</ErrorModal>
      ) : null}
      <IngredientForm
        onAddIngredient={addIngredientHandler}
        loading={httpState.loading}
      />

      <section>
        <Search onLoadIngredients={filteredIngredientsHandler} />
        <IngredientList
          ingredients={userIngredients}
          onRemoveItem={removeIngredientHandler}
        />
      </section>
    </div>
  );
};

export default Ingredients;
