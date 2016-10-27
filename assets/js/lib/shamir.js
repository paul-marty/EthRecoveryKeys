
var prime = 257;

/* Split number into the shares */
function split(number, available, needed) {
    var coef = [number, 166, 94], x, exp, c, accum, shares = [];
    /* Normally, we use the line:
     * for(c = 1, coef[0] = number; c < needed; c++) coef[c] = Math.floor(Math.random() * (prime  - 1));
     * where (prime - 1) is the maximum allowable value.
     * However, to follow this example, we hardcode the values:
     * coef = [number, 166, 94];
     * For production, replace the hardcoded value with the random loop
     * For each share that is requested to be available, run through the formula plugging the corresponding coefficient
     * The result is f(x), where x is the byte we are sharing (in the example, 1234)
     */
    for(x = 1; x <= available; x++) {
        /* coef = [1234, 166, 94] which is 1234x^0 + 166x^1 + 94x^2 */
        for(exp = 1, accum = coef[0]; exp < needed; exp++) accum = (accum + (coef[exp] * (Math.pow(x, exp) % prime) % prime)) % prime;
        /* Store values as (1, 132), (2, 66), (3, 188), (4, 241), (5, 225) (6, 140) */
        shares[x - 1] = [x, accum];
    }
    return shares;
}

/* Gives the decomposition of the gcd of a and b.  Returns [x,y,z] such that x = gcd(a,b) and y*a + z*b = x */
function gcdD(a,b) { 
    if (b == 0) return [a, 1, 0]; 
    else { 
        var n = Math.floor(a/b), c = a % b, r = gcdD(b,c); 
        return [r[0], r[2], r[1]-r[2]*n];
    }
}

/* Gives the multiplicative inverse of k mod prime.  In other words (k * modInverse(k)) % prime = 1 for all prime > k >= 1  */
function modInverse(k) { 
    k = k % prime;
    var r = (k < 0) ? -gcdD(prime,-k)[2] : gcdD(prime,k)[2];
    return (prime + r) % prime;
}

/* Join the shares into a number */
function join(shares) {
    var accum, count, formula, startposition, nextposition, value, numerator, denominator;
    for(formula = accum = 0; formula < shares.length; formula++) {
        /* Multiply the numerator across the top and denominators across the bottom to do Lagrange's interpolation
         * Result is x0(2), x1(4), x2(5) -> -4*-5 and (2-4=-2)(2-5=-3), etc for l0, l1, l2...
         */
        for(count = 0, numerator = denominator = 1; count < shares.length; count++) {
            if(formula == count) continue; // If not the same value
            startposition = shares[formula][0];
            nextposition = shares[count][0];
            numerator = (numerator * -nextposition) % prime;
            denominator = (denominator * (startposition - nextposition)) % prime;
        }
        value = shares[formula][1];
        accum = (prime + accum + (value * numerator * modInverse(denominator))) % prime;
    }
    return accum;
}

var sh = split(129, 10, 4) /* split the secret value 129 into 6 components - at least 3 of which will be needed to figure out the secret value */
var newshares = [sh[1], sh[2], sh[3], sh[4]]; /* pick any selection of 3 shared keys from sh */

alert(join(newshares));