var cities = [];
var popSize = 300;
var population = [];
var fitness = [];
var recordDistance = Infinity;
var bestEver;
var currentBest; // Added currentBest variable
var statusP;

function setup() {
    createCanvas(1200, 740);
  totalCities = prompt("Please enter the number of cities");
   var order = [];
    for (var i = 0; i < totalCities; i++) {
        var v = createVector(random(width), random(height)); // Fixed typo: changed random to random(height)
        cities[i] = v;
        order[i] = i;
    }

    for (var i = 0; i < 10; i++) {
        population[i] = shuffle(order);
    }

    statusP = createP('').style('font-size', '32px');
}

function calculateFitness() {
    for (var i = 0; i < population.length; i++) {
        var d = calcDistance(cities, population[i]);
        fitness[i] = 1 / (d + 1);
    }
}

var running = true;

function draw() {
    background(0);

    // GA
    findBest();
   if (running) {
        calculateFitness();
        normalizeFitness();
        nextGeneration();

        // Check if the best solution is found
        if (recordDistance === Infinity) {
            statusP.html('Calculating...');
        } else {
            statusP.html('Best distance: ' + recordDistance);
        }
    }

    // Draw currentBest path
   if (currentBest) {
        stroke(0, 255, 0); // Green color for currentBest path
        strokeWeight(4);
        noFill();
        beginShape();
        for (var i = 0; i < currentBest.length; i++) { 
            var n = currentBest[i]; 
            vertex(cities[n].x, cities[n].y); 
        }
        endShape();
    }
    
    if (bestEver) {
        stroke(255, 0, 0); // Red color for bestEver path
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
    a[j] = temp;
}

function calcDistance(points, order) {
    var sum = 0;
    for (var i = 0; i < order.length - 1; i++) { 
        var cityAIndex = order[i];
        var cityA = points[cityAIndex];
        var cityBIndex = order[i + 1];
        var cityB = points[cityBIndex];
        var d = dist(cityA.x, cityA.y, cityB.x, cityB.y);
        sum += d;
    }
    return sum;
}
