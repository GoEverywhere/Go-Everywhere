/*
 *  THIS PLUGIN IS UNDER PUBLIC DOMAIN
 *
 *  The purpose is to get all imediate text from an element, without children in it
 *
 */
jQuery.fn.justtext = function() {
    return $(this).clone().children().remove().end().text();
};