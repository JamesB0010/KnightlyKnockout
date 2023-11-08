<!-- Credits for readme template https://github.com/othneildrew/Best-README-Template/blob/master/README.md -->
<a name="readme-top"></a>
<br />
<div align="center">
  <h3 align="center">Uni Web Game</h3>

  <p align="center">
    A first person 1 vs 1 sword fighting game
    <br />
    <br />
    <a href="">View Demo</a>
    ·
    <a href="">Git Repo</a>
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
    <li><a href="#roadmap">Roadmap</a></li>
    <li><a href="#contact">Contact</a></li>
    <li><a href="#acknowledgments">Acknowledgments</a></li>
  </ol>
</details>



<!-- ABOUT THE PROJECT -->
## About The Project

<img src="https://northeurope1-mediap.svc.ms/transform/thumbnail?provider=spo&inputFormat=png&cs=MDAwMDAwMDAtMDAwMC0wMDAwLTAwMDAtMDAwMDQ4MTcxMGE0fFNQTw&docid=https%3A%2F%2Fmy.microsoftpersonalcontent.com%2F_api%2Fv2.0%2Fdrives%2Fb!a72iQpK34EWhSXI3m85uAf2-WPNtqfxDu0_ndmi-io06Bt-0QiclQKREJRJ84W7Z%2Fitems%2F01HQDMLO6SYFLASV4YWVD26WR5JWEUWSG2%3Ftempauth%3DeyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIwMDAwMDAwMy0wMDAwLTBmZjEtY2UwMC0wMDAwMDAwMDAwMDAvbXkubWljcm9zb2Z0cGVyc29uYWxjb250ZW50LmNvbUA5MTg4MDQwZC02YzY3LTRjNWItYjExMi0zNmEzMDRiNjZkYWQiLCJpc3MiOiIwMDAwMDAwMy0wMDAwLTBmZjEtY2UwMC0wMDAwMDAwMDAwMDAiLCJuYmYiOiIxNjk5NDY2NDAwIiwiZXhwIjoiMTY5OTQ4ODAwMCIsImVuZHBvaW50dXJsIjoiWUZxOHc4clNFcE5MaVQ2UUh1N2lyb0xjazFnYVRPZzRmZ0xmOUtyNWNHUT0iLCJlbmRwb2ludHVybExlbmd0aCI6IjE2NCIsImlzbG9vcGJhY2siOiJUcnVlIiwidmVyIjoiaGFzaGVkcHJvb2Z0b2tlbiIsInNpdGVpZCI6Ik5ESmhNbUprTm1JdFlqYzVNaTAwTldVd0xXRXhORGt0TnpJek56bGlZMlUyWlRBeCIsImFwcGlkIjoiMDAwMDAwMDAtMDAwMC0wMDAwLTAwMDAtMDAwMDQ4MTcxMGE0IiwidGlkIjoiOTE4ODA0MGQtNmM2Ny00YzViLWIxMTItMzZhMzA0YjY2ZGFkIiwidXBuIjoiamFtbXlkb2RnZXI4ODg4QGdtYWlsLmNvbSIsInB1aWQiOiIwMDAzNDAwMUQzNDdCOUVEIiwiY2FjaGVrZXkiOiIwaC5mfG1lbWJlcnNoaXB8MDAwMzQwMDFkMzQ3YjllZEBsaXZlLmNvbSIsInNjcCI6ImFsbHNpdGVzLmZ1bGxjb250cm9sIiwic2lkIjoiMTk5ODMzODE0MjA3MTg0NzA5IiwidHQiOiIyIiwiaXBhZGRyIjoiODIuMjUuMzIuMjIzIn0.3RTn5GHp6yJnhSFPFSaHaA23Mtjpx_8gAhjoDrfq58A%26version%3DPublished&cb=63835068619&encodeFailures=1&width=1469&height=834">
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
<li>The game will be served from a server which also handles player networking </li>
<li>Nodemon was used during the development of the server code to make the development experience easier</li>
</ul>
<br>

* [![Three][Three.js]][Three-url]
* [![Express][Express.js]][Express-url]
* [![Socket.io][Socket.io]][Socket.io-url]
* [![Node.js][Node.js]][Node-url]
* [![Nodemon][Nodemon]][Nodemon-url]
* [![Npm][Npm]][Npm-url]
* ![Html][Html]
* ![JavaScript][Javascript]
* ![CSS][CSS]


<p align="right">(<a href="#readme-top">back to top</a>)</p>



<!-- GETTING STARTED -->
## Getting Started

This section will cover setting the project up locally

### Prerequisites

First you will need <a href = "https://nodejs.org/en/">node</a> installed on your machine
<br>
if you already have node you can update it using the following command:

* npm
  ```sh
  npm install npm@latest -g
  ```

### Installation

How to install and setup the game to run on localhost


1. Clone the repo (Url can be used with github desktop too)
   ```sh
   git clone https://github.com/JamesB0010/Year2UniWebGame.git
   ```
2. Install NPM packages
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

open the website again (http://localhost:3000) in another tab and follow the same steps to play the game and will be met with another loading screen

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
- [ ] Game has a server side, and displays a 404 page correctly ✅ and is correctly deployed ❌
- [ ] Game websites are fully working with correct login, register web interface
- [x] Game webpages are responsive to different screen sizes
- [ ] Data storage implementation - user login data
- [ ] Data storage implementation - game score/ stats
- [ ] Game score for the players login data can be reloaded correctly
- [ ] ·	Game data storage is secured and not able to be access without authentication.
- [ ] ·	Complicated landscape and visual effect display and with a good loading speed: For example, particles ❌and use of instance.  ✅  
- [ ] Game increases in difficulty as the user score increases
- [ ] Game audio is working in the game
- [ ] Game is working on the latest google chrome web browser for both pc and mobile devices
- [x] Has a "Readme" documentation <sub>Yay thats me️!</sub>
- [ ] User data is encrypted and stored securley
- [ ] Has database design and implementation for game data
- [x] Multiple player allows at least two players to play in the same game at the same time
- [ ] Using physics that affected the game
- [ ] Has a systematic game messaging design. Passing the data using suitable client-server communication methods in a correct way
- [ ] A youtube video has been made showing the game and demonstrating my work as a portfolio peice
- [ ] A presentation has been created for the project


See the [open issues](https://github.com/othneildrew/Best-README-Template/issues) for a full list of proposed features (and known issues).

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- CONTACT -->
## Contact

Your Name - [@your_twitter](https://twitter.com/your_username) - email@example.com

Project Link: [https://github.com/your_username/repo_name](https://github.com/your_username/repo_name)

<p align="right">(<a href="#readme-top">back to top</a>)</p>



<!-- ACKNOWLEDGMENTS -->
## Acknowledgments

<!--Badges from https://github.com/Ileriayo/markdown-badges-->
<!--Markdown template from https://github.com/othneildrew/Best-README-Template/blob/master/README.md-->

Use this space to list resources you find helpful and would like to give credit to. I've included a few of my favorites to kick things off!

* [Choose an Open Source License](https://choosealicense.com)
* [GitHub Emoji Cheat Sheet](https://www.webpagefx.com/tools/emoji-cheat-sheet)
* [Malven's Flexbox Cheatsheet](https://flexbox.malven.co/)
* [Malven's Grid Cheatsheet](https://grid.malven.co/)
* [Img Shields](https://shields.io)
* [GitHub Pages](https://pages.github.com)
* [Font Awesome](https://fontawesome.com)
* [React Icons](https://react-icons.github.io/react-icons/search)

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


