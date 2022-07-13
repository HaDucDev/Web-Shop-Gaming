package com.project.beweb.utils;

import org.apache.commons.lang3.RandomStringUtils;

public class Util {
  public static String generateString() {
    return RandomStringUtils.random(6, true, true);
  }
}
