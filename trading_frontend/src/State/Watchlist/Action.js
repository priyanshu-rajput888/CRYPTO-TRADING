import api from "@/config/Api";
import {
  GET_USER_WATCHLIST_FAILURE,
  GET_USER_WATCHLIST_REQUEST,
  GET_USER_WATCHLIST_SUCCESS,
  TOGGLE_WATCHLIST_FAILURE,
  TOGGLE_WATCHLIST_REQUEST,
  TOGGLE_WATCHLIST_SUCCESS,
} from "./ActionType";

export const getUserWatchlist = (jwt) => async (dispatch) => {
  dispatch({ type: GET_USER_WATCHLIST_REQUEST });

  try {
    const response = await api.get("/api/watchlist/user", {
      headers: { Authorization: `Bearer ${jwt}` },
    });

    dispatch({
      type: GET_USER_WATCHLIST_SUCCESS,
      payload: response.data,
    });
  } catch (error) {
    dispatch({
      type: GET_USER_WATCHLIST_FAILURE,
      error: error.response?.data?.message ?? error.message,
    });
  }
};

export const toggleWatchlistCoin = ({ jwt, coinId }) => async (dispatch) => {
  dispatch({ type: TOGGLE_WATCHLIST_REQUEST });

  try {
    const response = await api.patch(
      `/api/watchlist/add/coin/${coinId}`,
      null,
      { headers: { Authorization: `Bearer ${jwt}` } }
    );

    dispatch({
      type: TOGGLE_WATCHLIST_SUCCESS,
      payload: response.data,
    });
    return true;
  } catch (error) {
    dispatch({
      type: TOGGLE_WATCHLIST_FAILURE,
      error: error.response?.data?.message ?? error.message,
    });
    return false;
  }
};
