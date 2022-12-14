const SERVER_URL = "http://localhost:8080/api/"
import { paginator } from "../../lib/paginator/paginate-bootstrap.js"
import { sanitizeStringWithTableRows } from "../../utils.js"
const SIZE = 10
const TOTAL = Math.ceil(1000 / SIZE)  //Should come from the backend
//useBootStrap(true)

const navigoRoute = "cars"

let cars = [];

let sortField = "brand"
let sortOrder = "red"

let initialized = false

function handleSort(pageNo, match) {
    /*
    sortOrder = sortOrder == "asc" ? "desc" : "asc"
    sortField = "brand"
     */
    sortField = "color"
    sortOrder = "red"
    
    load(pageNo, match)
}

export async function load(pg, match) {
    //We dont wan't to setup a new handler each time load fires
    if (!initialized) {
        document.getElementById("header-brand").onclick = function (evt) {
            evt.preventDefault()
            handleSort(pageNo, match)
        }
        initialized = true
    }
    const p = match?.params?.page || pg  //To support Navigo
    let pageNo = Number(p)

    let queryString = `?column=${sortField}&value=${sortOrder}&size=${SIZE}&page=` + (pageNo - 1)
    console.log(SERVER_URL+"cars/filter"+queryString)
    try {
        cars = await fetch(`${SERVER_URL}cars/filter${queryString}`)
            .then(res => res.json())
    } catch (e) {
        console.error(e)
    }
    const rows = cars.map(car => `
  <tr>
    <td>${car.id}</td>
    <td>${car.brand}</td>
    <td>${car.model}</td>
    <td>${car.color}</td>
    <td>${car.kilometers}</td>
  `).join("")


    document.getElementById("tbody").innerHTML = sanitizeStringWithTableRows(rows)

    // (C1-2) REDRAW PAGINATION
    paginator({
        target: document.getElementById("car-paginator"),
        total: TOTAL,
        current: pageNo,
        click: load
    });
    //Update URL to allow for CUT AND PASTE when used with the Navigo Router
    //callHandler: false ensures the handler will not be called again (twice)
    window.router?.navigate(`/${navigoRoute}${queryString}`, { callHandler: false, updateBrowserURL: true })
}