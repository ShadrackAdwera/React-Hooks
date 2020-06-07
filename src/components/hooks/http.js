import { useReducer, useCallback } from 'react';

const initialState = {
  loading: false,
  error: null,
  data: null,
  extra: null,
  identifier: null,
};

const httpReducer = (httpState, action) => {
  switch (action.type) {
    case 'SEND':
      return {
        loading: true,
        error: null,
        data: null,
        extra: null,
        identifier: action.identifier,
      };
    case 'RESPONSE':
      return {
        ...httpState,
        loading: false,
        data: action.resposeData,
        extra: action.extra,
      };
    case 'ERROR':
      return { loading: false, error: action.error, data: null };
    case 'CLEAR':
      return initialState;
    default:
      throw new Error('Fucc them kids');
  }
};

const useHttp = () => {
  const [httpState, dispatchHttp] = useReducer(httpReducer, initialState);

  const clear = useCallback(()=> dispatchHttp({type:'CLEAR'}),[])

  const sendRequest = useCallback(
    (url, method, body, reqExtra, reqIdentifier) => {
      dispatchHttp({ type: 'SEND', identifier: reqIdentifier });
      fetch(url, {
        method: method,
        body: body,
        headers: {
          'Content-Type': 'application/json',
        },
      })
        .then((response) => {
          return response.json();
        })
        .then((responseData) => {
          dispatchHttp({
            type: 'RESPONSE',
            responseData: responseData,
            extra: reqExtra,
          });
          // setIngredients((prevIngredients) =>
          //   prevIngredients.filter((ingredient) => ingredient.id !== id)
          // );
        })
        .catch((error) => {
          dispatchHttp({ type: 'ERROR', error: error.message });
        });
    },
    []
  );
  return {
    isLoading: httpState.loading,
    data: httpState.data,
    error: httpState.error,
    sendRequest: sendRequest,
    reqExtra: httpState.extra,
    identifier: httpState.identifier,
    clear: clear
  };
};

export default useHttp;
