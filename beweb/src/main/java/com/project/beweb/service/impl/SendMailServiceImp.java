package com.project.beweb.service.impl;

import com.project.beweb.service.SendMailService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import javax.mail.internet.MimeMessage;

@Service
public class SendMailServiceImp implements SendMailService {
    @Autowired
    private JavaMailSender javaMailSender;

    @Override
    public String sendMailWithText(String sub, String content, String to) {
        try {
            MimeMessage message = javaMailSender.createMimeMessage();
            boolean multipart = true;
            MimeMessageHelper helper = new MimeMessageHelper(message, multipart, "utf-8");
            message.setContent(content, "text/html;charset=UTF-8");
            message.setSubject(sub);
            helper.setTo(to);
            javaMailSender.send(message);
        }catch (Exception e) {
            return "Send failed";
        }
        return "Send successfully";
    }
}
