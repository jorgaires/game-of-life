Game of Life
------------

The following program contains source code for a game called Game of Life created by John Horton Conway.

The game_of_life.js file contais:
  - Usefull class to handle canvas component
  - Usefull methods to generate random values
  - The class GameOfLife to implement the game

Rules Explanation
-----------------

Initially, there is a grid with some cells which may be alive or dead. The task is to generate the next generation of cells based on the following rules: 
  
  - Any alive cell with fewer than two live neighbors dies, as if caused by under population.
  - Any alive cell with two or three live neighbors lives on to the next generation.
  - Any alive cell with more than three live neighbors dies, as if by overpopulation.
  - Any dead cell with exactly three live neighbors becomes a live cell, as if by reproduction.

