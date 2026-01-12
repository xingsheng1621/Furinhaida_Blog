// 配置全局代理
if (process.env.HTTP_PROXY || process.env.HTTPS_PROXY) {
  const proxy = process.env.HTTPS_PROXY || process.env.HTTP_PROXY;
  
  try {
    const { setGlobalDispatcher, ProxyAgent } = require('undici');
    const proxyAgent = new ProxyAgent(proxy);
    setGlobalDispatcher(proxyAgent);
  } catch (err) {
    
    const { HttpsProxyAgent } = require('https-proxy-agent');
    const agent = new HttpsProxyAgent(proxy);
    
    // 禁用 SSL 验证（仅开发环境）
    process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
    
    // 设置全局代理
    const https = require('https');
    const http = require('http');
    
    const originalHttpsRequest = https.request;
    https.request = function(url, options, callback) {
      if (typeof url === 'string') {
        url = new URL(url);
      }
      if (typeof options === 'function') {
        callback = options;
        options = {};
      }
      options = { ...options, agent };
      return originalHttpsRequest.call(this, url, options, callback);
    };
    
    const originalHttpRequest = http.request;
    http.request = function(url, options, callback) {
      if (typeof url === 'string') {
        url = new URL(url);
      }
      if (typeof options === 'function') {
        callback = options;
        options = {};
      }
      options = { ...options, agent };
      return originalHttpRequest.call(this, url, options, callback);
    };
    
  }
} else {
}

module.exports = {};
