export const sdk_embedding = {
  vanilla_js: {
    code_string:(src_link) => `<!DOCTYPE html>
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
    <div id="exchangeBanner"></div> 

    <!--example to open offer wall -->
    <button id="openOfferWallButton">Open Offer Wall</button>
    <button id="confirmConversion">Confirm Conversion</button>
    <button id="checkUserConversion">Check User Conversion</button>
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

            const checkUserConversion = document.getElementById('checkUserConversion');
            checkUserConversion.addEventListener('click', async function() {
                if (TE && typeof TE.checkUserConversion === 'function') {
                    let result = await TE.checkUserConversion();
                    console.log("🚀 ~ result checkUserConversion:", result)
                } else {
                    console.error('TE is not defined or checkUserConversion is not a function');
                }
            });
        });
    </script>
</body>
</html>
`
  },
  react_js: {
    code_string:(src_link) => `<!DOCTYPE html>
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
                          <button id="checkUserConversion"  onClick={async() =>{
                            if (TE && typeof TE.checkUserConversion === 'function') {
                                let result = await TE.checkUserConversion();
                                console.log("🚀 ~ result checkUserConversion:", result)
                            } else {
                                console.error('TE is not defined or checkUserConversion is not a function');
                            }
                        }}>check User Conversion</button>
                    </div>
                </div>
            );
        };
        ReactDOM.render(<LandingPage />, document.getElementById('root'));
    </script>
</body>
</html>

`
  }
}