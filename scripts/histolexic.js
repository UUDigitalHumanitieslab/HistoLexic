$(document).ready(function() 
{
	// On submit...
	$('#submit').click(function() {
		// Clear the current text
		$('#demo_text').empty();

		// Split the text into sentences and wrap them in p tags.
		var sentences = $('textarea').val().split("\n\n"); 
		$.each(sentences, function (i, s) {
			$('#demo_text').append('<p class="demo">' + s + '</p>');
		});

		// Wrap the words and add a tooltip
		wrapWords();
		addTooltip();
	});
});

// Wraps each word in a span tag
function wrapWords() {
	$('.demo').each(function() {
		var text = [];
		// Split on each space
		var words = $(this).text().split(' ');
		$.each(words, function (i, w) {
			// Only wrap "words" in span tags, if there's a number in the word, don't wrap. 
			if (!/\d+/g.test(w)) {
				// Don't include non alphanumeric characters from the span tag. 
				var m = w.match(/[^A-Za-z\u00C0-\u017F]*$/); 
				text[i] = '<span>' + w.substring(0, m.index) + '</span>' + w.substring(m.index, w.length);
			}
			else {
				text[i] = w; 
			} 
		});
		$(this).html(text.join(' '));
	});
}
	 
// Adds a qtip tooltip to each word
function addTooltip() {
	$('.demo span').qtip({
		content: {
			text: function (event, api) {
				// Convert the word to lowercase for lookup
				var word = $(this).text().toLowerCase(); 
				
				// Try fetching the data from the INL LexiconService with an AJAX request
				$.ajax({
					url: 'http://lexiconservice.inl.nl/lexicon/get_lemma',
					dataType: 'json',
					data: {
						database: 'lexicon_service_db',
						wordform: word,
						//pos: 'NOU',
						//year_from: 1800,
						//year_to: 1900,
					}, 
				})
				.then(function (response) {
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
				}, function (xhr, status, error) {
					// On failure, set the tooltip content to the status and error value
					api.set('content.text', status + ': ' + error);
				});

				// Initial text while we wait for the AJAX request to complete
				return 'Ophalen...'; 
			}
		}
	});
}