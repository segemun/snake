(function(){
  var Snake = function(){
    let self = this,
      availableKeys = ['Right', 'Down', 'Left', 'Up'],
      settings = {
        fieldElementId: 'playingField',
        fieldWidth: 10,
        fieldHeight: 10,
        speed: 500  
      },
      previousElement,
      snakeElements,
      foodElement,
      direction,
      interval,
      scores;
          
    self.init = customSettings => {
      settings = Object.assign(settings, customSettings);
      redrawPlayingField();
      setDefaultParams();
      setListeners();
      redrawSnake();
      redrawFood();
      drawScores();
      run();
    }
  
    let redrawPlayingField = () => {
      let playingField = document.querySelector(`#${settings.fieldElementId}`);
      let scoresElement = document.createElement('div');
      scoresElement.className = 'scores';
      playingField.innerHTML = '';
      for (let i = 1; i <= settings.fieldHeight; i++) {
        let rowElement = document.createElement('div');
        rowElement.setAttribute('data', i);
        rowElement.className = 'row';
        for (let ii = 1; ii <= settings.fieldWidth; ii++) {
          let ceilElement = document.createElement('div');
          ceilElement.setAttribute('data', ii);
          rowElement.appendChild(ceilElement);
        }
        playingField.appendChild(rowElement);
      }
      playingField.appendChild(scoresElement);
    }
  
    let setDefaultParams = () => {
      clearInterval(interval);
      direction = 'Right';
      scores = 0;
      foodElement = null;
      document.removeEventListener('keydown', keydownListener);
      snakeElements = [
        getCeil(1,1),
        getCeil(1,2),
        getCeil(1,3),
        getCeil(1,4),
        getCeil(1,5)
      ];
    }
  
    let setListeners = () => {
      document.addEventListener('keydown', keydownListener);
    }
      
    let keydownListener = event => {
      if (availableKeys.indexOf(event.keyIdentifier) !== -1) {
        direction = event.keyIdentifier;
        runStep();
        clearInterval(interval);
        run();
      }
    }
      
    let redrawSnake = () => {
      let activeCeils = document.querySelectorAll('.active');
      if (activeCeils !== null) {
        for (let i = 0; i < activeCeils.length; i++) {
            activeCeils[i].classList.remove('active');
            activeCeils[i].classList.remove('tail');
            activeCeils[i].classList.remove('head');
        }
      }
      drawSnake();
    }
    let drawSnake = () => {
      for (let i = 0; i < snakeElements.length; i++) {
        snakeElements[i].classList.add('active');
        if (i == snakeElements.length - 1) {
          snakeElements[i].classList.add('head');
        } else if (i == 0) {
          snakeElements[i].classList.add('tail');
        }
      }
    }
    
    let redrawFood = () => {
      var foodElements = document.querySelectorAll('.food');
      for (let i = 0; i < foodElements.length; i++) {
        foodElements[i].classList.remove('food');
      }
      drawFood();
    }
    
    let drawFood = () => {
      let foodElement = null,
        randomRow,
        randowCeil;
      do {
        var randomCeil = getCeil(getRandomInt(1, settings.fieldHeight + 1),getRandomInt(1, settings.fieldWidth + 1));
        if (!randomCeil.classList.contains('active')) {
            foodElement = randomCeil;
        }
      } while (foodElement === null)
      foodElement.classList.add('food');
    }
    
    let run = () => {
      interval = setInterval(function(){
        runStep();
      }, settings.speed);
    }
    
    let runStep = () => {
      previousElement = snakeElements.shift();
      let nextElement,
        firstCeil = snakeElements[snakeElements.length - 1],
        rowNumber = firstCeil.parentNode.attributes.data.value,
        ceilNumber = firstCeil.attributes.data.value;
      switch(direction) {
        case 'Right':
          ceilNumber++;
          if (ceilNumber > settings.fieldWidth) {
              ceilNumber = 1;
          }
          break;
        case 'Down':
          rowNumber++;
          if (rowNumber > settings.fieldWidth) {
              rowNumber = 1;
          }
          break;
        case 'Left':
          ceilNumber--;
          if (ceilNumber < 1) {
              ceilNumber = settings.fieldWidth;
          }
          break;
        case 'Up':
          rowNumber--;
          if (rowNumber < 1) {
              rowNumber = settings.fieldHeight;
          }
          break;
      }
      nextElement = getCeil(rowNumber, ceilNumber);
      if (nextElement.classList.contains('active')
          && !nextElement.classList.contains('tail')) {
        gameOver();
        return;
      } else if (nextElement.classList.contains('food')) {
        addScores();
        redrawFood();
        snakeElements.unshift(previousElement);
      }
      snakeElements.push(nextElement);
      redrawSnake();
    }
    
    let addScores = () => {
      scores++;
      drawScores();
    }
    
    let drawScores = () => {
      let scoresElement = document.querySelector('.scores');
      scoresElement.innerHTML = scores;
    }
    
    let gameOver = () => {
      alert(`Game Over. Scores - ${scores}`);
      self.init();
    }
    
    let getCeil = (row, ceil) => {
      return document.querySelector(`.row[data="${row}"]`).querySelector(`[data="${ceil}"]`);
    }
    
    let getRandomInt = (min, max) => Math.floor(Math.random() * (max - min)) + min;
    
    return self;
  }
  
  var game = new Snake();
  game.init({
    fieldWidth: 20,
    fieldHeight: 20
  });
})();