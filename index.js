const axios = require("axios");
const cheerio = require("cheerio");
const fs = require("fs");
const express = require("express");
const createCsvWriter = require("csv-writer").createObjectCsvWriter;



const CSVToJSON = require('csvtojson')


const PORT = process.env.PORT || 3000;
const date = new Date();
const articles = [];
let currentDate;


const app = express();
app.get('/news', async (req, res) => {
    var json;
    setInterval(() => {

        axios('https://news.ycombinator.com/newest')
            .then(res => {
                const htmlData = res.data;
                const $ = cheerio.load(htmlData);

                $('.title', htmlData).each(function (indexInArray, valueOfElement) { 
                    const title = $(valueOfElement).children('.titleline').text();
                    $('.subline', htmlData).each(function (indexInArray, valueOfElement) { 
                    const author = $(valueOfElement).children('.hnuser').text();
                    const noOfPoints = $(valueOfElement).children('.score').text();
                    const time = $(valueOfElement).children('.age').text();
                    const comments = $('a:nth-child(4)').text();
                     currentDate = new Date().toJSON().slice(0, 10);

                    //  const author = $(valueOfElement).
                        articles.push({
                            title,
                            author,
                            time,
                            comments,
                            noOfPoints,
                            currentDate
                        }) 
                    });
                });

                

                console.log(articles);

            })
            .catch(err => {
                console.error(err);
            })



            json = JSON.stringify(articles);   

            const csvWriter = createCsvWriter({
                path: `./${currentDate}.csv`,
                header: ['title', 'author', 'time', 'comments', 'noOfPoints', 'currentDate']
            })

            const main = () => {
                const parsed_data = JSON.parse(json)
                csvWriter.writeRecords(parsed_data)
            }

            main();
            // json = JSON.stringify(articles);   
           
        }, 2000)

 })

 app.get("/news/date", (req, res) => {

    CSVToJSON()
    .fromFile('2022-11-06.csv')
    .then(users => {
        console.log(users)
        res.send(users)
    })
    .catch(err => {
        console.log(err)
    })
 })


app.listen(PORT, () => {
    console.log("listining on port 3000")
})