<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8">
    <link rel="icon" href="/favicon.ico">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <link rel="manifest" href="/manifest.json">
    <title>PixelRetail</title>
    <style>
      html {
        background-color: #111;
      }
      body {
        background-image: url(/bg.jpg);
        background-position: center;
        background-repeat: no-repeat;
        height: 100vh;
        overflow: hidden;
        margin: 0;
        padding: 0;
      }
      #logo {
        position: absolute;
        width: 100vw;
        height: 100vh;
        background-image: url(/logo-white.png);
        background-position: center;
        background-repeat: no-repeat;
        filter: drop-shadow(0 5px 0 rgba(0,0,0,0.1));
      }
      @media (max-width: 690px) {
        #logo {
          background-size: 80vw auto;
        }
      }
    </style>
  </head>
  <body>
    <div id="logo"></div>
  </body>
</html>
