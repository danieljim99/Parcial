import {fetchData} from "./fetchdata";
import {GraphQLServer} from "graphql-yoga";

const url = "https://swapi.co/api/people/?format=json";

const runApp = data => {
    const typeDefs = 
    `type Query {
        people(page:Int, number:Int, name:String, gender:String):[Character!]!
        character(id:Int!):Character!
    }

    type Character {
        name: String!
        gender: String!
        url: String!
        films: [Film!]!
    }
    
    type Film {
        title: String!
        episode_id: Int!
    }`

    const resolvers = {
        Query: {
            people(parent, args, cts, info){
                let array = data.slice();
                let result = [];
                let filmsObj = [];
    
                let page = args.page || 1;
                let number = args.number || 10;
    
                if(args.name){
                    array = array.filter(obj => obj.name.toUpperCase().includes(args.name.toUpperCase()));
                }
    
                if(args.gender){
                    array = array.filter(obj => obj.gender.toUpperCase() === args.gender.toUpperCase());
                }
    
                for(let i = (page-1)*number; (i < number*page) && (i < array.length); i++){
                    result.push({
                        name: array[i].name,
                        gender: array[i].gender,
                        url: array[i].url,
                        films: array[i].films,
                    })
                }
                if(result === []){
                    result = [{
                        name: "",
                        gender: "",
                        url: "",
                        films: [{
                            title: "",
                            episode_id: -0,
                        }],
                    }];
                }
                return result;
            },
            character(parent, args, cts, info){
                let result = {
                    name: "",
                    gender: "",
                    url: "",
                    films: [{
                        title: "",
                        episode_id: -0,
                    }],
                };
                data.forEach(elem => {
                    if(elem.url.slice(28).slice(0,-1) === args.id.toString()){
                        result = {
                            name: elem.name,
                            gender: elem.gender,
                            url: elem.url,
                            films: elem.films,
                        }
                    }
                });
                return result;
            },
        }
    }
    const server = new GraphQLServer({typeDefs, resolvers});
    server.start();
}
fetchData(runApp, url);