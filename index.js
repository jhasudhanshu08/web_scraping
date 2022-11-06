const axios = require("axios");
const cheerio = require("cheerio");
const fs = require("fs");
const express = require("express");
const createCsvWriter = require("csv-writer").createObjectCsvWriter;





const PORT = process.env.PORT || 3000;
const date = new Date();
const articles = [];
let currentDate;


const app = express();
app.get('/news', (req, res) => {
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



            const json = JSON.stringify(articles);   

            const csvWriter = createCsvWriter({
                path: `./${currentDate}.csv`,
                header: ['title', 'author', 'time', 'comments', 'noOfPoints', 'currentDate']
            })

            const main = () => {
                const parsed_data = JSON.parse(json)
                csvWriter.writeRecords(parsed_data)
            }

            main();
           
    }, 2000)
 })




app.listen(PORT, () => {
    console.log("listining on port 3000")
})