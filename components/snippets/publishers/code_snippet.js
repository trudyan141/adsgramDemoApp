import { check_user_conversion } from "../advertisers/code_snippet";

export const publishers = {
    vanilla_js: {
        code_string_btn_display_offer_wall: `<button id="openOfferWallButton">Open Offer Wall</button>`,
    code_string_btn_display_offer_wall_script: `<script>
    document.addEventListener('DOMContentLoaded', function() {
        const openOfferWallButton = document.getElementById('openOfferWallButton');
        openOfferWallButton.addEventListener('click', function() {
            if (TE && typeof TE.offerWall === 'function') {
                TE.offerWall();
            } else {
                console.error('TE is not defined or offerWall is not a function');
            }
        });
    });
</script>`,
        code_string_adding_1: `<div id="exchangeBanner"></div>` ,
        code_string_btn_confirm_conversion: `<button id="confirmConversion">Confirm Conversion</button>`,
        code_string_btn_confirm_conversion_script: `<script>
    document.addEventListener('DOMContentLoaded', function() {
        const confirmConversion = document.getElementById('confirmConversion');
        confirmConversion.addEventListener('click', async function() {
            if (TE && typeof TE.confirmConversion === 'function') {
                let result = await TE.confirmConversion();
                console.log("🚀 ~ result confirmConversion:", result)
            } else {
                console.error('TE is not defined or confirmConversion is not a function');
            }
        });
    });
</script>`,
        code_string_config_offer_wall: `<script>
    document.addEventListener('becLoaded', function (event) {
        // load the offer wall style config
        TE.configureOfferWallStyle({
            topBar: {
                backgroundColor: '#2c3e50',
                textColor: '#ecf0f1'
            },
            content: {
                backgroundColor: '#34495e',
                appNameColor: '#ecf0f1',
                appDescriptionColor: '#bdc3c7'
            },
            button: {
                backgroundColor: '#3498db',
                textColor: '#ffffff',
                highlightedBackgroundColor: '#2980b9',
                highlightedTextColor: '#ffffff',
                outlineColor: '#3498db'
            }
        });
    });
</script>`,
    code_string_check_user_conversion_response:`{
    "items": [
        {
            "click_id": "string",
            "action": "string",
            "tui": "string",
            "time": 0,
            "ads_id": "string"
        }
    ]
}`,
    code_string_display_offer_wall_example:(src_link,api_url) => `<!DOCTYPE html>
<html>
<head>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <script src="${src_link}" ></script>
    <script src="https://telegram.org/js/telegram-web-app.js"></script>
    <style> 
        h1{
            text-align: center;
        }
        #exchangeBanner{
            display: flex;
            align-items: center;
            justify-content: center;
        }
        #openOfferWallButton{
            margin-top: 120px;
            margin-left: 120px;
        }
    </style>
</head>
<body>
    <h1>DEMO BANNER EXCHANGE CODE</h1>
    <div class="main-content"> 
    
    </div>
    <!--example to open offer wall -->
    <button id="openOfferWallButton">Open Offer Wall</button>
    <!--example to check user conversion -->
    <button id="checkUserConversionButton">Check User Conversion</button>
    <script>
        // call onLoad to initialize the library
        document.addEventListener('DOMContentLoaded',async function() {
            if (TE && typeof TE.onLoad === 'function') {
                await TE.onLoad()
            } else {
                console.error('onLoad is not a function');
            }
        });
        // function get telegram user id
        function getTelegramUserId() {
            try {
                const telegram = window.Telegram;
                if (telegram && telegram.WebApp) {
                    telegram.WebApp.ready();
                    const userId = telegram.WebApp && telegram.WebApp.initDataUnsafe && telegram.WebApp.initDataUnsafe.user && telegram.WebApp.initDataUnsafe.user.id || '';
                    return userId;
                } else {
                    console.error('Telegram Web App SDK is not available');
                    return '';
                }
            } catch (error) {
                console.error(error);
                return '';
            }
        }
        document.addEventListener('becLoaded', function (event) {
            // load the offer wall style config
            TE.configureOfferWallStyle({
                topBar: {
                    backgroundColor: '#2c3e50',
                    textColor: '#ecf0f1'
                },
                content: {
                    backgroundColor: '#34495e',
                    appNameColor: '#ecf0f1',
                    appDescriptionColor: '#bdc3c7'
                },
                button: {
                    backgroundColor: '#3498db',
                    textColor: '#ffffff',
                    highlightedBackgroundColor: '#2980b9',
                    highlightedTextColor: '#ffffff',
                    outlineColor: '#3498db'
                }
            });
            // add blacklist tasks - examples values
            if (TE && typeof TE.setBlacklistAds === 'function') {
                TE.setBlacklistAds([
                'SEED App - Mine SEED', // task name 
                '66ec39da467ed0b3fdea3539', // task id
                '6724665873652075dc5b388f', // task id
                '123', // task name
                ]);
            } else {
                console.warn("TE.setBlacklistAds function not available");
            }
        });
        // event listener to get the click task info  
        document.addEventListener('TEAdClicked', function (event) {
            const adInfo = event?.detail;
            console.log('TEAdClicked',adInfo);
            alert('TEAdClicked=> task: ' + JSON.stringify(adInfo || {}));
        });
        // action to open offer wall
        document.addEventListener('DOMContentLoaded', function() {
            const openOfferWallButton = document.getElementById('openOfferWallButton');
            openOfferWallButton.addEventListener('click', function() {
                if (TE && typeof TE.offerWall === 'function') {
                    TE.offerWall();
                } else {
                    console.error('TE is not defined or offerWall is not a function');
                }
            });
        });
        // action to check user conversion
        document.addEventListener('DOMContentLoaded', function() {
            const checkUserConversionButton = document.getElementById('checkUserConversionButton');
            checkUserConversionButton.addEventListener('click', async function() {
                try {
                //const tui = getTelegramUserId();
                const url = '${api_url}' + '&tui=' + getTelegramUserId();
                const response = await fetch(url);
                const data = await response.json();
                console.log("🚀 ~ checkUserConversion ~ data:", data)
                } catch (error) {
                console.log("🚀 ~ checkUserConversion ~ error:", error);
                }
            });
        });
    </script>
</body>
</html>
`,
code_string_confirm_conversion_example :(src_link) => `<!DOCTYPE html>
<html>
<head>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <script src="${src_link}" ></script>
    <style> 
        h1{
            text-align: center;
        }
        #exchangeBanner{
            display: flex;
            align-items: center;
            justify-content: center;
        }
        #openOfferWallButton{
            margin-top: 120px;
            margin-left: 120px;
        }
    </style>
</head>
<body>
    <h1>DEMO BANNER EXCHANGE CODE</h1>
    <div class="main-content"> 
    
    </div>
    <!--example to open offer wall -->
    <button id="openOfferWallButton">Open Offer Wall</button>
    <button id="confirmConversion">Confirm Conversion</button>
    <script>
        document.addEventListener('becLoaded', function (event) {
            // load the offer wall style config
            TE.configureOfferWallStyle({
                topBar: {
                    backgroundColor: '#2c3e50',
                    textColor: '#ecf0f1'
                },
                content: {
                    backgroundColor: '#34495e',
                    appNameColor: '#ecf0f1',
                    appDescriptionColor: '#bdc3c7'
                },
                button: {
                    backgroundColor: '#3498db',
                    textColor: '#ffffff',
                    highlightedBackgroundColor: '#2980b9',
                    highlightedTextColor: '#ffffff',
                    outlineColor: '#3498db'
                }
            });
        });
        document.addEventListener('DOMContentLoaded', function() {
            const openOfferWallButton = document.getElementById('openOfferWallButton');
            openOfferWallButton.addEventListener('click', function() {
                if (TE && typeof TE.offerWall === 'function') {
                    TE.offerWall();
                } else {
                    console.error('TE is not defined or offerWall is not a function');
                }
            });

            const confirmConversion = document.getElementById('confirmConversion');
            confirmConversion.addEventListener('click', async function() {
                if (TE && typeof TE.confirmConversion === 'function') {
                    let result = await TE.confirmConversion();
                    console.log("🚀 ~ result confirmConversion:", result)
                } else {
                    console.error('TE is not defined or confirmConversion is not a function');
                }
            });
        });
    </script>
</body>
</html>`,
        code_string_get_user_telegram_id:``,
        code_string_check_user_conversion: (api_url) => `let telegram_user_id = getTelegramUserId();  // please check how to get from example
let url = "${api_url}" + '&tui=' + telegram_user_id;
const response = await fetch(url);
const data = await response.json();`,
code_string_listener_click_ad_event:`<script> 
document.addEventListener('TEAdClicked', function (event) {
    const adInfo = event?.detail;
    console.log('TEAdClicked',adInfo);
    alert('TEAdClicked=> task: ' + JSON.stringify(adInfo || {}));
});
</script>`,
code_string_set_black_list_ads: `<script>
document.addEventListener('becLoaded', function (event) {
    // add blacklist tasks - examples values
    if (TE && typeof TE.setBlacklistAds === 'function') {
        TE.setBlacklistAds([
        'SEED App - Mine SEED', // task name 
        '66ec39da467ed0b3fdea3539', // task id
        '6724665873652075dc5b388f', // task id
        '123', // task name 
        ]);
    } else {
        console.warn("TE.setBlacklistAds function not available");
    }
});
</script>`,
  },
    react_js: {
        code_string_btn_display_offer_wall:`<button id="openOfferWallButton" 
    onClick={() => {
        if (TE && typeof TE.offerWall === 'function') {
            TE.offerWall();
        } else {
            console.error('TE is not defined or offerWall is not a function');
        }
    }}>
    Open Offer Wall
</button>`,
    code_string_adding_1: `<div id="exchangeBanner"></div>` ,
    code_string_btn_confirm_conversion:`<button id="confirmConversion"  onClick={async () =>{
    if (TE && typeof TE.confirmConversion === 'function') {
        let result = await TE.confirmConversion();
        console.log("🚀 ~ result confirmConversion:", result)
    } else {
        console.error('TE is not defined or confirmConversion is not a function');
    }
}}>confirm Conversion</button>`,
    code_string_config_offer_wall:`<script>
    useEffect(() => {
        document.addEventListener('becLoaded', function (event) {
            // load the offer wall style config
            TE.configureOfferWallStyle({
                topBar: {
                    backgroundColor: '#2c3e50',
                    textColor: '#ecf0f1'
                },
                content: {
                    backgroundColor: '#34495e',
                    appNameColor: '#ecf0f1',
                    appDescriptionColor: '#bdc3c7'
                },
                button: {
                    backgroundColor: '#3498db',
                    textColor: '#ffffff',
                    highlightedBackgroundColor: '#2980b9',
                    highlightedTextColor: '#ffffff',
                    outlineColor: '#3498db'
                }
            });
        });
    }, []);
</script>`,
    code_string_display_offer_wall_example:(src_link,api_url) => `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Snippets - Reactjs Demo</title>
    <script src="https://unpkg.com/react@18/umd/react.production.min.js"></script>
    <script src="https://unpkg.com/react-dom@18/umd/react-dom.production.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/babel-standalone/6.26.0/babel.min.js"></script>
    <script src="${src_link}" ></script>
    <script src="https://telegram.org/js/telegram-web-app.js"></script>
</head>
<body>
    <style>
        .btn-actions{
            margin-top: 48px;
        }
    </style>
    <div id="root"></div>

    <script type="text/babel">
        const { useState, useEffect } = React;
        const LandingPage = () => {
            function getTelegramUserId() {
                try {
                    const telegram = window.Telegram;
                    if (telegram && telegram.WebApp) {
                        telegram.WebApp.ready();
                        const userId = telegram.WebApp && telegram.WebApp.initDataUnsafe && telegram.WebApp.initDataUnsafe.user && telegram.WebApp.initDataUnsafe.user.id || '';
                        return userId;
                    } else {
                        console.error('Telegram Web App SDK is not available');
                        return '';
                    }
                } catch (error) {
                    console.error(error);
                    return '';
                }
            }
            useEffect(() => {
                const initTE = async () => {
                    if (TE && typeof TE.onLoad === 'function') {
                        await TE.onLoad()
                    } else {
                        console.error('initTE is not a function');
                    }
                };
                
                initTE();
            }, []);
            useEffect(() => {
            document.addEventListener('becLoaded', function (event) {
                // load the offer wall style config
                TE.configureOfferWallStyle({
                    topBar: {
                        backgroundColor: '#2c3e50',
                        textColor: '#ecf0f1'
                    },
                    content: {
                        backgroundColor: '#34495e',
                        appNameColor: '#ecf0f1',
                        appDescriptionColor: '#bdc3c7'
                    },
                    button: {
                        backgroundColor: '#3498db',
                        textColor: '#ffffff',
                        highlightedBackgroundColor: '#2980b9',
                        highlightedTextColor: '#ffffff',
                        outlineColor: '#3498db'
                    }
                });
                 // add blacklist tasks - examples values
                if (TE && typeof TE.setBlacklistAds === 'function') {
                    TE.setBlacklistAds([
                    'SEED App - Mine SEED', // task name 
                    '66ec39da467ed0b3fdea3539', // task id
                    '6724665873652075dc5b388f', // task id
                    '123', // task name
                    ]);
                } else {
                    console.warn("TE.setBlacklistAds function not available");
                }
            });
            // event listener to get the click task info  
            document.addEventListener('TEAdClicked', function (event) {
                const adInfo = event?.detail;
                console.log('TEAdClicked',adInfo);
                alert('TEAdClicked=> task: ' + JSON.stringify(adInfo || {}));
            });
            }, []);
            return (
                <div className="min-h-screen flex flex-col">
                    <div className="btn-actions"> 
                        <button id="openOfferWallButton" onClick={() =>{
                            if (TE && typeof TE.offerWall === 'function') {
                                TE.offerWall();
                            } else {
                                console.error('TE is not defined or offerWall is not a function');
                            }
                        }}>Open Offer Wall</button>
                        <button id="checkUserConversionButton" onClick={async () =>{
                            try {
                               //const tui = getTelegramUserId();
                                const url = ${api_url} + '&tui=' + getTelegramUserId();
                                const response = await fetch(url);
                                const data = await response.json();
                                console.log("🚀 ~ checkUserConversion ~ data:", data)
                            } catch (error) {
                                console.log("🚀 ~ checkUserConversion ~ error:", error);
                            }
                        }}>Check User Conversion</button>
                    </div>
                </div>
            );
        };
        ReactDOM.render(<LandingPage />, document.getElementById('root'));
    </script>
</body>
</html>
`,
    code_string_confirm_conversion_example:(src_link) => `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Snippets - Reactjs Demo</title>
    <script src="https://unpkg.com/react@18/umd/react.production.min.js"></script>
    <script src="https://unpkg.com/react-dom@18/umd/react-dom.production.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/babel-standalone/6.26.0/babel.min.js"></script>
    <script src="${src_link}" ></script>
</head>
<body>
    <style>
        .btn-actions{
            margin-top: 48px;
        }
    </style>
    <div id="root"></div>

    <script type="text/babel">
        const { useState, useEffect } = React;
        const LandingPage = () => {
            useEffect(() => {
              document.addEventListener('becLoaded', function (event) {
                // load the offer wall style config
                TE.configureOfferWallStyle({
                    topBar: {
                        backgroundColor: '#2c3e50',
                        textColor: '#ecf0f1'
                    },
                    content: {
                        backgroundColor: '#34495e',
                        appNameColor: '#ecf0f1',
                        appDescriptionColor: '#bdc3c7'
                    },
                    button: {
                        backgroundColor: '#3498db',
                        textColor: '#ffffff',
                        highlightedBackgroundColor: '#2980b9',
                        highlightedTextColor: '#ffffff',
                        outlineColor: '#3498db'
                    }
                });
            });
            }, []);
            return (
                <div className="min-h-screen flex flex-col">
                    <div id="exchangeBanner"></div> 
                    <div className="btn-actions"> 
                        <button id="openOfferWallButton"  onClick={() =>{
                            if (TE && typeof TE.offerWall === 'function') {
                                TE.offerWall();
                            } else {
                                console.error('TE is not defined or offerWall is not a function');
                            }
                        }}>Open Offer Wall</button>
                          <button id="confirmConversion"  onClick={async () =>{
                            if (TE && typeof TE.confirmConversion === 'function') {
                                let result = await TE.confirmConversion();
                                console.log("🚀 ~ result confirmConversion:", result)
                            } else {
                                console.error('TE is not defined or confirmConversion is not a function');
                            }
                        }}>confirm Conversion</button>
                    </div>
                </div>
            );
        };
        ReactDOM.render(<LandingPage />, document.getElementById('root'));
    </script>
</body>
</html>`,
code_string_listener_click_ad_event:`<script> 
    useEffect(() => {
        document.addEventListener('TEAdClicked', function (event) {
            const adInfo = event?.detail;
            console.log('TEAdClicked',adInfo);
            alert('TEAdClicked=> task: ' + JSON.stringify(adInfo || {}));
        });
    }, []);
</script>`,
code_string_set_black_list_ads: `<script>
    useEffect(() => {
        document.addEventListener('becLoaded', function (event) {
             // add blacklist tasks - examples values
            if (TE && typeof TE.setBlacklistAds === 'function') {
                TE.setBlacklistAds([
                'SEED App - Mine SEED', // task name 
                '66ec39da467ed0b3fdea3539', // task id
                '6724665873652075dc5b388f', // task id
                '123', // task name
                ]);
            } else {
                console.warn("TE.setBlacklistAds function not available");
            }
        });
    }, []);
</script>`,
}
}