// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/random#getting_a_random_integer_between_two_values
export default cards => {
    const min = 0;
    const max = cards.length;
    const minCeiled = Math.ceil(min);
    const maxFloored = Math.floor(max);
    const randInt = Math.floor(Math.random() * (maxFloored - minCeiled) + minCeiled); // The maximum is exclusive and the minimum is inclusive

    return cards[randInt];
};
