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
The game takes inspiration from games like For Honor and Chivalry

<p align="right">(<a href="#readme-top">back to top</a>)</p>



### Built With
<ul>
<li>The game is built to run in the browser on the web. </li>
<li>The game will be served from a server which also handles player networking </li>
<li>Nodemon was used during the development of the server code to make the development experience easier</li>
<li>The game is a 3d game and so uses Three.js for its rendering</li>
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

This is an example of how you may give instructions on setting up your project locally.
To get a local copy up and running follow these simple example steps.

### Prerequisites

This is an example of how to list things you need to use the software and how to install them.
* npm
  ```sh
  npm install npm@latest -g
  ```

### Installation

_Below is an example of how you can instruct your audience on installing and setting up your app. This template doesn't rely on any external dependencies or services._

1. Get a free API Key at [https://example.com](https://example.com)
2. Clone the repo
   ```sh
   git clone https://github.com/your_username_/Project-Name.git
   ```
3. Install NPM packages
   ```sh
   npm install
   ```
4. Enter your API in `config.js`
   ```js
   const API_KEY = 'ENTER YOUR API';
   ```

<p align="right">(<a href="#readme-top">back to top</a>)</p>



<!-- USAGE EXAMPLES -->
## Usage

Use this space to show useful examples of how a project can be used. Additional screenshots, code examples and demos work well in this space. You may also link to more resources.

_For more examples, please refer to the [Documentation](https://example.com)_

<p align="right">(<a href="#readme-top">back to top</a>)</p>



<!-- ROADMAP -->
## Roadmap

- [x] Add Changelog
- [x] Add back to top links
- [ ] Add Additional Templates w/ Examples
- [ ] Add "components" document to easily copy & paste sections of the readme
- [ ] Multi-language Support
    - [ ] Chinese
    - [ ] Spanish

See the [open issues](https://github.com/othneildrew/Best-README-Template/issues) for a full list of proposed features (and known issues).

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- CONTACT -->
## Contact

Your Name - [@your_twitter](https://twitter.com/your_username) - email@example.com

Project Link: [https://github.com/your_username/repo_name](https://github.com/your_username/repo_name)

<p align="right">(<a href="#readme-top">back to top</a>)</p>



<!-- ACKNOWLEDGMENTS -->
## Acknowledgments

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


