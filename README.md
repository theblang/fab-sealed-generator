# Try it [here](https://theblang.github.io/fab-sealed-generator)

If you notice an issue, please submit [here](https://github.com/theblang/fab-sealed-generator/issues). For example, at one point I realized I hadn't filtered out the expansion slot cards from the main card pool.

## Credits

Big thanks to [FaBrary's typed library](https://github.com/fabrary/cards), which in turn sources data from [The Fab Cube](https://github.com/the-fab-cube/flesh-and-blood-cards).

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Changelog

**HVY.2**

-   Fix **significant** bug where all common slots are the same, pulling from the entire pool. In reality: five are single-class, 3 are wedge, and 3 are generic/equipment.
-   Tweak randomization code
-   Implement export using query params, which FaBrary taught me via a message to [their Patreon](https://www.patreon.com/fabrary/posts)!
-   Remove the majestic
