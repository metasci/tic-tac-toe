
// ways to win-----------

// row-one   [1, 2, 3]
// row-two   [4, 5, 6]
// row-three [7, 8, 9]

// col-one   [1, 4, 7]
// col-two   [2, 5, 8]
// col-three [3, 6, 9]

// diag-one  [1, 5, 9]
// diag-two  [3, 5, 7]
//----------------------




// cache DOM
var $box = $('.in-box');
var $sym = $('.sym');
var $cover = $('.cover');
var $select = $('.frontMenu.select');
var $frontMenu = $('.frontMenu');
var $backMenu = $('.backMenu');
var $divBack = $('div.backMenu');
var $backButton = $('button.backMenu');
// Objects and constructors --------------------------------------------------------------------------------

function Player(name) {
    this.label = name;
    this.symbol = '';
    this.moves = [];
    this.wins = 0;
}

var human = new Player('human');
var computer = new Player('computer');




computer.play = function(){
    
    var choice;
    
   if(computer.options.indexOf(2) !== -1){
        
        choice = computer.think(computer, computer.options.indexOf(2));
        // take action 
        if(choice.length>0){
            computer.click(choice[0]);
        }else{
            computer.play();
        }
       
    }else if(human.options.indexOf(2) !== -1){       
        choice = computer.think(human, human.options.indexOf(2));
        // take action  
        if(choice.length>0){
            computer.click(choice[0]); 
        }else{
            computer.play();
        }     
    }else if(computer.options.indexOf(1) !== -1){
        choice = computer.think(computer, computer.options.indexOf(1)); 
        if(choice.length>0){
            choice = computer.prioritize(choice);
            computer.click(choice[0]);
        }else{
            computer.play();
        } 
    }else{
        choice = game.allOpen();
        // find all open spaces & prioritize() them 
        choice = computer.prioritize(choice);
        computer.click(choice[0]);
    } 
}
// first option
computer.think = function(player, howMany) {
    var options = [];
    // this only thinks of one winning option, max return is .length === 3
    for(var i in game.winners[howMany]){
        // check if its an option 
        if(human.moves.indexOf(game.winners[howMany][i]) === -1 && computer.moves.indexOf(game.winners[howMany][i]) === -1){      
            options.push(game.winners[howMany][i]);     
        }else{
            // if its not an option
            player.options[howMany] = 0;
        }
    }
    return options;
}




computer.click = function(choice){
    $('#'+choice).addClass('active');
    setTimeout(function() {
        $('#'+choice).trigger('click').removeClass('active');
    }, 200);
}

// prioritize in event of multiple options in choice array
computer.prioritize = function(array){
    var temp;
    var priOrder = [];
    var corner = [1, 3, 7, 9];
    var edge = [2, 4, 6, 8];
    
    if(array.indexOf(5) !== -1){
        var temp = array.splice(array.indexOf(5), 1);
        priOrder.push(temp[0]);
    }
    corner.forEach(function(i){
        if(array.indexOf(i) !== -1){
            var temp = array.splice(array.indexOf(i), 1);
            priOrder.push(temp[0]);
        }
    });
    edge.forEach(function(i){
        if(array.indexOf(i) !== -1){
            var temp = array.splice(array.indexOf(i), 1);
            priOrder.push(temp[0]);
        }
    });
        return priOrder;
}

// control cover menu
var menu = {
    // try to set show to menu property for back reference for other functions
    show: 1,
    hideShow : function() {
        if(menu.show){
            $cover.slideUp(1000, function() {
                $box.slideDown(1000);
            });
            menu.show = 0;
        }else {
            $box.slideUp(1000, function(){
                $cover.slideDown(1000);
            });
            menu.show = 1;
        }
    },
    
// choose player sign and assign opposite to computer----
    symbolSet: function(choice) {
        human.symbol = choice;
        computer.symbol = human.symbol === "X" ? "O":"X";
    }
}

//best 2 out of three game info tracker
var game = {
    // all possible winning combinations
    winners: [[1, 2, 3], [4, 5, 6], [7, 8, 9], [1, 4, 7], [2, 5, 8], [3, 6, 9], [1, 5, 9], [3, 5, 7]],
    // whos turn is it? player:1, computer:0
    turn: 1,
    //count number of games played (1-3)
    round: 0,
    win: function(player){
        var countIt;
        countIt = isIn(game.winners, player.moves);
        // win case
        if(countIt.indexOf(3) !== -1){
            console.log(player.label +' wins!');
            player.wins++;
            // color the winning boxes
            game.winners[countIt.indexOf(3)].forEach(function(i){
                $('#'+i).animate({'background-color': '#4d4dff'}, 800).animate({'background-color': '#79d2a6'}, 500);
            })
            setTimeout(function(){
                if(game.round !== 3){
                    // winner goes first in next round
                    newGame(player.label==='human'? 1:0);
                }else{
                    // pop up with winner name ('you' or 'computer')
                    game.end();
                } 
            }, 3000);
        }else if(computer.moves.length + human.moves.length === 9){
            console.log('tie');
            setTimeout(function(){
                if(game.round !== 3){
                    newGame(player.label==='human'? 0:1);
                }else{
                    // pop up with winner name ('you' or 'computer')
                    game.end();
                } 
            }, 1000);
        }else if(game.turn === 0){
            // computers turn
            computer.options = isIn(game.winners, computer.moves);
            human.options = isIn(game.winners, human.moves);
            // trigger computer reaction 
            computer.play();
        }

    },
    save: function(player, spot) {
        spot.children().html(player.symbol);
        player.moves.push(parseInt(spot[0].id, 10));
        game.turn = game.turn? 0:1;
        game.win(player);
    },
    end: function(){
        var bgc = '#79d2a6';
        var winner = 'Tie';
        if(human.wins > computer.wins){
            bgc = '#4d4dff';
            winner = 'you<br>win!!!';
            $divBack.css('font-size', '100px');
            $backButton.css('margin', '20px auto');
        }else if(human.wins < computer.wins){
            bgc = '#ff8080';
            winner = 'computer<br>wins'
        }
        $frontMenu.addClass('hide');
        $backMenu.removeClass('hide');
        $divBack.html(winner);
        $cover.css('background-color', bgc);
        menu.hideShow();
    }
}
// finds all open boxes
game.allOpen = function() {
    var options = [];
    var best = [];
    for(var j in game.winners){
        for(var i in game.winners[j]){
            if(human.moves.indexOf(game.winners[j][i]) === -1 && computer.moves.indexOf(game.winners[j][i]) === -1){
                options.push(game.winners[j][i]);
            }
        }
    }
    // remove duplicates!! - all options
    options.forEach(function(val){
        if(best.indexOf(val) === -1) best.push(val);
    });
    return best;
}
//------------------------------------------------------------------------------------------------------------------




// stand alone functions --------------------------------------------
function newGame(comp) {
    game.turn = comp;
    computer.options = [];
    human.options = [];
    human.moves = [];
    computer.moves = [];
    $sym.html('');
    game.round++;
    // trigger computers first move if it won last game
    if(!comp){
        computer.play();
    }
}

// compares arr to winning arrays && decides if last turn won
// make this compare and count win possiblities
// --- essential in computer thinking ---
function isIn(winners, arr) {
    var array = [];
    for(var j in winners){
        var count = 0;
        for(var i in winners[j]){
            if(arr.indexOf(winners[j][i]) !== -1){
                count++;
            }
        }
        array.push(count);
    }
    return array;
}
//------------------------------------------------------------



// event listeners -----------------------------------------------
// human symbol selection 
$select.on('click', function(){
    menu.symbolSet($(this).html());
    menu.hideShow();
});


// change box clicked to current player symbol
$box.click(function(event) {
    if($(this).children().html() === ""){
        // disable human click events for computers turn
        if(game.turn === 0 && event.originalEvent !== undefined){
        }else{
            game.save(game.turn? human:computer, $(this));
        }   
    }
});


$backButton.on('click', function() {
    location.reload(true);
});
//-------------------------------------------------------------------


$(function(){
    //set first game board
    newGame(1);
    
});

