//
// Source code recreated from a .class file by IntelliJ IDEA
// (powered by Fernflower decompiler)
//

package com.newtec.sso.client.servlet;

import com.newtec.common.CommonCall;
import com.newtec.myqdp.encry.utils.DesUtil;
import com.newtec.myqdp.print.utils.Print;
import com.newtec.myqdp.server.utils.StringUtils;
import com.newtec.myqdp.server.utils.exception.CustomException;
import com.newtec.serialize.utils.SerializationUtil;
import com.newtec.sso.client.extend.HttpPersons;
import com.newtec.sso.client.extend.LoginSucess;
import com.newtec.sso.client.extend.Logout;
import com.newtec.sso.client.utils.HttpRequestUtils;
import com.newtec.sso.client.utils.Param;
import com.newtec.sso.client.utils.Utils;
import com.newtec.sso.entity.PersonClass;
import com.newtec.sso.entity.SSOPerson;
import java.io.IOException;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Enumeration;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import javax.servlet.Filter;
import javax.servlet.FilterChain;
import javax.servlet.FilterConfig;
import javax.servlet.ServletException;
import javax.servlet.ServletRequest;
import javax.servlet.ServletResponse;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

public class AuthFilter implements Filter {
    public static String ssoLoginProjectPath;
    private static String ssoLoginServlet;
    private static String loginURL;
    private static List<String> excludedRequests;
    private static LoginSucess loginSucess;
    private static Logout logout;
    private static String params;

    static {
        Print.setPrintLog(true);
        Print.setPrintLevel("info");
        params = null;
    }

    public AuthFilter() {
    }

    public void destroy() {
    }

    private static String getPath(HttpServletRequest req) {
        String queryString = req.getQueryString();
        String url = req.getRequestURL().toString();
        if (queryString != null && !"".equals(queryString)) {
            queryString = Utils.removeSTParam(queryString, req.getParameter("ST123"));
            queryString = Utils.removeUserNamePassword(req, queryString);
            return "".equals(queryString) ? url : url + "?" + queryString;
        } else {
            return url;
        }
    }

    private boolean isResourceRequest(HttpServletRequest req) {
        boolean resource = StringUtils.isNull(req.getHeader("referer")) && StringUtils.isNull(Utils.getjsessionId(req.getSession()));
        return resource;
    }

    private boolean excludedRequest(HttpServletRequest req, HttpServletResponse resp, FilterChain chain) {
        String url = req.getServletPath().toLowerCase();
        if (!url.endsWith(".css") && !url.endsWith(".js") && !url.endsWith(".ico") && !url.endsWith(".jpg") && !url.endsWith(".png") && !url.endsWith(".gif") && !url.endsWith(".woff2") && !url.endsWith(".ttf") && !url.endsWith(".woff") && !this.isResourceRequest(req)) {
            if (!url.endsWith("/login") && !url.endsWith("/logout")) {
                Iterator var6 = excludedRequests.iterator();

                while(var6.hasNext()) {
                    String excludedRequest = (String)var6.next();
                    excludedRequest = excludedRequest.toLowerCase();
                    if (excludedRequest.contains("*")) {
                        excludedRequest = excludedRequest.replace("*", "");
                        if (url.contains(excludedRequest)) {
                            Print.info(url + ">>111---" + excludedRequest);
                            return true;
                        }
                    } else {
                        excludedRequest = excludedRequest.startsWith("/") ? excludedRequest : "/" + excludedRequest;
                        if (url.equals(excludedRequest)) {
                            Print.info(url + ">>222---" + excludedRequest);
                            return true;
                        }
                    }
                }

                return false;
            } else {
                return true;
            }
        } else {
            return true;
        }
    }

    private boolean isST(String ST) {
        return ST != null && ST.startsWith("ST-");
    }

    public void doFilter(ServletRequest req1, ServletResponse resp1, FilterChain chain) throws IOException, ServletException {
        HttpServletRequest req = (HttpServletRequest)req1;
        HttpServletResponse resp = (HttpServletResponse)resp1;
        req.setCharacterEncoding("UTF-8");
        resp.setCharacterEncoding("UTF-8");
        resp.setHeader("Access-Control-Allow-Origin", "*");
        resp.setHeader("Access-Control-Allow-Methods", "POST, GET, OPTIONS, DELETE");
        resp.setHeader("Access-Control-Max-Age", "3600");
        resp.setHeader("Access-Control-Allow-Headers", "x-requested-with");
        HttpSession session = req.getSession();
        if ("logout123".equals(req.getParameter("logout123"))) {
            Object person = Utils.getPerson(req);
            Print.info(person + ">>客户端注销操作：" + Utils.getjsessionId(session));
            this.logoutBefore(person, req, resp);
            session.invalidate();
            this.logoutAfter(person, req, resp);
        } else if (this.excludedRequest(req, resp, chain)) {
            Print.info("放行：" + req.getRequestURL());
            chain.doFilter(req1, resp1);
        } else {
            Print.info(req.getQueryString() + "||" + req.getRequestURL() + "=Utils.getPerson(req)====" + Utils.getPerson(req) + "|" + Utils.getjsessionId(session));
            if (Utils.getPerson(req) != null) {
                chain.doFilter(req1, resp1);
            } else {
                String ngCodeName = req.getParameter("xxngCode123");
                System.out.println("==ngCodeName==>>>" + ngCodeName);
                String st;
                if (!StringUtils.isNull(ngCodeName)) {
                    System.out.println("===>>>>1111");

                    try {
                        st = Utils.decNgCode(ngCodeName);
                        SSOPerson person = HttpPersons.getPerson(st);
                        if (person == null) {
                            toSSOLoginServerlet(req, resp, "STNORequest=STNORequest");
                        } else {
                            Print.info(person + "登录成功后客户端：" + Utils.getjsessionId(session));
                            Utils.setPerson(req, person);

                            try {
                                if (loginSucess != null) {
                                    loginSucess.execute(person, req, resp);
                                }
                            } catch (CustomException var13) {
                                var13.printStackTrace();
                            }

                            chain.doFilter(req1, resp1);
                        }
                    } catch (CustomException var14) {
                        toSSOLoginServerlet(req, resp, "STNORequest=STNORequest");
                    }
                } else {
                    st = req.getParameter("ST123");
                    boolean isST = this.isST(st);
                    if (isAjax(req)) {
                        resp.getWriter().write(req.getRequestURL() + "请求被拦截，未登录！");
                        toSSOLoginServerlet(req, resp, "STNORequest=STNORequest");
                    } else if (isST) {
                        Print.info("客户端发送ST：" + st);
                        System.err.println("客户端：Utils.getjsessionId(session)：" + Utils.getjsessionId(session));
                        byte[] STresult = HttpRequestUtils.sendPostBytes(getSSOLogin(req), "ST123=" + st, Utils.getjsessionId(session), (Map)null);
                        Print.info("返回结果：" + STresult + ":" + new String(STresult));
                        if (isSTFail(STresult)) {
                            toSSOLoginServerlet(req, resp, "STNORequest=STNORequest");
                        } else {
                            PersonClass person = (PersonClass)SerializationUtil.deserialize(STresult, PersonClass.class);
                            if (person == null) {
                                toSSOLoginServerlet(req, resp, "STNORequest=STNORequest");
                            } else {
                                Print.info("登录成功后客户端：" + Utils.getjsessionId(session));
                                Utils.setPerson(req, person);

                                try {
                                    this.loginSuccess(person.getPerson(), req, resp);
                                } catch (CustomException var15) {
                                    var15.printStackTrace();
                                    throw new IOException(var15.getMessage());
                                }
                            }
                        }
                    } else {
                        toSSOLoginServerlet(req, resp, "");
                    }
                }
            }
        }
    }

    private static final boolean isSTFail(byte[] STresult) {
        if (STresult == null) {
            return false;
        } else if (Param.STNOBS.length != STresult.length) {
            return false;
        } else {
            for(int i = 0; i < Param.STNOBS.length; ++i) {
                if (Param.STNOBS[i] != STresult[i]) {
                    return false;
                }
            }

            return true;
        }
    }

    private static final boolean isAjax(HttpServletRequest req) {
        String requested = req.getHeader("x-requested-with");
        Print.info("requested===" + requested);
        return !StringUtils.isNull(requested);
    }

    protected void loginSuccess(Object person, HttpServletRequest req, HttpServletResponse resp) throws CustomException {
        boolean result = true;
        if (loginSucess != null) {
            result = loginSucess.execute(person, req, resp);
        }

        if (result) {
            try {
                resp.sendRedirect(getPath(req));
            } catch (IOException var6) {
                var6.printStackTrace();
                throw new CustomException("", var6.getMessage());
            }
        }

    }

    protected void logoutBefore(Object person, HttpServletRequest req, HttpServletResponse resp) {
    	if (logout != null) {
            logout.before(person, req, resp);
        }

    }

    protected void logoutAfter(Object person, HttpServletRequest req, HttpServletResponse resp) {
        if (logout != null) {
            logout.after(person, req, resp);
        }

    }

    public static void toSSOLoginServerlet(HttpServletRequest req, HttpServletResponse resp, String paramsExt) throws IOException {
        String clientURL = Utils.encode(getPath(req)) + params;
        paramsExt = StringUtils.isNull(paramsExt) ? "" : "&" + paramsExt;
        Enumeration<String> params = req.getParameterNames();
        int i = 0;

        String param;
        while(params.hasMoreElements()) {
            param = (String)params.nextElement();
            String value = req.getParameter(param);
            if ("u123x".equalsIgnoreCase(param)) {
                if (StringUtils.isNull(value)) {
                    throw new IOException("账号不能为空！");
                }

                value = DesUtil.enc(value);
                ++i;
            }

            if ("p123x".equalsIgnoreCase(param)) {
                if (StringUtils.isNull(value)) {
                    throw new IOException("密码不能为空！");
                }

                value = DesUtil.enc(value);
                ++i;
            }

            if (!StringUtils.isNull(value)) {
                paramsExt = paramsExt + "&" + param + "=" + Utils.encode(value);
            }
        }

        if (i == 2) {
            paramsExt = paramsExt + "&customLogin=1";
        }

        if (!StringUtils.isNull(loginURL)) {
            paramsExt = paramsExt + "&" + "123LoginURL123" + "=" + loginURL;
        }

        paramsExt = paramsExt + "&ngssoTime123=" + System.currentTimeMillis();
        param = getSSOLogin(req) + "?" + "123client123" + "=" + clientURL + paramsExt;
        System.out.println("====rul===rul===>>>" + param);
        resp.sendRedirect(param);
    }

    private static String getSSOLogin(HttpServletRequest req) throws IOException {
        String ssoLoginServlet_ = req.getParameter("ssoProjectPath");
        ssoLoginServlet_ = ssoLoginServlet_ == null ? ssoLoginServlet : ssoLoginServlet_;
        if (StringUtils.isNull(ssoLoginServlet_)) {
            throw new IOException("请在过滤器中或request请求里配置ssoLoginServlet登录入口！");
        } else {
            ssoLoginServlet_ = Utils.getRequestFullPath(req, ssoLoginServlet);
            return ssoLoginServlet_;
        }
    }

    public void init(FilterConfig config) throws ServletException {
        String ssoProjectPath = config.getInitParameter("ssoProjectPath");
        ssoProjectPath = ssoProjectPath.endsWith("/") ? ssoProjectPath : ssoProjectPath + "/";
        ssoLoginProjectPath = ssoProjectPath;
        ssoLoginServlet = ssoProjectPath + "login1";
        CommonCall initFinshSSOURL = LoginSucess.getInitFinshSSOURL();
        if (initFinshSSOURL != null) {
            initFinshSSOURL.call(new Object[]{ssoProjectPath, ssoLoginServlet, ssoProjectPath + "logout"});
        }

        String logoutStr;
        if (excludedRequests == null) {
            excludedRequests = new ArrayList();
            logoutStr = config.getInitParameter("excludedRequests");
            if (!StringUtils.isNull(logoutStr)) {
                logoutStr = logoutStr.replace("，", ",").replace(";", ",").replace("；", ",");
                excludedRequests.addAll(Arrays.asList(logoutStr.split(",")));
                Print.info("初始化：" + excludedRequests);
            }
        }

        Object o;
        if (loginSucess == null) {
            logoutStr = config.getInitParameter("loginSucess");
            if (!StringUtils.isNull(logoutStr)) {
                try {
                    o = Utils.getObject(logoutStr);
                    if (o instanceof LoginSucess) {
                        loginSucess = (LoginSucess)o;
                    }
                } catch (CustomException var8) {
                    ;
                }
            }
        }

        if (logout == null) {
            logoutStr = config.getInitParameter("logout");

            try {
                o = Utils.getObject(logoutStr);
                // 朱才富修改过
//                if (o instanceof LoginSucess) {
                if (o instanceof Logout) {
                    logout = (Logout)o;
                }
            } catch (CustomException var7) {
                ;
            }

        }

        if (loginURL == null) {
            logoutStr = config.getInitParameter("loginURL");
            loginURL = StringUtils.isNull(logoutStr) ? "" : logoutStr;
            loginURL = Utils.encode(loginURL);
            Print.info("logoutStr........................" + logoutStr);
        }

        if (params == null) {
            params = "";
            Enumeration ps = config.getInitParameterNames();

            while(ps.hasMoreElements()) {
                String param = (String)ps.nextElement();
                if (!"excludedRequests".equals(param) && !"ssoLoginServlet".equals(param) && !"loginSucess".equals(param) && !"logout".equals(param) && !"loginURL".equals(param)) {
                    String value = config.getInitParameter(param);
                    params = params + param + ":" + value + ";";
                }
            }

            if (!StringUtils.isNull(params)) {
                Print.info("params1===" + params);
                params = "&123params123=" + Utils.encode(params.substring(0, params.length() - 1));
                Print.info("params2===" + params);
            }
        }

    }
}
