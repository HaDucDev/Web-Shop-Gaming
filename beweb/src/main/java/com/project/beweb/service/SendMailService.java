package com.project.beweb.service;

public interface SendMailService {
    String sendMailWithText(String sub, String content, String to);
}
