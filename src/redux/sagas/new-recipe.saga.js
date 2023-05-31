import { put, takeLatest } from 'redux-saga/effects';
import axios from 'axios';

function* createNewRecipe({payload: newRecipe}) {
  try {
    console.log('newRecipe within saga:', newRecipe);
    if(isNaN(newRecipe.categoryInput)) {
      const {data: newCategoryId} = yield axios.post('/api/recipes/recipe-categories', newRecipe.categoryInput)
      newRecipe.categoryInput = newCategoryId
    }
    for (let ingredient of newRecipe.recipeIngredients) {
      if(isNaN(ingredient.units.id)) {
        const {data: newUnitId} = yield axios.post('/api/recipes/units-of-measurement', ingredient.units)
        ingredient.units.id = newUnitId
      }
      if(isNaN(ingredient.ingredient.id)) {
        const {data: newIngredientId} = yield axios.post('/api/recipes/ingredients', ingredient.ingredient)
        ingredient.ingredient.id = newIngredientId
      }
    }

    const response = yield axios.post('/api/recipes/', newRecipe)
    yield put({type: 'FETCH_RECIPES'})
    // yield put({type: 'FETCH_NEW_RECIPE'})
  } catch (error) {
    console.log('Error within createNewRecipe saga:', error);
  }
}

function* fetchNewRecipe() {
  try {
    const {data:newRecipeId} = yield axios.get('/api/recipes/new-recipe-id')
    yield put({type: 'SET_NEW_RECIPE', payload: newRecipeId})
  } catch (error) {
    console.log('Error within fetchNewRecipeId saga:', error);
  }
}

export default function* recipesSaga() {
  yield takeLatest('CREATE_NEW_RECIPE', createNewRecipe)
  yield takeLatest('FETCH_NEW_RECIPE', fetchNewRecipe)
}