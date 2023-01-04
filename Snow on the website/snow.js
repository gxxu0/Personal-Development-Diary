const body = document.querySelector("body");
//시작점 랜덤화

const MIN_DURATION = 10; //애니메이션을 원하는 최소 지속시간인 10초의 상수로 생성.
function makeSnowflake() {
  const snowflake = document.createElement("div"); //div요소 만들기
  const delay = Math.random() * 10; //눈 끼리 delay 값 부여
  const initialOpacity = Math.random(); //눈 끼리 불투명도 다르게 하기
  const duration = Math.random() * 20 + MIN_DURATION;

  snowflake.classList.add("snowflake"); //스타일 가져오기
  //랜덤함수를 사용하고, 화면의 너비를 곱함. 이를 눈을 왼쪽으로 이동시키기 위해 사용.
  snowflake.style.left = `${Math.random() * window.screen.width}px`; //delay를 style에 적용
  snowflake.style.animationDelay = `${delay}s`;
  snowflake.style.opacity = initialOpacity;
  snowflake.style.animation = `fall ${duration}s linear`;

  body.appendChild(snowflake); //눈송이 추가.
}

makeSnowflake();
for (let index = 0; index < 50; index++) {
  //   makeSnowflake();
  setTimeout(makeSnowflake, 500 * index);
}

//눈이 다 내리면 html에서 완전히 없어지도록 setTimeout설정
setTimeout(() => {
  body.removeChild(snowflake);
  makeSnowflake(); //눈송이 무한대로 생성
}, (duration + delay) * 1000);
