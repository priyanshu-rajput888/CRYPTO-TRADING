import axios from "axios";
import { FETCH_COIN_BY_ID_FAILURE, FETCH_COIN_BY_ID_REQUEST, FETCH_COIN_BY_ID_SUCCESS, FETCH_COIN_DETAILS_FAILURE, FETCH_COIN_DETAILS_REQUEST, FETCH_COIN_DETAILS_SUCCESS, FETCH_COIN_LIST_FAILURE, FETCH_COIN_LIST_REQUEST, FETCH_COIN_LIST_SUCCESS, FETCH_MARKET_CHART_FAILURE, FETCH_MARKET_CHART_REQUEST, FETCH_MARKET_CHART_SUCCESS, FETCH_TOP_50_COINS_FAILURE, FETCH_TOP_50_COINS_REQUEST, FETCH_TOP_50_COINS_SUCCESS, SEARCH_COIN_FAILURE, SEARCH_COIN_REQUEST, SEARCH_COIN_SUCCESS } from "./Reducer";
import api, { API_BASE_URL } from "@/config/Api";

const requestCache = new Map();
const pendingRequests = new Map();
const REQUEST_CACHE_TTL = 60_000;

const getCachedRequest = async (key, request) => {
    const cached = requestCache.get(key);
    if (cached && Date.now() - cached.cachedAt < REQUEST_CACHE_TTL) {
        return cached.data;
    }

    if (pendingRequests.has(key)) {
        return pendingRequests.get(key);
    }

    const pendingRequest = request()
        .then((data) => {
            requestCache.set(key, {data, cachedAt: Date.now()});
            return data;
        })
        .finally(() => pendingRequests.delete(key));

    pendingRequests.set(key, pendingRequest);
    return pendingRequest;
};

export const getCoinList = (page) => async (dispatch) => {
    dispatch({ type: FETCH_COIN_LIST_REQUEST });
    const baseUrl = "http://localhost:5454";

    try {
        const data = await getCachedRequest(
            `coin-list:${page}`,
            () => axios.get(`${baseUrl}/coins?page=${page}`).then((response) => response.data)
        );
        console.log("coin list", data);
        dispatch({type: FETCH_COIN_LIST_SUCCESS, payload: data});
    } catch (error) {
        dispatch({type: FETCH_COIN_LIST_FAILURE, payload: error.response?.data?.message ?? error.message});
        console.log(error);
    }
};


export const getTop50CoinList = () => async (dispatch) => {
    dispatch({ type: FETCH_TOP_50_COINS_REQUEST });

    try {
        const data = await getCachedRequest(
            "coin-list:top50",
            () => axios.get(`${API_BASE_URL}/coins/top50`).then((response) => response.data)
        );
        dispatch({type: FETCH_TOP_50_COINS_SUCCESS, payload: data});
        console.log("top 50", data);
    } catch (error) {
        dispatch({type: FETCH_TOP_50_COINS_FAILURE, payload: error.response?.data?.message ?? error.message});
        console.log(error);
    }
};

export const fetchMarketChart = ({coinId, days}) => async (dispatch) => {
    dispatch({type: FETCH_MARKET_CHART_REQUEST, payload: {coinId, days}});

    try {
        const data = await getCachedRequest(
            `market-chart:${coinId}:${days}`,
            () => api.get(`/coins/${coinId}/chart?days=${days}`).then((response) => response.data)
        );
        dispatch({type: FETCH_MARKET_CHART_SUCCESS, payload: {coinId, days, data}});
        console.log("market chart", data);
    } catch (error) {
        dispatch({
            type: FETCH_MARKET_CHART_FAILURE,
            payload: {
                coinId,
                days,
                error: error.response?.data?.message ?? error.message
            }
        });
        console.log(error);
    }
};

export const fetchCoinById = (coinId) => async (dispatch) => {
    dispatch({ type: FETCH_COIN_BY_ID_REQUEST });

    try {
        const response = await axios.get(`${API_BASE_URL}/coins/${coinId}`);
        dispatch({type: FETCH_COIN_BY_ID_SUCCESS, payload: response.data});
        console.log("coin by id ", response.data);
    } catch (error) {
        dispatch({type: FETCH_COIN_BY_ID_FAILURE, payload: error.message});
        console.log(error);
    }
};

export const fetchCoinDetails = ({coinId}) => async (dispatch) => {
    dispatch({ type: FETCH_COIN_DETAILS_REQUEST });

    try {
        const data = await getCachedRequest(
            `coin-details:${coinId}`,
            () => api.get(`/coins/details/${coinId}`).then((response) => response.data)
        );
        dispatch({type: FETCH_COIN_DETAILS_SUCCESS, payload: data});
        console.log("coin details", data);
    } catch (error) {
        dispatch({type: FETCH_COIN_DETAILS_FAILURE, payload: error.message});
        console.log(error);
    }
};

export const searchCoin = (keyword) => async (dispatch) => {
    dispatch({ type: SEARCH_COIN_REQUEST });

    const query = keyword.trim();
    if (!query) {
        dispatch({type: SEARCH_COIN_SUCCESS, payload: {coins: []}});
        return;
    }

    try {
        const response = await api.get("/coins/search", {
            params: {q: query},
        });
        dispatch({type: SEARCH_COIN_SUCCESS, payload: response.data});
    } catch (error) {
        dispatch({
            type: SEARCH_COIN_FAILURE,
            payload: error.response?.data?.message ?? error.message,
        });
    }
};