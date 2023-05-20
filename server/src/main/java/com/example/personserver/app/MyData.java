package com.example.personserver.app;

import java.net.Inet4Address;
import java.net.UnknownHostException;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;


public class MyData {
    public static void myInfo() throws UnknownHostException {
        System.out.println("Maria Markowiak, 260417");
        System.out.println("Remigiusz Pisarski, 260364");
        LocalDateTime now = LocalDateTime.now();
        System.out.println(now.format(DateTimeFormatter.ofPattern("dd MMMM, HH:mm:ss")));
        System.out.println(System.getProperty("java.version"));
        System.out.println(System.getProperty("user.name"));
        System.out.println(System.getProperty("os.name"));
        try {
            System.out.println("IP: " + Inet4Address.getLocalHost().getHostAddress());
        } catch(Exception e) {}
    }

}
