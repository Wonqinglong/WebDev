var cities = [];
var totalCities = 5;

var population = [];
var fitness = [];
var recordDistance = Infinity;
var bestEver;

var statusP;

function setup() {
    createCanvas(1200, 740);
    var order = [];
    for (var i = 0; i < totalCities; i++) {
        var v = createVector(random(width), random(height)); // Fixed typo: changed random to random(height)
        cities[i] = v;
        order[i] = i;
    }

    for (var i = 0; i < 10; i++) {
        population[i] = shuffle(order);
    }

    statusP = createP('').style('font-size', '32px'); // Fixed typo: changed 32p to 32px
}
function calculateFitness() {
    for (var i = 0; i < population.length; i++) {
        var d = calcDistance(cities, population[i]);
        fitness[i] = 1 / (d + 1);
    }
}
function draw() {
    findBest(); 

    background(0);

    // GA
    calculateFitness();
    normalizeFitness();
    nextGeneration();
    if (bestEver) {
      
        stroke(255);
        strokeWeight(4);
        noFill();
        beginShape();
        for (var i = 0; i < bestEver.length; i++) {
            var n = bestEver[i];
            vertex(cities[n].x, cities[n].y);
            ellipse(cities[n].x, cities[n].y, 16, 16);
        }
        endShape();
    }

   
}

function swap(a, i, j) {
    var temp = a[i];
    a[i] = a[j];
    a[j] = temp; // Added missing assignment to a[j]
}

function calcDistance(points, order) {
    var sum = 0;
    for (var i = 0; i < order.length - 1; i++) { // Fixed typo: changed , to .
        var cityAIndex = order[i];
        var cityA = points[cityAIndex];
        var cityBIndex = order[i + 1];
        var cityB = points[cityBIndex];
        var d = dist(cityA.x, cityA.y, cityB.x, cityB.y); // Fixed typo: changed city.A to cityB.y
        sum += d;
    }
    return sum;
}
