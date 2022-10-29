new Vue({
    el: '#app',
    data: {
        url: 'https://120.110.115.127:8000/api/Cost/',
        message: 'Only work on pc browser, Or Click View.',
        countDate: 0,
    },
    created: function () {
        this.countDate = this.checkDate()
        this.getCost()
        this.countDown()
    },
    watch: {},
    methods: {
        getCost: function() {
            this.message = ''
            this.$http.get(this.url)
                .then(function (response) {
                    response.body.forEach((item => {
                        this.message += item.name + ': ' + item.cost + '\n '
                    }))
                })
                .catch(function (error) {
                    console.log(error)
                })
        },
        
        checkDate: function () {
            if (new Date().getMonth() + 1 < 13)
                return (new Date(this.checkMonth(new Date().getMonth() + 1)).getTime() < new Date().getTime()) ? new Date().getMonth() + 2 : new Date().getMonth() + 1
            else
                return 1
        },

        checkMonth: function(month) {
            switch (month) {
                case 1:
                    return "Jan 08, 2022 12:00:00"
                case 2:
                    return "Feb 08, 2022 12:00:00"
                case 3:
                    return "Mar 08, 2022 12:00:00"
                case 4:
                    return "Apr 08, 2022 12:00:00"
                case 5:
                    return "May 08, 2022 12:00:00"
                case 6:
                    return "Jun 08, 2022 12:00:00"
                case 7:
                    return "Jul 08, 2022 12:00:00"
                case 8:
                    return "Aug 08, 2022 12:00:00"
                case 9:
                    return "Sep 08, 2022 12:00:00"
                case 10:
                    return "Oct 08, 2022 12:00:00"
                case 11:
                    return "Nov 08, 2022 12:00:00"
                case 12:
                    return "Dec 08, 2022 12:00:00"
            }
        },

        checkCost: function () {
            Swal.fire({
                title: 'Youtube Premium Cost',
                text: this.message,
                imageUrl: 'payment.png',
                imageWidth: 250,
                imageHeight: 250,
                imageAlt: 'Banking Image',
                showConfirmButton: true,
                showDenyButton: true,
                confirmButtonText: 'ok',
                denyButtonText: 'View',
            }).then((result) => {
                if (result.isDenied) {
                    window.location.href = this.url
                }
            })
        },
        
        countDown: function () {
            const second = 1000
            const minute = second * 60
            const hour = minute * 60
            const day = hour * 24
            
            let countDown = new Date(this.checkMonth(this.countDate)).getTime()
            let x = setInterval(function () {
                let now = new Date().getTime()
                let distance = countDown - now

                document.getElementById("days").innerText = Math.floor(distance / (day))
                document.getElementById("hours").innerText = Math.floor((distance % (day)) / (hour))
                document.getElementById("minutes").innerText = Math.floor((distance % (hour)) / (minute))
                document.getElementById("seconds").innerText = Math.floor((distance % (minute)) / second)

                if (distance < 0) {
                    clearInterval(x)
                }
            }, 1000)
        }
    }
})