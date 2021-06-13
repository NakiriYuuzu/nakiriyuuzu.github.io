jQuery(function($) {
    $(window).on('scroll', function() {
		if ($(this).scrollTop() >= 00 || $(this).scrollTop() <= 150) {
			$('.navbar').addClass('fixed-top');
        }
	});
});