(function() {
    const second = 1000,
          minute = second * 60,
          hour = minute * 60,
          day = hour * 24;
    
    var countDay = 6;
    
    function checkMonth(countDay) {
		if (countDay >= 1 && countDay <= 12) {
			if (countDay == 1) {
            	return birthday = "Jan 08, 2021 12:00:00";
        	}
        	else if (countDay == 2){
				return birthday = "Feb 08, 2021 12:00:00";
        	}
        	else if (countDay == 3){
				return birthday = "Mar 08, 2021 12:00:00";
        	}
        	else if (countDay == 4){
				return birthday = "Apr 08, 2021 12:00:00";
        	} 
        	else if (countDay == 5){
				return birthday = "May 08, 2021 12:00:00";
        	} 
        	else if (countDay == 6){
				return birthday = "Jun 08, 2021 12:00:00";
        	} 
        	else if (countDay == 7){
				return birthday = "Jul 08, 2021 12:00:00";
        	} 
        	else if (countDay == 8){
				return birthday = "Aug 08, 2021 12:00:00";
        	} 
        	else if (countDay == 9){
				return birthday = "Sep 08, 2021 12:00:00";
        	} 
        	else if (countDay == 10){
				return birthday = "Oct 08, 2021 12:00:00";
        	} 
        	else if (countDay == 11){
				return birthday = "Nov 08, 2021 12:00:00";
        	} 
        	else if (countDay == 12){
				return birthday = "Dec 08, 2021 12:00:00";
        	}
		}
		else {
			countDay = 1;
		}
    }
		//
    let countDown = new Date(checkMonth(countDay)).getTime(),
        x = setInterval(function() {    

            let now = new Date().getTime(),
                distance = countDown - now;

            document.getElementById("days").innerText = Math.floor(distance / (day)),
            document.getElementById("hours").innerText = Math.floor((distance % (day)) / (hour)),
            document.getElementById("minutes").innerText = Math.floor((distance % (hour)) / (minute)),
            document.getElementById("seconds").innerText = Math.floor((distance % (minute)) / second);

            if (distance < 0) {
                countDay ++;
                let headline = document.getElementById("headline"),
                countdown = document.getElementById("countdown"),
                content = document.getElementById("content");
				
                headline.innerText = "Yt = 0+13, lq = 0+13, Px = 0+13, Wp = 39+13, Zy = 26+13";
                countdown.style.display = "none";
                content.style.display = "block";

                clearInterval(x);
            }
            //
        }, 1000)
		
}());
