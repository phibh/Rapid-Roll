		$(document).ready(function () {


			var myGameArea, myGamePiece,myScoreTxt,myLife,mySawTop,hightScoreTxt
			, myObstacles = []
			, myScore = 0
			, addLife = []
			, time = 0
			, hightScore = localStorage.getItem("Hight Score")
			, lifeCounter = 3
			, types = {
				text: "text",
				circle: "circle",
				rectangle: "rectangle",
				image : "image",
				pencil :  "pencil"
			}
			, hcolor = 0;
			// , lcolor = 48;


			$("#btnstartGame").click(function(){
				$("#myfilter").hide();
	            $("#mystartbutton").hide();

	            $("#btnLeft").css('display', 'inline-block');
	            $("#btnRight").css('display', 'inline-block');
	            startGame();
			});

			init();



			function startGame(){
				myGameArea.start();
			}

			function init() {
				myGameArea = new GameArea();



				$("#myMusic")[0].loop=!0;




				var rd1 = Math.random() * (myGameArea.canvas.width-90 - 0) + 0;
				var rd2 = Math.random() * (myGameArea.canvas.width-90 - 0) + 0;
				var rd3 = Math.random() * (myGameArea.canvas.width-90 - 0) + 0;

				myObstacles.push(new component(90,5,"hsl(220,46%,48%)",rd3,myGameArea.canvas.height - 171,"rectangle"));
				myObstacles.push(new component(90,5,"hsl(220,46%,48%)",rd2,myGameArea.canvas.height - 114,"rectangle"));
				myObstacles.push(new component(90,5,"hsl(220,46%,48%)",rd1,myGameArea.canvas.height - 57,"rectangle"));

				myGamePiece = new component(20,20,'#DD4F8F',myObstacles[0].x + 45,myObstacles[0].y - 10,"circle");
				myScoreTxt = new component("20px", "Consolas", "#FE2472", myGameArea.canvas.width/2, 40, "text");
				myLife = new component("20px", "Consolas", "red", 40, 40, "text");


				hightScoreTxt = new component("12px", "Consolas", "red", myGameArea.canvas.width - 130, 18, "text");

				mySawTop = new component(myGameArea.canvas.width, 150, "SawTop.png", 0, 0, "image");

				updateGameArea();

			};

			function GameArea(){
				this.pause = !1;
				this.canvas = document.createElement("canvas");
				this.canvas.width = window.innerWidth - 2;
				this.canvas.height = window.innerHeight - 2;
				this.context = this.canvas.getContext("2d");
				this.frameNo = 0;

				$("#canvascontainer").append(this.canvas);


				this.start = function(){
					// myMusic.play();
					$("#myMusic")[0].play();
					this.interval = setInterval(updateGameArea, 20);
				}
				this.clear = function() {
					this.context.clearRect(0,0,this.canvas.width, this.canvas.height);
				}
				this.stop = function (){
					clearInterval(this.interval);
					this.pause = !0;

					$("#myMusic")[0].pause()
					time=0;
				}
			};



			function component(width, height, color, x , y, type) {
				this.width = width;
				this.height = height;
				this.type = type;
				this.color = color;
				this.x = x;
				this.y = y;
				this.speedX = 0;
				this.speedY = 0;
				this.lcolor = 48;
				this.update = function(){
					ctx = myGameArea.context;

					switch(this.type){
						case types.circle :
							ctx.beginPath();
					        ctx.arc(this.x,this.y, height/2, 0 , 2*Math.PI);

					        ctx.fillStyle = this.color;
					        ctx.fill();

					        break;
					    case types.rectangle :
					    	ctx.fillStyle = this.color;
							ctx.fillRect(this.x, this.y, this.width, this.height);

							break;
						case types.text :
							ctx.font = this.width + " " + this.height;
					        ctx.fillStyle = this.color;
					        ctx.fillText(this.text, this.x, this.y);

					        break;
					    case types.image :
				    		ctx.drawImage($("#SawTop")[0],this.x,this.y,this.width,this.height);
							break;
						case types.pencil :
							ctx.beginPath();

							ctx.moveTo(this.x+10, this.y);
							ctx.lineTo(this.x, this.y+ this.height/2)
							ctx.lineTo(this.x+10, this.y+ this.height);
							ctx.lineTo(this.x+this.width-10, this.y+this.height);
							ctx.lineTo(this.x+this.width, this.y+this.height/2);
							ctx.lineTo(this.x+this.width-10, this.y);
							ctx.closePath();

							ctx.fillStyle = this.color;
							ctx.fill();


					    	break;

					}

				}
				this.newPos = function(){
					this.x += this.speedX;
					this.y += this.speedY;
					this.hitRight();
					this.hitLeft();
				}
				this.hitRight = function(){
					var rockright = myGameArea.canvas.width - 10;
			        if (this.x > rockright) {
			            this.x = rockright;
			        }
				}
				this.hitLeft = function(){
					var rockleft = 10;
			        if (this.x < rockleft) {
			            this.x = rockleft;
			        }
				}

				this.collision = function(otherobj){
					myleft = this.x - this.height/2;
					myright = this.x +(this.width)/2;
					mytop = this.y - this.height/2;
					mybottom = this.y + this.height/2;
					otherleft = otherobj.x;
					otherright = otherobj.x + otherobj.width;
					othertop = otherobj.y;
					otherbottom = otherobj.y + otherobj.height;
					crash = !1;

					if(mytop < 0 || mytop > myGameArea.canvas.height){

						crash = !0;


						return crash;
					}


					else if (((myleft > otherleft && myleft < otherright) || (myright > otherleft && myright < otherright)) && mybottom > othertop ) {

						if (mybottom - otherbottom > 3 ) {
							if(mytop < othertop){
								if (myright > otherleft && myleft < otherleft) {
									this.x = otherleft - 10;

                                    if (otherobj.type == types.pencil) {

                                        crash = !0;
                                        return crash;
                                    }
									if (otherobj.color!="hsl(220,46%,0%)"){
                                        otherobj.lcolor--;
									    otherobj.color = 'hsl(220,46%,'+otherobj.lcolor+'%)';
                                        otherobj.x++;
                                        myScore++;
									}

									crash = !1;
									return crash;
								}
								if (myleft < otherright && myright > otherright) {
									this.x = otherright + 10;
                                    if (otherobj.type == types.pencil) {

                                        crash = !0;
                                        return crash;
                                    }
                                    if (otherobj.color!="hsl(220,46%,0%)"){
                                        otherobj.lcolor--;
                                        otherobj.color = 'hsl(220,46%,'+otherobj.lcolor+'%)';
										otherobj.x--;
                                        myScore++;
                                    }


									crash = !1;
									return crash;
								}

							}

							crash = !1;
							return crash;
						}
						time = 0;
						this.y = othertop - this.height + this.height / 2 ;

						crash = !1;
						return crash;
					}


					return crash;
				}

				this.collisionAtBirth = function(otherobj){
					myleft = this.x - this.height/2;
					myright = this.x +(this.width)/2;
					mytop = this.y - this.height/2;
					mybottom = this.y + this.height/2;
					otherleft = otherobj.x;
					otherright = otherobj.x + otherobj.width;
					othertop = otherobj.y;
					otherbottom = otherobj.y + otherobj.height;
					crash = !1;

					if ((myleft > otherleft && myleft < otherright) || (myright > otherleft && myright < otherright)  ) {

						crash = !0;
						return crash;

					}
					return crash;
				}

				this.collisionWithHeart = function(otherobj){
					myleft = this.x - this.height/2;
					myright = this.x +(this.width)/2;
					mytop = this.y - this.height/2;
					mybottom = this.y + this.height/2;
					otherleft = otherobj.x;
					otherright = otherobj.x + 11;
					othertop = otherobj.y - 13;
					otherbottom = otherobj.y;
					crash = !1;

					if( ((myleft > otherleft && myleft < otherright) || (myright > otherleft && myright < otherright)) && ( (othertop > mytop && othertop < mybottom) || (otherbottom > mytop && otherbottom < mybottom) )){

						$("#add-life")[0].play();
						myScore = myScore + 100;

						crash = !0;
						return crash;
					}
					return crash;
				}
			};

			function updateGameArea() {
                hcolor += 17*0.34;
                myGamePiece.color = 'hsl('+hcolor+',100%,50%)';

				for (i = 0; i < myObstacles.length; i++) {

					if(myGamePiece.collision(myObstacles[i])){

						$("#mySound")[0].play();
						if(stillAlive()){
							extraLife();

							return;
						}

						hightScore = (myScore < hightScore)?hightScore:myScore;

						localStorage.setItem("Hight Score", hightScore);


						myGameArea.stop();


						$("#btnLeft").css('display', 'none');
	                	$("#btnRight").css('display', 'none');
						$("#myfilter").css('display', 'block');
	                	$("#myrestartbutton").css('display', 'block');

	                	return;
					}
				}

				if (myGameArea.pause == !1) {
					myGameArea.clear();
					myGameArea.frameNo += 1;


					agm = (myGameArea.frameNo < 1000)?60:10;

					if (myGameArea.frameNo == 1 || everyinterval(agm)) {

						var rd = Math.random() * (myGameArea.canvas.width-90 - 0) + 0;
						var rd2 = Math.random() * (90 - 0) + 0;

						if (myGameArea.frameNo > 1000 && everyinterval(20) ) {
							myObstacles.push(new component(90,5,"#DD4F8F",rd,myGameArea.canvas.height,"pencil"));

						}
						else {

							if (everyinterval(30)){
                                myObstacles.push(new component(90,5,"#4267B2",rd,myGameArea.canvas.height ,"rectangle"));

							}
							else {
                                myObstacles.push(new component(90,5,"hsl(220,46%,0%)",rd,myGameArea.canvas.height ,"rectangle"));

							}
						}

						if (everyinterval(600)) {

							addLife.push(new component("20px", "Consolas", "red", rd + rd2, myGameArea.canvas.height, "text"));

						}

					}



					for ( i = 0; i < myObstacles.length; i++) {
						if (myObstacles[i].y < -20) {
							myObstacles.shift();
						}
						myObstacles[i].y -= 1;
						myObstacles[i].update();
					}

					for ( i = 0; i < addLife.length; i++) {

						if (myGamePiece.collisionWithHeart(addLife[i])) {
							addLife.shift();
							lifeCounter ++ ;

						}

						if (addLife.length!=0 && addLife[i].y < -20 ) {
							addLife.shift();
						}

						if(addLife.length!=0 ){
							addLife[i].text = "♥";
							addLife[i].color = 'hsl('+hcolor+',100%,50%)';
							addLife[i].y --;
							addLife[i].update();
						}

					}

					myGamePiece.speedY = 0;
					myGamePiece.speedX = 0;

					/*key event*/
					window.addEventListener('keydown', function (e) {
			            myGameArea.keys = (myGameArea.keys || []);
			            myGameArea.keys[e.keyCode] = (e.type == "keydown");
		       		})
			        window.addEventListener('keyup', function (e) {
			        	myGameArea.keys = (myGameArea.keys || []);
			            myGameArea.keys[e.keyCode] = (e.type == "keydown");            
			        })
			        /*end key event*/



			        $('#btnRight').on('touchstart', function(){

			        	myGameArea.keys = (myGameArea.keys || []);
			            myGameArea.keys[39] = !0;

				    });
				    $('#btnRight').on('touchend', function(){

			        	myGameArea.keys = (myGameArea.keys || []);
			            myGameArea.keys[39] = !1;

				    });

				    $('#btnLeft').on('touchstart', function(){

			        	myGameArea.keys = (myGameArea.keys || []);
			            myGameArea.keys[37] = !0;

				    });

				    $('#btnLeft').on('touchend', function(){

			        	myGameArea.keys = (myGameArea.keys || []);
			            myGameArea.keys[37] = !1;

				    });

					if (myGameArea.keys && myGameArea.keys[37]) {
						myGamePiece.speedX = -5;
						myGamePiece.newPos();

					}
				    if (myGameArea.keys && myGameArea.keys[39]) {
				    	myGamePiece.speedX = 5;
				    	myGamePiece.newPos();
				    }

				    freefall();

				    // myPencil.update();


				    // myGamePiece.newPos();
				    // myGamePiece.hitLeft();
				    // myGamePiece.hitRight();

					// myGamePiece.color = 'hsl('+ hcolor +',100%,50%)';
					// console.log(hcolor);
					myGamePiece.update();

		    		// switch(lifeCounter){
		    		// 	case 0:
			    	// 		myLife.text="";
			    	// 		myLife.update();
		    		// 		break;
		    		// 	case 1:
			    	// 		myLife.text="♥";
			    	// 		myLife.update();
		    		// 		break;
		    		// 	case 2:
			    	// 		myLife.text="♥♥";
			    	// 		myLife.update();
			    	// 		break;
		    		// 	case 3:
			    	// 		myLife.text="♥♥♥";
			    	// 		myLife.update();
		    		// 		break;
		    		// 	case 4:
			    	// 		myLife.text="♥♥♥♥";
			    	// 		myLife.update();
			    	// 		break;
			    	// 	default:
			    	// 		myLife.text="♥♥♥♥♥";
			    	// 		myLife.update();
		    		// }
		    		txt = "♥";

	    			myLife.text=txt.repeat(lifeCounter);
	    			myLife.update();

		    		if (hightScore > 0) {
		    			hightScoreTxt.text= "Hight Score " + hightScore.toString();
		    			hightScoreTxt.update();
		    		}



		    		myScore = (myScore>0)?myScore:0;

		    		myScoreTxt.text="SCORE: " + myScore;
		    		myScoreTxt.update();

					mySawTop.update();

				}



			};
			function stillAlive(){
				if (lifeCounter >= 1) {return !0};
				return !1;
			};

			function extraLife(){

				lifeCounter--;
				l = myObstacles.length;

				switch(l){
					case 1 :
					case 2 :
					case 3 :
						myGamePiece.x = myObstacles[0].x + 45;
						myGamePiece.y = myObstacles[0].y - 10;
						break;
					case 4 :
						myGamePiece.x = myObstacles[1].x + 45;
						myGamePiece.y = myObstacles[1].y - 10;
						break;
					case 5 :
					case 6 :
						myGamePiece.x = myObstacles[2].x + 45;
						myGamePiece.y = myObstacles[2].y - 10;
					case 7 :
						myGamePiece.x = myObstacles[3].x + 45;
						myGamePiece.y = myObstacles[3].y - 10;
						break;
					case 8 :
					case 9 :
					case 10 :
						myGamePiece.x = myObstacles[4].x + 45;
						myGamePiece.y = myObstacles[4].y - 10;
						break;
					default :

						i = Math.floor(l/2);

						myGamePiece.x = myObstacles[i].x + 45;
						myGamePiece.y = myObstacles[i].y - 10;

						if(myGamePiece.collisionAtBirth(myObstacles[i-1])){
							i++;
							// console.log("change 1");

							myGamePiece.x = myObstacles[i].x + 45;
							myGamePiece.y = myObstacles[i].y - 10;

							if(myGamePiece.collisionAtBirth(myObstacles[i-1])){
								i++;
								// console.log("change 2");
								myGamePiece.x = myObstacles[i].x + 45;
								myGamePiece.y = myObstacles[i].y - 10;

								if(myGamePiece.collisionAtBirth(myObstacles[i-1])){
									i++;
									// console.log("change 3");
									myGamePiece.x = myObstacles[i].x + 45;
									myGamePiece.y = myObstacles[i].y - 10;

									if(myGamePiece.collisionAtBirth(myObstacles[i-1])){
										i++;
										// console.log("change 4");
										myGamePiece.x = myObstacles[i].x + 45;
										myGamePiece.y = myObstacles[i].y - 10;

										if(myGamePiece.collisionAtBirth(myObstacles[i-1])){
											i++;
											// console.log("change 5");
											myGamePiece.x = myObstacles[i].x + 45;
											myGamePiece.y = myObstacles[i].y - 10;

											if(myGamePiece.collisionAtBirth(myObstacles[i-1])){
												i++;
												// console.log("change 6");
												myGamePiece.x = myObstacles[i].x + 45;
												myGamePiece.y = myObstacles[i].y - 10;

												if(myGamePiece.collisionAtBirth(myObstacles[i-1])){
													i++;
													// console.log("change 7");
													myGamePiece.x = myObstacles[i].x + 45;
													myGamePiece.y = myObstacles[i].y - 10;

													if(myGamePiece.collisionAtBirth(myObstacles[i-1])){
														i++;
														// console.log("change 8");
														myGamePiece.x = myObstacles[i].x + 45;
														myGamePiece.y = myObstacles[i].y - 10;



													}

												}

											}


										}
									}

								}
							}
						}

				}

				time = 0;
			};
			$('#restartGame').on('touchstart', function(){
			        lifeCounter = 3;
				    $("#myfilter").css("display","none");
				    $("#myrestartbutton").css("display","none");
				    $("#btnLeft").css('display', 'inline-block');
                	$("#btnRight").css('display', 'inline-block');

				    myGameArea.stop();
				    myGameArea.clear();
				    myGameArea = {};
				    myGamePiece = {};

				    myObstacles = [];
				    addLife = [];

				    myScore = 0;
				    myGameArea.frameNo = 0;
				    $("#canvascontainer").text("");
				    init();
				    startGame();
		    });


			function freefall (){
				time += 0.02;
				myGamePiece.y += 1/2 * 10 * time * time;
				myGamePiece.update();
			};

			function everyinterval(n){
				if ((myGameArea.frameNo / n )%1 ==0) {return !0;}
				return !1;
			};





		})