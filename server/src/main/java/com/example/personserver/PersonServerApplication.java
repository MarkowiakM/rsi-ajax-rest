package com.example.personserver;

import com.example.personserver.app.MyData;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

import java.net.UnknownHostException;

@SpringBootApplication
public class PersonServerApplication {

	public static void main(String[] args) {
		try {
			MyData.myInfo();
		} catch (UnknownHostException e) {
			throw new RuntimeException(e);
		}
		SpringApplication.run(PersonServerApplication.class, args);
	}

}
