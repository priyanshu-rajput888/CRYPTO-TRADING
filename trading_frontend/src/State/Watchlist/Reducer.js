import {
  GET_USER_WATCHLIST_FAILURE,
  GET_USER_WATCHLIST_REQUEST,
  GET_USER_WATCHLIST_SUCCESS,
  TOGGLE_WATCHLIST_FAILURE,
  TOGGLE_WATCHLIST_REQUEST,
  TOGGLE_WATCHLIST_SUCCESS,
} from "./ActionType";

const initialState = {
  data: null,
  loading: false,
  error: null,
};

const watchlistReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_USER_WATCHLIST_REQUEST:
    case TOGGLE_WATCHLIST_REQUEST:
      return { ...state, loading: true, error: null };

    case GET_USER_WATCHLIST_SUCCESS:
      return {
        ...state,
        data: action.payload,
        loading: false,
        error: null,
      };

    case TOGGLE_WATCHLIST_SUCCESS: {
      const coins = state.data?.coins ?? [];
      const isAlreadySaved = coins.some((coin) => coin.id === action.payload.id);
      const updatedCoins = isAlreadySaved
        ? coins.filter((coin) => coin.id !== action.payload.id)
        : [...coins, action.payload];

      return {
        ...state,
        data: { ...(state.data ?? {}), coins: updatedCoins },
        loading: false,
        error: null,
      };
    }

    case GET_USER_WATCHLIST_FAILURE:
    case TOGGLE_WATCHLIST_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.error,
      };

    default:
      return state;
  }
};

export default watchlistReducer;
