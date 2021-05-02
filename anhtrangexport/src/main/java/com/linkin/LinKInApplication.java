
package com.linkin;

import java.security.KeyManagementException;
import java.security.KeyStoreException;
import java.security.NoSuchAlgorithmException;
import java.security.cert.X509Certificate;
import java.util.concurrent.TimeUnit;

import javax.net.ssl.SSLContext;
import javax.sql.DataSource;

import org.apache.http.conn.ssl.SSLConnectionSocketFactory;
import org.apache.http.impl.client.CloseableHttpClient;
import org.apache.http.impl.client.HttpClients;
import org.apache.http.ssl.TrustStrategy;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.annotation.Order;
import org.springframework.data.domain.AuditorAware;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
import org.springframework.http.CacheControl;
import org.springframework.http.client.HttpComponentsClientHttpRequestFactory;
import org.springframework.scheduling.annotation.EnableAsync;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.session.SessionRegistry;
import org.springframework.security.core.session.SessionRegistryImpl;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.web.authentication.rememberme.JdbcTokenRepositoryImpl;
import org.springframework.security.web.authentication.rememberme.PersistentTokenRepository;
import org.springframework.security.web.util.matcher.AntPathRequestMatcher;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurationSupport;
import org.thymeleaf.extras.springsecurity4.dialect.SpringSecurityDialect;

import com.linkin.entity.User;
import com.linkin.service.impl.AuditorAwareImpl;
import com.linkin.utils.FileStore;
import com.linkin.utils.RoleEnum;

@SpringBootApplication
@EnableJpaRepositories
@EnableJpaAuditing(auditorAwareRef = "auditorAware")
@EnableAsync
@EnableScheduling
public class LinKInApplication extends WebMvcConfigurationSupport {

	@Autowired
	private UserDetailsService userDetailsService;

	@Autowired
	DataSource dataSource;

	public static void main(String[] args) {
		SpringApplication.run(LinKInApplication.class, args);
	}

	@Autowired
	public void configureGlobal(AuthenticationManagerBuilder auth) throws Exception {
		auth.userDetailsService(userDetailsService).passwordEncoder(passwordEncoder());
	}

	@Configuration
	@Order(1)
	public class ApiWebSecurityConfigurationAdapter extends WebSecurityConfigurerAdapter {
		@Override
		protected void configure(HttpSecurity http) throws Exception {
			http.csrf().disable().antMatcher("/api/**").authorizeRequests()
					.antMatchers("/api/admin/**").hasAnyRole(RoleEnum.ADMIN.getRoleName())
					.antMatchers("/shipper/**").hasAnyRole(RoleEnum.ADMIN.getRoleName(), RoleEnum.SHIPPER.getRoleName())
					.antMatchers("/seller/**").hasAnyRole(RoleEnum.ADMIN.getRoleName(), RoleEnum.SHIPPER.getRoleName(), RoleEnum.SELLER.name())
					.antMatchers("/api/member/**").authenticated().anyRequest().permitAll().and().httpBasic();

		}
	}

	@Configuration
	public class FormLoginWebSecurityConfigurerAdapter extends WebSecurityConfigurerAdapter {
		@Override
		protected void configure(HttpSecurity http) throws Exception {
			http.authorizeRequests().antMatchers("/admin/**").hasAnyRole(RoleEnum.ADMIN.getRoleName())
					.antMatchers("/shipper/**").hasAnyRole(RoleEnum.ADMIN.getRoleName(), RoleEnum.SHIPPER.getRoleName())
					.antMatchers("/seller/**").hasAnyRole(RoleEnum.ADMIN.getRoleName(), RoleEnum.SHIPPER.getRoleName(), RoleEnum.SELLER.name())
					.antMatchers("/member/**").authenticated().anyRequest().permitAll().and().formLogin()
					.loginPage("/dang-nhap").loginProcessingUrl("/dang-nhap").defaultSuccessUrl("/member/home")
					.failureUrl("/dang-nhap?e").and().rememberMe().rememberMeCookieName("app-remember-me")
					.tokenValiditySeconds(24 * 60 * 60 * 30).tokenRepository(persistentTokenRepository()).and().logout()
					.logoutUrl("/dang-xuat").logoutSuccessUrl("/dang-nhap")
					.logoutRequestMatcher(new AntPathRequestMatcher("/dang-xuat")).clearAuthentication(true)
					.invalidateHttpSession(true).deleteCookies("JSESSIONID", "app-remember-me").permitAll().and()
					.exceptionHandling().accessDeniedPage("/access-deny").and().sessionManagement()
					.sessionCreationPolicy(SessionCreationPolicy.ALWAYS).sessionFixation().migrateSession()
					.maximumSessions(-1).sessionRegistry(sessionRegistry());
			http.headers().frameOptions().sameOrigin();
		}
	}

	@Bean
	public BCryptPasswordEncoder passwordEncoder() {
		BCryptPasswordEncoder bCryptPasswordEncoder = new BCryptPasswordEncoder(12);
		return bCryptPasswordEncoder;
	}

	@Bean
	public AuditorAware<User> auditorAware() {
		return new AuditorAwareImpl();
	}

	@Bean
	public SpringSecurityDialect springSecurityDialect() {
		SpringSecurityDialect dialect = new SpringSecurityDialect();
		return dialect;
	}

	@Bean
	public SessionRegistry sessionRegistry() {
		return new SessionRegistryImpl();
	}

	@Bean
	public PersistentTokenRepository persistentTokenRepository() {
		JdbcTokenRepositoryImpl tokenRepository = new JdbcTokenRepositoryImpl();
		tokenRepository.setDataSource(dataSource);
		return tokenRepository;
	}

	@Bean
	public RestTemplate restTemplate() throws KeyStoreException, NoSuchAlgorithmException, KeyManagementException {
		TrustStrategy acceptingTrustStrategy = (X509Certificate[] chain, String authType) -> true;

		SSLContext sslContext = org.apache.http.ssl.SSLContexts.custom().loadTrustMaterial(null, acceptingTrustStrategy)
				.build();

		SSLConnectionSocketFactory csf = new SSLConnectionSocketFactory(sslContext);

		CloseableHttpClient httpClient = HttpClients.custom().setSSLSocketFactory(csf).build();

		HttpComponentsClientHttpRequestFactory requestFactory = new HttpComponentsClientHttpRequestFactory();

		requestFactory.setHttpClient(httpClient);
		RestTemplate restTemplate = new RestTemplate(requestFactory);
		return restTemplate;
	}

	@Override
	public void addResourceHandlers(ResourceHandlerRegistry registry) {
		registry.addResourceHandler("/image/**").addResourceLocations("file:" + FileStore.UPLOAD_FOLDER)
				.setCacheControl(CacheControl.maxAge(24 * 365, TimeUnit.HOURS).cachePublic());
		registry.addResourceHandler("/**").addResourceLocations("classpath:/static/")
				.setCacheControl(CacheControl.maxAge(2, TimeUnit.HOURS).cachePublic());
	}

}
