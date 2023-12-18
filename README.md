<!------------------------------------------------------------------------------------------------->
<!--IMPORTANT-->


<!--PLEASE VIEW THIS MARKDOWN FILE ON THE GIT REPOSITORY AS IT WILL BE RENDERED PROPERLY THERE-->



<!--https://github.com/JamesB0010/Year2UniWebGame-->



<!------------------------------------------------------------------------------------------------->
<!-- Credits for readme template https://github.com/othneildrew/Best-README-Template/blob/master/README.md -->
<a name="readme-top"></a>
<br />
<div align="center">
  <h3 align="center">Knightly Knockout</h3>

  <p align="center">
    A first person 1 vs 1 sword fighting game
    <br />
    <br />
    <a href="https://replit.com/@JamesBland/Year2UniWebGame">View Demo</a>
    ·
    <a href="https://github.com/JamesB0010/Year2UniWebGame">Git Repo</a>
  </p>
</div>



<!-- TABLE OF CONTENTS -->
<details>
  <summary>Table of Contents</summary>
  <ol>
    <li>
      <a href="#about-the-project">About The Project</a>
      <ul>
        <li><a href="#built-with">Built With</a></li>
      </ul>
    </li>
    <li>
      <a href="#getting-started">Getting Started</a>
      <ul>
        <li><a href="#prerequisites">Prerequisites</a></li>
        <li><a href="#installation">Installation</a></li>
      </ul>
    </li>
    <li><a href="#usage">Usage</a></li>
    <li><a href="#FileStructure">File Structure</a></li>
    <li><a href = "#NamingConventions"> Naming Conventions</a></li>
    <li><a href="#roadmap">Roadmap</a></li>
    <li><a href="#contact">Contact</a></li>
    <li><a href="#acknowledgments">Acknowledgments</a></li>
  </ol>
</details>



<!-- ABOUT THE PROJECT -->
## About The Project

![knightlyKnockoutblockingSs](https://github.com/JamesB0010/Year2UniWebGame/assets/98528984/9b14ff5d-9b03-4c14-9ba4-c8cad50ab5e7)

This is the web game i have created as part of my course work at Birmingham City University
<br>
As mentioned above it is a networked multiplayer game, where two players fight 1 vs 1, the first to win 3 rounds wins!
<br>
The game takes inspiration from games like <a href = "https://www.ubisoft.com/en-gb/game/for-honor">For Honor</a> and <a href = "https://chivalry2.com">Chivalry 2</a>

<p align="right">(<a href="#readme-top">back to top</a>)</p>



### Built With
<ul>
<li>The game is built to run in the browser on the web. </li>
<li>The game is a 3d game and so uses Three.js for its rendering</li>
<li>The game uses Ammo.js for its physics calculations</li>
<li>The game will be served from an express server which also handles player networking using socket.io</li>
<li>Nodemon and postman was used during the development of the server code to make the development experience easier</li>
</ul>
<br>

* [![Three][Three.js]][Three-url]
* ![Static Badge](https://img.shields.io/badge/Ammo%20js-orange)
* [![Express][Express.js]][Express-url]
* ![Static Badge](https://img.shields.io/badge/Multer-red?logo=express&labelColor=black)
* [![Socket.io][Socket.io]][Socket.io-url]
* [![Node.js][Node.js]][Node-url]
* ![Static Badge](https://img.shields.io/badge/My_SQL-white?logo=mysql&labelColor=white&color=orange)
* [![Nodemon][Nodemon]][Nodemon-url]
* [![Npm][Npm]][Npm-url]
* ![Html][Html]
* ![JavaScript][Javascript]
* ![CSS][CSS]
* ![Static Badge](https://img.shields.io/badge/Cors-green)
* ![Static Badge](https://img.shields.io/badge/Crypto-green)
* ![Static Badge](https://img.shields.io/badge/Fs-blue)
* ![Static Badge](https://img.shields.io/badge/Path_(Node)-white)



<p align="right">(<a href="#readme-top">back to top</a>)</p>



<!-- GETTING STARTED -->
## Getting Started

### Replit

the code is hosted on the repl pointed to by <a href = "https://replit.com/@JamesBland/Year2UniWebGame">this</a> link

after following the link press run and then open in new tab

![Screenshot 2023-12-18 002141](https://github.com/JamesB0010/Year2UniWebGame/assets/98528984/1f0ac05a-9768-44b5-b7ec-69acd8b8496c)


### localhost

This section will cover setting the project up locally

#### Prerequisites

First you will need <a href = "https://nodejs.org/en/">node</a> installed on your machine
<br>
Node version v18.15.0 was used to develop the app, this version or any later versions should work to run the project

You will also need <a href = "https://desktop.github.com">github desktop</a> or <a href = "https://git-scm.com/downloads">git cli</a> installed

it is easier to clone the project with git desktop, the steps to clone the project with git cli are below

### Installation

How to install and setup the game to run on localhost


1. Clone the repo (Url can be used with github desktop too)

<ul>
  <li>To see the mid term submission of the game clone the mid-term-submission branch</li>
</ul>

```sh
git clone -b mid-term-submission https://github.com/JamesB0010/Year2UniWebGame.git
```

<ul>
  <li>or to see the current development version of the game then you can clone the repo from the main branch</li>
</ul>

   ```sh
   git clone https://github.com/JamesB0010/Year2UniWebGame.git
   ```
2. Make sure the current directory is Year2UniWebGame/
   
3. Install NPM packages

Open your command line and set the current directory to the root of the project, an easy way to do this is by right clicking the project folder and selecting "Open in Terminal"


![open in terminal](https://github.com/JamesB0010/Year2UniWebGame/assets/98528984/804bff27-73f1-46c1-aa14-27ee7e63eb80)


then run:
   ```sh
   npm install
   ```

<p align="right">(<a href="#readme-top">back to top</a>)</p>



<!-- USAGE EXAMPLES -->
## Usage

To play the game open a terminal session in the root of the repository

Then run:
```sh
node server.js
```

or for development
```sh
nodemon server.js
```

You will see a log to the console saying "server running on http://localhost:3000" You can click the link or manually type the url into a web browser to see the landing page for the game website

<img src = "https://northeurope1-mediap.svc.ms/transform/thumbnail?provider=spo&inputFormat=png&cs=MDAwMDAwMDAtMDAwMC0wMDAwLTAwMDAtMDAwMDQ4MTcxMGE0fFNQTw&docid=https%3A%2F%2Fmy.microsoftpersonalcontent.com%2F_api%2Fv2.0%2Fdrives%2Fb!a72iQpK34EWhSXI3m85uAf2-WPNtqfxDu0_ndmi-io06Bt-0QiclQKREJRJ84W7Z%2Fitems%2F01HQDMLO7PA4AUIQMZYFC26MUFW3LJZIEL%3Ftempauth%3DeyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIwMDAwMDAwMy0wMDAwLTBmZjEtY2UwMC0wMDAwMDAwMDAwMDAvbXkubWljcm9zb2Z0cGVyc29uYWxjb250ZW50LmNvbUA5MTg4MDQwZC02YzY3LTRjNWItYjExMi0zNmEzMDRiNjZkYWQiLCJpc3MiOiIwMDAwMDAwMy0wMDAwLTBmZjEtY2UwMC0wMDAwMDAwMDAwMDAiLCJuYmYiOiIxNjk5NDY2NDAwIiwiZXhwIjoiMTY5OTQ4ODAwMCIsImVuZHBvaW50dXJsIjoiVFp6ZlAwS3VVNHQvNDJPdjFPYzdMdnM5UFN6YTJMYmVMWlphVXBvTDJ4OD0iLCJlbmRwb2ludHVybExlbmd0aCI6IjE2NCIsImlzbG9vcGJhY2siOiJUcnVlIiwidmVyIjoiaGFzaGVkcHJvb2Z0b2tlbiIsInNpdGVpZCI6Ik5ESmhNbUprTm1JdFlqYzVNaTAwTldVd0xXRXhORGt0TnpJek56bGlZMlUyWlRBeCIsImFwcGlkIjoiMDAwMDAwMDAtMDAwMC0wMDAwLTAwMDAtMDAwMDQ4MTcxMGE0IiwidGlkIjoiOTE4ODA0MGQtNmM2Ny00YzViLWIxMTItMzZhMzA0YjY2ZGFkIiwidXBuIjoiamFtbXlkb2RnZXI4ODg4QGdtYWlsLmNvbSIsInB1aWQiOiIwMDAzNDAwMUQzNDdCOUVEIiwiY2FjaGVrZXkiOiIwaC5mfG1lbWJlcnNoaXB8MDAwMzQwMDFkMzQ3YjllZEBsaXZlLmNvbSIsInNjcCI6ImFsbHNpdGVzLmZ1bGxjb250cm9sIiwic2lkIjoiMTE0MDE3NjAyMzk4NjkwOTU4OSIsInR0IjoiMiIsImlwYWRkciI6IjUyLjEwNS4zMi4xNTcifQ.CPi7ceODg5rLkX-xRXeW-HO8rtT4NzRdxKrV_XM0xwg%26version%3DPublished&cb=63835073554&encodeFailures=1&width=1869&height=834">

You can visit the sign up and log in pages and can type "/" then some giberish into the url bar to see the 404 page

Then you can press "Play Game" to navigate to the games main menu and can press play game on the main menu to be taken to the game.

At this point you should see a loading screen

<img src = "https://northeurope1-mediap.svc.ms/transform/thumbnail?provider=spo&inputFormat=png&cs=MDAwMDAwMDAtMDAwMC0wMDAwLTAwMDAtMDAwMDQ4MTcxMGE0fFNQTw&docid=https%3A%2F%2Fmy.microsoftpersonalcontent.com%2F_api%2Fv2.0%2Fdrives%2Fb!a72iQpK34EWhSXI3m85uAf2-WPNtqfxDu0_ndmi-io06Bt-0QiclQKREJRJ84W7Z%2Fitems%2F01HQDMLO5W26EX2BNG35HJX3B3YJBINKQ4%3Ftempauth%3DeyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIwMDAwMDAwMy0wMDAwLTBmZjEtY2UwMC0wMDAwMDAwMDAwMDAvbXkubWljcm9zb2Z0cGVyc29uYWxjb250ZW50LmNvbUA5MTg4MDQwZC02YzY3LTRjNWItYjExMi0zNmEzMDRiNjZkYWQiLCJpc3MiOiIwMDAwMDAwMy0wMDAwLTBmZjEtY2UwMC0wMDAwMDAwMDAwMDAiLCJuYmYiOiIxNjk5NDY2NDAwIiwiZXhwIjoiMTY5OTQ4ODAwMCIsImVuZHBvaW50dXJsIjoiMkw1TmF1YnFya2NoanRBZzZsdnRxdEs5YU01a1FzcXR6WXJFM0pPSXBKVT0iLCJlbmRwb2ludHVybExlbmd0aCI6IjE2NCIsImlzbG9vcGJhY2siOiJUcnVlIiwidmVyIjoiaGFzaGVkcHJvb2Z0b2tlbiIsInNpdGVpZCI6Ik5ESmhNbUprTm1JdFlqYzVNaTAwTldVd0xXRXhORGt0TnpJek56bGlZMlUyWlRBeCIsImFwcGlkIjoiMDAwMDAwMDAtMDAwMC0wMDAwLTAwMDAtMDAwMDQ4MTcxMGE0IiwidGlkIjoiOTE4ODA0MGQtNmM2Ny00YzViLWIxMTItMzZhMzA0YjY2ZGFkIiwidXBuIjoiamFtbXlkb2RnZXI4ODg4QGdtYWlsLmNvbSIsInB1aWQiOiIwMDAzNDAwMUQzNDdCOUVEIiwiY2FjaGVrZXkiOiIwaC5mfG1lbWJlcnNoaXB8MDAwMzQwMDFkMzQ3YjllZEBsaXZlLmNvbSIsInNjcCI6ImFsbHNpdGVzLmZ1bGxjb250cm9sIiwic2lkIjoiMTE0MDE3NjAyMzk4NjkwOTU4OSIsInR0IjoiMiIsImlwYWRkciI6IjUyLjEwNS4zMi4zNiJ9.-HJmxNnkGpeJ_C1J1X76XTkS1IvqqJw1HmCgyUq9Lzw%26version%3DPublished&cb=63835073717&encodeFailures=1&width=1869&height=834">

open the website again (http://localhost:3000) in another tab and follow the same steps to play the game and you will be met with another loading screen

after both tabs have been loaded you will be able to see both players are loaded into the game and their movements are replicated to each other

![WebGameTest](https://github.com/JamesB0010/Year2UniWebGame/assets/98528984/be295952-7c8d-4de1-a0b1-63348cd05f07)


<h3>Player Damage and rounds</h3>

You can press the damage button to damage the player this will cause the blood effect around the screen to become less transparrent alerting the player to the health they have left

The heal button increases the players health and does the opposite of the damage button

The die button instantly kills the player

the buttons are not intended for the final game and so using them can be weird. each time you click the button the game will attempt to capture the cursor so you must press esc to get the cursor back to click another button

when a player dies the opposing player gets a point added to their score and the first player to get 3 points wins 

![DemoOfPlayerWinningGame](https://github.com/JamesB0010/Year2UniWebGame/assets/98528984/8dd401e0-3413-4f7c-b7f3-d9d38c30d278)



<p align="right">(<a href="#readme-top">back to top</a>)</p>


<!--File structure-->
## FileStructure

The file structure of the project is as follows

* root
    * server.js
    * Other files (such as gitignore, readme, package.json etc...)
    * node_modules/
        * libraries imported by npm
    * Presentation/
        * GamePresentation.pptx
    * public/
        * CSS/
            * game-styles.css
            * global-styles.css
        * GameAssets/
            * Images/
                * skybox textures/ (a folder containing images to be used as a skybox)
                * (images used in game such as blood splatter effects and a default profile picture)
            * Models/
                * Environment/
                    * medivalBridge.glb
                * Player/
                    * KnightMan.glb
        * HTML/
            * (html files for the game and website)
        * Javascript/
            * (Javascript files for the game and website)
    * views/
        * 404.html
        * 404styles.css

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!--Naming conventions-->
## NamingConventions
<h3>File naming</h3>

HTML, CSS and Javascript files all follow the convention of being all lowercase and seperating words with a hyphen except for the Game.js file

<h3>Code naming</h3>

* camelCase is used for variables
* PascalCase is used for functions and classes



<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- ROADMAP -->
## Roadmap

- [x] Game Website has: intro page, login page, new user page, 404 page, game loading page, and a game page
- [x] Game Assets for character, environment and enemy player
- [x] Use of lights, texture and material for the game assets
- [x] animation (translation) of game assets 
- [x] Game interaction (player able to control player character)
- [x] Game ui which is fully functioning displaying score, health, rewards and penalties
- [x] Responsive webpage design
- [x] Responsive game page design
- [X] Game has a server side, and displays a 404 page correctly and is correctly deployed
- [X] Game websites are fully working with correct login, register web interface
- [x] Game webpages are responsive to different screen sizes
- [X] Data storage implementation - user login data
- [X] Data storage implementation - game score/ stats
- [X] Game score for the players login data can be reloaded correctly
- [X] ·	Game data storage is secured and not able to be access without authentication.
- [X] ·	Complicated landscape and visual effect display and with a good loading speed: For example, particles and use of instance.   
- [X] Game increases in difficulty as the user score increases
- [X] Game audio is working in the game
- [X] Game is working on the latest google chrome web browser for both pc and mobile devices
- [x] Has a "Readme" documentation <sub>Yay thats me️!</sub>
- [X] User data is encrypted and stored securley
- [X] Has database design and implementation for game data
- [x] Multiple player allows at least two players to play in the same game at the same time
- [X] Using physics that affected the game
- [X] Has a systematic game messaging design. Passing the data using suitable client-server communication methods in a correct way
- [X] A youtube video has been made showing the game and demonstrating my work as a portfolio peice
- [X] A presentation has been created for the project


See the [open issues](https://github.com/JamesB0010/Year2UniWebGame/issues) for a list of features which are being worked on/have been worked on.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- CONTACT -->
## Contact

James Bland - JamesRichardBland@gmail.com or James.bland@mail.bcu.ac.uk

[LinkedIn](https://www.linkedin.com/in/james-richard-bland/)

[YouTube](https://www.youtube.com/channel/UCd5tdaMVhvp2SkkqIxzsuRQ)

Project Link: [https://github.com/JamesB0010/Year2UniWebGame](https://github.com/JamesB0010/Year2UniWebGame)

<p align="right">(<a href="#readme-top">back to top</a>)</p>



<!-- ACKNOWLEDGMENTS -->
## Acknowledgments

Here are references to rescources used in the project

* [Readme Template](https://github.com/othneildrew/Best-README-Template)
* [Img Shields/Badges](https://github.com/Ileriayo/markdown-badges)
* [Creating express server article](https://replit.com/talk/learn/SocketIO-Tutorial-What-its-for-and-how-to-use/143781)
* [How to respond to a 404 with express](https://www.youtube.com/watch?v=OKGMhFgR7RY)
* [How to send a html file in response to a 404](https://www.youtube.com/watch?v=JbwlM1Gu5aE)
* [Loader wheel for loading page](https://www.w3schools.com/howto/howto_css_loader.asp)
* [Pointer lock tutorial video](https://www.youtube.com/watch?v=leAbQ0yfVX0)
* [Log in and sign up form base](https://www.w3schools.com/html/tryit.asp?filename=tryhtml_form_submit)
* [Randomize matrix function used in the process of creating clouds using random spheres](https://github.com/mrdoob/three.js/blob/dev/examples/webgl_instancing_performance.html)
* [Fps controller and Input controller](https://www.youtube.com/watch?v=oqKzxPMLWxo)

<p align="right">(<a href="#readme-top">back to top</a>)</p>



<!-- MARKDOWN LINKS & IMAGES -->
<!-- https://www.markdownguide.org/basic-syntax/#reference-style-links -->
[linkedin-shield]: https://img.shields.io/badge/-LinkedIn-black.svg?style=for-the-badge&logo=linkedin&colorB=555
[linkedin-url]: https://linkedin.com/in/othneildrew


<!--Library shields-->
[Three.js]: https://img.shields.io/badge/Three.js-000000?style=for-the-badge&logo=three.js&logoColor=white
[Three-url]: https://threejs.org

[Express.js]: https://img.shields.io/badge/express.js-%23404d59.svg?style=for-the-badge&logo=express&logoColor=%2361DAFB
[Express-url]: https://expressjs.com

[Socket.io]: https://img.shields.io/badge/Socket.io-black?style=for-the-badge&logo=socket.io&badgeColor=010101
[Socket.io-url]: https://socket.io

[Node.js]: https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white
[Node-url]: https://nodejs.org/en/

[Nodemon]: https://img.shields.io/badge/NODEMON-%23323330.svg?style=for-the-badge&logo=nodemon&logoColor=%BBDEAD
[Nodemon-url]: https://www.npmjs.com/package/nodemon

[NPM]: https://img.shields.io/badge/NPM-%23CB3837.svg?style=for-the-badge&logo=npm&logoColor=white
[NPM-url]: https://www.npmjs.com


[HTML]: https://img.shields.io/badge/HTML-239120?style=for-the-badge&logo=html5&logoColor=white

[CSS]: https://img.shields.io/badge/CSS-239120?&style=for-the-badge&logo=css3&logoColor=white

[JavaScript]: https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black


