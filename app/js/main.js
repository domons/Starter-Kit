$(function() {

	var jsMegree = {
		'main.js': [
			'global.js',
			'index.js',
			'contact.js'
		],
		'main2.js': [
			'gl2obal.js',
			'inde2x.js',
			'cont2act.js'
		]
	};

	for (var file in jsMegree) {

		var files = jsMegree[file].join(',');

		$('body').append(file + ' - ' + files + '<br />');
	}

});