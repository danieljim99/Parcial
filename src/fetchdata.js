import request from 'request';
import fs from "fs";

function getFilms(callback, url, data) {
    for(let i = 0; i < data.length; i++){
        if(i !== (data.length - 1)){
            for(let j = 0; j < data[i].films.length; j++){
                request({url: data[i].films[j], json:true}, (error, response) => {
                    data[i].films[j] = {
                        title: response.body.title,
                        episode_id: response.body.episode_id,
                    }
                });
            }
        } else {
            for(let j = 0; j < data[i].films.length; j++){
                if(j !== (data[i].films.length - 1)){
                    request({url: data[i].films[j], json:true}, (error, response) => {
                        data[i].films[j] = {
                            title: response.body.title,
                            episode_id: response.body.episode_id,
                        }
                    });
                } else {
                    request({url: data[i].films[j], json:true}, (error, response) => {
                        data[i].films[j] = {
                            title: response.body.title,
                            episode_id: response.body.episode_id,
                        }
                        writeData(callback, url, data);
                    });
                }
            }
        }
    }
}

function writeData(callback, url, data){
    request({url, json: true}, (error, response) => {
        for(let i = 0; i < data.lenght; i++){
            for(let j = 0; j < data[i].films.length; j++){
                if(data[i].films[j].includes("https://swapi.co/api/films/")){
                    data[i].films.splice(j, 1);
                }
            }
        }
        fs.writeFileSync("./data.json", JSON.stringify(data));
        console.log("Ready");
        callback(data);
    });
}

function fetchData (callback, url, data) { 
    if(!data){
        data = [];
    }
    try{
        data = JSON.parse(fs.readFileSync("./data.json").toString());
        console.log("Ready");
        callback(data);
    } catch(e){
        console.log("Loading...");
        request({ url, json: true }, (error, response) => {
            if (response.body) {
                data = [...data, ...response.body.results];
            }
            if (response.body.next !== null)
                fetchData(callback, response.body.next, data);
            else {
                console.log("Almost ready...")
                getFilms(callback, url, data);
            }
        });
    }
}

export {fetchData};