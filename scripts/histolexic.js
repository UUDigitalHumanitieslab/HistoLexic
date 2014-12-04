$(document).ready(function() 
{
	// Wrap each word in a span tag
	$('.demo').each(function() {
		var text = [];
		// Split on each space
		$.each($(this).text().split(' '), function (i, v) {
			// Only wrap "words" in span tags, if there's a number in the word, don't wrap. 
			if (!/\d+/g.test(v)) {
				// Don't include non alphanumeric characters from the span tag. 
				var m = v.match(/[^A-Za-z\u00C0-\u017F]*$/); 
				text[i] = '<span>' + v.substring(0, m.index) + '</span>' + v.substring(m.index, v.length);
			}
			else {
				text[i] = v; 
			} 
		});
		$(this).html(text.join(' '));
	});
	 
	// Add a qtip tooltip to each word
	$('.demo span').qtip({
		content: {
			text: function(event, api) {
				// Convert the word to lowercase for lookup
				var word = $(this).text().toLowerCase(); 
				
				// Try fetching the data from the INL LexiconService with an AJAX request
				$.ajax({
					// We do this via a CORS proxy, as the server has no 'Access-Control-Allow-Origin' setting
					url: 'http://sk.taalbanknederlands.inl.nl/LexiconService/lexicon/get_lemma',
					dataType: 'json',
					data: {
						database: 'lexicon_service_db',
						wordform: word,
						//pos: 'NOU',
						//year_from: 1890,
						//year_to: 2000,
					}, 
				})
				.then(function(response) {
					// On success, set the titleText content upon successful retrieval
					var titleText = '';
					var found = response.lemmata_list[0].found_lemmata; 
					$.each(found, function(index, value) { 
						titleText += value.lemma + ' (' + value.pos + ')'; 
						titleText += '<br>';
					});
					// If we found no results, set a basic titleText
					if (found.length === 0)
					{
						titleText = 'Geen lemmata gevonden'; 
					} 
					api.set('content.title', 'Lemmata voor <em>' + word + '</em>');
					api.set('content.text', titleText);
				}, function(xhr, status, error) {
					// On failure, set the tooltip content to the status and error value
					api.set('content.text', status + ': ' + error);
				});

				// Initial text while we wait for the AJAX request to complete
				return 'Ophalen...'; 
			}
		}
	});
});