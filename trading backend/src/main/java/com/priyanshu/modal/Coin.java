package com.priyanshu.modal;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import lombok.Data;

import java.util.Date;

@Data
@Entity
public class Coin {

    @Id
    @JsonProperty("id")
    private String id;

    @JsonProperty("symbol")
    private String symbol;

    @JsonProperty("name")
    private String name;

    @JsonProperty("image")
    private String image;

    @JsonProperty("current_price")
    private String currentPrice;

    @JsonProperty("market_cap")
    private String marketCap;

    @JsonProperty("market_cap_rank")
    private String marketCapRank;

    @JsonProperty("fully_diluted_valuation")
    private String fullyDilutedValuation;

    @JsonProperty("total_volume")
    private String totalVolume;

    @JsonProperty("high_24h")
    private String high24h;

    @JsonProperty("low_24h")
    private String low24h;

    @JsonProperty("price_change_24h")
    private String priceChange24h;

    @JsonProperty("price_change_percentage_24h")
    private String priceChangePercentage24h;

    @JsonProperty("market_cap_change_24h")
    private String marketCapChange24h;

    @JsonProperty("market_cap_change_percentage_24h")
    private String marketCapChangePercentage24h;

    @JsonProperty("circulating_supply")
    private String circulatingSupply;

    @JsonProperty("total_supply")
    private String totalSupply;

    @JsonProperty("max_supply")
    private String maxSupply;

    @JsonProperty("ath")
    private String ath;

    @JsonProperty("ath_change_percentage")
    private String athChangePercentage;

    @JsonProperty("ath_date")
    private Date athDate;

    @JsonProperty("atl")
    private double atl;

    @JsonProperty("atl_change_percentage")
    private double atlChangePercentage;

    @JsonProperty("atl_date")
    private Date atlDate;

    @JsonProperty("roi")
    @JsonIgnore
    private Date roi;

    @JsonProperty("last_updated")
    private Date lastUpdated;
}
