/* =========================================================
   VOIDQUEST LAUNCHER
   ========================================================= */


/* =========================================================
   EDIT YOUR CONTENT HERE
   ========================================================= */


/*
    Add your games here.

    path:
    Where the PLAY button sends the player.

    image:
    Leave "" for now.
    Later you can use something like:

    image: "assets/dungeons-cover.png"

*/


const games = [

    {
        id: "vq-dungeons",

        title: "VQ Dungeons",

        shortTitle: "D",

        status: "IN DEVELOPMENT",

        type: "OPEN WORLD RPG",

        description:
            "A retro open world adventure with exploration, dungeons, combat and old-school RPG mechanics.",

        path: "./vq-dungeons/",

        image: "",

        featured: true,

        tags: [
            "3D/2D",
            "PIXEL ART",
            "RPG",
            "DUNGEON CRAWLER",
            "ADVENTURE"
        ]
    },


    {
        id: "vq-settlement",

        title: "VQ Settlement",

        shortTitle: "S",

        status: "IN DEVELOPMENT",

        type: "SETTLEMENT RPG",

        description:
            "A new VoidQuest project focused on building, survival and developing a settlement in a persistent game world.",

        path: "./vq-settlement/",

        image: "",

        featured: false,

        tags: [
            "2D",
            "PIXEL ART",
            "SIMULATION",
            "RPG"
        ]
    }

];



/*
    Add development updates here.

    Newest entry should be at the TOP.
*/


const news = [

    {
        date: "17 AUG 2026",

        game: "VOIDQUEST",

        title: "VoidQuest Launcher development started",

        text:
            "Development has begun on a central launcher and archive for all current and future VoidQuest projects."
    },


    {
        date: "17 AUG 2026",

        game: "VQ SETTLEMENT",

        title: "VQ Settlement added to the archive",

        text:
            "The settlement project is now part of the main VoidQuest project structure."
    },


    {
        date: "17 AUG 2026",

        game: "VQ DUNGEONS",

        title: "VQ Dungeons development continues",

        text:
            "The dungeon crawler remains one of the active VoidQuest game projects."
    }

];



/* =========================================================
   ELEMENTS
   ========================================================= */

const navButtons =
    document.querySelectorAll(".nav-button");

const sections =
    document.querySelectorAll(".page-section");

const pageTitle =
    document.getElementById("pageTitle");

const featuredGameContainer =
    document.getElementById("featuredGame");

const homeGames =
    document.getElementById("homeGames");

const allGames =
    document.getElementById("allGames");

const homeNews =
    document.getElementById("homeNews");

const allNews =
    document.getElementById("allNews");

const toast =
    document.getElementById("toast");



/* =========================================================
   NAVIGATION
   ========================================================= */

function openSection(sectionName) {

    sections.forEach(section => {

        section.classList.remove("active");

    });


    navButtons.forEach(button => {

        button.classList.remove("active");

    });


    const targetSection =
        document.getElementById(sectionName);


    const targetButton =
        document.querySelector(
            `[data-section="${sectionName}"]`
        );


    if (targetSection) {

        targetSection.classList.add("active");

    }


    if (targetButton) {

        targetButton.classList.add("active");

    }


    pageTitle.textContent =
        sectionName.toUpperCase();


    localStorage.setItem(
        "voidquest-section",
        sectionName
    );


    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });

}



navButtons.forEach(button => {

    button.addEventListener("click", () => {

        const section =
            button.dataset.section;

        openSection(section);

    });

});



/* Buttons like VIEW ALL */

document.addEventListener(
    "click",
    event => {

        const button =
            event.target.closest(
                "[data-open-section]"
            );


        if (!button) {
            return;
        }


        openSection(
            button.dataset.openSection
        );

    }
);



/* =========================================================
   FEATURED GAME
   ========================================================= */

function renderFeaturedGame() {

    const game =
        games.find(game => game.featured)
        || games[0];


    if (!game) {
        return;
    }


    const backgroundStyle =
        game.image
        ? `background-image: url('${game.image}')`
        : "";


    const tagsHTML =
        game.tags
            .map(
                tag =>
                    `<span class="meta-tag">${tag}</span>`
            )
            .join("");


    featuredGameContainer.innerHTML = `

        <div
            class="featured-background"
            style="${backgroundStyle}"
        ></div>


        ${
            !game.image
            ? `
                <div class="featured-placeholder">
                    VQ
                </div>
            `
            : ""
        }


        <div class="featured-content">

            <span class="featured-label">
                ◆ FEATURED PROJECT
            </span>


            <h2>
                ${game.title}
            </h2>


            <p>
                ${game.description}
            </p>


            <div class="game-meta">
                ${tagsHTML}
            </div>


            <div class="button-row">

                <button
                    class="primary-button"
                    data-launch="${game.id}"
                >
                    PLAY GAME
                </button>


                <button
                    class="secondary-button"
                    data-open-section="games"
                >
                    PROJECT INFO
                </button>

            </div>

        </div>

    `;

}



/* =========================================================
   GAME CARDS
   ========================================================= */

function createGameCard(game) {

    const imageHTML =
        game.image

        ? `
            <div
                class="game-art-background"
                style="
                    background-image:
                    url('${game.image}');
                "
            ></div>
        `

        : `
            <span
                class="game-art-placeholder"
            >
                ${game.shortTitle}
            </span>
        `;


    return `

        <article class="game-card">

            <div class="game-art">

                ${imageHTML}

            </div>


            <div class="game-card-content">

                <div class="game-status">

                    <span class="status-light"></span>

                    ${game.status}

                </div>


                <h3>
                    ${game.title}
                </h3>


                <p>
                    ${game.description}
                </p>


                <div class="game-card-footer">

                    <span class="game-type">
                        ${game.type}
                    </span>


                    <button
                        class="card-play-button"
                        data-launch="${game.id}"
                    >
                        PLAY →
                    </button>

                </div>

            </div>

        </article>

    `;

}



function renderGames() {

    /*
        Home currently displays
        only the first two games.
    */

    homeGames.innerHTML =
        games
            .slice(0, 2)
            .map(createGameCard)
            .join("");


    /*
        Games page displays everything.
    */

    allGames.innerHTML =
        games
            .map(createGameCard)
            .join("");

}



/* =========================================================
   GAME LAUNCHING
   ========================================================= */

document.addEventListener(
    "click",
    event => {

        const button =
            event.target.closest(
                "[data-launch]"
            );


        if (!button) {
            return;
        }


        const gameId =
            button.dataset.launch;


        const game =
            games.find(
                game => game.id === gameId
            );


        if (!game) {

            showToast(
                "PROJECT NOT FOUND"
            );

            return;
        }


        showToast(
            `LAUNCHING ${game.title.toUpperCase()}...`
        );


        /*
            Small delay simply makes it
            feel a little more like a launcher.
        */

        setTimeout(() => {

            window.location.href =
                game.path;

        }, 350);

    }
);



/* =========================================================
   NEWS
   ========================================================= */

function createNewsItem(item) {

    return `

        <article class="news-item">

            <div class="news-date">
                ${item.date}
            </div>


            <div class="news-game">
                ${item.game}
            </div>


            <div class="news-content">

                <h3>
                    ${item.title}
                </h3>


                <p>
                    ${item.text}
                </p>

            </div>

        </article>

    `;

}



function renderNews() {

    /*
        Home displays latest 3.
    */

    homeNews.innerHTML =
        news
            .slice(0, 3)
            .map(createNewsItem)
            .join("");


    /*
        News page displays all.
    */

    allNews.innerHTML =
        news
            .map(createNewsItem)
            .join("");

}



/* =========================================================
   TOAST
   ========================================================= */

let toastTimer;



function showToast(message) {

    toast.textContent = message;

    toast.classList.add("show");


    clearTimeout(toastTimer);


    toastTimer =
        setTimeout(() => {

            toast.classList.remove("show");

        }, 2200);

}



/* =========================================================
   CLOCK
   ========================================================= */

function updateClock() {

    const clock =
        document.getElementById("clock");


    const now =
        new Date();


    const hours =
        now
            .getHours()
            .toString()
            .padStart(2, "0");


    const minutes =
        now
            .getMinutes()
            .toString()
            .padStart(2, "0");


    clock.textContent =
        `${hours}:${minutes}`;

}



setInterval(
    updateClock,
    1000
);



updateClock();



/* =========================================================
   KEYBOARD SHORTCUTS
   ========================================================= */

/*

    1 = Home
    2 = Games
    3 = News
    4 = About

*/

document.addEventListener(
    "keydown",
    event => {

        if (event.key === "1") {
            openSection("home");
        }

        if (event.key === "2") {
            openSection("games");
        }

        if (event.key === "3") {
            openSection("news");
        }

        if (event.key === "4") {
            openSection("about");
        }

    }
);



/* =========================================================
   START LAUNCHER
   ========================================================= */

function startLauncher() {

    renderFeaturedGame();

    renderGames();

    renderNews();


    /*
        Remember the page the user
        had open last time.
    */

    const savedSection =
        localStorage.getItem(
            "voidquest-section"
        );


    if (
        savedSection &&
        document.getElementById(savedSection)
    ) {

        openSection(savedSection);

    } else {

        openSection("home");

    }

}



startLauncher();