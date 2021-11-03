# Pathfinding Visualiser

Can be used to visualise some pathfinding algorithms.


## Available Options

### Pathfinding Algorithms
- Breadth-First Search (BFS)
- Best First Search
- A* Search


### Maze Generation Algorithms
- Binary Tree
- "Random Tree" - Binary Tree but at each stage, 1-3 walls can be removed at random
- Maze - Cellular Automata, rulestring B3/S12345
- Mazectric - Cellular Automata, rulestring B3/S1234
- "Another CA" - was experimenting, this would be rulestring B1/S123?


## Other Options

- Dead-End Filling - Try this on your mazes!
- Different heuristics
  - Manhattan Distance
  - Euclidean Distance
- Diagonal travel


## Motivation

Pretty fun to watch the squares go.

Similar projects I found: [here](https://clementmihailescu.github.io/Pathfinding-Visualizer/) and [here](http://qiao.github.io/PathFinding.js/visual/).
Watch some maze generation [here](https://mtimmerm.github.io/webStuff/maze.html).

## Useful resources and next steps
[Maze Generation Algorithms](https://weblog.jamisbuck.org/2011/2/7/maze-generation-algorithm-recap) - Good explanation of many maze generation algorithms, will definitely try to implement all of them

[Cellular Automata Simulator](https://robinforest.net/post/cellular-automata/) - Good for visualising cellular automata, am planning to create this as well, either together or as a separate project from this.

[Maze Algorithms](http://www.astrolog.org/labyrnth/algrithm.htm) - An insane lot of content, in a perfect world I'll be smart enough to understand everything on that page.

[mazelib](https://github.com/john-science/mazelib) - Has some algorithms on mazes, am planning to look at their maze-transmuting algorithms.

[Red Blob Games](https://www.redblobgames.com/pathfinding/a-star/introduction.html) - Fantastic place to learn about these algorithms with nice visualisations.

[Aiding pathfinding with cellular automata](https://realtimecollisiondetection.net/blog/?p=57) - There is information here about simplifying fat mazes (under 'Solving a Fat Maze'), I can't seem to find more information on it online, would be great if anyone can point me to some resources or tell me the keywords to Google.

