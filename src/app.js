
import './index.html';
import './images/favicon.ico';
import './style/style.css';

const Stage = createjs.Stage;
const Shape = createjs.Shape;

const init = () => {

  const stage = new Stage("canvas");

  const circle = new Shape();
  circle.graphics.beginFill("DeepSkyBlue").drawCircle(0, 0, 50);
  circle.x = 100;
  circle.y = 100;
  stage.addChild(circle);

  stage.update();

};

init();
