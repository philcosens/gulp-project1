const myName = "Phil Cosens";
let myAge = 37;
let visited = ['Ibiza', 'Tenerfie', 'New York', 'Thailand'];
let future = ['Ibiza', 'Florida', 'Maldives', 'Thailand'];

/*const visitedDestinatons = () => {
    let matched = [];

    for (i = 0; i < future.length; i++) {
        for (j = 0; j < visited.length; j++) {
            if (future[i] === visited[j]) {
                matched.push(future[i]);
            }
        }
    }
    return matched;
}

console.log(visitedDestinatons);*/

let matched = future.filter(element => !visited.includes(element));
console.log(matched);