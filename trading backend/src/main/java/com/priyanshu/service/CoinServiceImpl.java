package com.priyanshu.service;

import com.priyanshu.modal.Coin;
import com.priyanshu.repository.CoinRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.HttpServerErrorException;
import org.springframework.web.client.RestTemplate;
import tools.jackson.core.type.TypeReference;
import tools.jackson.databind.JsonNode;
import tools.jackson.databind.ObjectMapper;

import java.util.List;
import java.util.Optional;

@Service
public class CoinServiceImpl implements CoinService{

    @Autowired
    private CoinRepository coinRepository;

    @Autowired
    private ObjectMapper objectMapper;

    @Override
    public List<Coin> getCoinList(int page) throws Exception {
        String url = "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&per_page=10&page="+page;

        RestTemplate restTemplate = new RestTemplate();

        try {
            HttpHeaders headers = new HttpHeaders();

            HttpEntity<String> entity = new HttpEntity<String>("parameters", headers);

            ResponseEntity<String> response = restTemplate.exchange(url, HttpMethod.GET, entity, String.class);

            return objectMapper.readValue(response.getBody(), new TypeReference<List<Coin>>() {});

        } catch (HttpClientErrorException | HttpServerErrorException e) {
            throw new Exception(e.getMessage());
        }
    }

    @Override
    public String getMarketChart(String coinId, int days) throws Exception {
        String url = "https://api.coingecko.com/api/v3/coins/"+coinId+"/market_chart?vs_currency=usd&days="+days;

        RestTemplate restTemplate = new RestTemplate();

        try {
            HttpHeaders headers = new HttpHeaders();

            HttpEntity<String> entity = new HttpEntity<String>("parameters", headers);

            ResponseEntity<String> response = restTemplate.exchange(url, HttpMethod.GET, entity, String.class);

            return response.getBody();

        } catch (HttpClientErrorException | HttpServerErrorException e) {
            throw new Exception(e.getMessage());
        }
    }


    @Override
    public String getCoinDetails(String coinId) throws Exception {

        String url = "https://api.coingecko.com/api/v3/coins/" + coinId;

        RestTemplate restTemplate = new RestTemplate();

        try {
            HttpHeaders headers = new HttpHeaders();
            HttpEntity<String> entity = new HttpEntity<>(headers);

            ResponseEntity<String> response = restTemplate.exchange(
                    url,
                    HttpMethod.GET,
                    entity,
                    String.class
            );

            JsonNode jsonNode = objectMapper.readTree(response.getBody());

            Coin coin = new Coin();

            coin.setId(requiredNode(jsonNode, "id").asText());
            coin.setName(requiredNode(jsonNode, "name").asText());
            coin.setSymbol(requiredNode(jsonNode, "symbol").asText());
            coin.setImage(optionalText(jsonNode, "image", "large"));
            coin.setCurrentPrice(optionalText(jsonNode, "market_data", "current_price", "usd"));
            coin.setMarketCap(optionalText(jsonNode, "market_data", "market_cap", "usd"));
            coin.setMarketCapRank(optionalText(jsonNode, "market_data", "market_cap_rank"));
            coin.setTotalVolume(optionalText(jsonNode, "market_data", "total_volume", "usd"));
            coin.setHigh24h(optionalText(jsonNode, "market_data", "high_24h", "usd"));
            coin.setLow24h(optionalText(jsonNode, "market_data", "low_24h", "usd"));
            coin.setPriceChange24h(optionalText(jsonNode, "market_data", "price_change_24h"));
            coin.setPriceChangePercentage24h(
                    optionalText(jsonNode, "market_data", "price_change_percentage_24h")
            );
            coin.setMarketCapChange24h(
                    optionalText(jsonNode, "market_data", "market_cap_change_24h")
            );
            coin.setMarketCapChangePercentage24h(
                    optionalText(jsonNode, "market_data", "market_cap_change_percentage_24h")
            );
            coin.setTotalSupply(optionalText(jsonNode, "market_data", "total_supply"));

            coinRepository.save(coin);

            return response.getBody();

        } catch (HttpClientErrorException | HttpServerErrorException e) {
            throw new Exception("CoinGecko API error: " + e.getMessage(), e);
        }
    }

    private JsonNode requiredNode(JsonNode parent, String field) {

        JsonNode node = parent.get(field);

        if (node == null || node.isNull()) {
            throw new IllegalStateException(
                    "Missing or null JSON field: " + field
            );
        }

        return node;
    }

    private String optionalText(JsonNode parent, String... path) {
        JsonNode node = parent;
        for (String field : path) {
            if (node == null || node.isNull()) {
                return null;
            }
            node = node.get(field);
        }
        return node == null || node.isNull() ? null : node.asText();
    }


    @Override
    public Coin findById(String coinId) throws Exception {
        Optional<Coin> optionalCoin = coinRepository.findById(coinId);
        if(optionalCoin.isEmpty())
            throw new Exception("Coin not found");
        return optionalCoin.get();
    }

    @Override
    public String searchCoin(String keyword) throws Exception {
        String url = "https://api.coingecko.com/api/v3/search?query="+keyword;

        RestTemplate restTemplate = new RestTemplate();

        try {
            HttpHeaders headers = new HttpHeaders();

            HttpEntity<String> entity = new HttpEntity<String>("parameters", headers);

            ResponseEntity<String> response = restTemplate.exchange(url, HttpMethod.GET, entity, String.class);

            return response.getBody();

        } catch (HttpClientErrorException | HttpServerErrorException e) {
            throw new Exception(e.getMessage());
        }
    }

    @Override
    public String getTop50CoinsByMarketCapRank() throws Exception {
        String url = "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&per_page=50&page=1";

        RestTemplate restTemplate = new RestTemplate();

        try {
            HttpHeaders headers = new HttpHeaders();

            HttpEntity<String> entity = new HttpEntity<String>("parameters", headers);

            ResponseEntity<String> response = restTemplate.exchange(url, HttpMethod.GET, entity, String.class);

            return response.getBody();

        } catch (HttpClientErrorException | HttpServerErrorException e) {
            throw new Exception(e.getMessage());
        }
    }

    @Override
    public String getTradingCoins() throws Exception {
        String url = "https://api.coingecko.com/api/v3/search/trending";

        RestTemplate restTemplate = new RestTemplate();

        try {
            HttpHeaders headers = new HttpHeaders();

            HttpEntity<String> entity = new HttpEntity<String>("parameters", headers);

            ResponseEntity<String> response = restTemplate.exchange(url, HttpMethod.GET, entity, String.class);

            return response.getBody();

        } catch (HttpClientErrorException | HttpServerErrorException e) {
            throw new Exception(e.getMessage());
        }
    }
}
