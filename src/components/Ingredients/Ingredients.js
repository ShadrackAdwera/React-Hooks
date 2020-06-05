import React, { useState } from 'react';
import IngredientForm from './IngredientForm';
import Search from './Search';
import IngredientList from './IngredientList';

const Ingredients = () => {
  const [ingredients, setIngredients] = useState([]);

  const addIngredientHandler = (ingredient) => (
      setIngredients(prevIngredients=>
      [...prevIngredients, { id:Math.random().toString(), ...ingredient }]
    )
  );

  return (
    <div className="App">
      <IngredientForm onAddIngredient={addIngredientHandler} />

      <section>
        <Search />
        <IngredientList ingredients={ingredients} onRemoveItem={()=>{}} />
      </section>
    </div>
  );
};

export default Ingredients;
