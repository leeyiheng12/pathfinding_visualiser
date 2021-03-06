# Pathfinding Visualiser

Can be used to visualise some pathfinding and maze related algorithms.

<img src="https://imgur.com/TeHGiaJ.gif" width="400" height="240" />

Generate beautiful mazes!

<img src="https://i.imgur.com/HKcZDD6.png" width="400" height="240" />

Or you can draw your own mazes.

Check it out [hereeeeeeeeeeeeeee](https://leeyiheng12.github.io/pathfinding_visualiser/).

Still a work in progress.


## Available Options

### Pathfinding Algorithms

- Breadth-First Search (BFS)
- Best First Search
- A* Search


### Maze Generation Algorithms

#### Legitimate Algorithms
- Aldous-Broder
- Backtracking
- Binary Tree
- Growing Tree
- Hunt and Kill
- Kruskal
- Prim

#### Others
- Random Tree - Binary Tree but at each stage, 1-3 walls can be removed at random
- Wrong Growing Tree - implemented Growing Tree wrongly but still produces something
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

[FastPriorityQueue.js](https://github.com/lemire/FastPriorityQueue.js/) - Used this temporarily, might just end up not implementing my own and continue using this.

[Maze Generation Algorithms](https://weblog.jamisbuck.org/2011/2/7/maze-generation-algorithm-recap) - Good explanation of many maze generation algorithms, will definitely try to implement all of them

[Cellular Automata Simulator](https://robinforest.net/post/cellular-automata/) - Good for visualising cellular automata, am planning to create this as well, either together or as a separate project from this.

[Maze Algorithms](http://www.astrolog.org/labyrnth/algrithm.htm) - An insane lot of content, in a perfect world I'll be smart enough to understand everything on that page.

[mazelib](https://github.com/john-science/mazelib) - Lots of information on mazes and information, am planning to look at their maze-transmuting algorithms. The owner made it super easy to understand as well.

[Red Blob Games](https://www.redblobgames.com/pathfinding/a-star/introduction.html) - Fantastic place to learn about these algorithms with nice visualisations.

[Aiding pathfinding with cellular automata](https://realtimecollisiondetection.net/blog/?p=57) - There is information here about simplifying fat mazes (under 'Solving a Fat Maze'), I can't seem to find more information on it online, would be great if anyone can point me to some resources or tell me the keywords to Google.


## Blooper reel
The importance of not screwing up a priority queue.

<img src="https://i.imgur.com/kDOKkLp.gif" width="400" height="240" />
