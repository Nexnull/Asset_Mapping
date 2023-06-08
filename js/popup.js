chrome.tabs.query({ active: true, lastFocusedWindow: true }, tabs => {
    var url = new URL(tabs[0].url);  //当前标签页的url
    let hostname = url.hostname.replace('www.', ''); //let声明变量；提取URL的主机名，并将开头的“www.”去掉，只要域名
    var pageTitle = tabs[0].title; //提取当前标签页的title
    //所有的“active: false”代表只打开新标签页，但不切换到新标签页

    function SearchTitle() {
        chrome.tabs.create({ url: 'https://www.baidu.com/s?wd=' + pageTitle, active: false });  //点击插件头部的网页title名，即打开新标签，用百度搜索关键字
    }
    document.getElementById("domain").innerHTML = "<a>"+pageTitle+"</a>";  //这段代码将在id为"domain"的HTML元素中渲染一个超链接，链接的文本为pageTitle的值

    function SearchDomain() { //点击Domain，打开各大测绘引擎进行搜索
        query = hostname;
        chrome.tabs.create({ url: 'https://quake.360.net/quake/#/searchResult?searchVal=' +query+ '&selectIndex=quake_service&latest=true', active: false });
        chrome.tabs.create({ url: 'https://hunter.qianxin.com/list?search=domain.suffix%3D%22'+query+'%22', active: false });
        chrome.tabs.create({ url: "https://fofa.info/result?qbase64=" + btoa("domain=\"" + query + "\""), active: false });
        chrome.tabs.create({ url: 'https://0.zone/search_home?title_type=all&title=' + query, active: false });
        chrome.tabs.create({ url: 'https://search.censys.io/search?resource=hosts&sort=RELEVANCE&per_page=25&virtual_hosts=EXCLUDE&q=' + query, active: false });
        chrome.tabs.create({ url: 'https://www.shodan.io/search?query=' + query, active: false });
        chrome.tabs.create({ url: 'https://github.com/search?q="' + query + '"&type=code', active: false });
        //搜索引擎语法查找站点
        chrome.tabs.create({ url: 'https://www.baidu.com/s?wd=site:' + query, active: false });
        chrome.tabs.create({ url: 'https://www.bing.com/search?q=site:' + query, active: false });
        chrome.tabs.create({ url: 'https://www.google.com/search?q=site:' + query, active: false });
    }
    function SearchIP() {
        // 使用域名获取 IP 地址，在各个敏感信息泄露检测网站中搜索该 IP
        fetch(`https://dns.google/resolve?name=${hostname}&type=A`)
        .then(response => response.json())
        .then(data => {
        const IP = data.Answer[0].data; // 从 JSON 数据中提取 IP 地址
        //对IP进行base64编码，用作fofa中搜索
        const ip_Base64 = btoa(`ip="${currentIPAddress}"`);
        const ip_Base64_C = btoa(`ip="${currentIPAddress}/24"`);
        
        // 在各个敏感信息泄露检测网站中搜索该 IP
        chrome.tabs.create({ url: 'https://quake.360.net/quake/#/searchResult?searchVal=' +IP+ '&selectIndex=quake_service&latest=true', active: false });
        chrome.tabs.create({ url: 'https://hunter.qianxin.com/list?search=domain.suffix%3D%22'+IP+'%22', active: false });
        chrome.tabs.create({ url: 'https://0.zone/search_home?title_type=all&title=' + IP, active: false });
        chrome.tabs.create({ url: 'https://www.shodan.io/host/' + IP, active: false });
        chrome.tabs.create({ url: 'https://www.censys.io/ipv4?q=' + IP, active: false });
        
        // 将 Base64 编码用来搜索 Fofa
        const fofa_Search_IP = `https://fofa.info/result?qbase64=${ip_Base64}`;  //fofa搜索ip
        //const fofaCidrSearchURL = `https://fofa.info/result?qbase64=${ip_Base64_C}`;  //fofa搜索c段
        chrome.tabs.create({ url: fofa_Search_IP, active: false });
        //chrome.tabs.create({ url: fofaCidrSearchURL, active: false });
        })
        .catch(error => {
        console.error(error);
        });
    }
    function SearchAll() {
        SearchDomain();
        SearchIP();
    }
    // 定义html按钮调用JS文件函数
    let btnSearchDomain = document.getElementById('btnSearchDomain');
    btnSearchDomain.onclick = SearchDomain;

    let btnSearchIP = document.getElementById('btnSearchIP');
    btnSearchIP.onclick = SearchIP;

    let btnSearchAll = document.getElementById('btnSearchAll');
    btnSearchAll.onclick = SearchAll;

    let btnSearchTitle = document.getElementById('domain');
    btnSearchTitle.onclick = SearchTitle;
    // 因为html中是<body class="hidden">，两者配置使用
    document.body.classList.remove('hidden')
    
});