package com.hodophilia.backend.security;

import java.io.IOException;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableGlobalMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.security.web.authentication.SimpleUrlAuthenticationFailureHandler;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.EnableWebMvc;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import com.hodophilia.backend.models.Provider;
import com.hodophilia.backend.models.User;
import com.hodophilia.backend.repository.UserRepository;
import com.hodophilia.backend.security.jwt.AuthEntryPointJwt;
//import com.hodophilia.SEbackend.security.jwt.AuthTokenFilter;
import com.hodophilia.backend.security.services.CustomOAuth2User;
import com.hodophilia.backend.security.services.CustomOAuth2UserService;
import com.hodophilia.backend.security.services.CustomUserDetailsService;
import com.hodophilia.backend.security.services.HttpCookieOAuth2AuthorizationRequestRepository;
//import com.hodophilia.SEbackend.security.services.UserDetailsServiceImpl;

@Configuration
@EnableGlobalMethodSecurity(
		securedEnabled = true,
        jsr250Enabled = true,
        prePostEnabled = true)
@EnableWebMvc
public class WebSecurityConfig implements WebMvcConfigurer {
	@Autowired
    private CustomUserDetailsService customUserDetailsService;

    
	@Autowired
	private UserRepository userRepository; 

	@Autowired
    private CustomOAuth2UserService oAuthUserService;

	@Autowired
	private AuthEntryPointJwt unauthorizedHandler;

	
	
	// @Autowired
    // private OAuth2AuthenticationSuccessHandler oAuth2AuthenticationSuccessHandler;

    // @Autowired
    // private OAuth2AuthenticationFailureHandler oAuth2AuthenticationFailureHandler;

//	@Bean
//	public AuthTokenFilter authenticationJwtTokenFilter() {
//		return new AuthTokenFilter();
//	}
//	
	@Override
	public void addCorsMappings(CorsRegistry registry) {
		registry.addMapping("/api/**").allowedOrigins("*").allowedMethods("GET", "POST", "OPTIONS", "PUT")
				.allowedHeaders("*")
				.exposedHeaders("*")
				.allowCredentials(false).maxAge(3600);
	}

	@Bean
    public TokenAuthenticationFilter tokenAuthenticationFilter() {
        return new TokenAuthenticationFilter();
    }

	
	@Bean
    public HttpCookieOAuth2AuthorizationRequestRepository cookieAuthorizationRequestRepository() {
        return new HttpCookieOAuth2AuthorizationRequestRepository();
    }
	
//	@Override
//    public void configure(AuthenticationManagerBuilder authenticationManagerBuilder) throws Exception {
//        authenticationManagerBuilder
//                .userDetailsService(customUserDetailsService)
//                .passwordEncoder(passwordEncoder());
//    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
	
    

	@Bean
	  public DaoAuthenticationProvider authenticationProvider() {
	      DaoAuthenticationProvider authProvider = new DaoAuthenticationProvider();
	       
	      authProvider.setUserDetailsService(customUserDetailsService);
	      authProvider.setPasswordEncoder(passwordEncoder());
	   
	      return authProvider;
	  }


		
	  @Bean
	  public AuthenticationManager authenticationManager(AuthenticationConfiguration authConfig) throws Exception {
	    return authConfig.getAuthenticationManager();
	  }

		
	


		@Bean
	  public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
	    http.cors().and().csrf().disable()
	        .exceptionHandling().authenticationEntryPoint(unauthorizedHandler).and()
	        .sessionManagement().sessionCreationPolicy(SessionCreationPolicy.STATELESS).and()
	        .authorizeRequests().antMatchers("/api/**","/api/users/**","/oauth/**").permitAll()
	        .antMatchers("/api/users/test/**","/api/test/**","/api/**").permitAll()
	        .antMatchers("api/**","api/users/**","/auth/**", "/oauth2/**","api/users/oauth2","/**","api/oauth2").permitAll()
	        .anyRequest().authenticated().and().formLogin().permitAll().and().oauth2Login()
	        .authorizationEndpoint()
	        .baseUri("/oauth2/authorize")
	        .authorizationRequestRepository(cookieAuthorizationRequestRepository())
	        .and()
         	.redirectionEndpoint()
         	.baseUri("/oauth2/callback/*")
            .and()
			.loginPage("/")
	        .userInfoEndpoint().userService(oAuthUserService).and()
	        //.successHandler(oAuth2AuthenticationSuccessHandler)
	        //.failureHandler(oAuth2AuthenticationFailureHandler);
	        .successHandler(new AuthenticationSuccessHandler() {
	            

               @Override
               public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response,
                       Authentication authentication) throws IOException, ServletException {
                   
						System.out.println("here1");
						CustomOAuth2User oauthUser = (CustomOAuth2User) authentication.getPrincipal();
						System.out.println(oauthUser.getEmail());
						
						if (userRepository.existsByEmail(oauthUser.getEmail())) {
							
						}
						else {
						System.out.println("here2");
						
							User newUser = new User();
							newUser.setName(oauthUser.getName());
							newUser.setEmail(oauthUser.getEmail());
							newUser.setPassword(passwordEncoder().encode("test"));
							newUser.setProvider(Provider.GOOGLE);
							newUser.setSecurityQuestion1("test");  
							newUser.setSecurityQuestion2("test");     
							newUser.setMfa(false);  
							userRepository.save(newUser);        
						
				
						
					}
					response.sendRedirect("https://hodophilia.vercel.app/login/oauth-sucess?email="+oauthUser.getEmail()+"&name="+oauthUser.getName());
					// response.sendError(200,"HI");
                   
               }
	        })
	        .failureHandler(new SimpleUrlAuthenticationFailureHandler() {
       		@Override
       		public void onAuthenticationFailure(HttpServletRequest request, HttpServletResponse response, AuthenticationException exception) 
       				throws IOException, ServletException {
       		}
       });
    
	    http.authenticationProvider(authenticationProvider());

	    http.addFilterBefore(tokenAuthenticationFilter(), UsernamePasswordAuthenticationFilter.class);
	    
	    return http.build();
	  }

		
}
