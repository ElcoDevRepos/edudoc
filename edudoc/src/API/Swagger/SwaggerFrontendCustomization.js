/* the purpose if this file is to inject request and response interceptors into swagger so we can set the xsrf and bearer tokens headers
automatically without having to copy them around. If you login to the /api/v1/authUsers/token endpoint we will automatically parse out the xsrf and
bearer tokens from the response and set them as SWAGGER-* cookies. Then when we request we automatically append them.*/

setTimeout(() => {
    if (window.ui) {
        window.ui.getConfigs().requestInterceptor = function (req) {
            req.headers["X-Xsrf-Token"] = getCookieValue('SWAGGER-X-XSRF-TOKEN');
            var bearerToken = getCookieValue('SWAGGER-X-BEARER-TOKEN');
            if (bearerToken) { 
                req.headers["Authorization"] = "Bearer " + getCookieValue('SWAGGER-X-BEARER-TOKEN');
            }

            req.headers['X-LOG-REQUEST'] = 'true';
            return req;
        };
        window.ui.getConfigs().responseInterceptor = function (res) {
            if (res.body?.LoginResult?.Jwt) {
                document.cookie = `SWAGGER-X-XSRF-TOKEN=${res.body.LoginResult.CsrfToken}; path=/; Secure; SameSite=Strict`;
                document.cookie = `SWAGGER-X-BEARER-TOKEN=${res.body.LoginResult.Jwt}; path=/; Secure; SameSite=Strict`;
                console.log("CSRF Token stored in cookie:", res.body.LoginResult.CsrfToken);

                const topbar = document.querySelector(".topbar-wrapper");


                const statusDiv = document.createElement("div");
                statusDiv.innerText = "✅ Logged in";
                statusDiv.style = `color: white;
                background-color: #28a745;
                padding: 4px 10px;
                margin-left: 20px;
                border-radius: 4px;
                font-weight: bold;`;

                topbar.appendChild(statusDiv);
            }

            return res;
        };

    }
}, 2000);





function getCookieValue(cookieName) {
    return decodeURIComponent(document.cookie)
        .split('; ')
        .find(row => row.startsWith(cookieName+"="))
        ?.split('=')[1];
}
