const cheerio = require('cheerio')
const fetch = require('isomorphic-fetch')
module.exports = opt => {
	opt = Object.assign(opt, {
		formId: 'googleForm',
		iframeId: 'googleFormIframe',
		type: 'iframe',
		onSubmit: 'Thank you for your submission!',
		res: {
			input: {}
		}
	})

	return fetchPage(opt)
		.then(parsePage)

}

function fetchPage(opt){
	return new Promise((resolve, reject) => {
		fetch(opt.url)
			.then(res => {
				if(res.status >= 400){
					reject(new Error('Bad response from server'))
				}
				else if(res.status === 200){
					res.text()
						.then(str => {
							opt.text = str
							resolve(opt)
						})
				}
			})
			.catch(reject)
	})
}

function parsePage(opt){
	const $ = cheerio.load(opt.text)
	const inputs = $.html('form [name]:not([name="draftResponse"], [name="pageHistory"], [name="fbzx"], [name="fvv"])')
	const form = $('form')
	$('span').remove()
	opt.res.post = form.attr('action')
	$('form [role="listitem"]').each(function(){
		let el = $(this)
		const heading = el.find('[role="heading"]').text()
		const name = el.find('[name]').attr('name')
		if(heading){
			opt.res.input[heading.trim()] = name
		}
	})
	return opt.res
}


function findHeading(el){
	let header
	console.log(el.parent().length)

	return el.find('[role="heading"]')
}
