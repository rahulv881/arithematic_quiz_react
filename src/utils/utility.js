import { OPERATORS } from './constants';

export const getAnswer = (x, y, operator) => {
    let ans = 0;
    switch (operator) {
        case '+':
            ans = x + y;
            break;
        case '-':
            ans = x - y;
            break;
        case '/':
            ans = x / y;
            
            break;
        case '*':
            ans = x * y;
            break;
        case '^':
            ans = Math.pow(x, y);
            break;
        default:
        // not reachable under given constraints.
    }

    return ans;
}

export const generateRandomNumbers = (setX, setY, setIndex) => {
    const x = parseInt(Math.random() * 1000) % 10;
    let y = parseInt(Math.random() * 1000) % 10;
    y+=1;
    const index = parseInt(Math.random() * 1000) % OPERATORS.length;
    setX(x);
    setY(y);
    setIndex(parseInt(Math.random() * 1000) % OPERATORS.length);

    return {
        x,
        y,
        index
    };
}