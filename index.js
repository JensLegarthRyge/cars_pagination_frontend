import "https://unpkg.com/navigo"  //Will create the global Navigo object used below
import {loadHtml,adjustForMissingHash,setActiveLink,renderTemplate} from "./utils.js"
import { load } from "./Pages/cars_overview/cars-overview.js"


window.addEventListener("load", async () => {
    const templateHome = await loadHtml("./pages/home/home.html")
    const templateCarsOverview = await loadHtml("./pages/cars_overview/cars-overview.html")

    const router = new Navigo("/", { hash: true });
    window.router = router

    adjustForMissingHash()
    router
        .hooks({
            before(done, match) {
                setActiveLink("topnav", match.url)
                done()
            }
        })
        .on({
            "/": () =>
                renderTemplate(templateHome, "content"),
            "/cars-overview": (match) => {
                renderTemplate(templateCarsOverview, "content")
                load(1, match)
            }
        })
        .notFound(() => renderTemplate("No page for this route found", "content"))
        .resolve()
});


window.onerror = (e) => alert(e)