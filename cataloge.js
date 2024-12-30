// Required Libraries
const fs = require('fs');

// Function to decode a value from a given base
function decodeValue(base, value) {
    return BigInt(parseInt(value, parseInt(base)));
}

// Function to calculate the constant term of the polynomial using Lagrange Interpolation
function lagrangeInterpolation(points, k) {
    let secret = BigInt(0);
    const n = points.length;

    for (let i = 0; i < n; i++) {
        let xi = points[i][0];
        let yi = points[i][1];

        let li = BigInt(1);
        for (let j = 0; j < n; j++) {
            if (i !== j) {
                li *= BigInt(xi) / BigInt(xi - points[j][0]);
            }
        }
        secret += li * yi;
    }
    return secret % BigInt(2 ** 256); // Ensure the result fits in a 256-bit number
}

// Main function to read JSON input and compute the secret
function main() {
    // Read input from JSON file
    const input = JSON.parse(fs.readFileSync('input.json', 'utf8'));
    
    const n = input.keys.n;
    const k = input.keys.k;
    
    // Prepare points array for Lagrange interpolation
    const points = [];
    
    for (let i = 1; i <= n; i++) {
        const base = input[i].base;
        const value = input[i].value;
        
        // Decode the value
        const decodedValue = decodeValue(base, value);
        points.push([BigInt(i), decodedValue]); // Store as (x, y)
    }

    // Calculate the secret constant term c
    const secretC = lagrangeInterpolation(points.slice(0, k), k);
    
    // Output the secret
    console.log("The constant term c is:", secretC.toString());
}

// Execute the main function
main();
