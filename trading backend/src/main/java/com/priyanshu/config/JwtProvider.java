package com.priyanshu.config;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.util.Collection;
import java.util.Date;
import java.util.HashSet;
import java.util.Set;

@Component
public class JwtProvider {

    private final SecretKey key;

    public JwtProvider(SecretKey key) {
        this.key = key;
    }

    public String generateToken(Authentication auth){
        Collection<? extends GrantedAuthority> authorities = auth.getAuthorities();
        String roles = populateAuthorities(authorities);
        return Jwts.builder()
                .issuedAt(new Date())
                .expiration(new Date(new Date().getTime() + 86400000))
                .claim("email", auth.getName())
                .claim("authorities", roles)
                .signWith(key)
                .compact();
    }

    public String getEmailFromToken(String token){
        token = token.substring(7);
        Claims claims = Jwts.parser().verifyWith(key).build().parseSignedClaims(token).getPayload();

        return String.valueOf(claims.get("email"));
    }

    private static String populateAuthorities(Collection<? extends GrantedAuthority> authorities) {
        Set<String> auth = new HashSet<>();
        for(GrantedAuthority ga : authorities)
            auth.add(ga.getAuthority());
        return String.join(",", auth);
    }
}
