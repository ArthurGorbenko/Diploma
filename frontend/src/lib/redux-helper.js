/*
const [ADD_TODO, addTodo] = createAction('ADD_TODO', 'text')
*/

export const createAction = (name, ...argNames) => {
  const type = `ADMIN/${name}`;
  const action = (...args) => {
    const action = {type};
    argNames.forEach((arg, index) => {
      action[argNames[index]] = args[index];
    });
    return action;
  };

  return [type, action];
};

/*
const reducer = createReducer([], {
  [ADD_TODO]: (state, {text}) => ([...state, text])
})
*/
export const createReducer = (initialState, handlers) => (state = initialState, action) =>
  handlers[action.type] ? handlers[action.type](state, action) : state;
