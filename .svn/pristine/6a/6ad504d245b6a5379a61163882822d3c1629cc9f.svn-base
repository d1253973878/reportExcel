package com.newtec.report.utils;

import java.text.DateFormat;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.Date;
import java.util.GregorianCalendar;

public class DateUtil {

    private final static String DEFAULT_FORMATE_TYPE = "yyyy-MM-dd HH:mm:ss";

    /**
     * @return 格式化后的当前时间
     */
    public static String getFormatDate() {
        return getFormatDate(new Date(), DEFAULT_FORMATE_TYPE);
    }

    /**
     * @param type 时间类型
     *             如：yyyy-mm-dd HH:mm:ss
     * @return 格式化后的当前时间
     */
    public static String getFormatDate(String type) {
        return getFormatDate(new Date(), DEFAULT_FORMATE_TYPE);
    }

    /**
     * @param date 时间
     * @return 格式化后的时间
     */
    public static String getFormatDate(Date date) {
        return getFormatDate(date, DEFAULT_FORMATE_TYPE);
    }

    /**
     * @param date 时间
     * @param type 时间类型 如：yyyy-mm-dd HH:mm:ss
     * @return 格式化后的时间
     */
    public static String getFormatDate(Date date, String type) {
        SimpleDateFormat df = new SimpleDateFormat(type);// 设置日期格式
        return df.format(date);
    }

    /**
     * 日期加上或减去多少天
     *
     * @param dateStr 原日期
     * @param num  +n/-n
     * @return 新的日期
     */
    public static String addDay(String dateStr, int num) {
        DateFormat f = new SimpleDateFormat(DEFAULT_FORMATE_TYPE);
        Calendar calendar = new GregorianCalendar();
        try {
            calendar.setTime(f.parse(dateStr));
            // YEAR(年), DAY_OF_MONTH(月), WEEK_OF_MONTH(星期), DATE(日)
            //把日期往后增加一天.整数往后推,负数往前移动
            calendar.add(calendar.DATE, num);
        } catch (ParseException e) {
            e.printStackTrace();
        }
        return f.format(calendar.getTime());
    }

    /**
     * 日期加上或减去多少天
     *
     * @param date 原日期
     * @param num  +n/-n
     * @return 新的日期
     */
    public static String addDay(Date date, int num) {
        DateFormat f = new SimpleDateFormat(DEFAULT_FORMATE_TYPE);
        Calendar calendar = new GregorianCalendar();
        calendar.setTime(date);
        calendar.add(calendar.DATE, num);
        return f.format(calendar.getTime());
    }

    /**
     *
     * @param date 原时间
     * @param num num  +n/-n
     * @return 新的时间
     */
    public static String addHour(String date, int num){
        DateFormat f = new SimpleDateFormat(DEFAULT_FORMATE_TYPE);
        Calendar calendar = new GregorianCalendar();
        try {
            calendar.setTime(f.parse(date));
            // YHOUR_OF_DAY(24), HOUR_OF_DAY(12)
            calendar.add(calendar.HOUR_OF_DAY, num);
        } catch (ParseException e) {
            e.printStackTrace();
        }
        return f.format(calendar.getTime());
    }

    /**
     * 日期加上或减去多少天
     *
     * @param date 原日期
     * @param num  +n/-n
     * @return 新的日期
     */
    public static String addHour(Date date, int num) {
        DateFormat f = new SimpleDateFormat(DEFAULT_FORMATE_TYPE);
        Calendar calendar = new GregorianCalendar();
        calendar.setTime(date);
        calendar.add(calendar.HOUR_OF_DAY, num);
        return f.format(calendar.getTime());
    }

    public static Date getDateFromString(String formateDateStr){
        return getDateFromString(formateDateStr, DEFAULT_FORMATE_TYPE);
    }

    public static Date getDateFromString(String formateDateStr, String type){
        Date date = null;
        DateFormat f = new SimpleDateFormat(type);
        try {
            date = f.parse(formateDateStr);
        } catch (ParseException e) {
            e.printStackTrace();
        }
        return date;
    }
    
    /**
     * 返回10位时间戳
     *
     * @return
     */
    public static Long getTimeStamp() {
        return getTimeStamp(new Date());
    }

    public static Long getTimeStamp(Date date) {
        return date.getTime() / 1000;
    }

    /**
     * 返回10位时间戳
     *
     * @return
     */
    public static String getTimeStampString() {
        return String.valueOf(new Date().getTime() / 1000);
    }

    public static String getTimeStampString(Date date) {
        return String.valueOf(date.getTime() / 1000);
    }

    public static String getAddHourTimeStamp(Date date, Integer amount) {
        Calendar calendar = new GregorianCalendar();
        calendar.setTime(date);
        calendar.add(calendar.HOUR_OF_DAY, amount);
        return String.valueOf(calendar.getTime().getTime() / 1000);
    }

    public static Integer getMinutes(String timeStamp){
        Date date = new Date(Long.parseLong(timeStamp) * 1000);
        return date.getMinutes();
    }

    public static String getDate(String timeStamp){
        Date date = new Date(Long.parseLong(timeStamp) * 1000);
        return getFormatDate(date);
    }

    public static void main(String[] args) {
        System.out.println(addHour("2018-03-25 12:00:00", 7));
    }

}
